$(document).ready(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $(".setter").click(function() {
                setter(data)
            })
            Mousetrap.bind('a', function() {
                setter(data)
            });
        })
    $(".stream").click(function() {
        stream()
    })
    $("#reset").click(function() {
        reset()
    })
    $(".arrow").on('click.arrow', function() {
        arrow()
    })
    Mousetrap.bind(['n', 'p'], function(e) {
        if (e.key == 'n') {
            left()
        }
        else {
            right()
        }
        arrow()
    });
    Mousetrap.bind('r', function() {
        reset()
    });
    Mousetrap.bind('1', function() {
        link('#0')
    });
    Mousetrap.bind('2', function() {
        link('#1')
    });
    Mousetrap.bind('3', function() {
        link('#2')
    });
    Mousetrap.bind('4', function() {
        link('#3')
    });
    Mousetrap.bind('5', function() {
        link('#4')
    });
    Mousetrap.bind('6', function() {
        link('#5')
    });
    Mousetrap.bind('7', function() {
        link('#6')
    });
    Mousetrap.bind('8', function() {
        link('#7')
    });
    Mousetrap.bind('9', function() {
        link('#8')
    });
})

function minMax(foo, bar) {
    if (new Date("2000/1/1 " + foo[1]) < new Date("2000/1/1 " + bar[1])) {
        return [foo, bar]
    }
    return [bar, foo]
}

function link(id) {
    if ($(id)[0] != null) {
        window.open($(id).attr('href'));
        stream()
    }
}

function stream() {
    var title = $("#title")[0].textContent
    var shows = JSON.parse(localStorage.getItem("shows"))
    if (title in shows) {
        updateSetter(shows, title, true)
        $("#" + ider_show(title)).css({"color": "#4f4f4f"})
        $('#reset').css({"visibility": "visible"})
    }
    localStorage.setItem('shows', JSON.stringify(shows))
}

function updateSetter(shows, title, Bool) {
    if ($('#left')[0].style[0] == null) {
        shows[title][0] = Bool
    }
    else {
        shows[title][1] = Bool
    }
}

function reset() {
    var title = $("#title")[0].textContent
    var shows = JSON.parse(localStorage.getItem("shows"))
    updateSetter(shows, title, false)
    $("#" + ider_show(title)).css({"color": "purple"})
    $($('#reset')).css({"visibility": "hidden"})
    localStorage.setItem('shows', JSON.stringify(shows))
}

function arrow() {
    let show:any = $("#title")[0]
    var shows = JSON.parse(localStorage.getItem("shows"))
    if ($('#right')[0].style[0] != null) {
        $('#reset').css({"visibility": "hidden"})
    }
    else if (show != null && shows != null && show.textContent in shows) {
        show = show.textContent
        if (($('#left')[0].style[0] == null) ? shows[show][0]:shows[show][1]) {
            $('#reset').css({"visibility": "visible"})
        }
        else {
            $('#reset').css({"visibility": "hidden"})
        }
    }
}

function setter(data) {
    var title = $("#title")[0].textContent
    var shows = JSON.parse(localStorage.getItem("shows"))
    if ($('.setter')[0].id == "add") {
        if (Object.keys(shows).length == 0) {
            shows = {}
            show = [title, data[title].time]
            localStorage.setItem('min', JSON.stringify(show))
            localStorage.setItem('max', JSON.stringify(show))
            let now: any = new Date()
            localStorage.setItem('time', JSON.stringify([now.getWeek, now.getFullYear]))
        }
        else {
            var show = [title, data[title].time]
            localStorage.setItem('min', JSON.stringify(minMax(show, JSON.parse(localStorage.getItem('min')))[0]))
            localStorage.setItem('max', JSON.stringify(minMax(show, JSON.parse(localStorage.getItem('max')))[1]))
        }
        $('#' + ider_show(title)).css({"border-color": "#4f004f"})
        $('.setter')[0].innerHTML = "Remove from Your List"
        $('.setter')[0].id = "sub"
        shows[title] = [false, false]
    }
    else if (shows != null && title in shows) {
        delete shows[title]
        $('#reset').css({"visibility": "hidden"})
        if (Object.keys(shows).length == 0) {
            localStorage.removeItem('min');
            localStorage.removeItem('max');
        }
        else if (Object.keys(shows).length == 1) {
            let show = Object.keys(shows)[0]
            localStorage.setItem('min', JSON.stringify([show, data[show].time]))
            localStorage.setItem('max', JSON.stringify([show, data[show].time]))
        }
        else {
            var min = JSON.parse(localStorage.getItem('min'))
            if (title == min[0]) {
                min = new Date("2001")
                for (let show in shows) {
                    var other = new Date("2000/1/1 " + data[show].time)
                    if (other < min) {
                        min = other
                        var New = show
                    }
                }
                localStorage.setItem('min', JSON.stringify([New, data[New].time]))
            }
            var max = JSON.parse(localStorage.getItem('max'))
            if (title == max[0]) {
                max = new Date("1999")
                for (let show in shows) {
                    var other = new Date("2000/1/1 " + data[show].time)
                    if (max < other) {
                        max = other
                        var New = show
                    }
                }
                show = [New, data[New].time]
                localStorage.setItem('max', JSON.stringify(show))
            }
        }
        $('#' + ider_show(title)).css({"border-color": "grey", "color": "purple"})
        $('.setter')[0].innerHTML = "Add to Your List"
        $('.setter')[0].id = "add"
    }
    localStorage.setItem('shows', JSON.stringify(shows))
    if ($("#list")[0].innerHTML == "Full List") {
        TheBigBang()
    }
}
