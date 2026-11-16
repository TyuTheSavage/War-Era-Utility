
// ==UserScript==
// @name         WarEra Auto Clicker
// @namespace    https://app.warera.io/
// @version      1.1.3
// @description  Automatically clicks selected WarEra actions
// @author       TyuTheSavage
// @match        https://app.warera.io/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const PANEL_ID = 'warera-crate-opener';
  const MIN_DELAY = 800;
  const DEFAULT_DELAY = 1500;

  let running = false;
  let timer = null;
  let clicks = 0;
  let minimized = false;

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.style.cssText = `
  position:fixed;
  right:20px;
  bottom:20px;
  z-index:999999;
  background:#181825;
  color:#cdd6f4;
  padding:12px;
  border:1px solid #45475a;
  border-radius:10px;
  font:13px Ubuntu,Arial,sans-serif;
  width:190px;
  box-sizing:border-box;
  box-shadow:0 4px 15px #0008;
  `;

  panel.innerHTML = `
  <div id="we-header" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
  <span style="font-weight:bold">WarEra Auto Clicker</span>
  <button id="we-minimize" style="padding:2px 8px;background:#45475a;color:#cdd6f4;border:0;border-radius:4px;cursor:pointer">−</button>
  </div>

  <div id="we-controls">
  <label>Action</label>
  <select id="we-action" style="width:100%;margin:5px 0 10px;padding:5px;background:#313244;color:#cdd6f4;border:1px solid #585b70;border-radius:5px">
  <option>OPEN</option>
  <option>DEFEND</option>
  <option>ATTACK</option>
  <option>RESIST</option>
  </select>

  <label>Delay (ms)</label>
  <input id="we-delay" type="number" min="${MIN_DELAY}" value="${DEFAULT_DELAY}" style="width:100%;box-sizing:border-box;margin:5px 0 10px;padding:5px;background:#313244;color:#cdd6f4;border:1px solid #585b70;border-radius:5px">

  <label>Click limit (0 = unlimited)</label>
  <input id="we-limit" type="number" min="0" value="1" style="width:100%;box-sizing:border-box;margin:5px 0 10px;padding:5px;background:#313244;color:#cdd6f4;border:1px solid #585b70;border-radius:5px">

  <div style="display:flex;gap:6px">
  <button id="we-start" style="flex:1;padding:6px;background:#a6e3a1;color:#1e1e2e;border:0;border-radius:5px;cursor:pointer">Start</button>
  <button id="we-stop" style="flex:1;padding:6px;background:#f38ba8;color:#1e1e2e;border:0;border-radius:5px;cursor:pointer">Stop</button>
  </div>
  </div>

  <div id="we-status" style="margin-top:8px;color:#a6adc8;font-size:12px">Idle</div>
  `;

  document.body.appendChild(panel);

  const $ = id => panel.querySelector(`#${id}`);

  function findButton(action) {
    const pattern = action === 'OPEN'
    ? /^OPEN\d*$/
    : new RegExp(`^${action}\\d*$`);

    return [...document.querySelectorAll('button, [role="button"], div')]
    .find(el => {
      if (!el.getClientRects().length) return false;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;

      const label = (el.getAttribute('aria-label') || el.textContent || '')
      .replace(/\s+/g, '')
      .toUpperCase();

      if (!pattern.test(label)) return false;

      return ![...el.querySelectorAll('button, [role="button"], div')].some(child => {
        const childLabel = (child.getAttribute('aria-label') || child.textContent || '')
        .replace(/\s+/g, '')
        .toUpperCase();

        return pattern.test(childLabel);
      });
    });
  }

  function stop(message = 'Stopped') {
    running = false;
    clearTimeout(timer);
    timer = null;
    $('we-action').disabled = false;
    $('we-status').textContent = `${message} | Clicks: ${clicks}`;
  }

  function run() {
    if (!running) return;

    const action = $('we-action').value;
    const limit = Math.max(0, Number($('we-limit').value) || 0);
    const delay = Math.max(MIN_DELAY, Number($('we-delay').value) || DEFAULT_DELAY);

    if (limit > 0 && clicks >= limit) {
      stop('Limit reached');
      return;
    }

    const button = findButton(action);

    if (!button) {
      stop(`${action} not found`);
      return;
    }

    button.click();
    clicks++;

    $('we-status').textContent = `Running | ${action} | Clicks: ${clicks}`;

    timer = setTimeout(run, delay);
  }

  $('we-start').addEventListener('click', () => {
    if (running) return;

    running = true;
    clicks = 0;
    $('we-action').disabled = true;
    $('we-status').textContent = 'Starting...';
    run();
  });

  $('we-stop').addEventListener('click', () => stop());

  $('we-minimize').addEventListener('click', () => {
    minimized = !minimized;

    $('we-controls').style.display = minimized ? 'none' : '';
    $('we-minimize').textContent = minimized ? '+' : '−';
    $('we-header').style.marginBottom = minimized ? '0' : '10px';
    panel.style.width = minimized ? 'auto' : '190px';
    panel.style.padding = minimized ? '8px 10px' : '12px';
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && running) stop();
  });
})();
