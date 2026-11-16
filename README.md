# WarEra Crate Opener

A Tampermonkey userscript that clicks WarEra's visible `OPEN` button at a controlled pace.

## Install

1. Install the Tampermonkey browser extension.
2. Open Tampermonkey and choose **Create a new script**.
3. Replace the editor contents with `warera-crate-opener.user.js` and save.
4. Reload [WarEra](https://app.warera.io/). The control panel appears in the lower-right corner.

## Use

The default limit is one crate and the default delay is 1500 ms. Set a higher crate limit before selecting **Start** to open more. The script enforces a minimum delay of 800 ms. Select **Stop** or press **Escape** to stop early. It stops if the visible OPEN button cannot be found.
