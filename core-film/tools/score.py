#!/usr/bin/env python3
"""Original score for the Core film, composed in code (no library music was reachable from the sandbox).

120 BPM, A major, |A|F#m|D|E| (one chord per 2 s bar). Every cut in the film is on the 0.5 s grid.
Sections (storyboard v2):
  0.0 - 3.5   intro: soft pad + filtered pluck arpeggio + light shaker (starts on the first sample)
  3.5         groove arrives on the logo lock: kick, sub bass
  5.5 - 21.0  full groove; 10.5 - 13.5 arp opens + bell layer (3D section)
 14.0 - 15.6  high-pass build on the bed; 15.6 - 16.0 dead stop; 16.0 drop on the purple takeover
 21.0 - 24.0  stripped (type section)
 24.0         final resolve on A, natural ring-out
Deterministic: seeded RNG only.
Usage: python3 tools/score.py out.wav [duration=27.0]
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
BPM = 120
BEAT = 60 / BPM
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 27.0
N = int(DUR * SR)
rng = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def env_adsr(n, a, d, s, r, sus_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); sl = max(0, int(sus_len * SR) - a - d)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sl, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))
def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))
def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR / 2 - 100), 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)
def place(buf, x, t0, gain=1.0, pan=0.0):
    i = int(round(t0 * SR));
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); seg = x[:j - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += seg * l * 1.414; buf[i:j, 1] += seg * r * 1.414

# chords (A major): A, F#m, D, E  (voicings around middle C)
CH = [[57, 61, 64, 69, 73], [54, 61, 66, 69, 73], [50, 57, 62, 66, 69], [52, 59, 64, 68, 71]]
ROOT = [45, 42, 38, 40]
def chord_at(t): return int(t // (4 * BEAT)) % 4

pad = np.zeros((N, 2)); arp = np.zeros((N, 2)); bass = np.zeros((N, 2)); drums = np.zeros((N, 2)); bell = np.zeros((N, 2))

# ---- pad: detuned saws, slow filter, one note-set per bar, crossfaded
for b in range(int(np.ceil(DUR / (4 * BEAT))) + 1):
    t0 = b * 4 * BEAT
    if t0 >= DUR - 0.5: break
    L = 4 * BEAT + 1.2; n = int(L * SR); t = np.arange(n) / SR
    final = t0 >= 24.0
    if final: L = DUR - t0 + 0.01; n = int(L * SR); t = np.arange(n) / SR
    for k, side in ((0, -0.5), (1, 0.5)):
        x = np.zeros(n)
        for m in CH[chord_at(t0)]:
            x += saw(midi(m), t, detune=(0.0035 if k else -0.0035)) + 0.5 * saw(midi(m - 12), t, detune=0.002)
        x = lp(x, 1600 if not final else 2200) * 0.05
        e = env_adsr(n, 0.35, 0.5, 0.85, 1.2 if not final else 2.5, L - (1.2 if not final else 2.5))
        place(pad, x * e, t0, 1.0, side)

# ---- arpeggio: pluck, 8th notes, pattern up through chord tones
pat = [0, 2, 3, 4, 3, 2, 1, 2]
def pluck(f, bright):
    n = int(0.45 * SR); t = np.arange(n) / SR
    x = saw(f, t) * 0.6 + np.sin(2 * np.pi * f * t) * 0.4
    # decaying filter: approximate by mixing bright and dark versions
    e_f = np.exp(-t * 14)
    x = lp(x, 900 + bright) * (1 - e_f) + lp(x, 900 + bright * 3) * e_f
    return x * np.exp(-t * 7.5) * env_adsr(n, 0.003, 0.05, 1, 0.05, 0.4)
step = BEAT / 2
for i in range(int(24.0 / step)):
    t0 = i * step
    if 15.6 <= t0 < 16.0: continue
    if 21.0 <= t0 < 24.0 and i % 2: continue
    c = CH[chord_at(t0)]; m = c[pat[i % 8]] + 12
    bright = 900 if t0 < 3.5 else (2600 if 10.5 <= t0 < 13.5 else 1700)
    g = 0.11 if t0 < 3.5 else 0.12
    place(arp, pluck(midi(m), bright), t0, g * (1.0 if i % 2 == 0 else 0.75), -0.35 if i % 2 else 0.35)

# ---- bell layer in 3D section and on the final resolve
def bellnote(f, L=1.6):
    n = int(L * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12)
    return x * np.exp(-t * 2.6) * env_adsr(n, 0.004, 0.1, 1, 0.1, L - 0.2)
for t0, m in [(10.5, 81), (11.0, 85), (11.5, 88), (12.5, 86), (13.0, 85)]:
    place(bell, bellnote(midi(m)), t0, 0.05, 0.2)
for t0, m in [(24.0, 81), (24.0, 88), (24.5, 85), (25.0, 93)]:
    place(bell, bellnote(midi(m), 2.6), t0, 0.045, -0.15)

# ---- bass: sub sine + soft saw, 8th-note pulse from 3.5
def bassnote(f, L):
    n = int(L * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.25 * lp(saw(f, t), 500)
    return x * env_adsr(n, 0.005, 0.08, 0.8, 0.06, L - 0.06)
for i in range(int(3.5 / step), int(DUR / step)):
    t0 = i * step
    if 15.6 <= t0 < 16.0: continue
    if t0 >= 24.0:
        if t0 == 24.0: place(bass, bassnote(midi(ROOT[0]), 2.6), t0, 0.16)
        continue
    r = ROOT[chord_at(t0)]
    place(bass, bassnote(midi(r + (12 if i % 4 == 3 else 0)), step * 0.9), t0, 0.15)

# ---- drums
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 9) + 0.15 * bp(rng.standard_normal(n), 1500, 5000) * np.exp(-t * 200)
    return x
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000, 4) * np.exp(-t * (18 if open_ else 70))
def shaker():
    n = int(0.09 * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 4000, 9000) * np.sin(np.pi * t / t[-1]) ** 2
def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 4200)
    e = np.exp(-t * 22); e[:int(.012 * SR)] *= 1.4; e[int(.012 * SR):int(.024 * SR)] *= 0.6
    return x * e
kicks = []
for b in range(int(DUR / BEAT)):
    t0 = b * BEAT
    if 15.6 <= t0 < 16.0: continue
    if t0 < 3.5:
        place(drums, shaker(), t0 + step, 0.05, 0.3)
        continue
    if t0 >= 24.0:
        if t0 == 24.0: place(drums, kick(), t0, 0.55); kicks.append(t0)
        continue
    place(drums, kick(), t0, 0.5); kicks.append(t0)
    if 5.5 <= t0 < 21.0 and b % 2 == 1: place(drums, clap(), t0, 0.12, 0.1)
    if 5.5 <= t0 < 21.0:
        place(drums, hat(), t0 + step, 0.07, -0.3)
        place(drums, hat(), t0 + step / 2, 0.03, 0.3); place(drums, hat(), t0 + 3 * step / 2, 0.03, 0.3)
    else:
        place(drums, shaker(), t0 + step, 0.05, 0.3)

# ---- sidechain duck on pad/bass/arp from kicks
duck = np.ones(N)
for k in kicks:
    i = int(k * SR); L = int(0.22 * SR); j = min(N, i + L)
    duck[i:j] = np.minimum(duck[i:j], 1 - 0.45 * (1 - np.linspace(0, 1, j - i)) ** 2)
for buf in (pad, bass, arp): buf *= duck[:, None]

# ---- build into the drop: high-pass sweep 15.5 -> 17.1 on the bed, then dead stop
def hp_sweep(buf, t0, t1, f0=40, f1=600):
    i0, i1 = int(t0 * SR), int(t1 * SR); hop = int(0.02 * SR)
    out = buf.copy()
    for i in range(i0, i1, hop):
        f = f0 * (f1 / f0) ** ((i - i0) / (i1 - i0))
        seg = buf[max(0, i - 2048):i + hop]
        y = hp(seg.T, f).T
        out[i:i + hop] = y[-hop:]
    return out
bed = pad + arp + bass
bed = hp_sweep(bed, 14.0, 15.6)
# riser-free dip, then silence 17.1-17.5 except pad tail at -12 dB
i0, i1 = int(15.6 * SR), int(16.0 * SR)
g = np.ones(N); g[i0:i1] = 0.0; g[i0 - int(.01 * SR):i0] = np.linspace(1, 0, int(.01 * SR)); g[i1:i1 + int(.005 * SR)] = np.linspace(0, 1, int(.005 * SR))
bed *= g[:, None]; drums *= g[:, None]
pad_tail = pad.copy(); pad_tail[:i0] = 0; pad_tail[i1:] = 0
mix = bed + drums + bell + pad_tail * 0.25

# ---- space: short seeded plate-ish reverb on arp/bell/pad bus
ir_n = int(1.8 * SR); t = np.arange(ir_n) / SR
ir = rng.standard_normal((ir_n, 2)) * np.exp(-t * 3.2)[:, None]; ir[:int(.01 * SR)] = 0
ir = np.stack([lp(hp(ir[:, c], 300), 7000) for c in range(2)], 1); ir /= np.abs(ir).sum(0) ** 0.5 * 4
wet_src = arp + bell + pad * 0.5
wet = np.stack([fftconvolve(wet_src[:, c], ir[:, c])[:N] for c in range(2)], 1)
mix = mix + wet * 0.35

# ---- master: gentle tilt, soft clip, fade in 5 ms, final fade over the last 0.8 s
mix = np.stack([hp(mix[:, c], 28) for c in range(2)], 1)
mix = np.tanh(mix * 1.2) / 1.2
mix[:int(.005 * SR)] *= np.linspace(0, 1, int(.005 * SR))[:, None]
f0 = int((DUR - 0.8) * SR); mix[f0:] *= (np.linspace(1, 0, N - f0) ** 1.6)[:, None]
mix /= np.abs(mix).max() / 0.7

import subprocess
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', sys.argv[1]],
               input=mix.astype(np.float32).tobytes(), check=True)
print('wrote', sys.argv[1], f'{DUR}s')
