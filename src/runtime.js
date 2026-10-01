/*!
 * Miniplayer 3-Section — a Spicetify extension
 *
 * Rearranges Spotify's PiP (Document Picture-in-Picture) mini player into
 * three horizontal sections: cover art | title & artist | time & progress.
 * 把 Spotify 迷你播放器改成横向三段式：封面 ｜ 歌手+歌名 ｜ 时间+进度条。
 *
 * @version 1.0.0
 * @license MIT
 * @repository https://github.com/Patrickkkkks/spotify-miniplayer-3sections
 * @tested-with Spotify 1.3.3.264 / Spicetify 2.45.1 / Windows 11
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
  var CSS = `/*__PIP_CSS__*/`;
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
