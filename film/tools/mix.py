#!/usr/bin/env python3
"""Offline mix for the Reel, adapted from kit/scripts/offline-mix.py (30 s film, no drop dip / ring lift).
Usage: python3 tools/mix.py renders/picture.mp4 renders/out.mp4 [--no-sfx] [--music-lufs -15.5]
Reads assets/audio/plan.json: [[name, t, target_dB_in_band, note, (peak_cap_dB)], ...]
Each effect's gain is solved so its 50 ms in-band peak sits target dB over the music in the same band and window,
the 2-8 kHz lift is capped (HF_CAP), and its sample peak may not exceed the local music peak + cap (effects never louder
than the music). Writes review/mix-<out>.txt with per-event numbers."""
import json, subprocess, sys, re
import numpy as np
from scipy.signal import butter, sosfilt
from pathlib import Path
P = Path(__file__).resolve().parents[1]; SR = 48000; DUR = 30.0; N = int(DUR * SR)
args = sys.argv[1:]; pic, out = args[0], args[1]
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
target_lufs = float(opt('--music-lufs', '-14.3')); HF_CAP = float(opt('--hf-cap', '4')); PKCAP = float(opt('--pkcap', '0'))
no_sfx = '--no-sfx' in args
def load(p): return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).reshape(-1, 2).copy()
def write(p, x): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', str(p)], input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)
def lufs(x):
    tmp = P / 'renders/_lufs.wav'; write(tmp, x)
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(tmp), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), float((re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e) or ['nan'])[-1]), float((re.findall(r'LRA:\s+([\d.]+) LU', e) or ['nan'])[-1])
def pk(y): h = int(.05 * SR); return max(10 * np.log10((y[i:i + h] ** 2).mean() + 1e-12) for i in range(0, max(1, len(y) - h), h // 2))
(P / 'renders').mkdir(exist_ok=True)
# music chain: gentle presence lift, glue compression
raw = P / 'renders/_music_chain.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(P / 'assets/audio/music.wav'), '-af',
                'highshelf=f=3000:g=2,acompressor=threshold=-18dB:ratio=1.4:attack=10:release=200:knee=6', '-ar', str(SR), '-ac', '2', str(raw)], check=True)
mus = load(raw)[:N]; mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
mg = 10 ** ((target_lufs - lufs(mus)[0]) / 20); mus *= mg; mono_m = mus.mean(1)
fx = np.zeros_like(mus); rep = []
plan = [] if no_sfx else json.loads((P / 'assets/audio/plan.json').read_text())
HB = butter(4, [2000, 8000], btype='band', fs=SR, output='sos')
BAND_CAP = 6.0
FIXED = {'whoosh-short': -11.0, 'pop': -9.0, 'click-soft': -13.0, 'ping': -12.0}
for ev in plan:
    name, t, target, note = ev[:4]; pkc = ev[4] if len(ev) > 4 else PKCAP
    s = load(P / 'assets/audio' / f'{name}.mp3'); m1 = s.mean(1)
    F = np.abs(np.fft.rfft(m1 * np.hanning(len(m1)))) ** 2; f = np.fft.rfftfreq(len(m1), 1 / SR); c = np.cumsum(F) / F.sum()
    lo = max(f[np.searchsorted(c, .2)], 60); hi = min(max(f[np.searchsorted(c, .8)], lo * 2), SR / 2 - 500); sos = butter(4, [lo, hi], btype='band', fs=SR, output='sos')
    i = int(t * SR); W = min(len(m1), int(.4 * SR)); seg_m = mono_m[max(0, i - SR // 2):i + W + SR // 2]
    mpk = max(pk(sosfilt(sos, seg_m)[SR // 2:SR // 2 + W]), -55); epk = pk(sosfilt(sos, m1)[:W])
    g = 10 ** ((mpk + target - epk) / 20)
    def hf_lift(g):
        a = seg_m.copy(); k = min(W, len(seg_m) - SR // 2); a[SR // 2:SR // 2 + k] += g * m1[:k]
        return pk(sosfilt(HB, a)[SR // 2:SR // 2 + W]) - max(pk(sosfilt(HB, seg_m)[SR // 2:SR // 2 + W]), -50)
    hl = hf_lift(g)
    while hl > HF_CAP and g > 1e-4: g *= .85; hl = hf_lift(g)
    k0 = min(len(m1), len(seg_m) - SR // 2); mloc = 20 * np.log10(np.abs(seg_m[SR // 2:SR // 2 + W]).max() + 1e-9)
    while 20 * np.log10(g * np.abs(m1[:k0]).max() + 1e-9) > mloc + pkc and g > 1e-4: g *= .9
    # consistency: repeated sounds sit at one fixed sample-peak level per type (kit audio rule 3), always under the local music peak
    mloc_pre = 20 * np.log10(np.abs(seg_m[SR // 2:SR // 2 + W]).max() + 1e-9)
    if name in FIXED: g = 10 ** ((FIXED[name] - 20 * np.log10(np.abs(m1).max() + 1e-9)) / 20) * (10 ** ((target - 3.0) / 20)); hl = hf_lift(g)
    while name in FIXED and hl > HF_CAP + 1 and g > 1e-4: g *= .9; hl = hf_lift(g)
    # never louder than the music: the effect's sample peak stays ≥2 dB under the local music peak
    while 20 * np.log10(g * np.abs(m1).max() + 1e-9) > mloc_pre - 2 and g > 1e-4: g *= .9
    # in-band cap: an effect may lift its own band at most BAND_CAP dB over the music (it reads as part of the mix, not on top of it)
    def band_lift(g):
        e_ = np.zeros_like(seg_m); k_ = min(len(m1), len(seg_m) - SR // 2); e_[SR // 2:SR // 2 + k_] = g * m1[:k_]
        return pk(sosfilt(sos, seg_m + e_)[SR // 2:SR // 2 + W]) - pk(sosfilt(sos, seg_m)[SR // 2:SR // 2 + W])
    while band_lift(g) > BAND_CAP and g > 1e-4: g *= .9
    j = min(N, i + len(s)); fx[i:j] += g * s[:j - i]
    e = np.zeros_like(seg_m); k = min(len(m1), len(seg_m) - SR // 2); e[SR // 2:SR // 2 + k] = g * m1[:k]
    inb = pk(sosfilt(sos, seg_m + e)[SR // 2:SR // 2 + W]) - pk(sosfilt(sos, seg_m)[SR // 2:SR // 2 + W])
    epeak = 20 * np.log10(g * np.abs(m1).max() + 1e-9)
    rep.append(f'{t:6.2f} {name:12s} band {int(lo):5d}-{int(hi):5d} Hz  in-band lift {inb:+5.1f} dB  2-8k lift {hl:+5.1f} dB  fx peak {epeak:6.1f} dBFS vs music peak {mloc:6.1f}  {note}')
mix = mus + fx
# true-peak safety: limiter to -1.5 dBFS sample peak
lim = 10 ** (-1.5 / 20); pkv = np.abs(mix).max()
if pkv > lim:  # soft-knee peak limiter on the sum (only touches the few peaks above the ceiling)
    a = np.abs(mix); over = a > lim * 0.8; k = lim * 0.8
    mix[over] = np.sign(mix[over]) * (k + (lim - k) * np.tanh((a[over] - k) / (lim - k)))
wav = P / f'renders/_mix-{Path(out).stem}.wav'; write(wav, mix)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pic, '-i', str(wav), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], check=True)
Lm, _, _ = lufs(mus); Lx, tp, lra = lufs(mix)
hdr = f'music-only {Lm:.1f} LUFS; mix {Lx:.1f} LUFS, LRA {lra} LU, peak {tp} dBFS; {len(plan)} effects'
(P / 'review').mkdir(exist_ok=True); (P / f'review/mix-{Path(out).stem}.txt').write_text(hdr + '\n' + '\n'.join(rep) + '\n')
print(hdr); print('\n'.join(rep))
