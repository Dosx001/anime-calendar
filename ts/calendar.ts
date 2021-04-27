declare var Mousetrap: any

$(function() {
    ((document.getElementById("format")) as HTMLSelectElement).selectedIndex = parseInt(localStorage.getItem('format')!);
    ((document.getElementById("info")) as HTMLSelectElement).selectedIndex = parseInt(localStorage.getItem('info')!)
    if (localStorage.getItem('list') != null) {
        document.getElementById('list')!.innerHTML = localStorage.getItem('list')!
    }
    if (localStorage.getItem('shows') == null) {
        localStorage.setItem('shows', JSON.stringify({}))
    }
    let VERSION = "21.1.4"
    if (localStorage.getItem('ver') != VERSION) {
        localStorage.setItem('ver', VERSION)
        set("./shows/shows.json", "storage")
        set("./shows/past_shows.json", "past")
            .then(resp => {
                let past = JSON.parse(localStorage.getItem('past')!)
                let store = JSON.parse(localStorage.getItem('storage')!)
                let shows = JSON.parse(localStorage.getItem('shows')!)
                for (let show in shows) {
                    if (!(show in store) || !(show in past)) {
                        delete shows[show]
                    }
                }
                localStorage.setItem('shows', JSON.stringify(shows))
                TheBigBang()
                $('html').append('<script src="js/search.min.js"></script>')
            })
    }
    else {
        TheBigBang();
        $('html').append('<script src="js/search.min.js"></script>')
    }
})

$(document).ready(function() {
    $('#left').click(function() {
        left()
    })
    $('#right').click(function() {
        right()
    })
    $('#format').change(function() {
        localStorage.setItem('format', ($(this)[0] as HTMLInputElement).value)
        $("#left")[0].style.display == "" ? TheBigBang():TheBigBang(-7)
    })
    $("#clear").click(function() {
        clear()
    })
    $("#list").click(function() {
        list()
    })
    Mousetrap.bind('f', function() {
        $('#format').focus()
    });
    Mousetrap.bind('i', function() {
        $('#info').focus()
    });
    Mousetrap.bind('c', function() {
        clear()
    });
    Mousetrap.bind('l', function() {
        list()
    });
    Mousetrap.bind('m', function() {
        $('#calendar').focus()
    });
    Mousetrap.bind('n', function() {
        right()
    });
    Mousetrap.bind('p', function() {
        left()
    });
    Mousetrap.bind('s', function() {
        $('#search').focus()
    });
    $('body').keyup(function(e) {
        if (e.keyCode == 13 && e.target.localName == "select") {
            e.target.blur()
        }
    })
})

function clear() {
    $('#clear').css({"visibility": "hidden"})
    $("#show").remove()
    $('#calendar').css({"height": "50rem"})
}

function list() {
    if ($('#list')[0].innerHTML == "Full List") {
        $('#list')[0].innerHTML = "Your List"
        localStorage.setItem('list', "Your List")
    }
    else {
        $('#list')[0].innerHTML = "Full List"
        localStorage.setItem('list', "Full List")
    }
    $("#left")[0].style.display == "" ? TheBigBang():TheBigBang(-7)
}

function left() {
    if ($("#left")[0].style.display == "") {
        if ($("#right")[0].style.display == "") {
            $("#left").hide();
            TheBigBang(-7);
        }
        else {
            $('#soon').remove();
            $("#right").show();
            $("#left").show();
            TheBigBang();
        }
    }
}

function right() {
    if ($("#right")[0].style.display == "") {
        if ($("#left")[0].style.display == "") {
            $("#right").hide();
            $('#calendar').remove()
            document.getElementById('month')!.textContent = "Summer 2021"
            $('body').append(
                '<div id="soon" class="content" align="center">'
                + 'Coming Soon</div>'
            )
        }
        else {
            $("#right").show();
            $("#left").show();
            TheBigBang();
        }
    }
}

async function set(file: string, key: string) {
    const resp = await fetch(file)
    const data = await resp.json()
    localStorage.setItem(key, JSON.stringify(data))
}

function TheBigBang(offset: number = 0) {
    $('#calendar').remove();
    updateTime()
    var option = localStorage.getItem('format')
    fetch(offset == 0 ? "./shows/time.json":"./shows/past_time.json")
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data) {
            switch(option) {
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
                switch(option) {
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
            shows(offset == 0 ? "storage":"past")
        })
}

function calendar(dates: Date[], times: string[]) {
    var calendar = '<div id="calendar"><table>'
        + '<thead><tr><td class="date"></th>'
    dates.forEach(async function(date: Date) {
        calendar += '<td class="date">' + date.getDate() + ' '
        calendar += date.toLocaleDateString("en-US",{ weekday: 'long' }) + '</td>'
    })
    calendar += '</tr></thead><tbody>'
    times.forEach(async function(time: string) {
        calendar += '<tr><td class="time">' + time + '</td>'
        for  (let day = 0; day < 7; day++) {
            var date = dates[day]
            calendar += '<td class="slot" id="'
                + ider_slot(date.toLocaleDateString("en-US",{ weekday: 'long' }), time)
                + '"></td>'
        }
        calendar += '</tr>'
    })
    calendar += '</tbody></table></div>'
    var element = document.getElementById('month');
    if (dates[0].getMonth() == dates[6].getMonth()) {
        element!.innerHTML = dates[0].toLocaleDateString("en-US",{ month: 'long' })
    }
    else {
        element!.innerHTML = dates[0].toLocaleDateString("en-US",{ month: 'long' })
            + " to "
            + dates[6].toLocaleDateString("en-US",{ month: 'long' })
    }
    return calendar
}

function getDates(offset: number = 0) {
    var dates = []
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
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

function ider_slot(day: string, time: string) {
    const days: {[key: string]: number } = {"Monday":1, "Tuesday":2, "Wednesday":3, "Thursday":4,
        "Friday":5, "Saturday":6, "Sunday":7}
    var id = days[day] * 10000
    if (time.substring(1,2) == ":") {
        id += parseInt(time.substring(0,1)) * 100
        id += parseInt(time.substring(2,4))
        return id + time.substring(5,6)
    }
    id += parseInt(time.substring(0,2)) * 100
    id += parseInt(time.substring(3,5))
    return id + time.substring(6,7)
}

function ider_show(title: string) {
    let words = title.split(" ")
    return title.length + words.length.toString() + words[words.length - 1].replace(/\W/g, '')
}

function shows(storage: string) {
    let data = JSON.parse(localStorage.getItem(storage)!)
    const shows = JSON.parse(localStorage.getItem("shows")!)
    for (let show in (document.getElementById('list')!.innerHTML == "Your List") ? data:shows) {
        if (show in data) {
            let style = ""
            if (shows != null && show in shows) {
                if ($('#left')[0].style[0] == null ? shows[show][0]:shows[show][1]) {
                    style = ' style="border-color: #4f004f; color: #4f4f4f;" '
                }
                else {
                    style = ' style="border-color: #4f004f;" '
                }
            }
            var id = "#" + ider_slot(data[show].day, data[show].time)
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
    const data = JSON.parse(localStorage.getItem(offset == 0 ? "storage":"past")!)
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
    if (new Date("2000/1/1 " + t1) < new Date("2000/1/1 " + t2)) {
        return [t1, t2]
    }
    return [t2, t1]
}

function cutoff(times: string[], offset: number) {
    const shows = JSON.parse(localStorage.getItem('shows')!)
    const data = JSON.parse(localStorage.getItem(offset == 0 ? "storage":"past")!)
    let max: any = "12:00 AM"
    let min: any = "11:59 PM"
    switch (shows.length) {
        case 0:
            return times;
        case 1:
            return data[Object.keys(shows)[0]].time;
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
    const data = JSON.parse(localStorage.getItem(offset == 0 ? "storage":"past")!)
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
    if (Object.keys($("#show")).length != 0 && ($('#info')[0] as HTMLSelectElement).value == "0") {
        $('#calendar').css({"height": "25rem"})
    }
    else {
        $('#calendar').css({"height": "50rem"})
    }
}

interface Shows {
    [key: string]: {
        day: string,
        time: string,
        cover: string,
        streams: {[key: string]: string}
    }
}

function streamInfo(data: Shows, show: string) {
    $("#show").remove()
    $('.arrow').off('click.arrow')
    var streams = '<table class="table table-hover"><tbody><tr><td id="title">'
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
    var shows = JSON.parse(localStorage.getItem('shows')!)
    const but = show in shows ?
        '<button id="sub" class="setter">Remove from Your List</button>':
        '<button id="add" class="setter">Add to Your List</button>'
    const reset = (show in shows && (($('#left')[0].style[0] == null) ?
        shows[show][0]:shows[show][1])) ?
        '<button id="reset" style="visibility: visible;">Reset</button>':
        '<button id="reset" style="visibility: hidden;">Reset</button>'
    switch(localStorage.getItem('info')) {
        case null:
        case "0":
            $("#content").append('<h3 id="show">'
                + but + reset
                + '<div id="cover"><img src="'
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
            $("#content").append('<h3 id="show" class="window container">'
                + but + reset
                + '<div id="cover"><img src="'
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
    $('#list-js').remove()
    $('html').append('<script id="list-js" src="js/list.js"></script>')
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
    if (time != null) {
        var shows = JSON.parse(localStorage.getItem("shows")!)
        var now:any = new Date()
        now = [now.getWeek(), now.getFullYear()]
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
        localStorage.setItem('time', JSON.stringify(now))
        localStorage.setItem('shows', JSON.stringify(shows))
    }
}
