#!/bin/bash
clear
if [[ $# -eq 0 ]]
then
    for dir in 'css' 'about/css' 'help/css'
    do
        sass $dir/styles.scss > $dir/styles.css
        yui-compressor $dir/styles.css > $dir/styles.min.css
        echo 'Done' $dir
    done
else
    for i in $@
    do
        case $i in
            'm')
                dir='css';;
            'h')
                dir='help/css';;
            'a')
                dir='about/css';;
        esac
        if [[ -n $dir ]]
        then
            sass $dir/styles.scss > $dir/styles.css
            yui-compressor $dir/styles.css > $dir/styles.min.css
            echo 'Done' $dir
            dir=""
        fi
    done
fi
