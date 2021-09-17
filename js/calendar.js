"use strict";
let PAST = JSON.parse(localStorage.getItem('past'));
let STORE = JSON.parse(localStorage.getItem('store'));
document.getElementById("info").selectedIndex = parseInt(localStorage.getItem('info'));
document.getElementById("format").selectedIndex = parseInt(localStorage.getItem('format'));
if (localStorage.getItem('list'))
    document.getElementById('list').innerHTML = localStorage.getItem('list');
if (!localStorage.getItem('shows'))
    localStorage.setItem('shows', JSON.stringify({}));
let LEFT = document.getElementById("left");
let RIGHT = document.getElementById("right");
LEFT.style.visibility = "visible";
RIGHT.style.visibility = "visible";
window.onload = () => {
    let script = document.createElement('script');
    script.src = 'js/search.min.js';
    let VERSION = "21.2.5";
    if (localStorage.getItem('ver') != VERSION) {
        localStorage.setItem('ver', VERSION);
        set("./shows/shows.json", "store");
        set("./shows/past_shows.json", "past")
            .then(() => {
            let shows = JSON.parse(localStorage.getItem('shows'));
            for (let show in shows)
                if (!(show in STORE) || !(show in PAST))
                    delete shows[show];
            localStorage.setItem('shows', JSON.stringify(shows));
        }).finally(() => {
            TheBigBang();
            document.body.append(script);
        });
    }
    else {
        TheBigBang();
        document.body.append(script);
    }
};
document.addEventListener('keydown', e => {
    if (hotkey(e)) {
        switch (e.key) {
            case "c":
                clear();
                break;
            case "f":
                document.getElementById('format').focus();
                break;
            case "i":
                document.getElementById('info').focus();
                break;
            case "l":
                list();
                break;
            case "m":
                let cal = document.getElementById('calendar');
                cal ? cal.focus() : document.getElementById('season').focus();
                break;
            case "n":
                right();
                break;
            case "p":
                left();
                break;
            case "s":
                document.getElementById('search').focus();
                e.preventDefault();
                break;
            case "Escape":
            case "Enter":
                e.target.blur();
        }
    }
});
function hotkey(e) {
    return e.target.id == "search" || e.ctrlKey || e.altKey ? false : true;
}
function format() {
    localStorage.setItem('format', document.getElementById('format').value);
    LEFT.style.visibility == 'visible' ? TheBigBang() : TheBigBang(-7);
}
function clear() {
    let show = document.getElementById('show');
    if (show) {
        show.remove();
        document.getElementById('clear').style.visibility = 'hidden';
        document.getElementById('calendar').style.height = '50rem';
    }
}
function list() {
    let list = document.getElementById('list');
    list.innerHTML = list.innerHTML == 'Full List' ? 'Your List' : 'Full List';
    localStorage.setItem('list', list.innerHTML);
    if (document.getElementById('calendar'))
        LEFT.style.visibility == 'visible' ? TheBigBang() : TheBigBang(-7);
}
function left() {
    if (LEFT.style.visibility == "visible") {
        if (RIGHT.style.visibility == "visible") {
            LEFT.style.visibility = "hidden";
            TheBigBang(-7);
        }
        else {
            RIGHT.style.visibility = "visible";
            LEFT.style.visibility = "visible";
            TheBigBang();
        }
    }
}
function right() {
    if (RIGHT.style.visibility == "visible") {
        if (LEFT.style.visibility == "visible") {
            RIGHT.style.visibility = "hidden";
            document.getElementById('clear').style.visibility = 'hidden';
            document.getElementById('calendar').remove();
            document.getElementById('month').textContent = "Fall 2021";
            season();
        }
        else {
            RIGHT.style.visibility = "visible";
            LEFT.style.visibility = "visible";
            TheBigBang();
        }
    }
}
function info() {
    localStorage.setItem('info', document.getElementById('info').value);
    if (document.getElementById('title'))
        streamInfo(document.getElementById('title').innerHTML);
}
async function set(file, key) {
    let data = await (await fetch(file)).json();
    key == 'store' ? STORE = data : PAST = data;
    localStorage.setItem(key, JSON.stringify(data));
}
function TheBigBang(offset = 0) {
    let cal = document.getElementById('calendar');
    cal ? cal.remove() : document.getElementById('season').remove();
    updateTime();
    let format = localStorage.getItem('format');
    fetch(offset == 0 ? "./shows/time.json" : "./shows/past_time.json")
        .then(resp => {
        return resp.json();
    })
        .then(data => {
        switch (format) {
            case "1":
                data = data['cutoff'];
                break;
            case "2":
                data = data['compact'];
                break;
            default:
                data = data['full'];
        }
        let times;
        if (localStorage.getItem('list') == "Your List"
            || Object.keys(JSON.parse(localStorage.getItem('shows'))).length == 0)
            times = data;
        else {
            switch (format) {
                case "1":
                    times = cutoff(data, offset);
                    break;
                case "2":
                    times = compact(data, offset);
                    break;
                default:
                    times = full(data, offset);
            }
        }
        calendar(getDates(offset), times);
        resizeCalendar();
        createShows(offset);
    });
}
function calendar(dates, times) {
    document.getElementById('month').innerHTML = (dates[0].getMonth() == dates[6].getMonth()) ?
        dates[0].toLocaleDateString("en-US", { month: 'long' }) :
        dates[0].toLocaleDateString("en-US", { month: 'long' }) + " to " +
            dates[6].toLocaleDateString("en-US", { month: 'long' });
    let td = document.createElement('td');
    td.className = 'date';
    let tr = document.createElement('tr');
    tr.append(td);
    dates.forEach(async function (date) {
        td = document.createElement('td');
        td.className = 'date';
        td.innerHTML = date.getDate() + ' ' + date.toLocaleDateString("en-US", { weekday: 'long' });
        tr.append(td);
    });
    let thead = document.createElement('thead');
    thead.append(tr);
    let tbody = document.createElement('tbody');
    times.forEach(async function (time) {
        td = document.createElement('td');
        td.className = 'time';
        td.innerHTML = time;
        tr = document.createElement('tr');
        tr.append(td);
        for (let day = 1; day < 8; day++) {
            td = document.createElement('td');
            td.id = ider_slot(day, time);
            td.className = 'slot';
            tr.append(td);
        }
        tbody.append(tr);
    });
    let table = document.createElement('table');
    table.append(thead);
    table.append(tbody);
    let calendar = document.createElement('div');
    calendar.id = 'calendar';
    calendar.tabIndex = 1;
    calendar.append(table);
    document.body.append(calendar);
}
function getDates(offset = 0) {
    let dates = [];
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    switch (date.getDay()) {
        case 0:
            day += offset - 6;
            break;
        case 1:
            day += offset;
            break;
        case 2:
            day += offset - 1;
            break;
        case 3:
            day += offset - 2;
            break;
        case 4:
            day += offset - 3;
            break;
        case 5:
            day += offset - 4;
            break;
        case 6:
            day += offset - 5;
    }
    for (let i = 0; i < 7; i++)
        dates.push(new Date(year, month, day + i));
    return dates;
}
function ider_slot(day, time) {
    return time.substring(1, 2) == ":" ?
        day * 10000 + parseInt(time.substring(0, 1)) * 100 + parseInt(time.substring(2, 4)) +
            time.substring(5, 6) :
        day * 10000 + parseInt(time.substring(0, 2)) * 100 + parseInt(time.substring(3, 5)) +
            time.substring(6, 7);
}
function ider_show(title) {
    let words = title.split(" ");
    return title.length + words.length.toString() + words[words.length - 1].replace(/\W/g, '');
}
function createShows(offset) {
    const data = offset == 0 ? STORE : PAST;
    const shows = JSON.parse(localStorage.getItem("shows"));
    for (let show in (document.getElementById('list').innerHTML == "Your List") ? data : shows) {
        if (show in data) {
            let button = document.createElement('button');
            button.id = ider_show(show);
            button.className = 'show';
            button.innerHTML = show;
            if (show in shows) {
                button.style.borderColor = "#4f004f";
                button.style.color = (LEFT.style.visibility == 'visible' ?
                    shows[show][0] : shows[show][1]) ?
                    "#4f4f4f" : "purple";
            }
            button.onclick = function (e) {
                localStorage.getItem('info') == '0' ?
                    (document.getElementById('title') ? e.preventDefault() : null) : e.preventDefault();
                streamInfo(this.innerHTML);
            };
            let a = document.createElement('a');
            let id = ider_slot(data[show].day, data[show].time);
            a.href = '#' + id;
            a.append(button);
            document.getElementById(id).append(a);
        }
    }
}
function full(times, offset) {
    const shows = JSON.parse(localStorage.getItem('shows'));
    const data = offset == 0 ? STORE : PAST;
    let output = [];
    for (let time in times) {
        if (!(times[time].includes("00") || times[time].includes("30"))) {
            for (let show in shows) {
                if (show in data) {
                    if (data[show].time.includes("00") || data[show].time.includes("30"))
                        delete shows[show];
                    else if (times[time] == data[show].time) {
                        output.push(times[time]);
                        delete shows[show];
                        break;
                    }
                }
                else
                    delete shows[show];
            }
        }
        else
            output.push(times[time]);
    }
    return output;
}
function minMax(t1, t2) {
    return new Date("2000/1/1 " + t1) < new Date("2000/1/1 " + t2) ? [t1, t2] : [t2, t1];
}
function cutoff(times, offset) {
    const shows = JSON.parse(localStorage.getItem('shows'));
    const data = offset == 0 ? STORE : PAST;
    let max = "12:00 AM";
    let min = "11:59 PM";
    switch (shows.length) {
        case 0:
            return times;
        case 1:
            return [data[Object.keys(shows)[0]].time];
        default:
            for (let show in shows)
                if (show in data) {
                    max = minMax(max, data[show].time)[1];
                    min = minMax(min, data[show].time)[0];
                    if (data[show].time.includes("00") || data[show].time.includes("30"))
                        delete shows[show];
                }
                else
                    delete shows[show];
    }
    let output = [];
    let bool = false;
    for (let time in times)
        if (min == times[time]) {
            output.push(times[time]);
            bool = true;
        }
        else if (max == times[time]) {
            output.push(times[time]);
            break;
        }
        else if (bool) {
            if (times[time].includes("00") || times[time].includes("30"))
                output.push(times[time]);
            else {
                for (let show in shows)
                    if (times[time] == data[show].time) {
                        output.push(times[time]);
                        delete shows[show];
                        break;
                    }
            }
        }
    return output;
}
function compact(times, offset) {
    const data = offset == 0 ? STORE : PAST;
    const shows = JSON.parse(localStorage.getItem('shows'));
    let output = [];
    for (let time in times) {
        for (let show in shows)
            if (show in data && data[show].time == times[time]) {
                output.push(times[time]);
                delete shows[show];
                break;
            }
            else if (!(show in data))
                delete shows[show];
        if (shows.length == 0)
            break;
    }
    return output;
}
function resizeCalendar() {
    document.getElementById('calendar').style.height = document.getElementById('show') &&
        document.getElementById('info').value == "0" ?
        "25rem" : "50rem";
}
function streamInfo(show) {
    const data = show in STORE ? STORE : PAST;
    let s = document.getElementById('show');
    if (s)
        s.remove();
    let td = document.createElement('td');
    td.id = 'title';
    td.innerHTML = show;
    let tr = document.createElement('tr');
    tr.append(td);
    let tbody = document.createElement('tbody');
    tbody.append(tr);
    let table = document.createElement('table');
    if (Object.keys(data[show].streams).length == 0) {
        td = document.createElement('td');
        td.innerHTML = 'No legal stream available';
        tr = document.createElement('tr');
        tr.append(td);
        tbody.append(tr);
        let img = document.createElement('img');
        img.className = 'icon';
        img.src = 'assets/skull.svg';
        let a = document.createElement('a');
        a.id = "0";
        a.className = 'stream';
        a.onclick = () => Stream();
        a.href = "#";
        a.append(img);
        a.innerHTML += " High Seas";
        td = document.createElement('td');
        td.innerHTML = '1 ';
        td.append(a);
        tr = document.createElement('tr');
        tr.append(td);
        tbody.append(tr);
    }
    else {
        for (const [index, [stream, link]] of Object.entries(Object.entries(data[show].streams))) {
            let img = document.createElement('img');
            img.className = 'icon';
            switch (stream) {
                case "Crunchyroll":
                    img.src = "assets/crunchyroll.svg";
                    break;
                case "Funimation":
                    img.src = "assets/funimation.svg";
                    break;
                case "VRV":
                    img.src = "assets/vrv.svg";
                    break;
                case "AnimeLab":
                    img.src = "assets/animelab.svg";
                    break;
                case "Hulu":
                    img.src = "assets/hulu.svg";
                    break;
                case "HiDive":
                    img.src = "assets/hidive.svg";
                    break;
                case "Wakanim":
                    img.src = "assets/wakanim.svg";
                    break;
                case "YouTube":
                    img.src = "assets/youtube.svg";
                    break;
                case "Netflix":
                    img.src = "assets/netflix.svg";
                    break;
            }
            let a = document.createElement('a');
            a.id = index;
            a.href = link;
            a.target = '_blank';
            a.className = 'stream';
            a.onclick = () => Stream();
            a.append(img);
            a.innerHTML += ' ' + stream;
            td = document.createElement('td');
            td.innerHTML = parseInt(index) + 1 + " ";
            td.append(a);
            tr = document.createElement('tr');
            tr.append(td);
            tbody.append(tr);
        }
    }
    table.append(tbody);
    let shows = JSON.parse(localStorage.getItem('shows'));
    let set = document.createElement('button');
    set.className = 'setter';
    set.onclick = () => setter();
    show in shows ?
        (set.id = "sub", set.innerHTML = 'Remove from Your List') :
        (set.id = "add", set.innerHTML = 'Add to Your List');
    let reset = document.createElement('button');
    reset.onclick = () => Reset();
    reset.id = 'reset';
    reset.innerHTML = 'Reset';
    reset.style.visibility = show in shows &&
        (LEFT.style.visibility == 'visible' ? shows[show][0] : shows[show][1]) ?
        'visible' : 'hidden';
    let output;
    let streams;
    let cover;
    let img;
    let info = localStorage.getItem('info');
    if (info == "1") {
        output = document.createElement('aside');
        output.append(table);
        output.append(set);
        output.append(reset);
    }
    else {
        img = document.createElement('img');
        img.src = data[show].cover;
        cover = document.createElement('div');
        cover.className = 'cover';
        cover.append(img);
        streams = document.createElement('div');
        streams.id = 'streams';
        streams.append(table);
        output = document.createElement('div');
        if (info == "2")
            output.className = 'window';
        output.align = 'center';
        output.append(set);
        output.append(reset);
        output.append(cover);
        output.append(streams);
    }
    output.id = 'show';
    document.getElementById('content').append(output);
    resizeCalendar();
    document.getElementById('clear').style.visibility = 'visible';
}
Date.prototype.getWeek = function () {
    const date = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    date.setDate(date.getDate() - date.getDay());
    return Math.ceil((((date.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) / 86400000)) / 7);
};
function updateTime() {
    const time = JSON.parse(localStorage.getItem("time"));
    let now = new Date();
    now = [now.getWeek(), now.getFullYear()];
    if (time != null) {
        let shows = JSON.parse(localStorage.getItem("shows"));
        if ((now[0] - time[0] == 1 && now[1] == time[1]) || (now[1] - time[1] == 1 && now[0] == 52))
            for (let show in shows)
                [shows[show][0], shows[show][1]] = [false, shows[show][0]];
        else if (now[0] != time[0] || now[1] != time[1])
            for (let show in shows)
                [shows[show][0], shows[show][1]] = [false, false];
        localStorage.setItem('shows', JSON.stringify(shows));
    }
    localStorage.setItem('time', JSON.stringify(now));
}
