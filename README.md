

# Project Requirements

* NodeJS >= 14.13.1
* Zx `npm i -g zx` (https://github.com/google/zx)
* Python 3.X
* Docker & Docker-compose


Une fois les requirements installés : `./dev/setup.sh`

# Chaque jour
`./dev/startup.sh`


# Démarrer un service précis
`lerna run --scope @fy/(api|www|producer|worker) dev --stream`

Project template from: https://github.com/chriswells0/node-typescript-template
