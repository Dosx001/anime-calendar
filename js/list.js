"use strict";
document.addEventListener('keydown', e => {
    if (e.target.id != "search" && document.getElementById('show')) {
        switch (e.key) {
            case "a":
                setter();
                break;
            case "n":
            case "p":
                arrow();
                break;
            case "r":
                reset();
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
                        stream();
                        break;
                    }
                }
                if (check) {
                    document.querySelector('.stream-box').style.backgroundColor = 'darkred';
                    setTimeout(function () {
                        document.querySelector('.stream-box').style.backgroundColor = 'black';
                    }, 50);
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
                link(`${parseInt(e.key) - 1}`);
                break;
        }
        e.stopImmediatePropagation();
    }
});
document.querySelectorAll('.arrow').forEach(ele => {
    ele.addEventListener('click', () => {
        arrow();
    });
});
document.querySelector('.setter').onclick = () => {
    setter();
};
document.querySelectorAll('.stream').forEach(but => {
    but.onclick = () => {
        stream();
    };
});
document.getElementById('reset').onclick = () => {
    reset();
};
function link(id) {
    let ele = document.getElementById(id);
    if (ele) {
        stream();
        if (!ele.href.includes(window.location.host)) {
            window.open(ele.href);
        }
    }
}
function stream() {
    let title = document.getElementById('title').innerHTML;
    let shows = JSON.parse(localStorage.getItem("shows"));
    if (title in shows) {
        updateSetter(shows, title, true);
        document.getElementById(ider_show(title)).style.color = "#4f4f4f";
        document.getElementById('reset').style.visibility = 'visible';
    }
    localStorage.setItem('shows', JSON.stringify(shows));
}
function updateSetter(shows, title, Bool) {
    LEFT.style.visibility == 'visible'
        ? shows[title][0] = Bool : shows[title][1] = Bool;
}
function reset() {
    let title = document.getElementById('title').innerHTML;
    let shows = JSON.parse(localStorage.getItem("shows"));
    updateSetter(shows, title, false);
    document.getElementById(ider_show(title)).style.color = 'purple';
    document.getElementById('reset').style.visibility = 'hidden';
    localStorage.setItem('shows', JSON.stringify(shows));
}
function arrow() {
    let title = document.getElementById('title');
    if (title) {
        title = title.innerHTML;
        let shows = JSON.parse(localStorage.getItem("shows"));
        if (document.getElementById('season')) {
            document.getElementById('show').remove();
        }
        else if (title in shows) {
            document.getElementById('reset').style.visibility =
                (LEFT.style.visibility == 'visible' ?
                    shows[title][0] : shows[title][1]) ?
                    'visible' : 'hidden';
        }
    }
}
function setter() {
    let title = document.getElementById('title').innerHTML;
    let setter = document.querySelector('.setter');
    let shows = JSON.parse(localStorage.getItem("shows"));
    if (setter.id == 'add') {
        let ele = document.getElementById(ider_show(title));
        if (ele) {
            ele.style.borderColor = "#4f004f";
        }
        setter.innerHTML = "Remove from Your List";
        setter.id = "sub";
        shows[title] = [false, false];
    }
    else if (shows != null && title in shows) {
        delete shows[title];
        document.getElementById('reset').style.visibility = 'hidden';
        document.getElementById(ider_show(title)).style.borderColor = "purple";
        setter.innerHTML = "Add to Your List";
        setter.id = "add";
    }
    localStorage.setItem('shows', JSON.stringify(shows));
    let list = document.getElementById('list');
    if (list.innerHTML == "Full List") {
        LEFT.style.visibility == 'visible' ? TheBigBang() : TheBigBang(-7);
    }
}
