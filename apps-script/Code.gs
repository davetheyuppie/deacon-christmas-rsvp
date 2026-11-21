/**
 * Deacons' Christmas Party RSVP — Google Apps Script backend.
 *
 * Paste this into the sign-up sheet: Extensions → Apps Script, replace
 * everything in Code.gs, save, then Deploy → New deployment → Web app,
 * "Execute as: Me", "Who has access: Anyone". Copy the /exec URL into
 * src/config.ts in the Astro project.
 *
 * Sheet layout (first tab):
 *   Row 5 = headers, row 6 = example row (ignored), RSVPs from row 7 down.
 *   A Name | B Number Attending | C Side Dish or Dessert | D What You're Bringing
 *   E Submitted | F RSVP ID | G Edit key (lets a guest change their own RSVP)
 */

var HEADER_ROW = 5;
var FIRST_DATA_ROW = 7;
var MAX_PARTY = 30;

function sheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders_(sh) {
  var range = sh.getRange(HEADER_ROW, 5, 1, 3);
  if (!range.getValues()[0][0]) {
    range.setValues([['Submitted', 'RSVP ID', 'Edit key (private)']]);
  }
}

function readRows_(sh) {
  var last = sh.getLastRow();
  if (last < FIRST_DATA_ROW) return [];
  var values = sh.getRange(FIRST_DATA_ROW, 1, last - FIRST_DATA_ROW + 1, 7).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    var name = String(r[0]).trim();
    var dish = String(r[3]).trim();
    if (!name && !dish) continue;
    rows.push({
      row: FIRST_DATA_ROW + i,
      name: name,
      count: Number(r[1]) || 0,
      kind: /dessert/i.test(String(r[2])) ? 'dessert' : 'side',
      dish: dish,
      id: String(r[5] || ''),
      token: String(r[6] || '')
    });
  }
  return rows;
}

// Stops a typed value from being read as a formula.
function text_(value, maxLen) {
  var s = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, maxLen);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function validate_(b) {
  var name = text_(b.name, 60);
  var dish = text_(b.dish, 80);
  var count = Math.round(Number(b.count));
  if (!name) return { error: 'Please add your name.' };
  if (!dish) return { error: 'Please add what you are bringing.' };
  if (!(count >= 1 && count <= MAX_PARTY)) return { error: 'Number attending must be between 1 and ' + MAX_PARTY + '.' };
  return {
    name: name,
    dish: dish,
    count: count,
    kindLabel: b.kind === 'dessert' ? 'Dessert' : 'Side Dish'
  };
}

/** GET → the public list (no edit keys). */
function doGet() {
  var rows = readRows_(sheet_()).map(function (r) {
    return { id: r.id || ('row' + r.row), name: r.name, count: r.count, kind: r.kind, dish: r.dish };
  });
  return json_({ ok: true, rows: rows });
}

/** POST {action: "add" | "update" | "delete", ...} */
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'The request was not readable.' });
  }
  if (body.website) return json_({ ok: true }); // spam trap field filled in

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_();
    ensureHeaders_(sh);
    var action = body.action || 'add';

    if (action === 'update' || action === 'delete') {
      var mine = readRows_(sh).filter(function (r) {
        return r.id && r.id === String(body.id) && r.token === String(body.token);
      })[0];
      if (!mine) return json_({ ok: false, error: 'not_found' });
      if (action === 'delete') {
        sh.deleteRow(mine.row);
        return json_({ ok: true });
      }
      var u = validate_(body);
      if (u.error) return json_({ ok: false, error: u.error });
      sh.getRange(mine.row, 1, 1, 5).setValues([[u.name, u.count, u.kindLabel, u.dish, new Date()]]);
      return json_({ ok: true, id: mine.id, token: mine.token });
    }

    var v = validate_(body);
    if (v.error) return json_({ ok: false, error: v.error });
    var id = Utilities.getUuid().slice(0, 8);
    var token = Utilities.getUuid();
    sh.appendRow([v.name, v.count, v.kindLabel, v.dish, new Date(), id, token]);
    return json_({ ok: true, id: id, token: token });
  } finally {
    lock.releaseLock();
  }
}
