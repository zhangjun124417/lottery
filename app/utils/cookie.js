const COOKIE_PREFIX = `${process.env.PKG_NAME}.`;
const COOKIE_SPITER = '; ';
const COOKIE_DECODE = decodeURIComponent;
// const COOKIE_ENCODE = encodeURIComponent;
const CHAR_EQUAL = '=';

function getCookies() {
  const _cookies = {};
  const documentCookie = document.cookie;
  if (documentCookie) {
    documentCookie.split(COOKIE_SPITER).forEach((cookie) => {
      cookie = cookie.split(CHAR_EQUAL);
      const name = COOKIE_DECODE(cookie[0]).substr(COOKIE_PREFIX.length);
      _cookies[name] = COOKIE_DECODE(cookie[1]);
    });
  }
  return _cookies;
}

export default function(key) {
  return getCookies()[key];
}
