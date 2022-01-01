const QueueName = process.env.QUEUE_NAME ?? 'videos';
const ExtractorFileName = 'extractor.py';

const Config = {
    elasticHost: 'localhost',
    elasticPort: 9200,
    sonarIndex: 'videos',
    elasticTranscriptIndex: 'transcript',
    redisHost: 'localhost',
    redisPort: 6379,
    queueName: QueueName,
    extractorFileName: ExtractorFileName,
};

export default Config;
