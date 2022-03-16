"use strict";
class Season {
    constructor() {
        this.set = async () => (await fetch('shows/keys.json')).json();
        this.row = (item, content) => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerHTML = `${item}: ${content}`;
            tr.append(td);
            return tr;
        };
        this.list = JSON.parse(localStorage.getItem('season')) ?? {};
        this.set().then((keys) => {
            Object.keys(this.list).forEach((title) => {
                const show = keys[title];
                if (show) {
                    CAL.shows[show] = [false, false];
                    delete this.list[title];
                    localStorage.setItem('season', JSON.stringify(this.list));
                }
            });
            localStorage.setItem('shows', JSON.stringify(CAL.shows));
        });
    }
    async init() {
        const div = document.createElement('div');
        div.id = 'season';
        div.tabIndex = 1;
        document.body.append(div);
        const data = await (await fetch('season/shows.json')).json();
        let count = 0;
        Object.keys(document.getElementById('list').innerHTML === 'Your List'
            ? data
            : this.list).forEach((show) => {
            const content = document.createElement('div');
            content.className = 'show-season';
            const table = document.createElement('table');
            table.className = 'info';
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.innerHTML = show;
            tr.append(th);
            table.append(tr);
            Object.keys(data[show]).forEach((item) => {
                switch (item) {
                    case 'cover': {
                        const cover = document.createElement('div');
                        cover.className = 'cover-season';
                        cover.align = 'right';
                        const img = document.createElement('img');
                        img.src = data[show][item];
                        img.width = 340;
                        img.height = 440;
                        if (count > 2) {
                            img.src += '?w=5&h=5';
                            const observer = new IntersectionObserver((entries, obser) => {
                                entries.forEach((entry) => {
                                    if (!entry.isIntersecting)
                                        return;
                                    const imag = entry.target;
                                    imag.src = imag.src.substring(0, imag.src.length - 8);
                                    obser.unobserve(imag);
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
                    }
                    case 'Genres':
                        table.append(this.row(item, data[show][item].join(', ')));
                        break;
                    default:
                        table.append(this.row(item, data[show][item]));
                }
            });
            const btn = document.createElement('button');
            btn.innerHTML = show in this.list ? 'Remove' : 'Add';
            btn.onclick = (e) => {
                const title = e.target.previousElementSibling
                    .childNodes[0].innerText;
                if (title in this.list) {
                    delete this.list[title];
                    e.target.innerHTML = 'Add';
                }
                else {
                    this.list[title] = null;
                    e.target.innerHTML = 'Remove';
                    const temp = {};
                    Object.keys(this.list)
                        .sort()
                        .forEach((shw) => {
                        temp[shw] = null;
                    });
                    this.list = temp;
                }
                localStorage.setItem('season', JSON.stringify(this.list));
            };
            content.append(table);
            content.append(btn);
            div.append(content);
        });
    }
}
