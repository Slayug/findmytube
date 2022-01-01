import {Worker, Job} from 'bullmq';
import {Config, VideoJob} from '@fy/core';

const {Client} = require('@elastic/elasticsearch')
const client = new Client({
    node: `http://${Config.elasticHost}:${Config.elasticPort}`
});

import {execSync} from 'child_process';

const worker = new Worker<VideoJob, number>(
    Config.queueName, async (job: Job<VideoJob>) => {

        try {
            console.log(` > Processing ${job.data.video.videoId}`);

            const result = execSync('python ' +
                [Config.extractorFileName,
                    job.data.video.videoId,
                    Config.elasticHost,
                    Config.elasticPort.toString()
                ].join(' ')
            );
            console.log(result);
            console.log('===========================');
            console.log('');

        } catch (e) {
            console.error('something bad happened for ' + job.data.video.videoId);
            throw e;
        }

        return 0;
    }, {
        connection: {
            host: Config.redisHost,
            port: Config.redisPort
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
