import { Worker, Job } from 'bullmq';
import { Config, VideoJobData } from '@fy/core';


import { execSync } from 'child_process';

const worker = new Worker<VideoJobData, number>(
  Config.queueName, async (job: Job<VideoJobData>) => {

    try {
      console.log(`> Processing ${job.data.videoId}`);

      const result = execSync('python ' +
        [Config.extractorFileName,
          job.data.videoId,
          Config.sonarHost,
          Config.sonarPort.toString()
        ].join(' ')
      );
      console.log(result);
      console.log('===========================');
      console.log('');

    } catch (e) {
      console.error('something bad happened for ' + job.data.videoId);
    }

    return 0;
  }, {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

worker.on('error', err => {
  // log the error
  console.error('Cannot handle', err);
});
