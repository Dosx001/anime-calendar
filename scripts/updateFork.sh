#!/bin/bash
if [ $# == 0 ]
then
    git push
    cd /mnt/d/Repositories/github/AnimeCalendar.github.io
    git fetch upstream
    git rebase upstream/main
    if [[ -n `git branch --show-current` ]]
    then
        git push -f
        cd /mnt/d/Repositories/html/anime-calendar
    fi
else
    git rebase --continue
    git push -f
    cd /mnt/d/Repositories/html/anime-calendar
fi
