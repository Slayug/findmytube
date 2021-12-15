#!/usr/bin/env zx

import { log } from './utils.mjs';

const execSync = require('child_process').execSync;


log('Installation des deps Python');
log(execSync('pip install -r requirements').toString());
