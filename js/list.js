$(document).ready(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $(".setter").click(function() {
                var title = $("#title")[0].textContent
                var shows = JSON.parse(localStorage.getItem("shows"))
                if ($(this)[0].id == "add") {
                    if (shows == null || Object.keys(shows).length == 0) {
                        shows = {}
                        show = [title, data[title]['time']]
                        localStorage.setItem('min', JSON.stringify(show))
                        localStorage.setItem('max', JSON.stringify(show))
                    }
                    else {
                        var show = [title, data[title]['time']]
                        localStorage.setItem('min', JSON.stringify(minMax(show, JSON.parse(localStorage.getItem('min')))[0]))
                        localStorage.setItem('max', JSON.stringify(minMax(show, JSON.parse(localStorage.getItem('max')))[1]))
                    }
                    $(this)[0].innerHTML = "Remove from Your List"
                    $(this)[0].id = "sub"
                    shows[title] = [false, false]
                }
                else if (shows != null && title in shows) {
                    delete shows[title]
                    console.log($('#reset'))
                    $('#reset').css({"visibility": "hidden"})
                    if (Object.keys(shows).length == 0) {
                        localStorage.removeItem('min');
                        localStorage.removeItem('max');
                    }
                    else if (Object.keys(shows).length == 1) {
                        var show = Object.keys(shows)[0]
                        var New = [show, data[show]['time']]
                        localStorage.setItem('min', JSON.stringify(New))
                        localStorage.setItem('max', JSON.stringify(New))
                    }
                    else {
                        var min = JSON.parse(localStorage.getItem('min'))
                        if (title == min[0]) {
                            min = new Date("2001")
                            for (show in shows) {
                                var other = new Date("2000/1/1 " + data[show]['time'])
                                if (other < min) {
                                    min = other
                                    var New = show
                                }
                            }
                            show = [New, data[New]['time']]
                            localStorage.setItem('min', JSON.stringify(show))
                        }
                        var max = JSON.parse(localStorage.getItem('max'))
                        if (title == max[0]) {
                            max = new Date("1999")
                            for (show in shows) {
                                var other = new Date("2000/1/1 " + data[show]['time'])
                                if (max < other) {
                                    max = other
                                    var New = show
                                }
                            }
                            show = [New, data[New]['time']]
                            localStorage.setItem('max', JSON.stringify(show))
                        }
                    }
                    $(this)[0].innerHTML = "Add to Your List"
                    $(this)[0].id = "add"
                }
                localStorage.setItem('shows', JSON.stringify(shows))
                if ($("#list")[0].innerHTML == "Full List") {
                    TheBigBang()
                }
            })
            $(".stream").click(function() {
                var title = $("#title")[0].textContent
                var shows = JSON.parse(localStorage.getItem("shows"))
                if (title in shows) {
                    setter(shows, title, true)
                    $("#" + ider_show(title)).css({"color": "green"})
                    $('#reset').css({"visibility": "visible"})
                }
                localStorage.setItem('shows', JSON.stringify(shows))
            })
            $("#reset").click(function() {
                var title = $("#title")[0].textContent
                var shows = JSON.parse(localStorage.getItem("shows"))
                setter(shows, title, false)
                $("#" + ider_show(title)).css({"color": "purple"})
                $($(this)).css({"visibility": "hidden"})
                localStorage.setItem('shows', JSON.stringify(shows))
            })
        })
})

function minMax(foo, bar) {
    if (new Date("2000/1/1 " + foo[1]) < new Date("2000/1/1 " + bar[1])) {
        return [foo, bar]
    }
    return [bar, foo]
}

function setter(shows, title, Bool) {
    if ($('#left')[0].style[0] == null) {
        shows[title][0] = Bool
    }
    else {
        shows[title][1] = Bool
    }
}
