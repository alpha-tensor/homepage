/* Tech Text headline effect, demo section only.
 *
 * Vanilla port of the TechText component from React Bits
 * (github.com/DavidHDev/react-bits, src/content/TextAnimations/
 * TechText, MIT + Commons Clause). The React wrapper and the
 * TypeScript types are gone; the component's own canvas
 * rendering logic is carried over as is, minus the text labels
 * (labels are off in the settings below, and the label drawing
 * and its separate label typeface are removed entirely, so
 * the only typeface the canvas ever uses is the container's
 * own, per the site's two typeface rule).
 *
 * What it does: a headline drawn on a 2D canvas. The letter
 * nearest the cursor dissolves into a dashed outline of
 * itself and gains a small selection frame in the accent
 * color, the site's selection bracket motif. Everything else
 * stays solid. At rest, untouched, it is simply the headline.
 *
 * Settings are decided for this one headline, the demo
 * section title "One fact, every format the form asks for":
 * Outfit (read from the container, whose font is the site's
 * display stack), weight 500, letterSpacing -0.02, ink from
 * the computed color so it follows the theme, accent
 * #F06E00, reveal 'letter', dashed outlines (dash 4, gap 2,
 * stroke 1), reach 140, softness 0.7, selection frame on,
 * labels off, specks 0, no drag, no click kick, no intro,
 * no guides, and sweep off, because the component's sweep
 * animates the lens on its own and this headline must be at
 * rest when untouched.
 *
 * Progressive enhancement only. The script enhances the
 * section title at viewport widths of 760px and up, and
 * never under prefers-reduced-motion (the original keeps a
 * reduced-motion hover state; here the plain headline is
 * kept instead, which is the stronger reading of the
 * preference). Below the breakpoint, or if anything here
 * fails, the styled h2 simply remains. While the canvas is
 * active the h2 keeps the text in the DOM for assistive
 * technology and search, visually hidden; the canvas
 * wrapper is aria-hidden. The render loop pauses off
 * screen (the component's intersection observer) and in
 * hidden tabs, and stops entirely at rest.
 */
(function () {
  'use strict';

  var FALLOFF_STEPS = 8;
  var SPRING = 320;
  var INHERIT = /^(currentcolor|inherit)$/i;
  var INTRO_DELAY = 0.15;
  var KICK_DECAY = 0.62;

  function approach(current, target, dt, seconds) {
    return current + (target - current) * (1 - Math.exp(-dt / seconds));
  }

  function clamp01(value) {
    return Math.min(1, Math.max(0, Number(value) || 0));
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function noise() {
    var h = 2166136261;
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      h = Math.imul(h ^ (value | 0), 16777619);
      h ^= h >>> 13;
      h = Math.imul(h, 0x5bd1e995);
      h ^= h >>> 15;
    }
    return (h >>> 0) / 4294967296;
  }

  function createTechText(container, canvas, settings) {
    var settingsRef = { current: settings };
    var wakeRef = { current: function () {} };
    var ctx = canvas.getContext('2d');
    var scratch = document.createElement('canvas');
    var scratchCtx = scratch.getContext('2d');
    if (!ctx || !scratchCtx) return function () {};

    var reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var width = 1;
    var height = 1;
    var dpr = 1;
    var raf = 0;
    var last = performance.now();
    var visible = false;
    var alive = true;
    var layoutKey = '';
    var sizeDirty = true;
    var requestedFont = '';
    var word = null;
    var glyphs = [];
    var presence = 0;
    var clock = 0;
    var pulse = 0;
    var placed = false;
    var dragging = -1;
    var cursor = '';
    var introClock = 0;
    var introKind = '';
    var introducing = false;
    var fontsReady = !document.fonts;
    var guideAlpha = 0;
    var kicks = [];
    var press = { x: 0, y: 0, time: 0, index: -1 };
    var pointer = { x: 0, y: 0, inside: false };
    var grab = { x: 0, y: 0 };
    var lens = { x: 0, y: 0 };
    var frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    function refreshFonts() {
      layoutKey = '';
      wakeRef.current();
    }

    function fontsLoaded() {
      fontsReady = true;
      refreshFonts();
    }

    function family(s) {
      return s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif';
    }

    function fontFor(s, size) {
      return s.fontWeight + ' ' + size + 'px ' + family(s);
    }

    function palette(s) {
      var current = getComputedStyle(container).color || '#000000';
      function pick(value) {
        return !value || INHERIT.test(String(value).trim()) ? current : value;
      }
      return { ink: pick(s.color), accent: pick(s.accentColor) };
    }

    function setFont(target, s, size) {
      target.font = fontFor(s, size);
      if ('letterSpacing' in target) {
        target.letterSpacing = s.letterSpacing * size + 'px';
      }
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    }

    function sprite(s, view, glyph, stroke, ink) {
      var pad = Math.ceil(s.strokeWidth * 2 + 4);
      var left = glyph.box.x1 - pad;
      var top = glyph.box.y1 - pad;
      var w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      var h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      var image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      var c = image.getContext('2d');
      if (!c) return { image: image, left: left, top: top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, s, view.size);
      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = 'butt';
        c.strokeStyle = ink;
        if (s.lineStyle !== 'solid') {
          c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        }
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        c.fillStyle = ink;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image: image, left: left, top: top };
    }

    function ensureLayout(s, ink) {
      var key = [
        s.text, family(s), s.fontWeight, s.fontSize, s.letterSpacing,
        s.align, ink, s.dashLength, s.dashGap, s.strokeWidth,
        s.lineStyle, width, height, dpr
      ].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;
      var wanted = fontFor(s, 64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text).then(refreshFonts, refreshFonts);
      }

      var probe = scratchCtx;
      setFont(probe, s, s.fontSize);
      var m = probe.measureText(s.text);
      var fit = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1)
      );
      var size = s.fontSize * fit;
      setFont(probe, s, size);
      m = probe.measureText(s.text);
      var inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      var inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      /* One adaptation from the component: with left
         alignment its wordmark margin (5% of the width) is
         dropped to zero, so the canvas headline's ink starts
         exactly where the h2's ink started and nothing in
         the section shifts sideways when it enhances. */
      var margin = s.align === 'left' ? 0 : width * 0.05;
      var start =
        s.align === 'left'
          ? margin
          : s.align === 'right'
            ? width - margin - inkWidth
            : (width - inkWidth) / 2;
      var x = start + m.actualBoundingBoxLeft;
      var baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      var xHeight = baseline - probe.measureText('x').actualBoundingBoxAscent;
      var capHeight = baseline - probe.measureText('H').actualBoundingBoxAscent;
      var ascender = baseline - probe.measureText('d').actualBoundingBoxAscent;
      var descender = baseline + probe.measureText('p').actualBoundingBoxDescent;
      var top = baseline - m.actualBoundingBoxAscent;
      var bottom = baseline + m.actualBoundingBoxDescent;
      var inkTop = Math.min(top, capHeight) - 2;
      var inkBottom = Math.max(bottom, baseline) + 2;
      var lines = [
        { y: baseline },
        { y: xHeight },
        { y: capHeight }
      ];
      if (capHeight - ascender > Math.max(11, size * 0.06)) {
        lines.push({ y: ascender });
      }
      lines.push({ y: descender });
      var next = {
        size: size,
        baseline: baseline,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top: top,
        bottom: bottom,
        lines: lines,
        bands: [
          { y0: xHeight, y1: baseline, up: true, order: 0 },
          { y0: capHeight, y1: xHeight, up: true, order: 1 },
          { y0: inkTop, y1: capHeight, up: true, order: 2 },
          { y0: baseline, y1: inkBottom, up: false, order: 1 }
        ].filter(function (band) { return band.y1 - band.y0 > 0.5; })
      };
      word = next;

      var chars = Array.from(s.text);
      var previous = glyphs;
      glyphs = [];
      var prefix = '';
      chars.forEach(function (char, i) {
        prefix += char;
        var own = probe.measureText(char);
        var gx = x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        var base = {
          char: char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent
          }
        };
        var kept = previous[glyphs.length];
        var sameGlyph = kept && kept.char === char && kept.index === i;
        glyphs.push({
          char: base.char,
          x: base.x,
          box: base.box,
          offset: sameGlyph ? kept.offset : { x: 0, y: 0 },
          velocity: sameGlyph ? kept.velocity : { x: 0, y: 0 },
          outline: sameGlyph ? kept.outline : 0,
          shown: sameGlyph ? kept.shown : 1,
          cells: null,
          assembled: 0,
          index: i,
          fill: sprite(s, next, base, false, ink),
          dashes: sprite(s, next, base, true, ink)
        });
      });
      if (dragging >= 0 && (!glyphs[dragging] || glyphs[dragging].index !== (previous[dragging] && previous[dragging].index))) {
        dragging = -1;
      }
      if (frame.index >= 0 && (!glyphs[frame.index] || glyphs[frame.index].char !== (previous[frame.index] && previous[frame.index].char))) {
        frame.index = -1;
      }
      return next;
    }

    function glyphAt(px, py) {
      if (!word || py < word.top - 24 || py > word.bottom + 24) return -1;
      var best = -1;
      var bestDistance = Infinity;
      glyphs.forEach(function (glyph, i) {
        var x1 = glyph.box.x1 + glyph.offset.x;
        var x2 = glyph.box.x2 + glyph.offset.x;
        var d = px < x1 ? x1 - px : px > x2 ? px - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    }

    function falloff(target, cx, cy, radius, strength, softness) {
      var inner = Math.min(1, Math.max(0, 1 - softness));
      var gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, ' + strength + ')');
      if (inner > 0.995) {
        gradient.addColorStop(0.995, 'rgba(0, 0, 0, ' + strength + ')');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      }
      for (var i = 0; i <= FALLOFF_STEPS; i++) {
        var t = i / FALLOFF_STEPS;
        var eased = t * t * (3 - 2 * t);
        gradient.addColorStop(
          inner + (1 - inner) * t,
          'rgba(0, 0, 0, ' + strength * (1 - eased) + ')'
        );
      }
      return gradient;
    }

    function blit(target, art, dx, dy, originX, originY) {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      );
    }

    function drawReveal(s) {
      var radius = s.reach * dpr;
      var cx = lens.x * dpr;
      var cy = lens.y * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';

      var x0 = Math.max(0, Math.floor(cx - radius));
      var y0 = Math.max(0, Math.floor(cy - radius));
      var x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      var y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      var w = x1 - x0;
      var h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = 'source-over';
      scratchCtx.clearRect(0, 0, w, h);
      for (var gi = 0; gi < glyphs.length; gi++) {
        blit(scratchCtx, glyphs[gi].dashes, glyphs[gi].offset.x, glyphs[gi].offset.y, x0, y0);
      }
      scratchCtx.globalCompositeOperation = 'destination-in';
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    }

    function crisp(value) {
      return (Math.round(value * dpr) + 0.5) / dpr;
    }

    function perimeterPoint(distance, w, h) {
      var d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    }

    function drawSpecks(s, a, accent) {
      var w = frame.x2 - frame.x1;
      var h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      var perimeter = 2 * (w + h);
      var seed = frame.index + 1;
      var grid = 3;
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      for (var k = 0; k < s.specks; k++) {
        var period = 0.5 + noise(seed, k, 11) * 1.2;
        var t = pulse / period + noise(seed, k, 17);
        var cycle = Math.floor(t);
        var life = t - cycle;
        if (life > 0.7) continue;
        var pt = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        var px = pt[0], py = pt[1], nx = pt[2], ny = pt[3];
        var pick = noise(seed, k, cycle, 2);
        var size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        var large = size >= 8;
        var out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        var sx = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        var sy = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        var tone = noise(seed, k, cycle, 3);
        var blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        var alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        var left = Math.round(sx - size / 2);
        var top = Math.round(sy - size / 2);
        ctx.globalAlpha = alpha;
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 2, 2);
        } else {
          ctx.fillRect(left, top, size, size);
        }
      }

      for (var j = 0; j < 2; j++) {
        var head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (var i = 0; i < 4; i++) {
          var hp = perimeterPoint(head - i * 6, w, h);
          var hsize = i === 0 ? 3 : 2;
          ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
          ctx.fillRect(Math.round(hp[0] - hsize / 2), Math.round(hp[1] - hsize / 2), hsize, hsize);
        }
      }
      ctx.globalAlpha = 1;
    }

    /* The component's label text (glyph dimensions beside the
       frame, metric names beside the guide lines) is not
       ported: labels are off in the settings, and leaving the
       drawing code out is what keeps the label font stack out
       of this file entirely. The frame and the guide lines
       themselves are unchanged. */
    function drawFrame(s, accent) {
      var glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      var a = frame.alpha;
      var x1 = crisp(frame.x1);
      var y1 = crisp(frame.y1);
      var x2 = crisp(frame.x2);
      var y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;

      var moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        var hx = (glyph.box.x1 + glyph.box.x2) / 2;
        var hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.45 * a;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.globalAlpha = 0.7 * a;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = 0.5 * a;
      ctx.stroke();

      ctx.beginPath();
      var corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
      for (var ci = 0; ci < corners.length; ci++) {
        ctx.rect(Math.round(corners[ci][0]) - 2, Math.round(corners[ci][1]) - 2, 5, 5);
      }
      ctx.globalAlpha = 0.95 * a;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (s.specks > 0) drawSpecks(s, a, accent);
    }

    function drawLines(s, view, accent, alpha, growth) {
      var pad = Math.max(12, view.size * 0.12);
      var x1 = Math.round(view.left - pad);
      var x2 = Math.round(view.right + pad);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      view.lines.forEach(function (line, k) {
        var grow = growth(k);
        if (grow <= 0.001) return;
        var y = crisp(line.y);
        var end = x1 + (x2 - x1) * grow;
        ctx.globalAlpha = alpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(end, y);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
        ctx.fillRect(Math.round(end) - 1, Math.round(line.y) - 1, 3, 3);
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }

    function ensureCells(glyph, view) {
      if (glyph.cells) return glyph.cells;
      var art = glyph.fill;
      var size = Math.max(3, Math.round(view.size / 26));
      var w = art.image.width;
      var h = art.image.height;
      var source = art.image.getContext('2d');
      var cells = [];
      glyph.cells = cells;
      glyph.assembled = 0;
      if (!source || w < 2 || h < 2) return cells;
      var data = source.getImageData(0, 0, w, h).data;
      var gx = Math.floor(art.left / size) * size;
      var gy = Math.floor(art.top / size) * size;
      var cols = Math.ceil((art.left + w / dpr - gx) / size) + 1;
      var rows = Math.ceil((art.top + h / dpr - gy) / size) + 1;
      var hit = new Uint8Array(cols * rows);
      for (var py = 0; py < h; py++) {
        for (var px = 0; px < w; px++) {
          if (data[(py * w + px) * 4 + 3] < 24) continue;
          var cx = Math.floor((art.left + px / dpr - gx) / size);
          var cy = Math.floor((art.top + py / dpr - gy) / size);
          hit[cy * cols + cx] = 1;
        }
      }
      var center = (glyph.box.x1 + glyph.box.x2) / 2;
      var along = clamp01((center - view.left) / Math.max(1, view.right - view.left));
      for (var k = 0; k < hit.length; k++) {
        if (!hit[k]) continue;
        var angle = noise(glyph.index, k, 1) * Math.PI * 2;
        var distance = view.size * (0.25 + 0.6 * noise(glyph.index, k, 2));
        var start = 0.03 + 0.36 * along + 0.12 * noise(glyph.index, k, 3);
        var land = start + 0.3 + 0.14 * noise(glyph.index, k, 4);
        cells.push({
          x: gx + (k % cols) * size,
          y: gy + Math.floor(k / cols) * size,
          size: size,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance * 0.7,
          start: start,
          land: land
        });
        glyph.assembled = Math.max(glyph.assembled, land);
      }
      return cells;
    }

    function cellRect(x, y, size) {
      var left = Math.round(x * dpr);
      var top = Math.round(y * dpr);
      return [left, top, Math.round((x + size) * dpr) - left, Math.round((y + size) * dpr) - top];
    }

    function drawAssembling(glyph, progress, accent) {
      var cells = glyph.cells || [];
      ctx.save();
      ctx.beginPath();
      var landed = 0;
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (progress < cell.land) continue;
        var r = cellRect(cell.x, cell.y, cell.size);
        ctx.rect(r[0], r[1], r[2], r[3]);
        landed++;
      }
      if (landed) {
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
      }
      ctx.restore();
      ctx.fillStyle = accent;
      for (var j = 0; j < cells.length; j++) {
        var c2 = cells[j];
        if (progress < c2.start || progress >= c2.land) continue;
        var u = (progress - c2.start) / (c2.land - c2.start);
        var eased = 1 - Math.pow(1 - u, 4);
        var sz = c2.size * (0.4 + 0.6 * eased);
        var cx2 = c2.x + (c2.size - sz) / 2 + c2.dx * (1 - eased);
        var cy2 = c2.y + (c2.size - sz) / 2 + c2.dy * (1 - eased);
        var rr = cellRect(cx2, cy2, sz);
        ctx.globalAlpha = Math.min(1, u * 4) * (0.55 + 0.45 * eased);
        ctx.fillRect(rr[0], rr[1], Math.max(1, rr[2]), Math.max(1, rr[3]));
      }
      ctx.globalAlpha = 1;
    }

    function drawFilling(glyph, lead, progress, view) {
      var art = glyph.fill;
      var left = Math.floor(art.left * dpr);
      var top = Math.floor(art.top * dpr);
      var w = art.image.width + 2;
      var h = art.image.height + 2;
      var fill = clamp01((progress - 0.24 - 0.28 * lead) / 0.48);
      var rects = [];
      for (var bi = 0; bi < view.bands.length; bi++) {
        var band = view.bands[bi];
        var amount = smoothstep(0.3 * band.order, 0.3 * band.order + 0.4, fill);
        if (amount <= 0) continue;
        var span = (band.y1 - band.y0) * amount;
        var y0 = Math.round((band.up ? band.y1 - span : band.y0) * dpr);
        var y1 = Math.round((band.up ? band.y1 : band.y0 + span) * dpr);
        if (y1 > y0) rects.push([y0, y1 - y0]);
      }
      var outline = smoothstep(0.08 + 0.2 * lead, 0.22 + 0.2 * lead, progress);
      if (outline > 0.001) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(left - 2, top - 2, w + 2, h + 2);
        for (var ri = 0; ri < rects.length; ri++) ctx.rect(left - 2, rects[ri][0], w + 2, rects[ri][1]);
        ctx.clip('evenodd');
        ctx.globalAlpha = outline;
        blit(ctx, glyph.dashes, 0, 0, 0, 0);
        ctx.restore();
      }
      if (rects.length) {
        ctx.save();
        ctx.beginPath();
        for (var rj = 0; rj < rects.length; rj++) ctx.rect(left - 2, rects[rj][0], w + 2, rects[rj][1]);
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function kick(index) {
      var strength = (word ? word.size : 120) * 11;
      kicks.push({ index: index, at: pulse, velocity: strength });
      for (var d = 1; d < glyphs.length; d++) {
        var velocity = strength * Math.pow(KICK_DECAY, d);
        if (velocity < 30) break;
        var js = [index - d, index + d];
        for (var n = 0; n < js.length; n++) {
          var j = js[n];
          if (j >= 0 && j < glyphs.length) {
            kicks.push({ index: j, at: pulse + d * 0.055, velocity: velocity });
          }
        }
      }
      wakeRef.current();
    }

    function tick(now) {
      raf = 0;
      var s = settingsRef.current;
      if (!s) return;
      if (sizeDirty) {
        sizeDirty = false;
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        var pixelWidth = Math.round(width * dpr);
        var pixelHeight = Math.round(height * dpr);
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      }
      var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      var pal = palette(s);
      var ink = pal.ink;
      var accent = pal.accent;
      var view = ensureLayout(s, ink);
      var damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

      if (s.intro !== introKind) {
        introKind = s.intro;
        introClock = 0;
      }
      var introOn = introKind !== 'none' && !reducedMotion && glyphs.length > 0;
      if (introOn && fontsReady) introClock += dt;
      var progress = introOn
        ? clamp01((introClock - INTRO_DELAY) / Math.max(0.3, s.introDuration))
        : 1;
      introducing = introOn && progress < 1;

      var sweeping = !introducing && s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      var targetX = pointer.x;
      var targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      var active = !introducing && (pointer.inside || sweeping || dragging >= 0);
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        var lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      presence = approach(
        presence,
        s.reveal === 'area' && active && dragging < 0 ? 1 : 0,
        dt,
        0.16
      );

      for (var k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        var kg = glyphs[kicks[k].index];
        if (kg) kg.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      var moving = false;
      glyphs.forEach(function (glyph, i) {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        var offset = glyph.offset;
        var velocity = glyph.velocity;
        if (
          Math.abs(offset.x) < 0.05 &&
          Math.abs(offset.y) < 0.05 &&
          Math.hypot(velocity.x, velocity.y) < 0.5
        ) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      var typing = -1;
      var ti;
      if (introducing && introKind === 'type') {
        var step = 0.86 / glyphs.length;
        var cursorAt = Math.min(glyphs.length - 1, Math.floor(progress / step));
        typing = progress < 0.93 ? cursorAt : -1;
        glyphs.forEach(function (glyph, i) {
          glyph.shown =
            i < cursorAt
              ? 1
              : i === cursorAt
                ? smoothstep(0, step * 0.3, progress - i * step)
                : 0;
        });
      } else {
        for (ti = 0; ti < glyphs.length; ti++) glyphs[ti].shown = 1;
      }

      var focus = introducing
        ? typing
        : dragging >= 0
          ? dragging
          : active
            ? glyphAt(lens.x, lens.y)
            : -1;
      if (focus >= 0 && s.selection) {
        var fg = glyphs[focus];
        var bx1 = fg.box.x1 + fg.offset.x - 6;
        var by1 = fg.box.y1 + fg.offset.y - 6;
        var bx2 = fg.box.x2 + fg.offset.x + 6;
        var by2 = fg.box.y2 + fg.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        var glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

      glyphs.forEach(function (glyph, i) {
        var target = introducing
          ? introKind === 'type' && (i === typing || (typing >= 0 && i > typing))
            ? 1
            : 0
          : s.reveal === 'letter' && i === focus && i !== dragging
            ? 1
            : 0;
        if (introducing && glyph.shown === 0) glyph.outline = target;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      guideAlpha = approach(
        guideAlpha,
        s.guides && !introducing && (focus >= 0 || presence > 0.4) ? 1 : 0,
        dt,
        0.14
      );

      var hovering = !introducing && focus >= 0 && pointer.inside;
      var nextCursor =
        dragging >= 0
          ? 'grabbing'
          : hovering && s.draggable
            ? 'grab'
            : hovering && s.clickKick
              ? 'pointer'
              : '';
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        container.style.cursor = nextCursor;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      glyphs.forEach(function (glyph) {
        var moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      });
      if (introducing && introKind === 'metrics') {
        drawLines(s, view, accent, 1 - smoothstep(0.84, 1, progress), function (k2) {
          return smoothstep(0.02 + 0.04 * k2, 0.2 + 0.04 * k2, progress);
        });
      } else if (guideAlpha > 0.005) {
        drawLines(s, view, accent, guideAlpha * 0.6, function () { return 1; });
      }
      glyphs.forEach(function (glyph, i) {
        if (introducing && introKind === 'assemble') {
          ensureCells(glyph, view);
          if (progress < glyph.assembled) {
            drawAssembling(glyph, progress, accent);
            return;
          }
        }
        if (introducing && introKind === 'metrics') {
          var lead = glyphs.length > 1 ? i / (glyphs.length - 1) : 0;
          if (progress < 0.72 + 0.28 * lead) {
            drawFilling(glyph, lead, progress, view);
            return;
          }
        }
        if (glyph.shown < 0.001) return;
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = (1 - glyph.outline) * glyph.shown;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline * glyph.shown;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      });
      if (presence > 0.001) drawReveal(s);
      drawFrame(s, accent);

      var settling =
        moving ||
        introducing ||
        kicks.length > 0 ||
        (guideAlpha > 0.005 && guideAlpha < 0.995) ||
        Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible && alive) {
        raf = requestAnimationFrame(tick);
      }
    }

    function wake() {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    wakeRef.current = wake;

    function resize() {
      sizeDirty = true;
      wake();
    }

    function locate(e) {
      var rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    function onMove(e) {
      locate(e);
      pointer.inside = true;
      wake();
    }

    function onLeave() {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    }

    function onDown(e) {
      locate(e);
      pointer.inside = true;
      var s = settingsRef.current;
      var primary = e.pointerType !== 'mouse' || e.button === 0;
      var index = introducing || !primary ? -1 : glyphAt(pointer.x, pointer.y);
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (s && s.draggable && index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        if (container.setPointerCapture) {
          try { container.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }
      wake();
    }

    function onUp(e) {
      if (dragging >= 0) {
        dragging = -1;
        if (container.releasePointerCapture) {
          try { container.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        var rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
      if (
        e.type === 'pointerup' &&
        press.index >= 0 &&
        settingsRef.current &&
        settingsRef.current.clickKick &&
        !reducedMotion &&
        performance.now() - press.time < 450
      ) {
        var rect2 = container.getBoundingClientRect();
        if (Math.hypot(e.clientX - rect2.left - press.x, e.clientY - rect2.top - press.y) < 6) {
          kick(press.index);
        }
      }
      press.index = -1;
      wake();
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        wake();
      }
    }

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize, { passive: true });
    var intersectionObserver = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    var themeObserver = new MutationObserver(wake);
    [document.documentElement, document.body].forEach(function (node) {
      if (node) {
        themeObserver.observe(node, {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-theme']
        });
      }
    });
    var schemeQuery =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (schemeQuery && schemeQuery.addEventListener) {
      schemeQuery.addEventListener('change', wake);
    }
    document.addEventListener('visibilitychange', onVisibility);
    if (document.fonts) document.fonts.ready.then(fontsLoaded, fontsLoaded);

    resize();

    return function destroy() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      wakeRef.current = function () {};
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      if (schemeQuery && schemeQuery.removeEventListener) {
        schemeQuery.removeEventListener('change', wake);
      }
      document.removeEventListener('visibilitychange', onVisibility);
      container.style.cursor = '';
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onLeave);
    };
  }

  /* Wiring: enhance the demo section title, and only that
     title, at 760px and up, and never under reduced motion. */
  var SETTINGS = {
    fontFamily: '',
    fontWeight: 500,
    fontSize: 40,
    letterSpacing: -0.02,
    color: 'currentColor',
    accentColor: '#F06E00',
    align: 'left',
    reach: 140,
    softness: 0.7,
    dashLength: 4,
    dashGap: 2,
    strokeWidth: 1,
    lineStyle: 'dashed',
    reveal: 'letter',
    specks: 0,
    selection: true,
    labels: false,
    draggable: false,
    bounce: 0.4,
    sweep: false,
    speed: 1,
    clickKick: false,
    intro: 'none',
    introDuration: 2,
    guides: false
  };

  var wideQuery = window.matchMedia('(min-width: 760px)');
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var instance = null;

  function enhance() {
    var title = document.querySelector(
      '.section--one-fact-every-format-the-form-asks-for .section-title'
    );
    if (!title || !title.parentNode) return null;
    var text = (title.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return null;
    var wrap = document.createElement('div');
    wrap.className = 'tech-text';
    wrap.setAttribute('aria-hidden', 'true');
    var canvas = document.createElement('canvas');
    canvas.className = 'tech-text__canvas';
    wrap.appendChild(canvas);
    title.parentNode.insertBefore(wrap, title);
    title.classList.add('sr-only');
    var settings = Object.assign({}, SETTINGS, { text: text });
    var destroy = createTechText(wrap, canvas, settings);
    return { title: title, wrap: wrap, destroy: destroy };
  }

  function teardown() {
    if (!instance) return;
    instance.destroy();
    if (instance.wrap.parentNode) {
      instance.wrap.parentNode.removeChild(instance.wrap);
    }
    instance.title.classList.remove('sr-only');
    instance = null;
  }

  function sync() {
    var want = wideQuery.matches && !motionQuery.matches;
    if (want && !instance) {
      instance = enhance();
    } else if (!want && instance) {
      teardown();
    }
  }

  function listen(query) {
    if (query.addEventListener) query.addEventListener('change', sync);
    else if (query.addListener) query.addListener(sync);
  }
  listen(wideQuery);
  listen(motionQuery);
  sync();
})();
