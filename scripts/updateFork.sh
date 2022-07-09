#!/bin/bash
if [ "$(basename "$PWD")" == "anime-calendar" ]; then
	git push
	cd ../AnimeCalendar.github.io || exit
	git fetch upstream
	git rebase upstream/main
	if [[ -n $(git branch --show-current) ]]; then
		git push -f
		cd ../anime-calendar || exit
	fi
else
	git add .
	git rebase --continue
	git push -f
	cd ../anime-calendar || exit
fi
