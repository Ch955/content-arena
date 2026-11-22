#!/bin/bash
# sheet.sh out.png t1 t2 ... : stills side by side (each 432 px wide)
out=$1; shift; in=(); f=""; i=0
for t in "$@"; do in+=(-i "stills/still-$t.png"); f="$f[$i]"; i=$((i+1)); done
ffmpeg -loglevel error -y "${in[@]}" -filter_complex "${f}hstack=$i,scale=$((432*i)):-1" "$out"
