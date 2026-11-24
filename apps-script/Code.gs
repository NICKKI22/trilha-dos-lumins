/**
 * Shared leaderboard for Trilha dos Lumins.
 * Deploy as a Web App that executes as the owner and allows anonymous access.
 * The leaderboard is intentionally public; do not put personal data here.
 */
const SCORES_PROPERTY = 'lumins-global-ranking-v1';
const MAX_STORED_SCORES = 50;
const MAX_NAME_LENGTH = 20;
const MIN_TIME_MS = 10000;
const MAX_TIME_MS = 12 * 60 * 60 * 1000;

function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = String(params.callback || '');
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,60}$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  let result;
  try {
    if (params.action === 'submit') {
      result = submitScore_(params.name, params.ms);
    } else {
      result = { ok: true, ranking: readScores_().slice(0, 10) };
    }
  } catch (error) {
    result = { ok: false, error: 'O ranking está temporariamente indisponível.' };
  }

  // JSONP is used because the static game is hosted on GitHub Pages and
  // Apps Script Content Service does not provide configurable CORS headers.
  const json = JSON.stringify(result)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return ContentService.createTextOutput(callback + '(' + json + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function submitScore_(rawName, rawMs) {
  const name = Array.from(String(rawName || '').replace(/[<>\u0000-\u001f\u007f]/g, '').trim())
    .slice(0, MAX_NAME_LENGTH).join('');
  const ms = Number(rawMs);
  if (!name || !Number.isSafeInteger(ms) || ms < MIN_TIME_MS || ms > MAX_TIME_MS) {
    return { ok: false, error: 'Nome ou tempo inválido.' };
  }

  const cache = CacheService.getScriptCache();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name.toLowerCase());
  const throttleKey = 'submit_' + Utilities.base64EncodeWebSafe(digest).slice(0, 32);
  if (cache.get(throttleKey)) {
    return { ok: false, error: 'Espere um pouco antes de registrar outro tempo com este nome.' };
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { ok: false, error: 'Tente novamente em alguns segundos.' };
  try {
    const scores = readScores_();
    scores.push({ name: name, ms: ms, createdAt: Date.now() });
    scores.sort(function (a, b) { return a.ms - b.ms || a.createdAt - b.createdAt; });
    PropertiesService.getScriptProperties().setProperty(
      SCORES_PROPERTY,
      JSON.stringify(scores.slice(0, MAX_STORED_SCORES))
    );
    cache.put(throttleKey, '1', 20);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function readScores_() {
  const raw = PropertiesService.getScriptProperties().getProperty(SCORES_PROPERTY);
  if (!raw) return [];
  try {
    const scores = JSON.parse(raw);
    if (!Array.isArray(scores)) return [];
    return scores.filter(function (row) {
      return row && typeof row.name === 'string' &&
        Number.isSafeInteger(row.ms) && row.ms >= MIN_TIME_MS && row.ms <= MAX_TIME_MS;
    }).sort(function (a, b) { return a.ms - b.ms || a.createdAt - b.createdAt; });
  } catch (error) {
    return [];
  }
}
