'use strict';
const $ = id => document.getElementById(id);
const fa = number => new Intl.NumberFormat('fa-IR').format(number);
let edits = [], accepted = new Set(), timer;
function announce(message) {
  $('status').textContent = message;
  clearTimeout(timer);
  timer = setTimeout(() => { $('status').textContent = ''; }, 3500);
}
function output() {
  const result = Pishnevis.apply($('source').value, edits, accepted);
  $('result').value = result;
  $('applied').textContent = fa(accepted.size) + ' اصلاح';
  $('copy').disabled = !result;
  $('again').disabled = !result || result === $('source').value;
  $('result-hint').textContent = !result ? 'آماده برای یک شروع تمیز' : accepted.size ? 'با انتخاب تو مرتب شد' : 'متن اصلی حفظ شده است';
}
function analyze() {
  const text = $('source').value;
  edits = Pishnevis.suggestions(text, {digits: $('digits').value});
  accepted = new Set(edits.map(edit => edit.id));
  $('count').textContent = fa(Array.from(text).length) + ' نویسه';
  $('total').textContent = fa(edits.length);
  $('changes').replaceChildren();
  $('accept-all').disabled = $('reject-all').disabled = edits.length === 0;
  if (!edits.length) {
    const empty = document.createElement('div'); empty.className = 'empty';
    const star = document.createElement('span'); star.textContent = '✦'; star.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p'); title.textContent = text ? 'در قواعد فعلی، اصلاحی پیدا نشد.' : 'هر متن، جای بهترشدن دارد.';
    const note = document.createElement('small'); note.textContent = text ? 'این نتیجه، تأیید املایی یا دستوری متن نیست.' : 'متنت را وارد کن تا پیشنهادها را اینجا ببینی.';
    empty.append(star, title, note); $('changes').append(empty);
  }
  for (const edit of edits) {
    const label = document.createElement('label'); label.className = 'change';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = true;
    check.setAttribute('aria-label', edit.label + '، موقعیت ' + fa(edit.start + 1));
    check.addEventListener('change', () => { check.checked ? accepted.add(edit.id) : accepted.delete(edit.id); output(); });
    const body = document.createElement('span'); body.className = 'change-body';
    const caption = document.createElement('span'); caption.className = 'change-label'; caption.textContent = edit.label;
    const diff = document.createElement('span'); diff.className = 'diff';
    const before = document.createElement('del'); before.textContent = visible(edit.before);
    const arrow = document.createElement('em'); arrow.textContent = '←';
    const after = document.createElement('ins'); after.textContent = visible(edit.after);
    diff.append(before, arrow, after); body.append(caption, diff);
    const position = document.createElement('span'); position.className = 'position'; position.textContent = 'نویسهٔ ' + fa(edit.start + 1);
    label.append(check, body, position); $('changes').append(label);
  }
  output();
}
function visible(value) { return value === '' ? 'بدون فاصله' : /^\s+$/u.test(value) ? value.replace(/ /g, '·').replace(/\t/g, '⇥') : value; }
$('source').addEventListener('input', analyze);
$('digits').addEventListener('change', analyze);
$('sample').addEventListener('click', () => {
  $('source').value = 'سلام!من يك ايده  براي يك ابزار كوچك دارم ، كه قبل از انتشار متن كمكم مي كند.\nامروز 3 تغيير را مرور مي كنم؛تو هم امتحانش كن!';
  analyze(); announce('متن نمونه اضافه شد.');
});
$('clear').addEventListener('click', () => { $('source').value = ''; analyze(); $('source').focus(); });
for (const [id, checked] of [['accept-all', true], ['reject-all', false]]) {
  $(id).addEventListener('click', () => {
    accepted = new Set(checked ? edits.map(edit => edit.id) : []);
    $('changes').querySelectorAll('input').forEach(input => { input.checked = checked; }); output();
  });
}
$('again').addEventListener('click', () => { $('source').value = $('result').value; analyze(); announce('خروجی برای مرور دوباره جایگزین شد.'); });
$('copy').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText($('result').value); announce('متن کپی شد؛ آمادهٔ ارسال!');
  } catch {
    $('result').focus(); $('result').select();
    announce('کپی خودکار در این مرورگر در دسترس نیست؛ متن انتخاب شد. از Ctrl+C یا گزینهٔ کپی استفاده کن.');
  }
});
analyze();
