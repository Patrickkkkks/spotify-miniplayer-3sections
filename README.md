# Miniplayer 3-Section

> Turns Spotify's **PiP mini player** into three horizontal sections:
> **cover art ｜ title & artist ｜ time & progress bar** — frosted glass cards,
> album-art-driven colors, one consistent corner radius.

![preview](preview.png)

## 中文简介

把 Spotify 的迷你播放器（PiP 小窗）改成横向三段式：左边是圆角方形专辑封面，中间是歌手 + 歌名，右边是播放进度（时间在上、进度条在下）。三块卡片**圆角一致、间距一致、纵向高度一致**，窗口底色、卡片、文字和进度条都会跟随当前专辑封面变化。

## Features

- Three horizontal sections: cover art / track info / progress
- Frosted-glass cards over a blurred cover-art backdrop (album-art-driven colors)
- Consistent corner radius for all three cards (8px, matching the Windows 11 window radius)
- Compact default size (320×76) that is applied once on first open — resize it however you like afterwards
- Right-hand timer forced to the **total duration** instead of a countdown
- Playback controls stay hidden on the cover and fade in on hover

## Requirements

- Spicetify 2.45+ (extension support)
- Spotify desktop **1.3.3.264** (tested on Windows 11) — see *Compatibility* below
- The mini player must be the Document Picture-in-Picture window (default in current desktop builds)

## Install

### From the Marketplace

Search for **Miniplayer 3-Section** in the Spicetify Marketplace → *Extensions* tab → **Install**.

### Manual

1. Download [`dist/pip-3-sections.js`](dist/pip-3-sections.js).
2. Copy it into your Spicetify extensions folder:
   - Windows: `%appdata%\spicetify\Extensions\`
   - macOS / Linux: `~/.config/spicetify/Extensions/`
3. Enable it and apply:

   ```sh
   spicetify config extensions pip-3-sections.js
   spicetify apply
   ```

Then restart Spotify and open the mini player.

## Customization

Styling lives in [`src/pip-3-sections.css`](src/pip-3-sections.css):

| Variable | Default | Meaning |
| --- | --- | --- |
| `--pip-radius` | `8px` | corner radius of the three cards |
| `--pip-gap` | `8px` | gap between the cards and the window padding |
| `--pip-blur` | `22px` | frosted-glass blur strength |
| `--pip-page-bg` / `--pip-text` | album-art colors | window background / main text color |

Edit the values, then rebuild the extension:

```sh
node build.js
```

(You can also edit the `CSS = \`…\`` block inside `dist/pip-3-sections.js` directly.)

Behaviour switches are at the top of [`src/runtime.js`](src/runtime.js):

```js
var AUTO_RESIZE = true;   // shrink the window to a compact bar once
var TARGET_WIDTH = 320;   // …
var TARGET_HEIGHT = 76;
var FIX_DURATION = true;  // right timer shows total duration
```

### Development

Set `DEV_SYNC_USER_CSS = true` in `src/runtime.js` (before `node build.js`), copy the
`/* == PIP-3SECTIONS START == */ … /* == PIP-3SECTIONS END == */` block into your
Spicetify `user.css`, and the extension will re-read that file every time the mini
player is opened — no Spotify restart needed while tweaking values.

## Compatibility

Spotify's client UI is minified and its class names are hashed, and they change
between releases. This extension targets Spotify **1.3.3.264**. Most selectors use
stable `data-testid` attributes (`pip-hover-element`, `document-pip-hover-element`,
`progress-bar`, `playback-duration`, …); the layout ones use the current hashed
class names, so a Spotify update may require updating them in
`src/pip-3-sections.css`.

The window's own rounded corners are drawn by the operating system and **cannot be
changed** by CSS — the three cards are set to 8px so that they match the window on
Windows 11. On another OS/theme you can change `--pip-radius` to whatever the system
window radius looks like.

## License

[MIT](LICENSE)
