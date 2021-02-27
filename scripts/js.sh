#!/bin/bash
case $1 in
    'c')
        files=('calendar');;
    'l')
        files=('list');;
    's')
        files=('search');;
    'h')
        files=('show');;
    *)
        files=('calendar' 'list' 'search' 'show');;
esac

for file in ${files[@]}
do
    terser -c -m -- js/${file}.js > js/${file}.min.js
done
