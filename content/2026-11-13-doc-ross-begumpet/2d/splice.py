import wave,numpy as np,sys
def rd(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16), w.getframerate()
def runs(a,sr):
    hop=sr//100; fr=len(a)//hop; rms=np.sqrt((a[:fr*hop].reshape(fr,hop).astype(float)**2).mean(1)); loud=rms>0.03*rms.max()
    out=[];k=0
    while k<fr:
        if not loud[k]:
            j=k
            while j<fr and not loud[j]: j+=1
            if j-k>22 and k>0: out.append((k/100,j/100))
            k=j
        else: k+=1
    return out
a,sr=rd(sys.argv[1]); b,_=rd(sys.argv[2])
ra,rb=runs(a,sr),runs(b,sr); print(ra,rb)
ca=int((ra[0][0]+0.12)*sr); cb=int((rb[0][1]-0.12)*sr)
out=np.concatenate([a[:ca],np.zeros(int(0.15*sr),np.int16),b[cb:]])
w=wave.open(sys.argv[3],"wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(out.tobytes())
print(len(out)/sr)
