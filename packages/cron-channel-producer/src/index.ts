import {Queue} from 'bullmq';
import {ChannelJob, Config} from '@findmytube/core';

import {Client} from "@elastic/elasticsearch";

const client = new Client({
    node: `http://${Config.elasticHost}:${Config.elasticPort}`
});

const channelQueue = new Queue<ChannelJob>(Config.channelQueueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort,
        password: Config.redisPassword,
    }
});

try {

    const response = await client.search({
        index: Config.elasticChannelIndex,
        from: 0,
        size: 120,
    });


    await Promise.all(response.body.hits.hits.map((channel) => {
            console.log('Push channel to queue', channel._id)
            return channelQueue.add(`channel-${channel._id}`, {channelId: channel._id})
        }
    ));
    process.exit(0);

} catch (e) {
    console.error('Cannot push a channel', e);
    process.exit(1);
}
