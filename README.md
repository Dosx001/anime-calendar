# anime-calendar
Anime Calendar is a website that allows users to create their own custom calendar for seasonal anime. Anime Calendar has all 64 Winter 2021 anime available. Anime Calendar provides quick access to direct links, for each anime, to all streaming services like YouTube, Hulu, Amazon Prime, Crunchyroll, etc. Anime Calendar is also a customizable website pick between Full Calendar, Cutoff Calendar, or Compact Calendar settings. Other customizations coming soon like Daily Calendar.

# Table of Contents
* [Features](#features)
* [To-Do List](#to-do-list)
    * [Done](#done)
    * [High Priority](#high-priority)
    * [Medium Priority](#medium-priority)
    * [Low Priority](#low-priority)
* [Bugs](#bugs)
    * [Fixed](#fixed)
    * [Investigating](#invest)

# Features
More coming soon!
<p align="center">
    <a href="https://dosx001.github.io/anime-calendar/">dosx001.github.io/anime-calendar</a>
</p>

![pity counter](https://i.imgur.com/Q6auM0V.png)

# To-Do List

### Done

* :white_check_mark: create generic calendar
* :white_check_mark: generate current dates for the calendar
* :white_check_mark: automate creating a JSON file containing all shows, stream, dates, and times
* :white_check_mark: create a navigation bar for all pages
* :white_check_mark: add cover art for all shows to JSON file
* :white_check_mark: create buttons for shows
* :white_check_mark: make buttons for all streams
* :white_check_mark: make .dates stationary
* :white_check_mark: user can create their custom list of anime
* :white_check_mark: resize calender when user pressing a show
* :white_check_mark: calendar jumps to the show press when calendar resize
* :white_check_mark: adjust .times for Your List
* :white_check_mark: ~~give users feedback when adding or removing shows~~
    * Merge add and remove
    * Button updates base on users\' Your List
* :white_check_mark: calendar updates when user removes or adds a show
* :white_check_mark: search bar for shows
* :white_check_mark: center calendar scrollbar

### High Priority

* :black_square_button: create a daily setting for calendar
* :black_square_button: record and display users\' watch history
* :black_square_button: fixed center content

### Medium Priority

* :black_square_button: create a aside for \#show
* :black_square_button: allow users to switch .show buttons between titles and cover art
* :black_square_button: allow users to switch between Japanese and English titles
* :black_square_button: standardize .slot size

### Low Priority

* :black_square_button: connect to Google Calendar API to push notifications to user
* :black_square_button: connect to Google Drive API to save user custom list on the cloud

# Bugs

### Fixed

* :white_check_mark: fix escpaing html
    * Use HTMLParser() to convert
* :white_check_mark: pressing .show buttons sometimes does nothing
    * surrond button tag with anchor tag instead of the other way around
    * from ```<button><a/><button>``` to ```<a><button/></a>```
* :white_check_mark: fix flickering
    * loading .js file is taxing
    * appending ```'<script src="filename.js"></script>'``` is faster
* :white_check_mark: list.js breaks in Firefox but works in Chromium browsers
    * ```new date("%Y %I:%M %p")``` is an Invalid Date in Firefox
    * change to ```new date("%Y/%m/%d %I:%M %p")```
* :white_check_mark: Shows() randomly doesn\'t run
    * Put shows() in a fetch promise
* :white_check_mark: If user changes their setting to Your List and Compact, when \#show is displaying then calendar will resize when it shouldn\'t
    * Resize calendar inside Compact()\'s fetch promise
* :white_check_mark: Some shows don\'t have their correct streams & some shows\' steam urls have some mistakes
    * Tweaked json_generator.py

### Investigating

* No bugs!!! For now...
