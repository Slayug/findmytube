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
    console.log(`Add ${channelId} to queue.`)
    queue.add(`channel-${channelId}`, {channelId})
})
