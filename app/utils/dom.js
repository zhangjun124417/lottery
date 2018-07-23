export function on(el, event, cb, useCapture = false) {
  el.addEventListener(event, cb, useCapture);
}

export function off(el, event, cb) {
  el.removeEventListener(event, cb);
}

export function getComputedSize(el, attr) {
  return parseFloat(getComputedStyle(el)[attr]);
}
