import {Queue} from 'bullmq';

import {Config, Video, ChannelJob} from '@fy/core';

const queue = new Queue<ChannelJob>(Config.channelQueueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort
    }
});


function wait(time: number, data: {items: Video[]}): Promise<{items: Video[]}> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, time)
    });
}

[
    'UC4bdl8K6B5Rt2dmKuvnhClg',
].forEach((channelId) => {
    console.log(`Add ${channelId} to queue.`)
    queue.add(`channel-${channelId}`, {channelId})
})
