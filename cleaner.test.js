const {test} = require('node:test');
const assert = require('node:assert/strict');
const {suggestions, apply} = require('./cleaner');
const clean = (text, options) => apply(text, suggestions(text, options));
test('normalizes only Arabic yeh and kaf', () => assert.equal(clean('يك کتاب English'), 'یک کتاب English'));
test('converts both numeral families and preserves decimals', () => {
  assert.equal(clean('12 ٣۴ 1.5', {digits:'fa'}), '۱۲ ۳۴ ۱.۵');
  assert.equal(clean('۱۲ ٣٤', {digits:'en'}), '12 34');
  assert.equal(clean('۱۲ 34'), '۱۲ 34');
});
test('preserves paragraph boundaries and URLs', () => {
  assert.equal(clean('سلام  دوست\n\nhttps://example.com/a?x=1&y=2'), 'سلام دوست\n\nhttps://example.com/a?x=1&y=2');
});
test('fixes Persian punctuation without modifying English punctuation', () => {
  assert.equal(clean('سلام ،دوست!خوبی؟ Hello,world!Test'), 'سلام، دوست! خوبی؟ Hello,world!Test');
});
test('suggests halfspace for bounded verbs only', () => {
  assert.equal(clean('می روم و نمی کنم'), 'می‌روم و نمی‌کنم');
  assert.equal(clean('می کنم؛می رود؟'), 'می‌کنم؛ می‌رود؟');
  assert.equal(clean('سهمی روم و می روما و می خانه'), 'سهمی روم و می روما و می خانه');
});
test('review can reject any individual edit and reject all restores original', () => {
  const text = 'يك  متن'; const edits = suggestions(text);
  assert.equal(apply(text, edits, new Set()), text);
  const ids = new Set(edits.map(e => e.id)); ids.delete(edits.find(e => e.before === 'ك').id);
  assert.equal(apply(text, edits, ids), 'یك متن');
});
test('handles empty text, emoji, and literal HTML safely as plain text', () => {
  assert.equal(clean(''), ''); assert.equal(clean('👋 يك <script>alert(1)</script>'), '👋 یک <script>alert(1)</script>');
});
test('edits never overlap and review passes settle', () => {
  let text = 'می  روم ،دوست';
  for(let i=0;i<5;i++) {
    const edits=suggestions(text); edits.forEach((e,j)=>{if(j) assert.ok(e.start>=edits[j-1].end);});
    text=apply(text,edits);
  }
  assert.equal(text,'می‌روم، دوست'); assert.equal(clean(text),text);
});
