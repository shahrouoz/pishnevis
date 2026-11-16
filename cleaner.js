(function (root) {
  'use strict';
  function suggestions(text, options = {}) {
    const found = [];
    const add = (regex, replacement, label, kind) => {
      for (const match of text.matchAll(regex)) {
        const before = match[0];
        const after = typeof replacement === 'function' ? replacement(match) : replacement;
        if (before !== after) found.push({start: match.index, end: match.index + before.length, before, after, label, kind});
      }
    };
    add(/[يك]/gu, m => m[0] === 'ي' ? 'ی' : 'ک', 'حرف فارسی', 'letters');
    if (options.digits === 'fa') add(/[0-9٠-٩]/gu, m => '۰۱۲۳۴۵۶۷۸۹'[m[0].charCodeAt(0) >= 1632 ? m[0].charCodeAt(0) - 1632 : Number(m[0])], 'عدد فارسی', 'digits');
    if (options.digits === 'en') add(/[۰-۹٠-٩]/gu, m => String(m[0].charCodeAt(0) - (m[0] >= '۰' ? 1776 : 1632)), 'عدد انگلیسی', 'digits');
    add(/[ \t]{2,}/gu, ' ', 'فاصلهٔ اضافه', 'spacing');
    // Conservative: leave English text, URLs, decimals, and line breaks alone.
    add(/(?<=[\u0600-\u06ff])[ \t]+(?=[،؛؟!])/gu, '', 'فاصله پیش از نشانه', 'spacing');
    add(/(?<=[،؛؟!])(?=[\u0621-\u063a\u0641-\u064a\u067e\u0686\u0698\u06a9\u06af\u06cc])/gu, ' ', 'فاصله پس از نشانه', 'spacing');
    const verbs = 'روم|روی|رود|رویم|روید|روند|کنم|کنی|کند|کنیم|کنید|کنند|نویسم|نویسی|نویسد|نویسیم|نویسید|نویسند|خواهم|خواهی|خواهد|خواهیم|خواهید|خواهند';
    add(new RegExp('(?<![\\p{L}\\p{M}\\u200c])(ن?می) ([ ]*)(?=(?:' + verbs + ')(?![\\p{L}\\p{M}\\u200c]))', 'gu'), m => m[1] + '\u200c', 'پیشنهاد نیم‌فاصله', 'halfspace');
    // Skip overlapping changes; another review pass can resolve any remainder.
    found.sort((a, b) => a.start - b.start || a.end - b.end);
    const edits = [];
    let end = -1;
    for (const edit of found) {
      if (edit.start < end) continue;
      edits.push({...edit, id: edits.length}); end = edit.end;
    }
    return edits;
  }
  function apply(text, edits, accepted = new Set(edits.map(e => e.id))) {
    let output = '', cursor = 0;
    for (const edit of edits) {
      output += text.slice(cursor, edit.start) + (accepted.has(edit.id) ? edit.after : edit.before);
      cursor = edit.end;
    }
    return output + text.slice(cursor);
  }
  const api = {suggestions, apply};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Pishnevis = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
