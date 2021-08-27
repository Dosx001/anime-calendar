document.addEventListener('keydown', e => {
    if (hotkey(e) && document.getElementById('show')) {
        switch (e.key) {
            case "a":
                setter()
                break
            case "n":
            case "p":
                arrow()
                break
            case "r":
                Reset()
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
                        Stream()
                        break
                    }
                }
                if (check) {
                    let box = <HTMLElement>document.querySelector('.stream-box')!
                    box.style.backgroundColor = 'darkred'
                    setTimeout(() => box.style.backgroundColor = 'black', 50);
                }
                break
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                link(`${parseInt(e.key) - 1}`)
        }
        e.stopImmediatePropagation()
    }
})

function link(id: string) {
    let ele = <HTMLAnchorElement>document.getElementById(id)
    if (ele) Stream(); if (!ele.href.includes(window.location.host)) window.open(ele.href);
}

function Stream() {
    let title = document.getElementById('title')!.innerHTML
    let shows = JSON.parse(localStorage.getItem("shows")!)
    if (title in shows) {
        updateSetter(shows, title, true)
        document.getElementById(ider_show(title))!.style.color = "#4f4f4f"
        document.getElementById('reset')!.style.visibility = 'visible'
    }
    localStorage.setItem('shows', JSON.stringify(shows))
}

function updateSetter(shows: {[key: string]: boolean[]}, title: string, Bool: boolean) {
    LEFT.style.visibility == 'visible'
        ? shows[title][0] = Bool : shows[title][1] = Bool
}

function Reset() {
    let title = document.getElementById('title')!.innerHTML
    let shows = JSON.parse(localStorage.getItem("shows")!)
    updateSetter(shows, title, false)
    document.getElementById(ider_show(title))!.style.color = 'purple'
    document.getElementById('reset')!.style.visibility = 'hidden'
    localStorage.setItem('shows', JSON.stringify(shows))
}

function arrow() {
    let title: HTMLElement | string = document.getElementById('title')!
    if (title) {
        title = title.innerHTML
        let shows = JSON.parse(localStorage.getItem("shows")!)
        if (document.getElementById('season')) document.getElementById('show')!.remove();
        else if (title in shows) {
            document.getElementById('reset')!.style.visibility =
                (LEFT.style.visibility == 'visible' ?
                shows[title][0]:shows[title][1]) ?
                'visible' : 'hidden'
        }
    }
}

function setter() {
    let title = document.getElementById('title')!.innerHTML
    let setter = document.querySelector('.setter')!
    let shows = JSON.parse(localStorage.getItem("shows")!)
    if (setter.id == 'add') {
        let ele = document.getElementById(ider_show(title))!
        if (ele) ele.style.borderColor = "#4f004f";
        setter.innerHTML = "Remove from Your List"
        setter.id = "sub"
        shows[title] = [false, false]
    }
    else if (shows != null && title in shows) {
        delete shows[title]
        document.getElementById('reset')!.style.visibility = 'hidden'
        document.getElementById(ider_show(title))!.style.borderColor = 'gray'
        setter.innerHTML = "Add to Your List"
        setter.id = "add"
    }
    localStorage.setItem('shows', JSON.stringify(shows))
    let list = <HTMLElement>document.getElementById('list')!
    if (list.innerHTML == "Full List") LEFT.style.visibility == 'visible' ? TheBigBang():TheBigBang(-7);
}
