const QueueName = process.env.QUEUE_NAME ?? 'videos';
const ExtractorFileName = 'extractor.py';

const Config = {
    sonarHost: 'localhost',
    sonarPort: 9200,
    sonarIndex: 'videos',
    redisHost: 'localhost',
    redisPort: 6379,
    queueName: QueueName,
    extractorFileName: ExtractorFileName,
};

export default Config;
