#!/usr/bin/env python3
"""Iteratively level each effect against the music-only stem, measured point-for-point (film vs music at the same instant):
body lift in the effect's own band (150 ms windows) -> target +3 dB (cap +4), and 2-8 kHz and >8 kHz lift (10 ms windows) <= +4 dB.
Adjusts the manual trim (plan.json field 7) and re-runs offline-mix.py. Usage: python3 tools/level-sfx.py renders/picture.mp4 tag [iterations]"""
import subprocess, sys, json, numpy as np
from scipy.signal import butter, sosfilt
SR = 48000; pic, tag = sys.argv[1], sys.argv[2]; IT = int(sys.argv[3]) if len(sys.argv) > 3 else 4
BAND = {'tap': (500, 2000), 'chime': (1500, 3500), 'pop': (530, 1080), 'whoosh': (330, 660)}
HB = butter(4, [2000, 8000], 'band', fs=SR, output='sos'); HH = butter(4, 8000, 'high', fs=SR, output='sos')
ld = lambda f: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).astype(np.float64)
mix = lambda extra=[]: subprocess.run(['python3', 'tools/offline-mix.py', pic, f'renders/film-{tag}.mp4', '--score', 'score-raw.wav', '--music-lufs', '-17', '--dur', '27', '--no-comp', '--hf-cap', '99'] + extra, capture_output=True, text=True, check=True)
mix(['--no-sfx']); subprocess.run(['cp', f'renders/_mix-film-{tag}.wav', f'renders/_music-{tag}.wav']); M = ld(f'renders/_music-{tag}.wav')
def measure():
    F = ld(f'renders/_mix-film-{tag}.wav'); n = min(len(F), len(M)); out = []
    for e in json.load(open('assets/sfx/plan.json')):
        i = int(e[1] * SR); a, b = i - int(.03 * SR), i + int(.5 * SR); r = []
        for sos, w in ((butter(4, BAND[e[0]], 'band', fs=SR, output='sos'), .15), (HB, .01), (HH, .01)):
            f = sosfilt(sos, F[a - SR // 4:b + SR // 4])[SR // 4:SR // 4 + b - a]; m = sosfilt(sos, M[a - SR // 4:b + SR // 4])[SR // 4:SR // 4 + b - a]; h = int(w * SR)
            r.append(max(10 * np.log10(((f[j:j + h] ** 2).mean() + 1e-13) / ((m[j:j + h] ** 2).mean() + 1e-13)) for j in range(0, len(f) - h, max(1, h // 2))))
        out.append(r)
    return out
for it in range(IT):
    mix(); res = measure(); pl = json.load(open('assets/sfx/plan.json'))
    for e, (body, hf, hh) in zip(pl, res):
        while len(e) < 7: e.append([-50, 6, 0.0][len(e) - 4])
        adj = 3.0 - body; adj = min(adj, 4.0 - hf, 4.0 - hh); adj = max(-12, min(8, adj)) * 0.8
        e[6] = round(e[6] + adj, 1)
    json.dump(pl, open('assets/sfx/plan.json', 'w'), indent=0)
mix(); res = measure()
rep = ['time  sound   body(own band,150ms)  2-8kHz(10ms)  >8kHz(10ms)   dB over music at the same instant']
for e, (body, hf, hh) in zip(json.load(open('assets/sfx/plan.json')), res): rep.append(f'{e[1]:6.2f} {e[0]:7s} {body:+5.1f} {hf:+5.1f} {hh:+5.1f}  trim {e[6]:+.1f}')
open(f'review/{tag}-sfx-levels.txt', 'w').write('\n'.join(rep) + '\n'); print('\n'.join(rep))
