import {Job, Worker} from 'bullmq';
import {Config, VideoJob} from '@findmytube/core';

import {Client} from '@elastic/elasticsearch';
import {execSync} from 'child_process';

import { logger } from '@findmytube/logger';

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
                logger.info(`Processing video: ${job.data.video.videoId}`);

                execSync('python3 ' +
                    [Config.extractorFileName,
                        job.data.video.videoId,
                        Config.elasticHost,
                        Config.elasticPort.toString()
                    ].join(' ')
                );
                logger.info(`Video ${job.data.video.videoId} scrapped.`);
            }
        } catch (e) {
            logger.error(`Something bad happened with the videoId: ${job.data.video.videoId}`, e);
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
        });
    } catch (e) {
        logger.error('Cannot update on elastic after job done', e);
        throw e;
    }
});

worker.on('error', err => {
    logger.error('Error with the worker', err);
});
