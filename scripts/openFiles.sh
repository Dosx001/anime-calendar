#!/bin/bash
vi=$(command -v nvim &> /dev/null && echo nvim || echo vim)
$vi -p index.html index.html index.html index.html css/base.scss index.html \
    "+vs ts/calendar.ts | tabn" \
    "+vs ts/search.ts | tabn" \
    "+vs ts/streams.ts | tabn" \
    "+vs ts/season.ts | tabn" \
    "+vs css/styles.scss | tabn" \
    "+vs ts/main.ts" \
    "+tabmove 0"
