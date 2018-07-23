import send from 'koa-send';

export default async function(ctx, fileName, filePath) {
  const userAgent = (ctx.headers['user-agent'] || '').toLowerCase();
  if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0
    || userAgent.indexOf('gecko') >= 0) {
    ctx.set(
      'Content-Disposition',
      `attachment;filename=${encodeURIComponent(fileName)}`
    );
  } else if (userAgent.indexOf('firefox') >= 0) {
    ctx.set(
      'Content-Disposition',
      `attachment;filename*="utf8''${encodeURIComponent(fileName)}"`
    );
  } else {
    ctx.set(
      'Content-Disposition',
      `attachment;filename=${Buffer.from(fileName).toString('binary')}`
    );
  }
  await send(ctx, fileName, { root: filePath });
}
