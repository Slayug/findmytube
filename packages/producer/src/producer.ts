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
  'amigoscode',
  'AndroidDevelopers',
  'FlorinPop',
  'grafikart',
  'https://www.youtube.com/channel/UC1lWm0Y1gO1Wz5RvZIJxc9Q',
  'coursenlignejava',
  'TraversyMedia',
  'xavki-linux',
  'Cookieconnect%C3%A9',
  'NotPatrickPodcasts',
  'Nowtech',
  'BlindingSunriseOFB',
  'RaonLee',
  'RomiMusicOfficial',
  'Hujikoman',
  'megannicole',
  'FirstToEleven',
  'Rainych%E3%82%8C%E3%81%84%E3%82%93',
  'UCs8ynQgjoKZblUXosXoeOEQ',
  'radwimpsstaff',
  'UCSNX8VGaawLFG_bAZuMyQ3Q',
  'aimerSMEJ',
  'UCvpredjG93ifbCP1Y77JyFA',
  'CrunchyrollFR',
  'LePasseTempsToulouse',
  'Hasheur',
  'UCjBVoSdVxL_fTU6JZCVcOUw',
].map((channelId) => {
    console.log(`Add ${channelId} to queue.`)
    return queue.add(`channel-${channelId}`, {channelId})
});

Promise.all(promises).catch((e) => {
    console.error('Cannot add to queue', e);
    process.exit(1);
});
