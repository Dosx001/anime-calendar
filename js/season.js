"use strict";
class Season {
    constructor() {
        this.row = (item, content) => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerHTML = `${item}: ${content}`;
            tr.append(td);
            return tr;
        };
        this.list = JSON.parse(localStorage.getItem('season')) ?? {};
        Object.keys(this.list).forEach((key) => {
            if (key in CAL.store) {
                CAL.shows[key] = [false, false];
                delete this.list[key];
            }
        });
        localStorage.setItem('season', JSON.stringify(this.list));
        localStorage.setItem('shows', JSON.stringify(CAL.shows));
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
            : this.list).forEach((key) => {
            const content = document.createElement('div');
            content.className = 'show-season';
            const table = document.createElement('table');
            table.className = 'info';
            Object.keys(data[key]).forEach((item) => {
                switch (item) {
                    case 'title': {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        th.innerHTML = data[key].title;
                        tr.append(th);
                        table.append(tr);
                        break;
                    }
                    case 'cover': {
                        const cover = document.createElement('div');
                        cover.className = 'cover-season';
                        const img = document.createElement('img');
                        img.src = `https://cdn.animeschedule.net/production/assets/public/img/anime/jpg/default/${data[key][item]}.jpg`;
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
                    case 'genres':
                        table.append(this.row(item, data[key][item].join(', ')));
                        break;
                    default:
                        table.append(this.row(item, data[key][item]));
                }
            });
            const btn = document.createElement('button');
            btn.innerHTML = key in this.list ? 'Remove' : 'Add';
            btn.setAttribute('key', key);
            btn.onclick = (e) => {
                const btnKey = e.target.attributes.getNamedItem('key').value;
                if (btnKey in this.list) {
                    delete this.list[btnKey];
                    e.target.innerHTML = 'Add';
                }
                else {
                    this.list[btnKey] = data[btnKey].title.substring(0, 10);
                    e.target.innerHTML = 'Remove';
                    this.list = Object.fromEntries(Object.entries(this.list).sort((a, b) => (a[1] < b[1] ? 0 : 1)));
                }
                localStorage.setItem('season', JSON.stringify(this.list));
            };
            content.append(table);
            content.append(btn);
            div.append(content);
        });
    }
}
