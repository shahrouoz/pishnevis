# پیش‌نویس · Pishnevis

**حرفت همان. متنت مرتب‌تر.**

A small, dependency-free Persian text cleaner. Review each proposed edit and keep control of your writing. All text processing happens in your browser, without accounts, analytics, storage, or third-party requests.

![Pishnevis interface](preview.jpg)

## امکانات

- تبدیل «ي / ك» عربی به «ی / ک» فارسی
- انتخاب اعداد فارسی، انگلیسی یا بدون تغییر
- کاهش فاصله‌های اضافه و مرتب‌کردن چند نشانهٔ فارسی
- پیشنهاد نیم‌فاصله برای فهرست محدودی از فعل‌ها
- قبول یا رد هر اصلاح، نمایش قبل و بعد و کپی خروجی
- رابط راست‌به‌چپ و سازگار با موبایل، بدون فونت یا کتابخانهٔ خارجی

## Run

Open `index.html` directly in a modern browser. No build step or installation is required. For clipboard support, HTTPS or localhost is recommended. If clipboard access fails, the app selects the output for manual copying.

Optional local server, from this directory:

```sh
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Tests

With Node.js 18 or later:

```sh
npm test
```

## Limits

This is a rule-based formatter, **not a spelling or grammar checker**. Suggestions start selected and can be rejected individually. Changing the input or numeral preference resets review selections. Overlapping corrections are deferred: use the review-output button for another pass. Halfspace suggestions intentionally cover a small verb list. Digit conversion applies throughout the input, including numbers in links or code; keep digits unchanged for technical text. This tool is intended for prose, not formatting code or Markdown tables.

The app does not save text; reloading clears it. The hosting provider may receive ordinary page requests, but the app does not transmit the text you enter.

## Files

- `cleaner.js` — pure suggestion and edit-application engine
- `app.js` — review UI and clipboard behavior
- `cleaner.test.js` — normalization, boundaries, rejection, and preservation tests

## Author

[Shahrooz](https://github.com/shahrouoz) · Computer Engineer & Product Builder

No open-source license has been granted at this stage. GitHub's terms still apply to viewing and forking public repositories.
