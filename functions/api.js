const https = require('https');
const fs    = require('fs');
const path  = require('path');
const DATA  = path.join(__dirname, '..', 'db.json');

/* ---------- helpers ---------- */
const read = () => fs.existsSync(DATA) ? JSON.parse(fs.readFileSync(DATA, 'utf8')) : [];
const write = d => fs.writeFileSync(DATA, JSON.stringify(d, null, 2));
const get = url => new Promise((res, rej) => https.get(url, {headers:{'User-Agent':'bangers-mini'}}, r => {
  let b = ''; r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
}).on('error', rej));

/* ---------- fetch real #betonbangers casts ---------- */
async function fetchChannelCasts() {
  const { messages } = await get('https://hub.pinata.cloud/v1/casts?reverse=true&limit=300');
  return messages
    .filter(m => /#?betonbangers/i.test(m.data.castAddBody.text))
    .map(m => ({
      castHash: m.hash,
      username: `user_${m.data.fid}`,
      text: m.data.castAddBody.text
    }));
}

/* ---------- router ---------- */
exports.handler = async (ev) => {
  const hdr = {'Content-Type':'application/json'};

  /* ---- GET /api/casts ---- */
  if (ev.httpMethod === 'GET' && ev.path === '/api/casts') {
    const live = await fetchChannelCasts();
    const local = read();
    const merged = live.map(c => {
      const saved = local.find(s => s.castHash === c.castHash);
      return saved ? {...c, ...saved} : {...c, likes:0, farmed:0, userLiked:false};
    });
    return {statusCode:200, headers:hdr, body:JSON.stringify(merged)};
  }

  /* ---- POST /api/like ---- */
  if (ev.httpMethod === 'POST' && ev.path === '/api/like') {
    const {castHash} = JSON.parse(ev.body || '{}');
    if (!castHash) return {statusCode:400, headers:hdr, body:JSON.stringify({error:'missing castHash'})};
    const list = read();
    let rec = list.find(s => s.castHash === castHash);
    if (!rec) { rec = {castHash, likes:0, farmed:0, userLiked:false}; list.push(rec); }
    rec.userLiked = !rec.userLiked;
    rec.likes += rec.userLiked ? 1 : -1;
    rec.farmed += rec.userLiked ? 10 : -10;
    if (rec.farmed < 0) rec.farmed = 0;
    write(list);
    return {statusCode:200, headers:hdr, body:JSON.stringify({liked:rec.userLiked, likes:rec.likes, farmed:rec.farmed})};
  }

  return {statusCode:404, headers:hdr, body:JSON.stringify({error:'not found'})};
};
                                
