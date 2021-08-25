#!/bin/bash
clear
tsc
if [[ $# -eq 0 ]]
then
    for file in 'calendar' 'list' 'search' 'streams' 'season' 'nav'
    do
        terser -c -m -- js/$file.js > js/$file.min.js
        echo 'Done:' $file
    done
else
    for i in $(echo $@ | fold -w1)
    do
        case $i in
            'c')
                file='calendar';;
            'l')
                file='list';;
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
