
# WarEra Auto Clicker

A Tampermonkey userscript that automatically clicks selected visible WarEra buttons at a controlled pace.

## Features

- **OPEN**: Automatically opens crates.
- **DEFEND**: Automatically clicks the DEFEND button.
- **RESIST**: Automatically clicks the RESIST button.
- **ATTACK**: Automatically clicks the ATTACK button.
- Configurable click delay.
- Configurable click limit.
- Start and Stop controls.
- Escape key to stop immediately.
- Detects only visible and enabled buttons.

## Install

1. Install the Tampermonkey browser extension.
2. Open Tampermonkey and choose **Create a new script**.
3. Replace the editor contents with `tampermonkey_script.js`.
4. Save the script.
5. Reload [WarEra](https://app.warera.io/).
6. The control panel appears in the lower-right corner.

## Use

1. Select the desired action: OPEN, DEFEND, RESIST or ATTACK.
2. Configure the click delay (default: 1500 ms).
3. Configure the click limit (default: 1).
4. Select **Start**.

The minimum delay is 800 ms.

Select **Stop** or press **Escape** to stop early.

The script automatically stops when:
- The configured click limit is reached.
- The selected button cannot be found.
- You manually stop the automation.

The action selector is locked while automation is running.

## Compatibility

- Browser: Chromium-based browsers and Firefox.
- Extension: Tampermonkey.
- Website: https://app.warera.io/
