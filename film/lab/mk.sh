#!/usr/bin/env bash
# Make a lab page for a time window of the film: lab/mk.sh name start end
set -e; n=$1; a=$2; b=$3; d=$(python3 -c "print(round($b-$a,3))")
sed -e "s#data-duration=\"30\"#data-duration=\"$d\" data-lab=\"$a,$b\"#" index.html > lab-$n.html
echo lab-$n.html
