#!/bin/bash
vim -p index.html index.html index.html index.html css/base.scss index.html \
    "+vs ts/list.ts | tabn" \
    "+vs ts/search.ts | tabn" \
    "+vs ts/streams.ts | tabn" \
    "+vs ts/season.ts | tabn" \
    "+vs css/styles.scss | tabn" \
    "+vs ts/calendar.ts" \
    "+tabmove 0"
