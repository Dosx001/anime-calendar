interface Shows {
    [key: string]: {
        day: number,
        time: string,
        cover: string,
        streams: {[key: string]: string}
    }
}
let PAST: Shows = JSON.parse(localStorage.getItem('past')!)
let STORE: Shows = JSON.parse(localStorage.getItem('store')!);

(<HTMLSelectElement>document.getElementById("info")).selectedIndex = parseInt(localStorage.getItem('info')!);
(<HTMLSelectElement>document.getElementById("format")).selectedIndex = parseInt(localStorage.getItem('format')!)
if (localStorage.getItem('list')) document.getElementById('list')!.innerHTML = localStorage.getItem('list')!;
if (!localStorage.getItem('shows')) localStorage.setItem('shows', JSON.stringify({}));
let LEFT = document.getElementById("left")!
let RIGHT = document.getElementById("right")!
LEFT.style.visibility = "visible"
RIGHT.style.visibility = "visible"

let cal = new Calendar()

window.onload = () => {
    let VERSION = "21.3.2"
    if (localStorage.getItem('ver') != VERSION) {
        localStorage.setItem('ver', VERSION)
        set("./shows/shows.json", "store")
        set("./shows/past_shows.json", "past")
            .then(() => {
                let shows = JSON.parse(localStorage.getItem('shows')!)
                for (let show in shows) if (!(show in STORE || show in PAST)) delete shows[show];
                localStorage.setItem('shows', JSON.stringify(shows))
            }).finally(() => {
                cal.TheBigBang()
                new Search(STORE, PAST)
            })
    }
    else {
        cal.TheBigBang();
        new Search(STORE, PAST)
    }
    new Streams()
}

window.matchMedia('(min-width: 1200px)').addListener(_ => {
    document.querySelectorAll<HTMLElement>(".date").forEach(ele => {
        [ele.innerHTML, ele.title] = [ele.title, ele.innerHTML]
    })
})

document.addEventListener('keydown', e => {
    if (!((<HTMLElement>e.target!).id == "search" || e.ctrlKey || e.altKey)) {
        switch(e.key) {
            case "c":
                cal.clear()
                break
            case "f":
                document.getElementById('format')!.focus()
                break
            case "i":
                document.getElementById('info')!.focus()
                break
            case "l":
                cal.list()
                break
            case "m":
                let Cal = document.getElementById('calendar')
                Cal ? Cal.focus() : document.getElementById('season')!.focus()
                break
            case "n":
                cal.right()
                break
            case "p":
                cal.left()
                break
            case "s":
                document.getElementById('search')!.focus()
                e.preventDefault()
                break
            case "Escape":
            case "Enter":
                (<HTMLElement>e.target!).blur()
        }
        if (document.getElementById('show')) {
            switch (e.key) {
                case "a":
                    cal.setter()
                    break
                case "n":
                case "p":
                    cal.arrow()
                    break
                case "r":
                    cal.Reset()
                    break
                case "w":
                    let urls: {[key: string]: string} = {}
                    document.querySelectorAll<HTMLAnchorElement>('.stream').forEach(
                        ele => urls[ele.innerText.substring(1)] = ele.href
                    )
                    let streams = JSON.parse(localStorage.getItem('streams')!)
                    let check = true
                    for (const i in streams) {
                        if (streams[i][1] && streams[i][0] in urls) {
                            window.open(urls[streams[i][0]])
                            check = false
                            cal.Stream()
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
                    cal.link(`${parseInt(e.key) - 1}`)
            }
            e.stopImmediatePropagation()
        }
    }
})

async function set(file: string, key: string) {
    let data = await (await fetch(file)).json()
    key == 'store' ? STORE = data : PAST = data
    localStorage.setItem(key, JSON.stringify(data))
}
