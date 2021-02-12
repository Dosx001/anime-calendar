$(document).ready(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $(".setter").click(function() {
                setter(data)
            })
            $('body').on('keyup.list', function(e) {
                if (e.target.id != 'search') {
                    switch(e.keyCode) {
                        case 49:
                        case 97:
                            link('#0')
                            break;
                        case 50:
                        case 98:
                            link('#1')
                            break;
                        case 51:
                        case 99:
                            link('#2')
                            break;
                        case 52:
                        case 100:
                            link('#3')
                            break;
                        case 53:
                        case 101:
                            link('#4')
                            break;
                        case 54:
                        case 102:
                            link('#5')
                            break;
                        case 55:
                        case 103:
                            link('#6')
                            break;
                        case 56:
                        case 104:
                            link('#7')
                            break;
                        case 57:
                        case 105:
                            link('#8')
                            break;
                        case 58:
                        case 106:
                            link('#9')
                            break;
                        case 65:
                            setter(data)
                            break;
                        case 78:
                        case 80:
                            arrow()
                            break;
                        case 82:
                            reset()
                            break;
                    }
                }
            })
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
    var show = $("#title")[0]
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
            const now = new Date()
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
            var show = Object.keys(shows)[0]
            var New = [show, data[show].time]
            localStorage.setItem('min', JSON.stringify(New))
            localStorage.setItem('max', JSON.stringify(New))
        }
        else {
            var min = JSON.parse(localStorage.getItem('min'))
            if (title == min[0]) {
                min = new Date("2001")
                for (show in shows) {
                    var other = new Date("2000/1/1 " + data[show].time)
                    if (other < min) {
                        min = other
                        var New = show
                    }
                }
                show = [New, data[New].time]
                localStorage.setItem('min', JSON.stringify(show))
            }
            var max = JSON.parse(localStorage.getItem('max'))
            if (title == max[0]) {
                max = new Date("1999")
                for (show in shows) {
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
