interface Shows {
    [key: string]: {
        day: number,
        time: string,
        cover: string,
        streams: {[key: string]: string}
    }
}
let PAST: Shows = JSON.parse(localStorage.getItem('past')!)
let STORE: Shows = JSON.parse(localStorage.getItem('store')!);

(<HTMLSelectElement>(document.getElementById("info"))).selectedIndex = parseInt(localStorage.getItem('info')!);
(<HTMLSelectElement>(document.getElementById("format"))).selectedIndex = parseInt(localStorage.getItem('format')!)
if (localStorage.getItem('list')) {
    document.getElementById('list')!.innerHTML = localStorage.getItem('list')!
}
if (!localStorage.getItem('shows')) {
    localStorage.setItem('shows', JSON.stringify({}))
}
let LEFT = document.getElementById("left")!, RIGHT = document.getElementById("right")!
LEFT.style.visibility = "visible", RIGHT.style.visibility = "visible"

window.onload = () => {
    let script = document.createElement('script')
    script.src = 'js/search.min.js'
    let VERSION = "21.2.4"
    if (localStorage.getItem('ver') != VERSION) {
        localStorage.setItem('ver', VERSION)
        set("./shows/shows.json", "store")
        set("./shows/past_shows.json", "past")
            .then(() => {
                let shows = JSON.parse(localStorage.getItem('shows')!)
                for (let show in shows) {
                    if (!(show in STORE) || !(show in PAST)) {
                        delete shows[show]
                    }
                }
                localStorage.setItem('shows', JSON.stringify(shows))
            }).finally(() => {
                TheBigBang()
                document.body.append(script)
            })
    }
    else {
        TheBigBang();
        document.body.append(script)
    }
}

document.addEventListener('keydown', e => {
    if ((<HTMLElement>e.target!).id != "search") {
        switch(e.key) {
            case "c":
                clear()
                break
            case "f":
                document.getElementById('format')!.focus()
                break
            case "i":
                document.getElementById('info')!.focus()
                break
            case "l":
                list()
                break
            case "m":
                let cal = document.getElementById('calendar')
                cal ? cal.focus() : document.getElementById('season')!.focus()
                break
            case "n":
                right()
                break
            case "p":
                left()
                break
            case "s":
                document.getElementById('search')!.focus()
                e.preventDefault()
                break
            case "Escape":
            case "Enter":
                (<HTMLElement>e.target!).blur()
        }
    }
})

function format() {
    localStorage.setItem('format', (<HTMLSelectElement>document.getElementById('format')!).value)
    LEFT.style.visibility == 'visible' ? TheBigBang():TheBigBang(-7)
}

function clear() {
    let show = document.getElementById('show')
    if (show) {
        show.remove()
        document.getElementById('clear')!.style.visibility = 'hidden'
        document.getElementById('calendar')!.style.height = '50rem'
    }
}

function list() {
    let list: HTMLElement = document.getElementById('list')!
    list.innerHTML = list.innerHTML == 'Full List' ? 'Your List' : 'Full List'
    localStorage.setItem('list', list.innerHTML)
    if (document.getElementById('calendar')) {
        if (!document.getElementById('soon')) {
            LEFT.style.visibility == 'visible' ? TheBigBang():TheBigBang(-7)
        }
    }
}

function left() {
    if (LEFT.style.visibility == "visible") {
        if (RIGHT.style.visibility == "visible") {
            LEFT.style.visibility = "hidden"
            TheBigBang(-7);
        }
        else {
            let soon = document.getElementById('soon')
            if (soon) {
                soon.remove()
            }
            RIGHT.style.visibility = "visible"
            LEFT.style.visibility = "visible"
            TheBigBang();
        }
    }
}

function right() {
    if (RIGHT.style.visibility == "visible") {
        if (LEFT.style.visibility == "visible") {
            RIGHT.style.visibility = "hidden"
            document.getElementById('calendar')!.remove()
            document.getElementById('month')!.textContent = "Fall 2021"
            season()
        }
        else {
            RIGHT.style.visibility = "visible"
            LEFT.style.visibility = "visible"
            TheBigBang();
        }
    }
}

async function set(file: string, key: string) {
    let data = await (await fetch(file)).json()
    key == 'store' ? STORE = data : PAST = data
    localStorage.setItem(key, JSON.stringify(data))
}

function TheBigBang(offset: number = 0) {
    let cal = document.getElementById('calendar')
    cal ? cal.remove() : document.getElementById('season')!.remove()
    updateTime()
    let format = localStorage.getItem('format')
    fetch(offset == 0 ? "./shows/time.json":"./shows/past_time.json")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            switch(format) {
                    case "1":
                        data = data['cutoff'];
                        break;
                    case "2":
                        data = data['compact'];
                        break;
                    default:
                        data = data['full'];
            }
            if (localStorage.getItem('list') == "Your List" || Object.keys(JSON.parse(localStorage.getItem('shows')!)).length == 0) {
                $("body").append(calendar(getDates(offset), data));
            }
            else {
                switch(format) {
                    case "1":
                        $("body").append(calendar(getDates(offset), cutoff(data, offset)));
                        break;
                    case "2":
                        $("body").append(calendar(getDates(offset), compact(data, offset)));
                        break;
                    default:
                        $("body").append(calendar(getDates(offset), full(data, offset)));
                }
            }
            resizeCalendar()
            createShows(offset)
        })
}

function calendar(dates: Date[], times: string[]) {
    let calendar = '<div id="calendar"><table><thead><tr><td class="date"></th>'
    dates.forEach(async function(date: Date) {
        calendar += '<td class="date">' + date.getDate() + ' '
            + date.toLocaleDateString("en-US",{ weekday: 'long' }) + '</td>'
    })
    calendar += '</tr></thead><tbody>'
    times.forEach(async function(time: string) {
        calendar += '<tr><td class="time">' + time + '</td>'
        for  (let day = 1; day < 8; day++) {
            calendar += '<td class="slot" id="'
                + ider_slot(day, time)
                + '"></td>'
        }
        calendar += '</tr>'
    })
    calendar += '</tbody></table></div>'
    document.getElementById('month')!.innerHTML = (dates[0].getMonth() == dates[6].getMonth()) ?
        dates[0].toLocaleDateString("en-US",{ month: 'long' }) :
        dates[0].toLocaleDateString("en-US",{ month: 'long' }) + " to " +
            dates[6].toLocaleDateString("en-US",{ month: 'long' })
    return calendar
}

function getDates(offset: number = 0) {
    let dates = []
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    switch(date.getDay()) {
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
            break;
    }
    for (let i = 0; i < 7; i++) {
        dates.push(new Date(year, month, day + i))
    }
    return dates
}

function ider_slot(day: number, time: string) {
    return (time.substring(1,2) == ":") ?
        day * 10000 + parseInt(time.substring(0,1)) * 100 + parseInt(time.substring(2,4)) +
            time.substring(5,6):
        day * 10000 + parseInt(time.substring(0,2)) * 100 + parseInt(time.substring(3,5)) +
            time.substring(6,7)
}

function ider_show(title: string) {
    let words = title.split(" ")
    return title.length + words.length.toString() + words[words.length - 1].replace(/\W/g, '')
}

function createShows(offset: number) {
    const data = offset == 0 ? STORE : PAST
    const shows = JSON.parse(localStorage.getItem("shows")!)
    for (let show in (document.getElementById('list')!.innerHTML == "Your List") ? data:shows) {
        if (show in data) {
            let style = ""
            if (show in shows) {
                style = (LEFT.style.visibility == 'visible' ?
                    shows[show][0] : shows[show][1]) ?
                        ' style="border-color: #4f004f; color: #4f4f4f;" ':
                        ' style="border-color: #4f004f;" '
            }
            let id = "#" + ider_slot(data[show].day, data[show].time)
            $(id).append('<a href="' + id + '">'
                + '<button id="'+ ider_show(show) + '" class="show"' + style + '>'
                + show + '</button></a>'
            )
        }
    }
    $("#show-js").remove()
    $('html').append('<script id="show-js" src="js/show.min.js"></script>')
}

function full(times: string[], offset: number) {
    const shows = JSON.parse(localStorage.getItem('shows')!)
    const data = offset == 0 ? STORE : PAST
    let output: string[] = []
    for (let time in times) {
        if (!(times[time].includes("00") || times[time].includes("30"))) {
            for (let show in shows) {
                if (show in data) {
                    if (data[show].time.includes("00") || data[show].time.includes("30")) {
                        delete shows[show]
                    }
                    else if (times[time] == data[show].time) {
                        output.push(times[time])
                        delete shows[show]
                        break
                    }
                }
                else {
                    delete shows[show]
                }
            }
        }
        else {
            output.push(times[time])
        }
    }
    return output
}

function minMax(t1: string, t2: string) {
    return new Date("2000/1/1 " + t1) < new Date("2000/1/1 " + t2) ? [t1, t2] : [t2, t1]
}

function cutoff(times: string[], offset: number) {
    const shows = JSON.parse(localStorage.getItem('shows')!)
    const data = offset == 0 ? STORE : PAST
    let max: string = "12:00 AM"
    let min: string = "11:59 PM"
    switch (shows.length) {
        case 0:
            return times;
        case 1:
            return [data[Object.keys(shows)[0]].time];
        default:
            for (let show in shows) {
                if (show in data) {
                    max = minMax(max, data[show].time)[1]
                    min = minMax(min, data[show].time)[0]
                    if (data[show].time.includes("00") || data[show].time.includes("30")) {
                        delete shows[show]
                    }
                }
                else {
                    delete shows[show]
                }
            }
    }
    let output: string[] = []
    let bool = false
    for (let time in times) {
        if (min == times[time]) {
            output.push(times[time])
            bool = true
        }
        else if (max == times[time]) {
            output.push(times[time])
            break
        }
        else if (bool) {
            if (times[time].includes("00") || times[time].includes("30")) {
                output.push(times[time])
            }
            else {
                for (let show in shows) {
                    if (times[time] == data[show].time) {
                        output.push(times[time])
                        delete shows[show]
                        break
                    }
                }
            }
        }
    }
    return output
}

function compact(times: string[], offset: number) {
    const data = offset == 0 ? STORE : PAST
    const shows = JSON.parse(localStorage.getItem('shows')!)
    let output: string[] = []
    for (let time in times) {
        for (let show in shows) {
            if (show in data && data[show].time == times[time]) {
                output.push(times[time])
                delete shows[show]
                break
            }
            else if (!(show in data)) {
                delete shows[show]
            }
        }
        if (shows.length == 0) {
            break
        }
    }
    return output
}

function resizeCalendar() {
    (Object.keys($("#show")).length != 0 && ($('#info')[0] as HTMLSelectElement).value == "0") ?
        $('#calendar').css({"height": "25rem"}):
        $('#calendar').css({"height": "50rem"})
}

function streamInfo(show: string) {
    const data = show in STORE ? STORE : PAST
    $("#show").remove()
    $('.arrow').off('click.arrow')
    let streams = '<table class="table table-hover"><tbody><tr><td id="title">'
        + show + '</td></tr>'
    if (Object.keys(data[show].streams).length == 0) {
        streams += '<tr><td>No legal stream available</td></tr><tr><td>'
            + '1 <a id="0" class="stream" href="#"><img class="icon" src="assets/skull.svg"> High Seas</a></td></tr>'
    }
    else {
        for (const [index, [stream, link]] of Object.entries(Object.entries(data[show].streams))) {
            const num = parseInt(index) + 1
            streams += '<tr><td>'
                + num
                + ' <a id="'
                + index
                + '"class="stream" href="'
                + link
                + '" target="_blank">'
            switch(stream) {
                case "Crunchyroll":
                    streams += '<img class="icon" src="assets/crunchyroll.svg">'
                    break;
                case "Funimation":
                    streams += '<img class="icon" src="assets/funimation.svg">'
                    break;
                case "VRV":
                    streams += '<img class="icon" src="assets/vrv.svg">'
                    break;
                case "AnimeLab":
                    streams += '<img class="icon" src="assets/animelab.svg">'
                    break;
                case "Hulu":
                    streams += '<img class="icon" src="assets/hulu.svg">'
                    break;
                case "HiDive":
                    streams += '<img class="icon" src="assets/hidive.svg">'
                    break;
                case "Wakanim":
                    streams += '<img class="icon" src="assets/wakanim.svg">'
                    break;
                case "YouTube":
                    streams += '<img class="icon" src="assets/youtube.svg">'
                    break;
                case "Netflix":
                    streams += '<img class="icon" src="assets/netflix.svg">'
                    break;
            }
            streams += ' ' + stream + '</a></td>'
        }
    }
    let shows = JSON.parse(localStorage.getItem('shows')!)
    const but = show in shows ?
        '<button id="sub" class="setter">Remove from Your List</button>':
        '<button id="add" class="setter">Add to Your List</button>'
    const reset = (show in shows && (LEFT.style.visibility == 'visible' ?
        shows[show][0] : shows[show][1])) ?
            '<button id="reset" style="">Reset</button>':
            '<button id="reset" style="visibility: hidden">Reset</button>'
    switch(localStorage.getItem('info')) {
        case null:
        case "0":
            $("#content").append('<h3 id="show">'
                + but + reset
                + '<div class="cover"><img src="'
                + data[show].cover + '" width="340" height="440">'
                + '</div><div id="streams">'
                + streams + '</div>'
            )
            break;
        case "1":
            $("#content").append('<aside id="show"><h2>'
                + streams
                + '</h2>'
                + '</aside>'
            )
            $('#show').append(but + reset)
            break;
        case "2":
            $("#content").append('<h3 id="show" class="window">'
                + but + reset
                + '<div class="cover"><img src="'
                + data[show].cover + '" width="340" height="440">'
                + '</div><div id="streams">'
                + streams + '</div>'
            )
            break;
    }
    switch(localStorage.getItem('info')) {
        case null:
        case "2":
        case "0":
            $('#reset').css({"position": "absolute"})
            $('.icon').css({"height": "2rem", "width": "2rem"})
            $('.setter').css({"margin-top": "24rem", "position": "absolute", "padding": "2px 10px"})
            break;
        case "1":
            $('.icon').css({"height": "1.5rem", "width": "1.5rem"})
            break;
    }
    resizeCalendar()
    $('#clear').css({"visibility": "visible"})
    let list = <HTMLScriptElement>document.getElementById('list-js')
    if (list) {
        list.remove()
    }
    list = document.createElement('script')
    list.id = 'list-js'
    list.src = 'js/list.min.js'
    document.body.append(list)
}

interface Date {
    getWeek: () => number;
}

Date.prototype.getWeek = function() {
    const date = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
    date.setDate(date.getDate() - date.getDay());
    return Math.ceil((((date.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) / 86400000)) / 7)
}

function updateTime() {
    const time = JSON.parse(localStorage.getItem("time")!)
    let now:any = new Date()
    now = [now.getWeek(), now.getFullYear()]
    if (time != null) {
        let shows = JSON.parse(localStorage.getItem("shows")!)
        if ((now[0] - time[0] == 1 && now[1] == time[1]) ||
            (now[1] - time[1] == 1 && now[0] == 52)) {
            for (let show in shows) {
                [shows[show][0], shows[show][1]] = [false, shows[show][0]]
            }
        }
        else if (now[0] != time[0] || now[1] != time[1]) {
            for (let show in shows) {
                [shows[show][0], shows[show][1]] = [false, false]
            }
        }
        localStorage.setItem('shows', JSON.stringify(shows))
    }
    localStorage.setItem('time', JSON.stringify(now))
}

function menu() {
    let menu = document.getElementById('menu')!
    menu.style.visibility = menu.style.visibility == 'visible' ? 'hidden' : 'visible'
}

window.matchMedia('(min-width: 800px)').addListener(_ => {
    document.getElementById('menu')!.style.visibility = 'hidden'
})
