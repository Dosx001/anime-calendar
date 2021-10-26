"use strict";
document.getElementById("info").selectedIndex = parseInt(localStorage.getItem('info'));
document.getElementById("format").selectedIndex = parseInt(localStorage.getItem('format'));
if (localStorage.getItem('list'))
    document.getElementById('list').innerHTML = localStorage.getItem('list');
if (!localStorage.getItem('shows'))
    localStorage.setItem('shows', JSON.stringify({}));
let cal = new Calendar("21.3.2");
window.onload = () => {
    cal.init().then(() => {
        new Search(cal.store, cal.past);
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
                cal.clear();
                break;
            case "f":
                document.getElementById('format').focus();
                break;
            case "i":
                document.getElementById('info').focus();
                break;
            case "l":
                cal.list();
                break;
            case "m":
                let Cal = document.getElementById('calendar');
                Cal ? Cal.focus() : document.getElementById('season').focus();
                break;
            case "n":
                cal.Right();
                break;
            case "p":
                cal.Left();
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
                    cal.setter();
                    break;
                case "n":
                case "p":
                    cal.arrow();
                    break;
                case "r":
                    cal.Reset();
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
                            cal.Stream();
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
                    cal.link(`${parseInt(e.key) - 1}`);
            }
            e.stopImmediatePropagation();
        }
    }
};
