"""Ep 3: re-take L10 (0-based 9, Suresh) -- batch B said 'మేనేజర్ కొడుకు వెడ్డింగ్ కి' instead of the owner's 'పెళ్లికి'.
ONE Gemini request, Suresh's voice only, the line twice (two takes to pick from) -> vo_retake/L0_raw.wav, L1_raw.wav."""
import voices as V
from content_arena import scenevoice
who, text, gap, act, say = V.LINES[9]
act2 = act + "; the first word after కొడుకు is the Telugu word పెళ్లికి (pel-li-ki, 'for the wedding'), never the English word wedding there"
batch = [{"who": who, "text": text, "act": act2, "say": say}, {"who": who, "text": text, "act": act2 + " (a second take, same energy)", "say": say}]
print(scenevoice.voice_batch(batch, "vo_retake", {"Suresh": "Achird"}))
