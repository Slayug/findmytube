import {Job, Worker} from 'bullmq';
import {Config, VideoJob} from '@findmytube/core';

import {Client} from '@elastic/elasticsearch';
import {execSync} from 'child_process';

const client = new Client({
    node: `http://${Config.elasticHost}:${Config.elasticPort}`
});

const worker = new Worker<VideoJob, number>(
    Config.videoQueueName, async (job: Job<VideoJob>) => {
        try {
            const {body: found} = await client.exists({
                index: Config.elasticTranscriptIndex,
                id: job.data.video.videoId,
            });
            if (!found) {
                console.log(` > Processing ${job.data.video.videoId}`);

                execSync('python3 ' +
                    [Config.extractorFileName,
                        job.data.video.videoId,
                        Config.elasticHost,
                        Config.elasticPort.toString()
                    ].join(' ')
                );
                console.log(' ==========================');
                console.log(` > ${job.data.video.videoId} done.`);
            }
        } catch (e) {
            console.error('something bad happened for ' + job.data.video.videoId);
            throw e;
        }

        return 0;
    }, {
        connection: {
            host: Config.redisHost,
            port: Config.redisPort,
            password: Config.redisPassword
        }
    });

worker.on('completed', async (job) => {
    const dataJob = job.data as VideoJob;

    try {
        await client.update({
            index: Config.elasticTranscriptIndex,
            id: dataJob.video.videoId,
            body: {
                script: {
                    lang: 'painless',
                    source: 'ctx._source.video = params.video',
                    params: {video: dataJob.video}
                }
            }
        })
    } catch (e) {
        console.error(e);
        console.error('Cannot put script after job done');
    }
});

worker.on('error', err => {
    // log the error
    console.error('Cannot handle', err);
});
