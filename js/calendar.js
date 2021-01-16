$(function() {
    $("#nav").load("nav.html");
    document.getElementById('settings').selectedIndex = parseInt(localStorage.getItem('option'))
    if (localStorage.getItem('list') != null) {
        document.getElementById('list').innerHTML = localStorage.getItem('list')
    }
    TheBigBang();
})

$(document).ready(function() {
    $('#left').click(function() {
        if ($("#right")[0].style.display == "") {
            $("#left").hide();
            TheBigBang(-7);
        }
        else {
            $("#right").show();
            $("#left").show();
            TheBigBang();
        }
    })
    $('#right').click(function() {
        if ($("#left")[0].style.display == "") {
            $("#right").hide();
            TheBigBang(+7);
        }
        else {
            $("#right").show();
            $("#left").show();
            TheBigBang();
        }
    })
    $('select').change(function() {
        localStorage.setItem('option', $(this)[0].value)
        TheBigBang();
    })
    $("#clear").click(function() {
        $('#clear').css({"visibility": "hidden"})
        $("#show").remove()
        $('#calendar').css({"height": "50rem"})
    })
    $("#list").click(function() {
        if ($(this)[0].innerHTML == "Full List") {
            $(this)[0].innerHTML = "Your List"
            localStorage.setItem('list', "Your List")
        }
        else {
            $(this)[0].innerHTML = "Full List"
            localStorage.setItem('list', "Full List")
        }
        TheBigBang();
    })
})

function TheBigBang(offset) {
    $('#calendar').remove();
    var file
    switch(localStorage.getItem('option')) {
        case "1":
            file = "./shows/cutoff.json"
            break;
        case "2":
            file = "./shows/compact.json"
            break;
        default:
            file = "./shows/full.json"
    }
    fetch(file)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $("body").append(calendar(getDates(offset), data));
            if (Object.keys($("#show")) != 0) {
                $('#calendar').css({"height": "25rem"})
            }
        })
    if (document.getElementById('list').innerHTML == "Your List") {
        shows(true)
    }
    else {
        shows(false)
    }
}

function calendar(dates, times) {
    var calendar = '<div id="calendar"><table>'
        + '<thead><tr><td class="date"></th>'
    dates.forEach(async function(date) {
            calendar += '<td class="date">' + date.getDate() + ' '
            calendar += date.toLocaleDateString("en-US",{ weekday: 'long' }) + '</td>'
    })
    calendar += '</tr></thead><tbody>'
    times.forEach(async function(time) {
        calendar += '<tr><td class="time">' + time + '</td>'
        for  (var day = 0; day < 7; day++) {
            var date = dates[day]
            calendar += '<td class="slot" id="'
                + ider(date.toLocaleDateString("en-US",{ weekday: 'long' }), time)
                + '"></td>'
        }
        calendar += '</tr>'
    })
    calendar += '</tbody></table></div>'
    var element = document.getElementById('month');
    if (dates[0].getMonth() == dates[6].getMonth()) {
        element.innerHTML = dates[0].toLocaleDateString("en-US",{ month: 'long' })
    }
    else {
        element.innerHTML = dates[0].toLocaleDateString("en-US",{ month: 'long' })
            + " to "
            + dates[6].toLocaleDateString("en-US",{ month: 'long' })
    }
    return calendar
}

function getDates(offset = 0) {
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
    for (i = 0; i < 7; i++) {
        dates.push(new Date(year, month, day + i))
    }
    return dates
}

function ider(day, time) {
    const days = {Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6, Sunday:7}
    var id = days[day] * 10000
    if (time.substring(1,2) == ":") {
        id += parseInt(time.substring(0,1)) * 100
        id += parseInt(time.substring(2,4))
        id = id.toString() + time.substring(5,6)
    }
    else {
        id += parseInt(time.substring(0,2)) * 100
        id += parseInt(time.substring(3,5))
        id = id.toString() + time.substring(6,7)
    }
    return id
}

function shows(Bool) {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            for (show in (Bool) ? data:JSON.parse(localStorage.getItem("shows"))) {
                var id = "#" + ider(data[show]["day"], data[show]["time"])
                $(id).append('<a href="' + id + '">'
                    + '<button id="'+ show + '" class="show">'
                    + show + '</button></a>'
                )
            }
            $("#show-js").remove()
            $('html').append('<script id="show-js" src="js/show.js"></script>')
        })
}
