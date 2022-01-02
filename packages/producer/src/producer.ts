import {Queue} from 'bullmq';

import {Config, Video, VideoJob} from '@fy/core';
import YoutubeHelper from './YoutubeHelper';

const queue = new Queue<VideoJob>(Config.queueName, {
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
    'Officialjvcom',
    'GouvHD',
    'AntoineGoya',
    'MaitreLomepal',
    'DamDamLive',
    'StupeflipOfficiel',
    'DanyCaligula',
    'fosdemtalks',
    'LArchiPelle',
    'MardiNoirPTLF',
    'SAEZLepouvoirdesmots',
    'LeChatQuiVole',
    'KangooVan',
    'UCyW65baBYNme1_81TrK8UOw',
    'franceinfo',
    'reinhardalexandre255',
    'DanyRazBestOf',
    'TF1',
    'JsuispascontentTV',
    'Aufhebung',
    'MonsieurPhi',
    'maxbird',
    'Transculture',
    'TroncheEnBiais-Zetetique',
    'PlaceauPeuple',
    'HeurekaFinanceEco'
].forEach((channelId) => {
    YoutubeHelper.loadAllChannelVideos(channelId)
        .then((videos) => {
            console.log(`FOUND ${videos.items.length} for ${channelId}`);
            return videos
        })
        .then((data) => wait(12000, data))
        .then((videos) => {
            console.log(`Posting to queue ${channelId} - length: ${videos.items.length}`)
            if (videos.items) {
                videos.items.forEach((video) => {
                    console.log(`Send job for ${video.videoId}`);
                    // post to queue
                    queue.add('video', {video})
                })
            } else {
                console.log('Cannot get videos for ' + channelId);
            }
        })
        .catch((e) => {
            console.error('Cannot get video for ', channelId);
            console.error(e);
        })
})
