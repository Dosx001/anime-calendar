document.addEventListener('keydown', e => {
    if ((<HTMLElement>e.target!).id != "search") {
        switch (e.key) {
            case "a":
                setter()
                break
            case "n":
            case "p":
                arrow()
                break
            case "r":
                reset()
                break
            case "w":
                let urls: {[key: string]: string} = {}
                document.querySelectorAll('.stream').forEach(
                    ele => urls[(ele as HTMLElement).innerText.substring(1)] = (ele as HTMLAnchorElement).href
                )
                let streams = JSON.parse(localStorage.getItem('streams')!)
                let check = true
                for (const i in streams) {
                    if (streams[i][1] && streams[i][0] in urls) {
                        window.open(urls[streams[i][0]])
                        check = false
                        stream()
                        break
                    }
                }
                e.stopImmediatePropagation()
                if (check) {
                    (document.querySelector('.stream-box')! as HTMLElement).style.backgroundColor = 'darkred'
                    setTimeout(function() {
                        (document.querySelector('.stream-box')! as HTMLElement).style.backgroundColor = 'black'
                    }, 50);
                }
                break
            case "1":
                link('#0')
                break
            case "2":
                link('#1')
                break
            case "3":
                link('#2')
                break
            case "4":
                link('#3')
                break
            case "5":
                link('#4')
                break
            case "6":
                link('#5')
                break
            case "7":
                link('#6')
                break
            case "8":
                link('#7')
                break
            case "9":
                link('#8')
                break
            case "10":
                link('#9')
                break
        }
    }
})

$(document).ready(function() {
    $(".setter").click(function() {
        setter()
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

function link(id: string) {
    if ($(id)[0] != null) {
        if ($(id).attr('href') != "#") {
            window.open($(id).attr('href'));
        }
        stream()
    }
}

function stream() {
    let title = $("#title")[0].textContent!
    let shows = JSON.parse(localStorage.getItem("shows")!)
    if (title in shows) {
        updateSetter(shows, title, true)
        $("#" + ider_show(title)).css({"color": "#4f4f4f"})
        $('#reset').css({"visibility": "visible"})
    }
    localStorage.setItem('shows', JSON.stringify(shows))
}

function updateSetter(shows: {[key: string]: boolean[]}, title: string, Bool: boolean) {
    $('#left')[0].style[0] == null ? shows[title][0] = Bool : shows[title][1] = Bool
}

function reset() {
    let title = $("#title")[0].textContent!
    let shows = JSON.parse(localStorage.getItem("shows")!)
    updateSetter(shows, title, false)
    $("#" + ider_show(title)).css({"color": "purple"})
    $($('#reset')).css({"visibility": "hidden"})
    localStorage.setItem('shows', JSON.stringify(shows))
}

function arrow() {
    let show: HTMLElement | string = $("#title")[0]
    let shows = JSON.parse(localStorage.getItem("shows")!)
    if ($('#right')[0].style[0] != null) {
        $('#reset').css({"visibility": "hidden"})
    }
    else if (show != null && shows != null && show.textContent! in shows) {
        show = show.textContent!
        if ($('#left')[0].style[0] == null ? shows[show][0]:shows[show][1]) {
            $('#reset').css({"visibility": "visible"})
        }
        else {
            $('#reset').css({"visibility": "hidden"})
        }
    }
}

function setter() {
    let title = $("#title")[0].textContent!
    let shows = JSON.parse(localStorage.getItem("shows")!)
    if ($('.setter')[0].id == "add") {
        $('#' + ider_show(title)).css({"border-color": "#4f004f"})
        $('.setter')[0].innerHTML = "Remove from Your List"
        $('.setter')[0].id = "sub"
        shows[title] = [false, false]
    }
    else if (shows != null && title in shows) {
        delete shows[title]
        $('#reset').css({"visibility": "hidden"})
        $('#' + ider_show(title)).css({"border-color": "grey", "color": "purple"})
        $('.setter')[0].innerHTML = "Add to Your List"
        $('.setter')[0].id = "add"
    }
    localStorage.setItem('shows', JSON.stringify(shows))
    if ($("#list")[0].innerHTML == "Full List") {
        $("#left")[0].style.display == "" ? TheBigBang():TheBigBang(-7)
    }
}
