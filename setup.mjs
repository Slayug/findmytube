#!/usr/bin/env zx

const execSync = require('child_process').execSync;

const PREFIX = '[FY] ';
function log(content, opt) {
  if (opt) {
    console.log(PREFIX + content, opt);
  } else {
    console.log(PREFIX + content);
  }
}


log('Installation des deps Python');
log(execSync('pip install -r requirements').toString());
