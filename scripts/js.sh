#!/bin/bash
clear
tsc
if [[ $# -eq 0 ]]
then
    for file in 'main' 'calendar' 'search' 'streams' 'season' 'nav'
    do
        terser -c -m -- js/$file.js > js/$file.min.js
        echo 'Done:' $file
    done
else
    for i in $(echo $@ | fold -w1)
    do
        case $i in
            'm')
                file='main';;
            'c')
                file='calendar';;
            's')
                file='search';;
            't')
                file='streams';;
            'e')
                file='season';;
            'n')
                file='nav';;
        esac
        if [[ -n $file ]]
        then
            terser -c -m -- js/$file.js > js/$file.min.js
            echo 'Done:' $file
            file=""
        fi
    done
fi
