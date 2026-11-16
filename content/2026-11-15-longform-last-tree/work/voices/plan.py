"""Plan Gemini batches: per scene, <=8 lines, <=2 speakers, <=CHARS chars; lines may skip (order kept)."""
import json
SPK = {"narrator": "Narrator", "meera": "Meera", "chintu": "Chintu", "thatayya": "Thatayya", "veerendra": "Veerendra",
       "tree": "Vriksha", "devata": "Vriksha", "villagers": "Villagers"}
def load():
    d = json.load(open("/home/user/content-arena/content/2026-11-15-longform-last-tree/script.json"))
    lines = []
    for s in d["scenes"]:
        for k, l in enumerate(s["lines"]):
            lines.append(dict(l, scene=s["n"], k=k, id=len(lines)))
    return d, lines
def plan(lines, chars=1150, maxn=8):
    out = []
    for sc in sorted({l["scene"] for l in lines}):
        rem = [l for l in lines if l["scene"] == sc]
        while rem:
            cur, spk, n = [], set(), 0
            for l in rem:
                s = SPK[l["who"]]
                if len(cur) >= maxn: break
                if s not in spk and len(spk) == 2: continue
                if cur and n + len(l["text"]) > chars: continue
                cur.append(l); spk.add(s); n += len(l["text"])
            out.append([l["id"] for l in cur]); rem = [l for l in rem if l not in cur]
    return out
if __name__ == "__main__":
    d, lines = load()
    p = plan(lines)
    for b in p:
        print(lines[b[0]]["scene"], b, sorted({SPK[lines[i]["who"]] for i in b}), sum(len(lines[i]["text"]) for i in b))
    print(len(p), "requests")

def plan2(lines, chars=1250):
    """Narrator chunks per scene first, then the leftover character lines pooled across scenes."""
    out, left = [], []
    for sc in sorted({l["scene"] for l in lines}):
        rem = [l for l in lines if l["scene"] == sc]
        cur, spk, n = [], {"Narrator"}, 0
        for l in rem:
            s = SPK[l["who"]]
            if len(cur) >= 8: break
            if s not in spk and len(spk) == 2: continue
            if cur and n + len(l["text"]) > chars: continue
            cur.append(l); spk.add(s); n += len(l["text"])
        out.append([l["id"] for l in cur]); left += [l for l in rem if l not in cur]
    while left:
        cur, spk, n = [], set(), 0
        for l in left:
            s = SPK[l["who"]]
            if len(cur) >= 8: break
            if s not in spk and len(spk) == 2: continue
            if cur and n + len(l["text"]) > 1000: continue
            cur.append(l); spk.add(s); n += len(l["text"])
        out.append([l["id"] for l in cur]); left = [l for l in left if l not in cur]
    return out
