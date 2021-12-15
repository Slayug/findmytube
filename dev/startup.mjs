#!/usr/bin/env zx

import { log } from './utils.mjs';

const execSync = require('child_process').execSync;

log(execSync('docker-compose -f ./docker/dev.yaml up -d').toString());