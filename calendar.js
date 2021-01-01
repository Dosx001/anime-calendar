$(function() {
    //dates.forEach(async function(date) {
    //    send += '<div>' + date + '</div>';
    //})
    $("body").append(testing(getDates()));
})

function testing(dates) {
    times = getTime();
    var calendar = '<div>';
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

function getDates() {
    var dates = [null]
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    switch(date.getDay()) {
        case 0:
            day -= 14;
            break;
        case 1:
            day -= 13;
            break;
        case 2:
            day -= 12;
            break;
        case 3:
            day -= 11;
            break;
        case 4:
            day -= 10;
            break;
        case 5:
            day -= 9;
            break;
        case 6:
            day -= 7;
            break;
    }
    day += 7
    for (i = 0; i < 7; i++) {
        dates.push(new Date(year, month, day + i))
    }
    return dates
}

