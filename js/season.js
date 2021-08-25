"use strict";
function season() {
    let div = document.createElement('div');
    div.id = 'season';
    document.body.append(div);
    fetch('season/shows.json')
        .then(resp => {
        return resp.json();
    })
        .then(data => {
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
            content.append(table);
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
