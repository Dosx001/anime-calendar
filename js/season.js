"use strict";
if (!localStorage.getItem('season'))
    localStorage.setItem('season', JSON.stringify({}));
function season() {
    let div = document.createElement('div');
    div.id = 'season';
    div.tabIndex = 1;
    document.body.append(div);
    fetch('season/shows.json')
        .then(resp => {
        return resp.json();
    })
        .then(data => {
        let season = JSON.parse(localStorage.getItem('season'));
        let count = 0;
        for (let show in data) {
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
                        table.append(row(item, data[show][item].join(", ")));
                        break;
                    default:
                        table.append(row(item, data[show][item]));
                }
            }
            let btn = document.createElement('button');
            btn.innerHTML = show in season ? "Remove" : "Add";
            btn.onclick = e => {
                let title = e.srcElement.previousElementSibling.childNodes[0].innerText;
                let season = JSON.parse(localStorage.getItem('season'));
                if (title in season) {
                    delete season[title];
                    e.srcElement.innerHTML = "Add";
                }
                else {
                    season[title] = null;
                    e.srcElement.innerHTML = "Remove";
                }
                localStorage.setItem('season', JSON.stringify(season));
            };
            content.append(table);
            content.append(btn);
            div.append(content);
        }
    });
}
function row(item, content) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.innerHTML = item + ': ' + content;
    tr.append(td);
    return tr;
}
