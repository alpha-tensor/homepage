/* Hero waves background, homepage only.
 *
 * Vanilla port of the Waves background from React Bits
 * (github.com/DavidHDev/react-bits, src/content/Backgrounds/Waves,
 * MIT + Commons Clause). The React wrapper is gone, the effect code
 * is the component's own, unchanged apart from the settings wiring.
 *
 * Settings are the ones from Brandon's Background Studio link
 * (2026-11-04): lineColor f97316, lineWidth 0.5, scale 1.15,
 * speed 0.55, variation 3, mouseRadius 150, fade 1. Unlisted
 * parameters keep the component defaults. One deliberate deviation:
 * opacity is 0.38, not the default 1, because the brief was very,
 * very subtle. If the effect ever needs to read stronger, that one
 * number is the dial.
 *
 * The canvas sits behind the hero content and never takes pointer
 * events; the effect listens on window, like the original. It
 * pauses off-screen and in hidden tabs (the component's own
 * observers), and under prefers-reduced-motion it draws one still
 * frame. Without WebGL2 it quietly does nothing.
 */
(function () {
  'use strict';

  var STYLES = { solid: 0, dashed: 1 };
  var CELL = 12;
  var STEP = 4;
  var INTRO_SECONDS = 2.2;
  var RIPPLE_SPEED = 640;
  var RIPPLE_WIDTH = 64;
  var RIPPLE_IMPULSE = (RIPPLE_WIDTH * Math.sqrt(Math.PI / 2)) / RIPPLE_SPEED;
  var MAX_VERTICES = 1600000;

  var VERTEX = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uView;
uniform float uRatio;
uniform vec2 uAxis;
uniform float uSpacing;
uniform float uStep;
uniform vec2 uStart;
uniform float uAmplitude;
uniform vec2 uFrequency;
uniform vec2 uDrift;
uniform float uTwist;
uniform uint uSeed;
uniform sampler2D uField;
uniform ivec2 uFieldSize;
uniform float uCell;
uniform float uLimit;
uniform float uReach;
uniform float uReveal;
uniform float uBand;
out float vAcross;
out float vAlong;
out float vEnergy;
out float vShow;
out float vPhase;
const vec2 GRADIENTS[12] = vec2[12](
  vec2(1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(-1.0, -1.0),
  vec2(1.0, 0.0), vec2(-1.0, 0.0), vec2(1.0, 0.0), vec2(-1.0, 0.0),
  vec2(0.0, 1.0), vec2(0.0, -1.0), vec2(0.0, 1.0), vec2(0.0, -1.0)
);
vec2 gradient(vec2 cell) {
  uvec2 q = uvec2(ivec2(cell) + 65536) + uvec2(uSeed * 7919u, uSeed * 104729u);
  q = 1103515245u * ((q >> 1u) ^ q.yx);
  uint n = 1103515245u * (q.x ^ (q.y >> 3u));
  return GRADIENTS[(n >> 16u) % 12u];
}
float ease(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  float n00 = dot(gradient(i), f);
  float n10 = dot(gradient(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(gradient(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(gradient(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  vec2 u = vec2(ease(f.x), ease(f.y));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}
vec2 node(ivec2 cell) {
  return texelFetch(uField, clamp(cell, ivec2(0), uFieldSize - 1), 0).xy;
}
void weights(float f, out vec4 w, out vec4 d) {
  float g = 1.0 - f;
  float f2 = f * f;
  float f3 = f2 * f;
  w = vec4(g * g * g, 3.0 * f3 - 6.0 * f2 + 4.0, -3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0, f3) / 6.0;
  d = vec4(-g * g, 3.0 * f2 - 4.0 * f, -3.0 * f2 + 2.0 * f + 1.0, f2) * 0.5;
}
vec2 field(vec2 point, out mat2 slope) {
  vec2 t = point / uCell;
  vec2 base = floor(t);
  vec2 f = t - base;
  vec4 wx;
  vec4 dx;
  vec4 wy;
  vec4 dy;
  weights(f.x, wx, dx);
  weights(f.y, wy, dy);
  ivec2 origin = ivec2(base) - 1;
  vec2 value = vec2(0.0);
  vec2 alongX = vec2(0.0);
  vec2 alongY = vec2(0.0);
  for (int j = 0; j < 4; j++) {
    vec2 row = vec2(0.0);
    vec2 rowSlope = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      vec2 tap = node(origin + ivec2(i, j));
      row += tap * wx[i];
      rowSlope += tap * dx[i];
    }
    value += row * wy[j];
    alongX += rowSlope * wy[j];
    alongY += row * dy[j];
  }
  float size = length(value);
  float scale = size > 0.0001 ? uLimit * tanh(size / uLimit) / size : 1.0;
  slope = mat2(alongX, alongY) * (scale / uCell);
  return value * scale;
}
vec2 wave(vec2 rest) {
  float turn = perlin(rest * uFrequency + uDrift) * 12.0 * uTwist;
  vec2 local = rest + vec2(cos(turn), sin(turn) * 0.5) * uAmplitude;
  return uView * 0.5 + vec2(local.x * uAxis.x - local.y * uAxis.y, local.x * uAxis.y + local.y * uAxis.x);
}
void main() {
  int index = gl_VertexID >> 1;
  float side = float(gl_VertexID & 1) * 2.0 - 1.0;
  float u = uStart.x + float(gl_InstanceID) * uSpacing;
  float v = uStart.y + float(index) * uStep;
  vec2 flowing = wave(vec2(u, v));
  vec2 bend = wave(vec2(u, v + uStep)) - wave(vec2(u, v - uStep));
  mat2 slope;
  vec2 shift = field(flowing, slope);
  vec2 point = flowing + shift;
  float energy = length(shift);
  vec2 tangent = bend + slope * bend;
  float span = max(length(tangent), 0.0001);
  vec2 normal = vec2(-tangent.y, tangent.x) / span;
  vec2 corner = point + normal * side * uReach / uRatio;
  vAcross = side * uReach;
  vAlong = v;
  vEnergy = energy;
  vShow = clamp((uReveal - abs(u)) / uBand, 0.0, 1.0);
  uint line = uint(gl_InstanceID) * 747796405u + uSeed * 2891336453u + 1u;
  line = ((line >> ((line >> 28u) + 4u)) ^ line) * 277803737u;
  vPhase = float((line >> 22u) ^ line) / 4294967295.0;
  vec2 clip = corner / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

  var FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform float uHalf;
uniform float uThin;
uniform int uStyle;
uniform float uPeriod;
uniform float uFlow;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uBase;
uniform float uHeat;
uniform float uFade;
uniform float uOpacity;
in float vAcross;
in float vAlong;
in float vEnergy;
in float vShow;
in float vPhase;
out vec4 outColor;
float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
void main() {
  float coverage = clamp(uHalf + 0.5 - abs(vAcross), 0.0, 1.0) * uThin;
  if (uStyle == 1) {
    float phase = (vAlong + uFlow) / uPeriod + vPhase;
    float blur = max(fwidth(phase), 0.0001);
    coverage *= clamp((0.25 - abs(fract(phase) - 0.5)) / blur + 0.5, 0.0, 1.0);
  }
  float heat = smoothstep(0.0, uHeat, vEnergy);
  vec2 uv = gl_FragCoord.xy / (uView * uRatio);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  float alpha = coverage * mix(uBase, 1.0, heat) * mask * vShow * uOpacity;
  outColor = vec4(mix(uColor, uAccent, heat) * alpha, alpha);
}`;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function smootherstep(value) {
    var t = clamp(value, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  function link(gl) {
    var vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    var fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    var program = gl.createProgram();
    if (!vertex || !fragment || !program) return null;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    var uniforms = {};
    var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < count; i++) {
      var info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program: program, uniforms: uniforms };
  }

  function init() {
    var container = document.querySelector('.hero-waves');
    var canvas = container ? container.querySelector('canvas') : null;
    if (!container || !canvas) return;

    /* Brandon's studio parameters first, component defaults for the
       rest, opacity lowered for subtlety (see header). */
    var raw = {
      lineColor: '#f97316',
      accentColor: '',
      lineStyle: 'solid',
      spacing: 10,
      lineWidth: 0.5,
      rotation: 0,
      amplitude: 32,
      scale: 1.15,
      twist: 1,
      speed: 0.55,
      variation: 3,
      mouseInteraction: true,
      mouseRadius: 150,
      mouseStrength: 1,
      bounce: 0.5,
      returnDuration: 1.4,
      clickRipple: true,
      intro: true,
      fade: 1,
      opacity: 0.38,
      lightMode: false,
      paused: false,
      dpr: undefined
    };
    var settings = {
      lineColor: String(raw.lineColor),
      accentColor: raw.accentColor ? String(raw.accentColor) : '',
      lineStyle: STYLES[raw.lineStyle] ?? 0,
      spacing: Math.max(2, raw.spacing),
      lineWidth: Math.max(0.25, raw.lineWidth),
      rotation: raw.rotation,
      amplitude: Math.max(0, raw.amplitude),
      scale: Math.max(0.05, raw.scale),
      twist: Math.max(0, raw.twist),
      speed: raw.speed,
      variation: Math.max(0, Math.round(raw.variation)),
      mouseInteraction: raw.mouseInteraction,
      mouseRadius: Math.max(20, raw.mouseRadius),
      mouseStrength: Math.max(0, raw.mouseStrength),
      bounce: clamp(raw.bounce, 0, 1),
      returnDuration: Math.max(0.2, raw.returnDuration),
      clickRipple: raw.clickRipple,
      intro: raw.intro,
      fade: clamp(raw.fade, 0, 1),
      opacity: clamp(raw.opacity, 0, 1),
      lightMode: raw.lightMode,
      paused: raw.paused,
      dpr: raw.dpr
    };

    var gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!gl) return;

    var program = link(gl);
    if (!program) return;
    var u = program.uniforms;

    var vao = gl.createVertexArray();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    var probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    var colors = new Map();

    function parse(value) {
      if (colors.has(value)) return colors.get(value);
      var rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#ffffff';
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        var data = probe.getImageData(0, 0, 1, 1).data;
        rgb = [data[0] / 255, data[1] / 255, data[2] / 255];
      }
      colors.set(value, rgb);
      return rgb;
    }

    function ink(rgb) {
      var linear = rgb.map(function (v) { return Math.pow(v, 2.2); });
      var tone = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      var depth = Math.min(1, 0.045 / Math.max(tone, 0.0001));
      return linear.map(function (v) { return Math.pow(v * depth, 1 / 2.2); });
    }

    var view = { width: 1, height: 1, ratio: 1 };
    var grid = { cols: 0, rows: 0, shift: new Float32Array(0), speed: new Float32Array(0), top: 0, bottom: -1, left: 0, right: -1 };
    var pointer = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, inside: false };
    var ripples = [];
    var state = { flow: 0, intro: settings.intro && !reduce ? 0 : 1 };
    var raf = 0;
    var last = 0;
    var visible = true;

    function limitOf(s) {
      return Math.max(12, s.mouseRadius * 0.5);
    }

    function rebuild() {
      grid.cols = Math.ceil(view.width / CELL) + 2;
      grid.rows = Math.ceil(view.height / CELL) + 2;
      grid.shift = new Float32Array(grid.cols * grid.rows * 2);
      grid.speed = new Float32Array(grid.cols * grid.rows * 2);
      grid.top = 0;
      grid.bottom = -1;
      grid.left = 0;
      grid.right = -1;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, grid.cols, grid.rows, 0, gl.RG, gl.FLOAT, grid.shift);
    }

    function include(x0, y0, x1, y1) {
      var c0 = clamp(Math.floor(x0 / CELL), 0, grid.cols - 1);
      var c1 = clamp(Math.ceil(x1 / CELL), 0, grid.cols - 1);
      var r0 = clamp(Math.floor(y0 / CELL), 0, grid.rows - 1);
      var r1 = clamp(Math.ceil(y1 / CELL), 0, grid.rows - 1);
      var empty = grid.bottom < grid.top;
      grid.top = empty ? r0 : Math.min(grid.top, r0);
      grid.bottom = empty ? r1 : Math.max(grid.bottom, r1);
      grid.left = empty ? c0 : Math.min(grid.left, c0);
      grid.right = empty ? c1 : Math.max(grid.right, c1);
    }

    function simulate(dt) {
      var s = settings;
      var follow = 1 - Math.exp(-dt / 0.045);
      var nx = pointer.sx + (pointer.x - pointer.sx) * follow;
      var ny = pointer.sy + (pointer.y - pointer.sy) * follow;
      var blend = 1 - Math.exp(-dt / 0.06);
      pointer.vx += ((nx - pointer.sx) / dt - pointer.vx) * blend;
      pointer.vy += ((ny - pointer.sy) / dt - pointer.vy) * blend;
      pointer.sx = nx;
      pointer.sy = ny;

      var zeta = 1 - 0.85 * s.bounce;
      var omega = 4 / (zeta * s.returnDuration);
      var radius = s.mouseRadius;
      var speedNow = Math.hypot(pointer.vx, pointer.vy);
      var drive = s.mouseInteraction && pointer.inside && !reduce ? 26000 * Math.tanh(speedNow / 1400) * s.mouseStrength : 0;
      if (drive > 1) include(pointer.sx - radius, pointer.sy - radius, pointer.sx + radius, pointer.sy + radius);

      var live = [];
      for (var i = ripples.length - 1; i >= 0; i--) {
        var ripple = ripples[i];
        ripple.age += dt;
        var front = ripple.age * RIPPLE_SPEED;
        var life = 1 - front / ripple.range;
        if (life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        var reach = front + RIPPLE_WIDTH * 3;
        include(ripple.x - reach, ripple.y - reach, ripple.x + reach, ripple.y + reach);
        live.push({
          x: ripple.x,
          y: ripple.y,
          front: front,
          power: (150 * omega * life * Math.sqrt(life)) / RIPPLE_IMPULSE
        });
      }

      if (grid.bottom < grid.top) return false;

      var stiffness = omega * omega;
      var damping = 2 * zeta * omega;
      var steps = Math.min(16, Math.max(1, Math.ceil(dt / Math.min(1 / 120, 0.6 / omega))));
      var h = dt / steps;
      var dirX = speedNow > 0.001 ? pointer.vx / speedNow : 0;
      var dirY = speedNow > 0.001 ? pointer.vy / speedNow : 0;
      var cols = grid.cols;
      var shift = grid.shift;
      var velocity = grid.speed;
      var left = grid.left;
      var right = grid.right;
      var peak = 0;

      for (var row = grid.top; row <= grid.bottom; row++) {
        var y = row * CELL;
        for (var col = left; col <= right; col++) {
          var x = col * CELL;
          var index = (row * cols + col) * 2;
          var ax = 0;
          var ay = 0;
          if (drive > 1) {
            var distance = Math.hypot(x - pointer.sx, y - pointer.sy);
            if (distance < radius) {
              var weight = smootherstep(1 - distance / radius) * drive;
              ax += dirX * weight;
              ay += dirY * weight;
            }
          }
          for (var r = 0; r < live.length; r++) {
            var rp = live[r];
            var ex = x - rp.x;
            var ey = y - rp.y;
            var dist = Math.hypot(ex, ey);
            var offset = (dist - rp.front) / RIPPLE_WIDTH;
            if (dist > 0.001 && Math.abs(offset) < 3) {
              var push = rp.power * Math.exp(-offset * offset * 2) * smootherstep(dist / 56);
              ax += (ex / dist) * push;
              ay += (ey / dist) * push;
            }
          }
          var px = shift[index];
          var py = shift[index + 1];
          var vx = velocity[index];
          var vy = velocity[index + 1];
          for (var k = 0; k < steps; k++) {
            vx += (ax - stiffness * px - damping * vx) * h;
            vy += (ay - stiffness * py - damping * vy) * h;
            px += vx * h;
            py += vy * h;
          }
          shift[index] = px;
          shift[index + 1] = py;
          velocity[index] = vx;
          velocity[index + 1] = vy;
          peak = Math.max(peak, Math.abs(px) + Math.abs(py) + (Math.abs(vx) + Math.abs(vy)) * 0.05);
        }
      }

      var top = grid.top;
      var height = grid.bottom - grid.top + 1;
      if (peak < 0.02 && drive <= 1 && !live.length) {
        for (var row2 = grid.top; row2 <= grid.bottom; row2++) {
          shift.fill(0, (row2 * cols + left) * 2, (row2 * cols + right + 1) * 2);
          velocity.fill(0, (row2 * cols + left) * 2, (row2 * cols + right + 1) * 2);
        }
        grid.top = 0;
        grid.bottom = -1;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, top, cols, height, gl.RG, gl.FLOAT, shift.subarray(top * cols * 2, (top + height) * cols * 2));
      return grid.bottom >= grid.top;
    }

    function render() {
      var s = settings;
      var angle = (s.rotation * Math.PI) / 180;
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var limit = limitOf(s);
      var margin = s.amplitude * 1.1 + limit + s.spacing * 2 + 8;
      var reachU = (view.width * Math.abs(cos) + view.height * Math.abs(sin)) / 2 + margin;
      var reachV = (view.width * Math.abs(sin) + view.height * Math.abs(cos)) / 2 + margin;
      var half = Math.ceil(reachU / s.spacing);
      var lines = half * 2 + 1;
      var step = STEP;
      var samples = Math.ceil((reachV * 2) / step) + 1;
      if (lines * samples * 2 > MAX_VERTICES) {
        samples = Math.max(16, Math.floor(MAX_VERTICES / (lines * 2)));
        step = (reachV * 2) / (samples - 1);
      }
      var width = s.lineWidth * view.ratio;
      var halfWidth = Math.max(0.5, width / 2);
      var reach = halfWidth + 1;
      var progress = state.intro;
      var reveal = s.intro && !reduce ? (1 - Math.pow(1 - clamp(progress / 0.7, 0, 1), 3)) * reachU * 1.3 : 1e6;
      var swell = s.intro && !reduce ? smootherstep((progress - 0.1) / 0.9) : 1;
      var base = parse(s.lineColor);
      var tone = s.lightMode ? ink(base) : base;
      var accent = s.accentColor ? parse(s.accentColor) : tone;
      var flowTime = state.flow + s.variation * 37.1;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(u.uField, 0);
      gl.uniform2f(u.uView, view.width, view.height);
      gl.uniform1f(u.uRatio, view.ratio);
      gl.uniform2f(u.uAxis, cos, sin);
      gl.uniform1f(u.uSpacing, s.spacing);
      gl.uniform1f(u.uStep, step);
      gl.uniform2f(u.uStart, -half * s.spacing, -reachV);
      gl.uniform1f(u.uAmplitude, s.amplitude * swell);
      gl.uniform2f(u.uFrequency, 0.002 / s.scale, 0.0015 / s.scale);
      gl.uniform2f(u.uDrift, flowTime * 0.025, flowTime * 0.0075);
      gl.uniform1f(u.uTwist, s.twist);
      gl.uniform1ui(u.uSeed, s.variation);
      gl.uniform2i(u.uFieldSize, grid.cols, grid.rows);
      gl.uniform1f(u.uCell, CELL);
      gl.uniform1f(u.uLimit, limit);
      gl.uniform1f(u.uReach, reach);
      gl.uniform1f(u.uReveal, reveal);
      gl.uniform1f(u.uBand, Math.max(1, reachU * 0.3));
      gl.uniform1f(u.uHalf, halfWidth);
      gl.uniform1f(u.uThin, Math.min(1, width));
      gl.uniform1i(u.uStyle, s.lineStyle);
      gl.uniform1f(u.uPeriod, s.spacing * 2.6);
      gl.uniform1f(u.uFlow, (state.flow * 16) % (s.spacing * 2.6));
      gl.uniform3fv(u.uColor, tone);
      gl.uniform3fv(u.uAccent, accent);
      gl.uniform1f(u.uBase, 0.62);
      gl.uniform1f(u.uHeat, limit * 0.55);
      gl.uniform1f(u.uFade, s.fade);
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, samples * 2, lines);
    }

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      var s = settings;
      var dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
      last = now;
      if (s.paused) {
        state.intro = 1;
        render();
        last = 0;
        return;
      }
      if (!reduce) state.flow += dt * s.speed;
      if (!s.intro || reduce) state.intro = 1;
      else if (state.intro < 1) state.intro = Math.min(1, state.intro + dt / INTRO_SECONDS);
      var awake = simulate(dt);
      render();
      var engaged = pointer.inside && s.mouseInteraction && Math.hypot(pointer.vx, pointer.vy) > 1;
      if (!reduce || awake || engaged || ripples.length || state.intro < 1) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function wake() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function resize() {
      var s = settings;
      var width = Math.max(1, container.clientWidth);
      var height = Math.max(1, container.clientHeight);
      var ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      view.width = width;
      view.height = height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      view.ratio = canvas.width / width;
      rebuild();
      render();
      wake();
    }

    function place(event, snap) {
      var rect = container.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (snap || (inside && !pointer.inside)) {
        pointer.sx = x;
        pointer.sy = y;
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.inside = inside;
      pointer.x = x;
      pointer.y = y;
      return { x: x, y: y, rect: rect, inside: inside };
    }

    function onPointerMove(event) {
      place(event, false);
      if (!settings.paused) wake();
    }

    function onPointerDown(event) {
      var s = settings;
      var placed = place(event, event.pointerType !== 'mouse');
      if (placed.inside && s.clickRipple && !s.paused && !reduce) {
        ripples.push({ x: placed.x, y: placed.y, age: 0, range: Math.max(360, Math.hypot(placed.rect.width, placed.rect.height) * 0.55) });
        if (ripples.length > 6) ripples.shift();
      }
      wake();
    }

    function onPointerUp(event) {
      if (event.pointerType !== 'mouse') pointer.inside = false;
    }

    function onPointerLeave() {
      pointer.inside = false;
      wake();
    }

    function onVisibility() {
      last = 0;
      wake();
    }

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    var intersection = new IntersectionObserver(function (entries) {
      visible = entries.some(function (entry) { return entry.isIntersecting; });
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
