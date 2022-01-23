const QueueName = process.env.QUEUE_NAME ?? 'videos';
const ExtractorFileName = 'extractor.py';

const Config = {
    apiHost: 'localhost',
    apiPort: 8080,
    elasticHost: 'localhost',
    elasticPort: 9200,
    sonarIndex: 'videos',
    elasticTranscriptIndex: 'transcript',
    elasticChannelIndex: 'channel',
    redisHost: 'localhost',
    redisPort: 6379,
    videoQueueName: QueueName,
    channelQueueName: 'channel',
    extractorFileName: ExtractorFileName,
};

export default Config;
