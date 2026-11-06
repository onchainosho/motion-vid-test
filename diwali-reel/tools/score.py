#!/usr/bin/env python3
"""Original festive score for the Diwali reel, composed in code (music libraries are blocked in the sandbox).
120 BPM, D major pentatonic. Deterministic (seeded noise only).
  0.0 - 1.9  tanpura-style drone (D/A) + a rising plucked figure under the rockets (starts on the first sample)
  1.9 / 2.15 bell shimmer chords on the two bursts
  2.0 - 5.0  soft pulse arrives (frame-drum style low thump + shaker), plucked arpeggio
  5.0        resolve: warm pad chord + slow bell melody for the greeting; ring-out to 10.0
Usage: python3 tools/score.py out.wav [duration=10]"""
import sys, subprocess
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000; DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0; N = int(DUR * SR)
rng = np.random.default_rng(23)
mf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
lp = lambda x, f, o=2: sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b, o=2: sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def saw(f, t): ph = f * t; return 2 * (ph - np.floor(ph + .5))
def place(buf, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR)); j = min(len(buf), i + len(x))
    if i >= len(buf) or j <= i: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); buf[i:j, 0] += x[:j - i] * g * l * 1.414; buf[i:j, 1] += x[:j - i] * g * r * 1.414
def env(n, a, r):
    e = np.ones(n); A = int(a * SR); R = int(r * SR); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
mix = np.zeros((N, 2)); verb = np.zeros((N, 2))
# drone: D2 + A2 + D3 saws through a moving band (jawari-like shimmer)
t = np.arange(N) / SR
for m, g, pan in ((38, .05, -.3), (45, .035, .3), (50, .03, 0)):
    x = saw(mf(m), t) + 0.6 * saw(mf(m) * 1.003, t)
    x = lp(x, 1400) + 0.35 * bp(x, 1800, 3000) * (0.6 + 0.4 * np.sin(t * 1.7 + m))
    place(mix, x * env(N, 0.004, 0.8) * g, 0, 1, pan)
# plucked string (santoor-like): bright attack, fast decay, slight double strike
def pluck(f, L=0.9, bright=4000):
    n = int(L * SR); tt = np.arange(n) / SR
    x = saw(f, tt) * 0.5 + np.sin(2 * np.pi * f * tt) * 0.6 + 0.25 * np.sin(2 * np.pi * 2 * f * tt)
    x = lp(x, bright) * np.exp(-tt * 6.5); x[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    return x
def bell(f, L=2.2):
    n = int(L * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt) + .45 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 5) + .25 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 9)
    x *= np.exp(-tt * 2.2); x[:int(.003 * SR)] *= np.linspace(0, 1, int(.003 * SR)); return x
PENT = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86]
# rising figure under the rockets (accelerating)
for k, (t0, i) in enumerate([(0.0, 0), (0.5, 2), (0.875, 3), (1.125, 4), (1.375, 5), (1.5625, 6), (1.75, 7)]):
    x = pluck(mf(PENT[i])); place(mix, x, t0, .11, -.25 + .08 * k); place(verb, x, t0, .06)
# bursts: bell shimmer chords
for t0, chord, g in ((2.02, (74, 78, 81, 86), .05), (2.27, (76, 81, 83, 88), .045)):
    for j, m in enumerate(chord): x = bell(mf(m)); place(mix, x, t0 + j * 0.03, g, -.4 + j * .27); place(verb, x, t0 + j * .03, g * .8)
# logo reveals: soft bell swells under CORE (3.15) and ADAM (3.45), pad swell from 2.6
for t0, chord in ((3.3, (74, 78, 81)), (3.6, (76, 81, 86)), (5.1, (81, 86, 90))):
    for j, m in enumerate(chord): x = bell(mf(m), 2.6); place(mix, x, t0 + j * .04, .04, -.3 + j * .3); place(verb, x, t0 + j * .04, .05)
n = int(2.6 * SR); tt = np.arange(n) / SR
for m in (62, 66, 69):
    x = lp(saw(mf(m), tt) + saw(mf(m) * 1.004, tt), 1600) * np.sin(np.pi * tt / tt[-1]) ** 1.5 * .02; place(mix, x, 2.6, 1); place(verb, x, 2.6, .5)
# 2.0 - 5.0: pulse + arpeggio
def thump():
    n = int(.4 * SR); tt = np.arange(n) / SR; f = 70 + 60 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10) + .08 * bp(rng.standard_normal(n), 300, 1200) * np.exp(-tt * 40)
def shaker():
    n = int(.09 * SR); tt = np.arange(n) / SR; return bp(rng.standard_normal(n), 4500, 9000) * np.sin(np.pi * tt / tt[-1]) ** 2
for b in range(int(2.0 / .5), int(10.0 / .5)):
    t0 = b * .5; late = t0 >= 5.0; gk = .30 if not late else .22
    if t0 < 9.5: place(mix, thump(), t0, gk)
    place(mix, shaker(), t0 + .25, .035 if not late else .028, .3)
ARP = [62, 69, 74, 78, 81, 78, 74, 69]
for i in range(int(2.0 / .25), int(5.0 / .25)):
    t0 = i * .25; x = pluck(mf(ARP[i % 8]), .7, 3500); place(mix, x, t0, .075 if i % 2 == 0 else .055, .3 if i % 2 else -.3); place(verb, x, t0, .04)
# 5.0: resolve pad + slow bell melody
for m, pan in ((50, -.3), (57, .3), (62, 0), (66, -.2), (69, .2)):
    n = N - int(5.0 * SR); tt = np.arange(n) / SR
    x = lp(saw(mf(m), tt) + saw(mf(m) * 1.004, tt), 1800) * env(n, 0.35, 1.2) * .022
    place(mix, x, 5.0, 1, pan); place(verb, x, 5.0, .6)
for t0, m in ((5.0, 81), (5.5, 78), (6.0, 76), (6.5, 74), (7.5, 78), (8.0, 81), (8.5, 86)):
    x = bell(mf(m), 2.4); place(mix, x, t0, .045, .15); place(verb, x, t0, .05)
for t0, i in ((5.0, 0), (5.25, 3), (5.5, 5), (5.75, 7), (7.0, 5), (7.25, 7), (7.5, 8), (9.0, 5)):
    x = pluck(mf(PENT[i]), .9, 3800); place(mix, x, t0, .06, -.2); place(verb, x, t0, .04)
# reverb (seeded noise IR) and master
irn = int(2.2 * SR); tt = np.arange(irn) / SR
ir = rng.standard_normal((irn, 2)) * np.exp(-tt * 2.6)[:, None]; ir[:int(.012 * SR)] = 0
ir = np.stack([lp(hp(ir[:, c], 250), 7000) for c in range(2)], 1); ir /= np.abs(ir).sum(0) ** .5 * 4
mix += np.stack([fftconvolve(verb[:, c], ir[:, c])[:N] for c in range(2)], 1) * .5
mix = np.stack([hp(mix[:, c], 30) for c in range(2)], 1); mix = np.tanh(mix * 1.1) / 1.1
mix[:int(.005 * SR)] *= np.linspace(0, 1, int(.005 * SR))[:, None]
f0 = int((DUR - .7) * SR); mix[f0:] *= (np.linspace(1, 0, N - f0) ** 1.5)[:, None]
mix /= np.abs(mix).max() / .7
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', sys.argv[1]], input=mix.astype(np.float32).tobytes(), check=True)
print('wrote', sys.argv[1])
