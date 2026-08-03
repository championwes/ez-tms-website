/* Cloudflare Pages Function — POST /api/contact
   Receives the website contact form and relays it as an email via Resend.

   Required env var (set in the Cloudflare Pages dashboard):
     RESEND_API_KEY   — your Resend API key
   Optional env vars (sensible defaults below):
     CONTACT_TO       — where leads are delivered   (default Sales@EZ-TMS.com)
     CONTACT_FROM     — verified Resend sender       (default notify@updates.championdigitalmedia.com)
                        Must be on a domain verified in your Resend account. */

export async function onRequestPost({ request, env }) {
  const json = (obj, status) =>
    new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Bad request.' }, 400);
  }

  const clean = (v) => (v == null ? '' : String(v)).trim();
  const name = clean(data.name);
  const email = clean(data.email);
  const company = clean(data.company);
  const phone = clean(data.phone);
  const message = clean(data.message);
  const honeypot = clean(data.website); // real users leave this blank

  // Bots fill the hidden honeypot — accept silently so they don't retry, but don't send.
  if (honeypot) return json({ ok: true }, 200);

  if (!name || !email || !message)
    return json({ ok: false, error: 'Please fill in your name, email, and message.' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  if (!env.RESEND_API_KEY)
    return json({ ok: false, error: 'Email is not configured yet.' }, 500);

  const TO = env.CONTACT_TO || 'Sales@EZ-TMS.com';
  const FROM = env.CONTACT_FROM || 'EZ TMS Website <notify@updates.championdigitalmedia.com>';

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `Phone: ${phone || '—'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#182954">' +
      '<h2 style="margin:0 0 14px">New website contact</h2>' +
      `<p style="margin:0"><strong>Name:</strong> ${esc(name)}</p>` +
      `<p style="margin:0"><strong>Email:</strong> ${esc(email)}</p>` +
      `<p style="margin:0"><strong>Company:</strong> ${esc(company || '—')}</p>` +
      `<p style="margin:0"><strong>Phone:</strong> ${esc(phone || '—')}</p>` +
      '<p style="margin:16px 0 4px"><strong>Message:</strong></p>' +
      `<p style="margin:0;white-space:pre-wrap">${esc(message)}</p>` +
    '</div>';

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Website contact — ${name}${company ? ', ' + company : ''}`,
        text,
        html,
      }),
    });
  } catch {
    return json({ ok: false, error: 'Could not send right now. Please email Sales@EZ-TMS.com directly.' }, 502);
  }

  if (!res.ok)
    return json({ ok: false, error: 'Could not send right now. Please email Sales@EZ-TMS.com directly.' }, 502);

  return json({ ok: true }, 200);
}
