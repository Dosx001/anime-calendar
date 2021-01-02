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
    //dates.forEach(async function(date) {
    //    send += '<div>' + date + '</div>';
    //})
    $("body").append(calendar(getDates()));
})

function calendar(dates) {
    times = getTime();
    var calendar = '<div id="calendar">';
    for (var time = 0; time < 25; time++) {
        calendar += '<div class="row">'
        for  (var day = 0; day < 8; day++) {
            if (time == 0) {
                var date = dates[day]
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
                calendar += '<div class="col-sm time">' + times[time] + '</div>'
            }
            else {
                calendar += '<div class="col-sm slot">content</div>'
            }
        }
        calendar += '</div>'
    }
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
    for (var i = 0; i < 24; i++) {
        var time = i % 12 + 1;
        if (i < 12 ) {
            times.push(time + " AM");
        }
        else {
            times.push(time + " PM");
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
            day += offset - 9;
            break;
        case 1:
            day += offset - 8;
            break;
        case 2:
            day += offset - 7;
            break;
        case 3:
            day += offset - 6;
            break;
        case 4:
            day += offset - 5;
            break;
        case 5:
            day += offset - 4;
            break;
        case 6:
            day += offset - 3;
            break;
    }
    for (i = 0; i < 7; i++) {
        dates.push(new Date(year, month, day + i))
    }
    return dates
}
