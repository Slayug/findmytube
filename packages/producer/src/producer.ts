import {Queue} from 'bullmq';

import {Config, ChannelJob} from '@findmytube/core';

const queue = new Queue<ChannelJob>(Config.channelQueueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort,
        password: Config.redisPassword
    }
});

const promises = [
  'Fireship',
  'arteplus7fr',
].map((channelId) => {
    console.log(`Add ${channelId} to queue.`)
    return queue.add(`channel-${channelId}`, {channelId})
});

Promise.all(promises).catch((e) => {
    console.error('Cannot add to queue', e);
    process.exit(1);
});
