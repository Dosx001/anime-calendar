$(function() {
    document.getElementById('settings').selectedIndex = parseInt(localStorage.getItem('option'))
    TheBigBang();
    $("#nav").load("nav.html");
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
        })
    shows()
}

function calendar(dates, times) {
    var calendar = '<div id="calendar" class="container-fluid">';
    times.forEach(async function(time) {
        calendar += '<div class="row"><div class="col-2"></div>'
        for  (var day = 0; day < 8; day++) {
            var date = dates[day]
            if (time == null) {
                if (day != 0) {
                    calendar += '<div class="col date">'
                        + date.getDate()
                        + ' '
                        + date.toLocaleDateString("en-US",{ weekday: 'long' })
                        + '</div>'
                }
                else {
                    calendar += '<div class="col slot"></div>'
                }
            }
            else if (day == 0) {
                calendar += '<div class="col time">' + time + '</div>'
            }
            else {
                calendar += '<div class="col slot" id="'
                    + ider(date.toLocaleDateString("en-US",{ weekday: 'long' }), time)
                    + '"></div>'
            }
            if (day == 7) {
                calendar += '<div class="col-2"></div>'
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

function shows() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            for (key in data) {
                $('#' + ider(data[key]["day"], data[key]["time"])).append('<button class="show">'
                    + '<a href="#content">'
                    + key
                    + '</a></button>'
                )
            }
            $('html').append(
                `<script>$(document).ready(function() {
                fetch("./shows/shows.json")
                    .then(function(resp) {
                        return resp.json();
                    })
                    .then(function(data) {
                        $(".show").click(function() {
                            $("#show").remove()
                            var show = $(this)[0].innerText
                            var streams = '<table class="table table-hover"><tbody><tr><td>'
                                + show + '</td></tr>'
                            if (Object.keys(data[show]['streams']) == 0) {
                                streams += '<tr><td>Streams not available</td></tr><tr><td>'
                                    + '<img id="cry"'
                                    + 'src="https://giffiles.alphacoders.com/349/34979.gif">'
                                    + '</td></tr>'
                            }
                            else {
                                for (stream in data[show]['streams']) {
                                    streams += '<tr><td><a class="stream" href="'
                                    streams += data[show]['streams'][stream]
                                    streams += '" target="_blank">'
                                    switch(stream) {
                                        case "Crunchyroll":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/crunchyroll-5cbb55eafe.svg">'
                                            break;
                                        case "Funimation":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/funimation-462779f3a7.svg">'
                                            break;
                                        case "VRV":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/vrv-bf6ed46045.svg">'
                                            break;
                                        case "AnimeLab":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/animelab-c94f1496fd.svg">'
                                            break;
                                        case "Hulu":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/hulu-f98114256c.svg">'
                                            break;
                                        case "Hidive":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/hidive-52e3526fbf.svg">'
                                            break;
                                        case "Wakanim":
                                            streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/wakanim-4c57bba81f.svg">'
                                            break;
                                        case "YouTube":
                                            streams += '<img class="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1280px-YouTube_full-color_icon_%282017%29.svg.png">'
                                            break;
                                    }
                                    streams += ' ' + stream + '</a></td>'
                                }
                            }
                            $("#content").append('<h3 id="show">'
                                + '<div id="cover"><img src="'
                                + data[show]['cover']
                                + '" width="300" height="400"></div><div id="streams">'
                                + streams
                                + '</div>'
                            )
                        })
                    })
                })`
            )
        });
}


