

# Project Requirements

* NodeJS >= 14.13.1
* Python 3.X
* Docker & Docker-compose


Une fois les requirements installés : `./dev/setup.sh`

# Chaque jour
`./dev/startup.sh`


# Démarrer un service précis
`lerna run --scope @fy/(api|www|producer|video-worker|channel-worker) dev --stream`

Chaque producer et worker est lancé via le service *pm2* pour simuler plusieurs nœuds en local pendant le développement.

