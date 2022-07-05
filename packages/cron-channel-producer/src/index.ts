import {Queue} from 'bullmq';
import {Config, ChannelJob} from '@findmytube/core';

const {Client} = require('@elastic/elasticsearch')
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

client.search({
    index: Config.elasticChannelIndex,
    trackTotalHits: true,
    from: 0,
    size: 100,
    body: {
        stored_fields: []
    },
}).then((response) => {
    console.log(response.body.hits.total.value, response.body.hits.hits.length)
    response.body.hits.hits.forEach((channel) => {
        console.log('Push channel to queue', channel._id)
        channelQueue.add(`channel-${channel._id}`, {channelId: channel._id})
    });
});
