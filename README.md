

# Project Requirements

* NodeJS >= 14.13.1
* Python 3.X
* Docker & Docker-compose
* Yarn
* pm2


Une fois les requirements installés : `./dev/setup.sh`

# Chaque jour
`./dev/startup.sh`


# Démarrer un service précis
`lerna run --scope  @findmytube/(api|www|producer|video-worker|channel-worker|cron-channel-producer) dev --stream`

Chaque producer et worker est lancé via le service *pm2* pour simuler plusieurs nœuds en local pendant le développement.

