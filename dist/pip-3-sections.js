/*!
 * Miniplayer 3-Section — a Spicetify extension
 *
 * Rearranges Spotify's PiP (Document Picture-in-Picture) mini player into
 * three horizontal sections: cover art | title & artist | time & progress.
 * 把 Spotify 迷你播放器改成横向三段式：封面 ｜ 歌手+歌名 ｜ 时间+进度条。
 *
 * @version 1.0.4
 * @license MIT
 * @repository https://github.com/Patrickkkkks/spotify-miniplayer-3sections
 * @tested-with Spotify 1.3.5.3058 / Spicetify 2.45.1 / Windows 11
 */

(function () {
  'use strict';

  /* ==================== 可调参数 / Options ==================== */
  var AUTO_RESIZE = true;        // 第一次打开时自动缩成横条 / auto-resize once
  var TARGET_WIDTH = 320;        // 目标宽 / target width  (px)
  var TARGET_HEIGHT = 76;        // 目标高 / target height (px)
  var FIX_DURATION = true;       // 右侧时间显示总时长 / right timer = total duration
  var DEV_SYNC_USER_CSS = false; // 开发用：从 user.css 热读取样式 / dev-only hot reload
  /* ============================================================ */

  var STYLE_ID = 'pip-3-sections-style';
  var CSS = `/* == PIP-3SECTIONS START == */
/* ==========================================================================
   Spotify 迷你播放器（PiP Mini Player）· 横向三段式
   --------------------------------------------------------------------------
   ┌────────┬───────────────────┬────────────────────┐
   │ 专辑封面 │  歌手 + 歌名        │  时间（上）+ 进度条（下） │
   └────────┴───────────────────┴────────────────────┘
   · 三块圆角一致、间距一致、纵向高度一致（封面填满第一块）
   · 窗口底色、卡片、文字、进度条跟随当前专辑封面
   · 任意窗口尺寸都生效（无需再拉大）
   适配：Spotify 1.3.3.264 · Spicetify 2.45.1 · Windows
   ========================================================================== */

/* ------------------------------ 可调参数 ------------------------------ */
.bEhb_FeKn_j0Not8O0Ua {
  --pip-radius: 8px;               /* 三块卡片的圆角，与 Windows 11 窗口圆角一致 */
  --pip-gap: 8px;                  /* 三块之间的间距 & 窗口内边距，保持一致 */
  --pip-blur: 22px;                /* 卡片毛玻璃强度 */
  --pip-page-bg: var(--extracted-background-color, #121212);      /* 窗口底色（跟随封面） */
  --pip-text: var(--extracted-text-base, #ffffff);                /* 主文字色（跟随封面） */
  --pip-text-sub: var(--extracted-text-subdued, rgba(255, 255, 255, .72));
  --pip-hairline: rgba(255, 255, 255, .10);                       /* 卡片描边 */
  --pip-card-bg: rgba(12, 12, 14, .62);                           /* 卡片玻璃底色 */
}

/* ------------------ 窗口背景：专辑封面模糊铺满 ------------------ */
.bEhb_FeKn_j0Not8O0Ua {
  background-color: var(--pip-page-bg) !important;
}

/* ---- 取消"环境模式"（鼠标静止约 1 秒触发）里的整体位移 ----
   Spotify 原本会在鼠标静止时把封面 / 中间容器往左推 22px、把整个内容
   往上推 26px，导致专辑被左侧栏遮住一角、模块间距忽大忽小。
   这里把这两个偏移量归零，悬浮与静止两种状态的位置和间距保持一致。 */
.bEhb_FeKn_j0Not8O0Ua {
  --cinema-mode-horizontal-offset: 0px !important;
}

.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj {
  --cinema-mode-top-offset: 0px !important;
}

.bEhb_FeKn_j0Not8O0Ua [data-testid="pip-hover-element"].V5nMLNGirl8Qq3LKiFlJ,
.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj.gPiaPK2nA9gwm2Yqu6jq .AWZB_jUImxPQPayEBTk4 {
  transform: none !important;
}

.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj.gPiaPK2nA9gwm2Yqu6jq,
.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj.gPiaPK2nA9gwm2Yqu6jq .pxfUJGGY2pRXA3TnweGS {
  margin-top: 0 !important;
}

.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj {
  background-color: var(--pip-page-bg) !important;
  background-image: none !important;
  overflow: hidden;
}

.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj::before {
  content: "";
  position: absolute;
  inset: -28px;
  z-index: -1;
  background: var(--background-image-url) center / cover no-repeat;
  filter: blur(38px) saturate(150%) brightness(.82);
  transform: scale(1.06);
  pointer-events: none;
}

/* ====================== 横向三段式（任意尺寸生效） ====================== */
/* 一行三列：封面 | 歌手+歌名 | 时间+进度条 */
.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj {
  grid-template-areas: "media contextinfo playercontrols" !important;
  grid-template-columns: auto minmax(0, 1.15fr) minmax(0, 1fr) !important;
  grid-template-rows: minmax(0, 1fr) !important;
  column-gap: var(--pip-gap) !important;
  row-gap: var(--pip-gap) !important;
  padding: var(--pip-gap) !important;
  min-height: 0 !important;
}

/* ---------- ① 专辑封面：填满第一块，方形，高度与另两块一致 ---------- */
.bEhb_FeKn_j0Not8O0Ua [data-testid="pip-hover-element"] {
  grid-area: media !important;
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  height: 100% !important;
  aspect-ratio: 1 / 1 !important;
  min-width: 0;
  min-height: 0;
}

.bEhb_FeKn_j0Not8O0Ua [data-testid="pip-hover-element"] div,
.bEhb_FeKn_j0Not8O0Ua [data-testid="pip-hover-element"] a,
.bEhb_FeKn_j0Not8O0Ua [data-testid="document-pip-cover-art-animation-container"] {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.bEhb_FeKn_j0Not8O0Ua [data-testid="pip-hover-element"] img,
.bEhb_FeKn_j0Not8O0Ua [data-testid="document-pip-cover-art"] {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  object-fit: cover !important;
  border-radius: var(--pip-radius) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .42), 0 0 0 1px var(--pip-hairline) !important;
}

/* 拆开悬停浮层与紧凑模式下的嵌套网格，让三块能并排 */
.bEhb_FeKn_j0Not8O0Ua [data-testid="document-pip-hover-element"] {
  display: contents !important;
  opacity: 1 !important;
  background: none !important;
}

.bEhb_FeKn_j0Not8O0Ua .JO8CP2asWaZqQiGeyD8H {
  display: contents !important;
}

.bEhb_FeKn_j0Not8O0Ua .AWZB_jUImxPQPayEBTk4 {
  grid-area: contextinfo !important;
  display: flex !important;
  align-items: stretch !important;
  align-self: stretch !important;
  min-width: 0;
  min-height: 0;
}

.bEhb_FeKn_j0Not8O0Ua .DHrF_9CgAwmk6pMviMCw {
  display: none !important;
}

/* 紧凑模式自带的底部细进度条隐藏（我们用第三块里的进度条） */
.bEhb_FeKn_j0Not8O0Ua [data-testid="miniplayer-edge-progress"] {
  display: none !important;
}

/* ------------------------ ② 歌手 + 歌名 ------------------------ */
.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv {
  grid-area: contextinfo !important;
  margin: 0 !important;
  padding: 0 16px !important;
  width: 100% !important;
  height: 100% !important;
  flex: 1 1 auto;
  min-height: 0;
  align-self: stretch;
  align-content: center;
  align-items: center;
  row-gap: 2px;
  background: var(--pip-card-bg) !important;
  background: color-mix(in srgb, var(--pip-page-bg) 66%, transparent) !important;
  -webkit-backdrop-filter: blur(var(--pip-blur)) saturate(150%);
  backdrop-filter: blur(var(--pip-blur)) saturate(150%);
  border-radius: var(--pip-radius) !important;
  box-shadow: inset 0 0 0 1px var(--pip-hairline), 0 6px 18px rgba(0, 0, 0, .18);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pip-text) 14%, transparent), 0 6px 18px rgba(0, 0, 0, .18);
  overflow: hidden;
}

.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv > * {
  min-width: 0;
}

.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv [data-testid="context-item-info-title"] {
  color: var(--pip-text) !important;
  font-weight: 700 !important;
}

.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv [data-testid="context-item-info-subtitles"] {
  color: var(--pip-text-sub) !important;
}

.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv [data-testid="context-item-info-title"],
.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv [data-testid="context-item-info-subtitles"] {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv a,
.bEhb_FeKn_j0Not8O0Ua .wqWx0tCZPmntPpBGC2nv a:hover {
  color: inherit !important;
}

/* 去掉"加号"按钮（保留右侧的红心/更多按钮） */
.bEhb_FeKn_j0Not8O0Ua .bVNUf8KfIKl6mb9DrWI1 {
  display: none !important;
}

/* 去掉"不再推荐"（✕）按钮：播放推荐曲目时它会出现在信息卡操作区，
   默认透明、悬停时浮现，横条比例下不需要它 */
.bEhb_FeKn_j0Not8O0Ua [data-feedback-curated] {
  display: none !important;
}

/* 播放推荐曲目时，操作区里的红心会被替换成"移除推荐（✕）+ 添加推荐（＋）"，
   这里把这两个按钮连同整个操作区一起隐藏（普通曲目仍保留红心） */
.bEhb_FeKn_j0Not8O0Ua .KxxuuV2YdX_0Hoc3Tpw6,
.bEhb_FeKn_j0Not8O0Ua .cJQ1LjUkPXLemCedNguL {
  display: none !important;
}

.bEhb_FeKn_j0Not8O0Ua .yLfxkhR9AuglM7q6O3Fk:has(.KxxuuV2YdX_0Hoc3Tpw6),
.bEhb_FeKn_j0Not8O0Ua .yLfxkhR9AuglM7q6O3Fk:has(.cJQ1LjUkPXLemCedNguL) {
  display: none !important;
}

/* --------------------- ③ 播放时间（上）+ 进度条（下） --------------------- */
.bEhb_FeKn_j0Not8O0Ua .glTivoRqAfFVHgs50m8g {
  grid-area: playercontrols !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: center !important;
  margin: 0 !important;
  padding: 8px 14px !important;
  background: var(--pip-card-bg) !important;
  background: color-mix(in srgb, var(--pip-page-bg) 66%, transparent) !important;
  -webkit-backdrop-filter: blur(var(--pip-blur)) saturate(150%);
  backdrop-filter: blur(var(--pip-blur)) saturate(150%);
  border-radius: var(--pip-radius) !important;
  box-shadow: inset 0 0 0 1px var(--pip-hairline), 0 6px 18px rgba(0, 0, 0, .18);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pip-text) 14%, transparent), 0 6px 18px rgba(0, 0, 0, .18);
  overflow: hidden;
  --text-subdued: var(--pip-text-sub);
  --text-base: var(--pip-text);
}

.bEhb_FeKn_j0Not8O0Ua .glTivoRqAfFVHgs50m8g [data-testid="progress-bar"] {
  --bg-color: rgba(255, 255, 255, .20) !important;
  --bg-color: color-mix(in srgb, var(--pip-text) 20%, transparent) !important;
  --mg-color: var(--pip-text-sub) !important;
  --fg-color: var(--pip-text) !important;
  --is-active-fg-color: var(--pip-text) !important;
  --progress-bar-height: 6px !important;
}

/* 播放按钮：默认隐藏，鼠标移到封面上时淡入 */
.bEhb_FeKn_j0Not8O0Ua .[data-testid="document-pip-player-controls"] {
  grid-area: media !important;
  z-index: 4 !important;
  align-self: stretch !important;
  justify-self: stretch !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: var(--pip-radius) !important;
  background: transparent !important;
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease;
}

.bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj:has([data-testid="pip-hover-element"]:hover) .[data-testid="document-pip-player-controls"],
.bEhb_FeKn_j0Not8O0Ua .[data-testid="document-pip-player-controls"]:focus-within {
  opacity: 1;
  pointer-events: auto;
}

/* ---------- 打开队列时（窗口很高）：在横条下面再加一行 ---------- */
@media (height >= 499px) {
  .bEhb_FeKn_j0Not8O0Ua .URcit8iHn3qCCV6zMxMj:has(.ovPl_lvjFOJ_Mz9Y6grv) {
    grid-template-areas: "media contextinfo playercontrols" "extra extra extra" !important;
    grid-template-columns: auto minmax(0, 1.15fr) minmax(0, 1fr) !important;
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) !important;
  }

  .bEhb_FeKn_j0Not8O0Ua .ovPl_lvjFOJ_Mz9Y6grv {
    height: auto !important;
    min-height: 0;
  }
}
/* == PIP-3SECTIONS END == */
`;
  var cssText = CSS;

  function inject(doc) {
    try {
      if (!doc || !doc.head) return;
      if (doc.getElementById(STYLE_ID)) return;
      var style = doc.createElement('style');
      style.id = STYLE_ID;
      style.textContent = cssText;
      doc.head.appendChild(style);
    } catch (e) {}
  }

  function getPipWindow() {
    try {
      return window.documentPictureInPicture && window.documentPictureInPicture.window;
    } catch (e) {
      return null;
    }
  }

  function injectAll() {
    inject(document);
    var w = getPipWindow();
    if (w && w.document) inject(w.document);
  }

  // 开发用：改 user.css 后重开迷你播放器即可看到最新样式（DEV_SYNC_USER_CSS=true 时启用）
  function refreshFromDisk() {
    if (!DEV_SYNC_USER_CSS) return;
    try {
      fetch('user.css', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (text) {
          if (!text || text.length < 500 || text.indexOf('PIP-3SECTIONS') < 0) return;
          cssText = text;
          try {
            var w = getPipWindow();
            var docs = [document, w && w.document];
            for (var i = 0; i < docs.length; i++) {
              var d = docs[i];
              if (!d) continue;
              var old = d.getElementById(STYLE_ID);
              if (old && old.parentNode) old.parentNode.removeChild(old);
            }
          } catch (e) {}
          injectAll();
        })
        .catch(function () {});
    } catch (e) {}
  }

  // 第一次打开时把窗口缩成横条；之后用户手动调整的尺寸会被保留
  function shapeWindow(w) {
    if (!AUTO_RESIZE || !w) return;
    try {
      if (localStorage.getItem('pip-3sections-autoshaped') === '1') return;
      localStorage.setItem('pip-3sections-autoshaped', '1');
      if ((w.outerWidth || 0) <= 420 && (w.outerHeight || 0) <= 140) return;
      w.resizeTo(TARGET_WIDTH, TARGET_HEIGHT);
      var screenX = w.screenX || 0;
      var availWidth = (w.screen && w.screen.availWidth) || 0;
      if (availWidth && screenX + TARGET_WIDTH > availWidth) {
        w.moveTo(Math.max(0, availWidth - TARGET_WIDTH), w.screenY || 0);
      }
    } catch (e) {}
  }

  function shapeWhenReady() {
    setTimeout(function () { shapeWindow(getPipWindow()); }, 700);
    setTimeout(function () { shapeWindow(getPipWindow()); }, 1800);
  }

  // 右侧时间默认显示"总时长"：Spotify 的右侧时间可点击切换 总时长/倒计时，
  // 打开时如果发现是倒计时（以 - 开头）就自动点一下。
  function ensureTotalDuration(w) {
    if (!FIX_DURATION || !w || !w.document) return;
    try {
      var el = w.document.querySelector('[data-testid="playback-duration"]');
      if (!el) return;
      var text = (el.textContent || '').trim();
      if (text.charAt(0) === '-') el.click();
    } catch (e) {}
  }

  function fixDurationWhenReady() {
    var tryFix = function () { ensureTotalDuration(getPipWindow()); };
    setTimeout(tryFix, 400);
    setTimeout(tryFix, 1500);
    setTimeout(tryFix, 3000);
  }

  var dp = window.documentPictureInPicture;
  if (dp && typeof dp.addEventListener === 'function') {
    dp.addEventListener('enter', function (e) {
      try { inject(e.window && e.window.document); } catch (err) {}
      setTimeout(injectAll, 100);
      setTimeout(injectAll, 800);
      refreshFromDisk();
      shapeWhenReady();
      fixDurationWhenReady();
    });
  }

  injectAll();
  refreshFromDisk();
  shapeWhenReady();
  fixDurationWhenReady();
  setInterval(injectAll, 1000);
})();
