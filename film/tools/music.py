#!/usr/bin/env python3
"""Synthesised music bed for the Reel (no samples, no AI). 120 BPM, A minor / C major, 30.0 s.
Every scene change in the film is on a beat (0.5 s grid). Deterministic (seeded noise).
Writes assets/audio/music.wav (48 kHz stereo, unmastered) and the checklist pluck accents into the same bed."""
import numpy as np, subprocess, sys
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000; DUR = 30.0; N = int(DUR * SR); BEAT = 0.5; rng = np.random.default_rng(2025)
L = np.zeros(N); R = np.zeros(N)
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def env_adsr(n, a, d, s, rel, hold):
    t = np.arange(n) / SR; e = np.ones(n) * s
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d); e[m] = 1 - (1 - s) * (t[m] - a) / d
    m = t >= hold; e[m] = s * np.exp(-(t[m] - hold) / rel) if s > 0 else e[m]
    return e
def add(buf, x, t0, gain=1.0):
    i = int(round(t0 * SR)); j = min(N, i + len(x));
    if i < N and j > i: buf[i:j] += gain * x[:j - i]
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)

# --- instruments ---
def epiano(note, dur, vel=1.0, detune=0.0):
    n = int((dur + 1.2) * SR); t = np.arange(n) / SR; f = midi(note) * (1 + detune)
    idx = 2.4 * np.exp(-t * 6) + 0.4                      # FM index decays: bright attack, mellow body
    mod = np.sin(2 * np.pi * f * t) * idx
    x = np.sin(2 * np.pi * f * t + mod) + 0.18 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5)
    e = np.exp(-t * 2.2) * np.minimum(1, t / 0.004); rel = t > dur; e[rel] *= np.exp(-(t[rel] - dur) / 0.12)
    return x * e * vel * (1 + 0.04 * np.sin(2 * np.pi * 4.5 * t))
def bass(note, dur, vel=1.0):
    n = int((dur + 0.15) * SR); t = np.arange(n) / SR; f = midi(note)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    x = np.tanh(1.6 * x) / np.tanh(1.6)
    e = np.minimum(1, t / 0.006) * np.exp(-t * 1.4); rel = t > dur; e[rel] *= np.exp(-(t[rel] - dur) / 0.04)
    return lp(x * e * vel, 900)
def kick(vel=1.0):
    n = int(0.42 * SR); t = np.arange(n) / SR
    f = 55 + 120 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7.5) + 0.25 * np.exp(-t * 300) * rng.standard_normal(n) * 0.3
    return x * vel
def clap(vel=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR; nz = rng.standard_normal(n)
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]): e += (t >= o) * np.exp(-np.maximum(0, t - o) * (60 if k < 2 else 18))
    return bp(nz * e, 1200, 5000) * vel * 0.8
def hat(vel=1.0, open_=False):
    n = int((0.18 if open_ else 0.06) * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 7000) * np.exp(-t * (22 if open_ else 70))
    return lp(x, 11000) * vel
def shaker(vel=1.0):
    n = int(0.09 * SR); t = np.arange(n) / SR
    e = np.minimum(1, t / 0.012) * np.exp(-t * 45)
    return bp(rng.standard_normal(n), 4500, 10000) * e * vel
def pluck(note, vel=1.0):
    n = int(0.6 * SR); t = np.arange(n) / SR; f = midi(note)
    x = sum(np.sin(2 * np.pi * f * k * t) * (0.6 ** (k - 1)) for k in (1, 2, 3, 4)) * np.exp(-t * 9) * np.minimum(1, t / 0.002)
    return lp(x, 5000) * vel

# --- harmony: one chord per 2 s bar (bars start on even seconds) ---
CH = {'Am7': [57, 60, 64, 67], 'Fmaj7': [53, 57, 60, 64], 'Cmaj7': [55, 60, 64, 71], 'G6': [55, 59, 62, 64], 'Cadd9': [55, 60, 62, 64, 67]}
ROOT = {'Am7': 45, 'Fmaj7': 41, 'Cmaj7': 48, 'G6': 43, 'Cadd9': 36}
PROG = ['Am7', 'Fmaj7', 'Cmaj7', 'G6']
keys = np.zeros(N); keysR = np.zeros(N); drums = np.zeros(N); bas = np.zeros(N); acc = np.zeros(N)
END_GROOVE = 28.0
for bar in range(15):
    t0 = bar * 2.0; ch = PROG[bar % 4] if t0 < END_GROOVE else 'Cadd9'
    if t0 >= END_GROOVE:
        for k, n in enumerate(CH[ch]):
            add(keys, epiano(n, 1.9, 0.30), t0 + 0.012 * k); add(keysR, epiano(n, 1.9, 0.30, 0.0015), t0 + 0.012 * k)
        add(bas, bass(ROOT[ch], 1.8, 0.9), t0); add(drums, kick(1.0), t0)
        continue
    # syncopated stabs: eighth positions 0, 3, 6 (and 7 on even bars)
    for pos in ([0, 3, 6] + ([7] if bar % 2 == 0 else [])):
        st = t0 + pos * 0.25; v = 0.26 if pos == 0 else 0.2
        for k, n in enumerate(CH[ch]):
            add(keys, epiano(n, 0.18, v), st + 0.006 * k); add(keysR, epiano(n, 0.18, v, 0.0015), st + 0.006 * k)
            if k >= 2: add(keys, epiano(n + 12, 0.12, v * 0.45), st + 0.01); add(keysR, epiano(n + 12, 0.12, v * 0.45, 0.002), st + 0.012)
    for pos, d in [(0, 0.6), (3, 0.2), (4, 0.5), (7, 0.2)]:
        add(bas, bass(ROOT[ch] + (12 if pos == 7 else 0), d, 0.85), t0 + pos * 0.25)
    for b in range(4):
        tb = t0 + b * 0.5
        if tb < 2.5:  # intro: kick on 1 and 3 only, light hats
            if b % 2 == 0: add(drums, kick(0.8), tb)
            add(drums, hat(0.12), tb + 0.25)
            continue
        if 26.4 <= tb < 26.5: continue
        if 22.5 <= tb < 26.4:
            add(drums, hat(0.13), tb + 0.25)
            if b == 3: add(drums, kick(0.7), tb)
            continue
        add(drums, kick(1.0), tb)
        if b % 2 == 1: add(drums, clap(0.9), tb)
        add(drums, hat(0.24), tb + 0.25)
        if b == 3 and bar % 2 == 1: add(drums, hat(0.12, True), tb + 0.25)
for k in range(int(28.0 / 0.125)):
    ts = k * 0.125
    if 26.4 <= ts < 26.5: continue
    acc_ = 1.0 if k % 4 == 2 else (0.55 if k % 2 else 0.4)
    lvl = 0.16 if ts < 2.5 else (0.22 if 22.5 <= ts < 26.4 else 0.3)
    add(drums, shaker(lvl * acc_), ts)
# clap on the 2.5 s arrival of the groove
add(drums, clap(1.0), 2.5)
# counter melody from 12.5 (tips 5-8): sparse plucks in A minor pentatonic
mel = [(12.5, 76), (13.25, 74), (13.5, 72), (14.5, 69), (16.5, 72), (17.25, 74), (17.5, 76), (18.5, 79), (20.5, 76), (21.25, 74), (21.5, 72), (22.0, 69)]
for t, n in mel: add(acc, pluck(n, 0.16), t)
# checklist ticks: an ascending in-key pluck on every tick (23.30 + 0.25 k), then a chord accent on "THEN GENERATE." (25.5)
for k, n in enumerate([69, 72, 74, 76, 79, 81, 84, 86]): add(acc, pluck(n, 0.34), 23.30 + 0.25 * k)
for n in [72, 76, 79, 84]: add(acc, pluck(n, 0.26), 25.5)
# dead stop before the CTA (26.4–26.5): duck everything briefly
# sidechain pump on keys/bass from the kick
kick_times = [b * 0.5 for b in range(int(DUR / 0.5)) if b * 0.5 >= 2.5 and not (22.5 <= b * 0.5 < 26.5) and b * 0.5 < END_GROOVE]
duck = np.ones(N); t = np.arange(int(0.3 * SR)) / SR; shape = 1 - 0.45 * np.exp(-t * 14)
for kt in kick_times: i = int(kt * SR); j = min(N, i + len(shape)); duck[i:j] = np.minimum(duck[i:j], shape[:j - i])
# intro filter: keys low-passed opening over 0–2.5 s (block-wise)
def sweep_lp(x, f0, f1, t0, t1):
    y = x.copy(); B = 2400
    for i in range(int(t0 * SR), int(t1 * SR), B):
        f = f0 * (f1 / f0) ** ((i / SR - t0) / (t1 - t0)); y[i:i + B] = lp(x[max(0, i - 4800):i + B], f)[-len(y[i:i + B]):]
    return y
keys = sweep_lp(keys, 900, 9000, 0, 2.5); keysR = sweep_lp(keysR, 900, 9000, 0, 2.5)
# reverb (seeded noise IR, 1.3 s)
ir_t = np.arange(int(1.3 * SR)) / SR; ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 4.2); ir = lp(ir, 6000); ir /= np.sqrt((ir ** 2).sum())
def verb(x): return fftconvolve(x, ir)[:N]
kL = keys * duck; kR = keysR * duck
L = 1.25 * kL + 0.18 * verb(kL) + 0.45 * bas * duck + 0.55 * drums + 0.6 * acc + 0.22 * verb(acc)
R = 1.25 * kR + 0.18 * verb(kR) + 0.45 * bas * duck + 0.55 * drums + 0.6 * acc + 0.22 * verb(acc) * 0.9
# section levels (dB) for dynamics: filtered intro, groove A, fuller groove B, breakdown under the checklist, full CTA
sec = [(0, 2.5, -6), (2.5, 12.5, -2.5), (12.5, 22.5, 0), (22.5, 26.4, -4.5), (26.5, 30.0, 0)]
sg = np.ones(N)
for a0, a1, db in sec: sg[int(a0 * SR):int(a1 * SR)] = 10 ** (db / 20)
k = int(0.03 * SR); sg = np.convolve(sg, np.ones(k) / k, 'same'); L *= sg; R *= sg
# dead stop 26.40–26.50 (short ramps), final fade 29.3–30.0
g = np.ones(N); a, b, rr = int(26.40 * SR), int(26.50 * SR), int(0.01 * SR)
g[a:b] = 0.05; g[a:a + rr] = np.linspace(1, 0.05, rr); g[b - rr:b] = np.linspace(0.05, 1, rr)
f0 = int(29.3 * SR); g[f0:] *= np.linspace(1, 0, N - f0) ** 1.5; g[:int(0.005 * SR)] *= np.linspace(0, 1, int(0.005 * SR))
L *= g; R *= g
# presence/air shelf for phone speakers: add a high-passed copy (≈ +6 dB above ~2.5 kHz)
L = L + 1.0 * hp(hp(L, 2500), 2500); R = R + 1.0 * hp(hp(R, 2500), 2500)
mix = np.stack([L, R], 1); mix /= np.abs(mix).max() * 1.12
out = sys.argv[1] if len(sys.argv) > 1 else 'assets/audio/music.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', out], input=mix.astype(np.float64).tobytes(), check=True)
print('wrote', out)
