"use strict";
class Season {
    constructor() {
        this.list = JSON.parse(localStorage.getItem('season')) ?? {};
    }
    async init() {
        let div = document.createElement('div');
        div.id = 'season';
        div.tabIndex = 1;
        document.body.append(div);
        let data = await (await fetch('season/shows.json')).json();
        let count = 0;
        for (let show in (document.getElementById('list').innerHTML == "Your List") ? data : this.list) {
            let content = document.createElement('div');
            content.className = 'show-season';
            let table = document.createElement('table');
            table.className = 'info';
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.innerHTML = show;
            tr.append(th);
            table.append(tr);
            for (let item in data[show]) {
                switch (item) {
                    case "cover":
                        let cover = document.createElement('div');
                        cover.className = 'cover-season';
                        cover.align = 'right';
                        let img = document.createElement('img');
                        img.src = data[show][item];
                        img.width = 340;
                        img.height = 440;
                        if (2 < count) {
                            img.src += "?w=5&h=5";
                            let observer = new IntersectionObserver((entries, observer) => {
                                entries.forEach(entry => {
                                    if (!entry.isIntersecting)
                                        return;
                                    let img = entry.target;
                                    img.src = img.src.substring(0, img.src.length - 8);
                                    observer.unobserve(img);
                                });
                            }, { root: div, rootMargin: '500px 0px' });
                            observer.observe(img);
                            img.loading = 'lazy';
                        }
                        else
                            count++;
                        cover.append(img);
                        content.append(cover);
                        break;
                    case "Genres":
                        table.append(this.row(item, data[show][item].join(", ")));
                        break;
                    default:
                        table.append(this.row(item, data[show][item]));
                }
            }
            let btn = document.createElement('button');
            btn.innerHTML = show in this.list ? "Remove" : "Add";
            btn.onclick = e => {
                let title = e.srcElement.previousElementSibling.childNodes[0].innerText;
                if (title in this.list) {
                    delete this.list[title];
                    e.srcElement.innerHTML = "Add";
                    let temp = {};
                    for (let show of Object.keys(this.list).sort()) {
                        temp[show] = null;
                    }
                    this.list = temp;
                }
                else {
                    this.list[title] = null;
                    e.srcElement.innerHTML = "Remove";
                }
                localStorage.setItem('season', JSON.stringify(this.list));
            };
            content.append(table);
            content.append(btn);
            div.append(content);
        }
    }
    row(item, content) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML = item + ': ' + content;
        tr.append(td);
        return tr;
    }
}
