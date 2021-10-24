"use strict";
class Search {
    constructor(STORE, PAST) {
        this.titleList = Object.keys(Object.assign({}, STORE, PAST)).sort();
        this.search = document.getElementById('search');
        this.titles = document.getElementById('titles');
        this.indexLi = 99;
        this.search.oninput = e => this.results(e);
        this.search.onfocus = e => e.relatedTarget && e.relatedTarget.className ?
            e.relatedTarget.className != "active" && this.results(e) : this.results(e);
        this.search.onkeyup = e => {
            switch (e.key) {
                case "Enter":
                    let input = document.getElementById((this.indexLi == 99 ? this.indexLi + 1 : this.indexLi).toString());
                    if (this.search.value && input)
                        streamInfo(input.innerHTML);
                    this.search.value = "";
                    this.titles.style.display = "none";
                    this.search.blur();
                    break;
                case "Escape":
                    e.target.blur();
            }
        };
        this.search.onkeydown = e => {
            switch (e.keyCode) {
                case 38:
                    this.move(-1);
                    e.preventDefault();
                    break;
                case 40:
                    this.move(1);
                    e.preventDefault();
            }
        };
        this.search.addEventListener('focusout', e => {
            this.titles.style.display = "none";
            e.relatedTarget && (e.relatedTarget.className == "active" ?
                this.titles.style.display = "" :
                e.relatedTarget.parentElement.id == "titles" &&
                    e.relatedTarget.click());
        });
    }
    results(e) {
        let input = e.target.value;
        let i = 100;
        this.indexLi = 99;
        if (input) {
            this.titles.innerHTML = "";
            for (let title of this.titleList) {
                if (title.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                    let li = document.createElement('li');
                    li.innerHTML = title;
                    li.id = i.toString();
                    li.tabIndex = i - 100;
                    i++;
                    li.onclick = e => {
                        streamInfo(e.target.innerHTML);
                        this.search.value = "";
                        this.titles.style.display = "none";
                    };
                    li.onmousemove = e => {
                        this.indexLi = parseInt(e.target.id);
                        let active = document.querySelector('.active');
                        if (active)
                            active.className = "";
                        e.target.className = "active";
                    };
                    li.oncontextmenu = () => this.titles.style.display = 'none';
                    this.titles.append(li);
                }
            }
        }
        this.titles.style.display = i > 100 ? "" : "none";
    }
    move(num) {
        let li = document.getElementById((this.indexLi + num).toString());
        if (li) {
            li.className = 'active';
            li.focus();
            this.search.focus();
            if (li.nextElementSibling)
                li.nextElementSibling.className = "";
            if (li.previousElementSibling)
                li.previousElementSibling.className = "";
            if (document.getElementById((this.indexLi + num).toString()))
                this.indexLi += num;
        }
    }
}
