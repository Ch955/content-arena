import sys, wave, numpy as np
p=sys.argv[1]
with wave.open(p) as w: x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16); sr=w.getframerate()
hop=sr//100; fr=len(x)//hop; rms=np.sqrt(np.mean(x[:fr*hop].reshape(fr,hop).astype(float)**2,axis=1)); loud=rms>0.03*rms.max()
v=np.flatnonzero(loud); print(p, "speech", v[0]/100, "-", (v[-1]+1)/100, "dur", len(x)/sr)
k=v[0]
while k<v[-1]:
    if not loud[k]:
        j=k
        while not loud[j]: j+=1
        if j-k>=8: print(f"  pause {k/100:.2f}-{j/100:.2f} ({(j-k)/100:.2f})")
        k=j
    else: k+=1
