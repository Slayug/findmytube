import { Worker, Job } from 'bullmq';
import { EXTRACTOR_FILENAME, QueueName } from './config';

import { execSync } from 'child_process';
import { VideoJobData } from './VideoJob';
import Configuration from './configuration';

console.log('QUNAME', QueueName);

const worker = new Worker<VideoJobData, number>(QueueName, async (job: Job<VideoJobData>) => {
  try {
    console.log(`> Processing ${job.data.videoId}`);

    const result = execSync('python ' +
      [EXTRACTOR_FILENAME,
        job.data.videoId,
        Configuration.sonarHost,
        Configuration.sonarPort.toString()
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
    host: "localhost",
    port: 6379
  }
});

worker.on('error', err => {
  // log the error
  console.error('Cannot handle', err);
});
