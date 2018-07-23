import ReqJSON from 'req-json';

const reqJSON = new ReqJSON();
const etagCache = {};

function serializeRequest(ctx) {
  return `${ctx.method}${ctx.url}${ctx.data ? JSON.stringify(ctx.data) : ''}`;
}

if (process.env.NODE_ENV != 'production') {
  reqJSON.use(async(ctx, next) => {
    const start = Date.now();
    console.log(`${ctx.method} ${ctx.url} at ${start}`, ctx);
    await next();
    console.log(`${ctx.method} ${ctx.url} ${Date.now() - start}ms`, ctx);
  });
}

// 控制 ETag
reqJSON.use(async(ctx, next) => {
  const request = serializeRequest(ctx);
  const cached = etagCache[request];
  if (cached) {
    ctx.header = {
      'If-None-Match': cached.etag
    };
  }
  await next();
  if (cached && ctx.status == 304) {
    ctx.response = cached.response;
  }
  const { etag } = ctx.headers;
  if (etag) {
    etagCache[request] = {
      etag,
      response: ctx.response
    };
  }
});

export default function resource(path) {
  return reqJSON.resource(`/api/v1${path}`);
}
