/* Cloudflare Pages Function — GET /media/hype
   Serves the homepage hype video WITH HTTP Range support, which Pages' static
   asset hosting does not provide (it answers Range requests with 200 + the whole
   file, so browsers can't scrub ahead past the buffered point). This function
   fetches the static asset internally and slices the requested byte range. */

const ASSET_PATH = '/assets/ez-tms-hype.mp4';

export async function onRequestGet({ request, env }) {
  const asset = await env.ASSETS.fetch(new URL(ASSET_PATH, request.url));
  if (!asset.ok) return new Response('Not found', { status: 404 });

  const buf = await asset.arrayBuffer();
  const total = buf.byteLength;
  const base = {
    'content-type': 'video/mp4',
    'accept-ranges': 'bytes',
    'cache-control': 'public, max-age=3600',
  };

  const range = (request.headers.get('range') || '').trim();
  if (!range) {
    return new Response(buf, { status: 200, headers: { ...base, 'content-length': String(total) } });
  }

  const m = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!m || (m[1] === '' && m[2] === '')) {
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${total}` } });
  }

  let start, end;
  if (m[1] === '') {
    // suffix form: bytes=-N (last N bytes)
    start = Math.max(0, total - parseInt(m[2], 10));
    end = total - 1;
  } else {
    start = parseInt(m[1], 10);
    end = m[2] === '' ? total - 1 : Math.min(parseInt(m[2], 10), total - 1);
  }
  if (start > end || start >= total) {
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${total}` } });
  }

  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      ...base,
      'content-range': `bytes ${start}-${end}/${total}`,
      'content-length': String(end - start + 1),
    },
  });
}
