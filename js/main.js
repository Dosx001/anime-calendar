"use strict";
document.getElementById("info").selectedIndex = parseInt(localStorage.getItem('info'));
document.getElementById("format").selectedIndex = parseInt(localStorage.getItem('format'));
document.getElementById('list').innerHTML = localStorage.getItem('list') ?? "Your List";
let CAL = new Calendar("22.0.2");
let SON = new Season();
window.onload = () => {
    CAL.init().then(() => {
        new Search(Object.keys(Object.assign({}, CAL.store, CAL.past)));
    });
    new Streams();
};
window.matchMedia('(min-width: 1200px)').addListener(_ => {
    document.querySelectorAll(".date").forEach(ele => {
        [ele.innerHTML, ele.title] = [ele.title, ele.innerHTML];
    });
});
document.onkeydown = e => {
    if (!(e.target.id == "search" || e.ctrlKey || e.altKey)) {
        switch (e.key) {
            case "c":
                CAL.clear();
                break;
            case "f":
                document.getElementById('format').focus();
                break;
            case "i":
                document.getElementById('info').focus();
                break;
            case "l":
                list();
                break;
            case "m":
                let cal = document.getElementById('calendar');
                cal ? cal.focus() : document.getElementById('season').focus();
                break;
            case "n":
                CAL.Right();
                break;
            case "p":
                CAL.Left();
                break;
            case "s":
                document.getElementById('search').focus();
                e.preventDefault();
                break;
            case "Escape":
            case "Enter":
                e.target.blur();
        }
        if (document.getElementById('show')) {
            switch (e.key) {
                case "a":
                    CAL.setter();
                    break;
                case "n":
                case "p":
                    CAL.arrow();
                    break;
                case "r":
                    CAL.Reset();
                    break;
                case "w":
                    let urls = {};
                    document.querySelectorAll('.stream').forEach(ele => urls[ele.innerText.substring(1)] = ele.href);
                    let streams = JSON.parse(localStorage.getItem('streams'));
                    let check = true;
                    for (const i in streams) {
                        if (streams[i][1] && streams[i][0] in urls) {
                            window.open(urls[streams[i][0]]);
                            check = false;
                            CAL.Stream();
                            break;
                        }
                    }
                    if (check) {
                        let box = document.querySelector('.stream-box');
                        box.style.backgroundColor = 'darkred';
                        setTimeout(() => box.style.backgroundColor = 'black', 50);
                    }
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    CAL.link(`${parseInt(e.key) - 1}`);
            }
            e.stopImmediatePropagation();
        }
    }
};
function list() {
    let list = document.getElementById('list');
    list.innerHTML = list.innerHTML == 'Full List' ? 'Your List' : 'Full List';
    localStorage.setItem('list', list.innerHTML);
    if (document.getElementById('calendar'))
        CAL.left.style.visibility == 'visible' ? CAL.init() : CAL.init(-7);
    else {
        document.getElementById('season').remove();
        SON.init();
    }
}
