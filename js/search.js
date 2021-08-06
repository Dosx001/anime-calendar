"use strict";
let titleList = Object.keys(Object.assign(STORE, PAST));
const search = document.getElementById('search');
const titles = document.getElementById('titles');
let indexLi = 99;
search.onkeyup = e => {
    switch (e.key) {
        case "Enter":
            let input = document.getElementById((indexLi == 99 ? indexLi + 1 : indexLi).toString());
            if (input) {
                streamInfo(input.innerHTML);
                search.value = "";
            }
            search.value = "";
            titles.style.display = "none";
            search.blur();
            break;
        case "Backspace":
        case "Delete":
            results(e);
            break;
        default:
            if (e.key.length == 1) {
                results(e);
            }
    }
};
search.onkeydown = e => {
    switch (e.keyCode) {
        case 38:
            move(-1);
            e.preventDefault();
            break;
        case 40:
            move(1);
            e.preventDefault();
            break;
    }
};
search.onclick = e => {
    results(e);
};
search.addEventListener('focusout', e => {
    titles.style.display = "none";
    if (e.relatedTarget) {
        if (e.relatedTarget.className == "active") {
            titles.style.display = "";
        }
        else if (e.relatedTarget.parentElement.id == "titles") {
            e.relatedTarget.click();
        }
    }
});
function results(e) {
    let input = e.target.value;
    indexLi = 99;
    if (input) {
        titles.style.display = "";
        titles.innerHTML = "";
        let i = 100;
        for (let title of titleList) {
            if (title.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                let li = document.createElement('li');
                li.innerHTML = title;
                li.setAttribute('id', i.toString());
                li.setAttribute('tabindex', (i - 100).toString());
                i++;
                li.addEventListener('click', function () {
                    streamInfo(this.innerHTML);
                    search.value = "";
                });
                li.addEventListener('mousemove', e => {
                    indexLi = parseInt(e.target.id);
                    let active = document.querySelector('.active');
                    if (active) {
                        active.classList.remove('active');
                    }
                    document.getElementById(indexLi.toString()).classList.add('active');
                });
                titles.append(li);
            }
        }
        if (i == 100) {
            titles.style.display = "none";
        }
    }
    else {
        titles.style.display = "none";
    }
}
function move(num) {
    let li = document.getElementById((indexLi + num).toString());
    if (li) {
        li.classList.add('active');
        li.focus();
        search.focus();
        if (li.nextElementSibling) {
            li.nextElementSibling.classList.remove('active');
        }
        if (li.previousElementSibling) {
            li.previousElementSibling.classList.remove('active');
        }
        if (document.getElementById((indexLi + num).toString())) {
            indexLi += num;
        }
    }
}
