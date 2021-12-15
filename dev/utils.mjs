
const PREFIX = '[FY] ';

export function log(content, opt) {
  if (opt) {
    console.log(PREFIX + content, opt);
  } else {
    console.log(PREFIX + content);
  }
}