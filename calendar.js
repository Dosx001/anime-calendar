$(document).ready(function() {
    $('#left').click(function() {
        $('#calendar').remove();
        if ($("#right")[0].style.display == "") {
            $("#left").hide();
            $("body").append(calendar(getDates(-7)));
        }
        else {
            $("#right").show();
            $("#left").show();
            $("body").append(calendar(getDates()));
        }
    })
    $('#right').click(function() {
        $('#calendar').remove();
        if ($("#left")[0].style.display == "") {
            $("#right").hide();
            $("body").append(calendar(getDates(+7)));
        }
        else {
            $("#right").show();
            $("#left").show();
            $("body").append(calendar(getDates()));
        }
    })
})

$(function() {
    $("body").append(calendar(getDates()));
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            for (key in data) {
                $('#' + ider(data[key]["day"], data[key]["time"])).append('<button class="show">'
                    + key
                    + '</button>')
            }
        });
})

function calendar(dates) {
    times = getTime();
    var calendar = '<div id="calendar">';
    times.forEach(async function(time) {
        calendar += '<div class="row">'
        for  (var day = 0; day < 8; day++) {
            var date = dates[day]
            if (time == null) {
                if (day != 0) {
                    calendar += '<div class="col-sm date">'
                        + date.getDate()
                        + ' '
                        + date.toLocaleDateString("en-US",{ weekday: 'long' })
                        + '</div>'
                }
                else {
                    calendar += '<div class="col-sm slot"></div>'
                }
            }
            else if (day == 0) {
                calendar += '<div class="col-sm time">' + time + '</div>'
            }
            else {
                calendar += '<div class="col-sm slot" id="'
                    + ider(date.toLocaleDateString("en-US",{ weekday: 'long' }), time)
                    + '"></div>'
            }
        }
        calendar += '</div>'
    })
    var element = document.getElementById('month');
    if (dates[1].getMonth() == dates[7].getMonth()) {
        element.innerHTML = dates[1].toLocaleDateString("en-US",{ month: 'long' })
    }
    else {
        element.innerHTML = dates[1].toLocaleDateString("en-US",{ month: 'long' })
            + " to "
            + dates[7].toLocaleDateString("en-US",{ month: 'long' })
    }
    return calendar
}

function getTime() {
    var times = [null];
    for (var i = 11; i < 35; i++) {
        var time = i % 12 + 1;
        if (i < 23 ) {
            times.push(time + ":00 AM");
            times.push(time + ":30 AM");
        }
        else {
            times.push(time + ":00 PM");
            times.push(time + ":30 PM");
        }
    }
    return times
}

function getDates(offset = 0) {
    var dates = [null]
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
