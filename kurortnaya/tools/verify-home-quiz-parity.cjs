/* Compare resort quiz roles with measured, approved homepage 17-quiz. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const reference = JSON.parse(fs.readFileSync(path.join(root, 'verification/home-quiz-reference-2026-11-03.json')));
const base = process.argv[2] || 'http://127.0.0.1:8875/kurortnaya/';
const selectors = {
  content: '.modal__content', layout: '.feedback-modal__layout', body: '.feedback-modal__body',
  title: '.feedback-modal__title', intro: '.feedback-modal__intro',
  eyebrow: '.resort-quiz__eyebrow', progress: '.resort-quiz__progress',
  option: '.resort-quiz__option', next: '.resort-quiz__next', form: '.feedback-modal__form',
  channels: '.feedback-modal__channels', channel: '.feedback-modal__channels button',
  input: '.feedback-modal__input', submit: '.feedback-modal__submit',
  consentText: '.feedback-modal__consent-text', summary: '.resort-quiz__summary',
  summaryText: '.resort-quiz__summary p', summaryEdit: '.resort-quiz__summary button'
};
(async () => {
  const browser = await chromium.launch({executablePath: '/usr/bin/google-chrome'});
  const checks = [], errors = [];
  try {
    for (const expected of reference.rows) {
      const p = await browser.newPage({viewport: {width: expected.width, height: expected.height}});
      p.on('pageerror', error => errors.push(error.message));
      await p.goto(base, {waitUntil: 'networkidle'});
      await p.locator('.floating-expert__card').click();
      const modal = p.locator('.catalog-feedback-modal');
      for (const stage of ['goal', 'contact']) {
        if (stage === 'contact') await modal.locator('.resort-quiz__skip').click();
        const actual = await modal.evaluate((m, {roles, selectors}) => Object.fromEntries(Object.entries(roles).map(([role, value]) => {
          const el = m.querySelector(selectors[role]), css = getComputedStyle(el), rect = el.getBoundingClientRect();
          return [role, {css: Object.fromEntries(Object.keys(value.css).map(k => [k, css[k]])), size: {width: rect.width, height: rect.height}}];
        })), {roles: expected.stages[stage], selectors});
        for (const [role, value] of Object.entries(expected.stages[stage])) {
          assert.deepEqual(actual[role].css, value.css, `${expected.width}/${stage}/${role}: typography and spacing`);
          for (const [key, number] of Object.entries(value.size || {})) {
            assert.ok(Math.abs(actual[role].size[key] - number) < 1, `${expected.width}/${stage}/${role}/${key}: ${actual[role].size[key]} != ${number}`);
          }
        }
        if (stage === 'contact') {
          assert.equal(await modal.locator('[name=comment]').isVisible(), false);
          assert.equal(await modal.locator('[name=comment]').isDisabled(), true);
          const questions = await p.evaluate(() => window.BarnEstateExpertQuiz.getQuestions());
          assert.deepEqual(questions, JSON.parse(fs.readFileSync(path.join(root, 'blocks/request-modal/questions.json'))));
          assert.match(await modal.locator('.feedback-modal__hero-image').getAttribute('alt'), /Денис Перковский/);
          await modal.locator('.feedback-modal__submit').scrollIntoViewIfNeeded();
          const rect = await modal.locator('.feedback-modal__submit').boundingBox();
          assert.ok(rect.y >= 0 && rect.y + rect.height <= expected.height, 'Submit reachable within viewport');
        }
      }
      checks.push({width: expected.width, height: expected.height, homepageRolesMatch: true, contactFormHeight: expected.stages.contact.form.size.height});
      console.log('PASS homepage quiz parity', expected.width, expected.height);
      await p.close();
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(root, 'verification/home-quiz-parity-2026-11-03.json'), JSON.stringify({reference: reference.source, checks, errors}, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
