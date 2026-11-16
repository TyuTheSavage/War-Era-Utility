// ==UserScript==
// @name         WarEra Crate Opener
// @namespace    local.warera.crate-opener
// @version      1.0.0
// @description  Clicks WarEra's visible OPEN button at a controlled pace.
// @match        https://app.warera.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  if (document.getElementById('warera-crate-opener')) return;

  const MIN_DELAY = 800;
  const DEFAULT_DELAY = 1500;
  const DEFAULT_LIMIT = 1;

  const panel = document.createElement('section');
  panel.id = 'warera-crate-opener';
  panel.innerHTML = `
    <div class="wco-title">WarEra crate opener</div>
    <label class="wco-row">Delay <input class="wco-delay" type="number" min="${MIN_DELAY}" step="100" value="${DEFAULT_DELAY}"> ms</label>
    <label class="wco-row">Crates <input class="wco-limit" type="number" min="1" step="1" value="${DEFAULT_LIMIT}"></label>
    <div class="wco-buttons"><button class="wco-start" type="button">Start</button><button class="wco-stop" type="button" disabled>Stop</button></div>
    <div class="wco-status" role="status">Stopped · limit 1</div>
    <div class="wco-help">Set a higher limit to open more. Stop anytime.</div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #warera-crate-opener{position:fixed;z-index:2147483647;right:16px;bottom:16px;width:230px;padding:12px;background:#17212b;color:#f4f6f8;border:1px solid #65717e;border-radius:9px;box-shadow:0 4px 18px #0008;font:13px/1.4 system-ui,sans-serif}
    #warera-crate-opener *{box-sizing:border-box}
    #warera-crate-opener .wco-title{font-weight:700;margin-bottom:8px}
    #warera-crate-opener .wco-row{display:flex;align-items:center;justify-content:space-between;margin:6px 0}
    #warera-crate-opener input{width:92px;padding:4px;border:1px solid #718091;border-radius:4px;background:#fff;color:#111}
    #warera-crate-opener .wco-buttons{display:flex;gap:8px;margin-top:9px}
    #warera-crate-opener button{flex:1;padding:6px;border:0;border-radius:5px;font-weight:700;cursor:pointer}
    #warera-crate-opener .wco-start{background:#81c784;color:#102015}
    #warera-crate-opener .wco-stop{background:#ef9a9a;color:#2c1111}
    #warera-crate-opener button:disabled{opacity:.45;cursor:default}
    #warera-crate-opener .wco-status{margin-top:8px;min-height:18px}
    #warera-crate-opener .wco-help{margin-top:5px;color:#c0cad4;font-size:11px}
  `;
  document.documentElement.append(style, panel);

  const delayInput = panel.querySelector('.wco-delay');
  const limitInput = panel.querySelector('.wco-limit');
  const startButton = panel.querySelector('.wco-start');
  const stopButton = panel.querySelector('.wco-stop');
  const status = panel.querySelector('.wco-status');
  let timer = null;
  let opened = 0;
  let running = false;

  function findOpenButton() {
    const candidates = document.querySelectorAll('button, [role="button"]');
    for (const element of candidates) {
      if (panel.contains(element)) continue;
      const rect = element.getBoundingClientRect();
      const css = getComputedStyle(element);
      if (!rect.width || !rect.height || css.visibility === 'hidden' || css.display === 'none') continue;
      if (element.disabled || element.getAttribute('aria-disabled') === 'true') continue;
      const label = (element.getAttribute('aria-label') || element.innerText || element.textContent || '')
        .replace(/\s+/g, '')
        .toUpperCase();
      if (/^OPEN\d*$/.test(label)) return element;
    }
    return null;
  }

  function stop(message = 'Stopped') {
    running = false;
    if (timer !== null) clearTimeout(timer);
    timer = null;
    startButton.disabled = false;
    stopButton.disabled = true;
    status.textContent = `${message} · opened ${opened}`;
  }

  function step() {
    if (!running) return;
    const limit = Math.max(1, Number.parseInt(limitInput.value, 10) || DEFAULT_LIMIT);
    if (opened >= limit) return stop('Limit reached');
    const button = findOpenButton();
    if (!button) return stop('OPEN button not found');
    button.click();
    opened += 1;
    status.textContent = `Running · ${opened}/${limit}`;
    const delay = Math.max(MIN_DELAY, Number.parseInt(delayInput.value, 10) || DEFAULT_DELAY);
    timer = setTimeout(step, delay);
  }

  startButton.addEventListener('click', () => {
    if (running) return;
    opened = 0;
    running = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    status.textContent = 'Starting…';
    step();
  });
  stopButton.addEventListener('click', () => stop());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && running) stop('Stopped with Escape');
  });
})();
