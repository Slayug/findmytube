const QueueName = process.env.QUEUE_NAME ?? 'videos';
const ExtractorFileName = 'extractor.py';

const Config = {
    apiHost: process.env.API_HOST ?? 'localhost',
    apiPort: process.env.API_PORT ?? 8080,
    elasticHost: process.env.ELASTIC_HOST ?? 'localhost',
    elasticPort: process.env.ELASTIC_PORT ?? 9200,
    sonarIndex: 'videos',
    elasticTranscriptIndex: 'transcript',
    elasticChannelIndex: 'channel',
    redisHost: process.env.REDIS_HOST ?? 'localhost',
    redisPort: process.env.REDIS_PORT ?? 6379,
    redisPassword: process.env.REDIS_PASSWORD ?? "",
    videoQueueName: QueueName,
    channelQueueName: 'channel',
    extractorFileName: ExtractorFileName,
};

export default Config;
