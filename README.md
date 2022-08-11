

# Project Requirements

* NodeJS >= 14.13.1
* Python 3.X
* Docker & Docker-compose
* Yarn
* [Pm2](https://pm2.keymetrics.io/)

Once you have installed the requirements: `./dev/setup.sh`

# Everyday
`./dev/startup.sh`

To start everything in dev mode :
* ElasticSearch
* Redis 
* Kibana
* core
* www
* api
* producer
* video-worker
* channel-worker
* cron-channel-producer

**The first time you run `./dev/startup.sh`, producer will propagate channels under `./packages/producer/src/producer.ts` to populate the database**

By default, in dev mode `video-worker` is launched with **Pm2** with 3 instances.
It avoids to spam dev logs with all other services.

To get `video-worker` logs run `pm2 monit`, you will be able to inspect each instance.

## How does it work ?

Each service may be found under `./packages`.  
Each one has a specific role.

ElasticSearch, Kibana, Redis and Redis commander are run with `docker-compose`, see `./docker/dev.yaml`

### Producer
The producer will send new channel to scrap to the _Channel Redis Queue_.

`lerna run --scope @findmytube/producer dev --stream`

### channel-worker
Channel worker will take channel from the _Channel Redis Queue_ then it will fetch video of the channel to send them to the _Video Redus Queue_.

`lerna run --scope @findmytube/channel-worker dev --stream`

### video-worker
Video worker will take video from the _Video Redis Queue_ then it will scrap each transcript of each video and save them to ElasticSearch.

`lerna run --scope @findmytube/video-worker dev --stream`

Replace `dev` by `start` to have one instance of `video-worker` and get the logs right from your terminal without **Pm2**

### cron-channel-producer

It's a cronjob (for production) to force other services to scrap new video of each channel already saved.

`lerna run --scope @findmytube/cron-channel-producer dev --stream`

