"use strict";
let drag;
let dragover;
let streams = JSON.parse(localStorage.getItem('streams'));
if (streams == null) {
    streams = [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
        ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]];
}
renderItems(streams);
function renderItems(data) {
    let list = document.querySelector('.stream-box');
    list.innerText = '';
    for (const i in data) {
        let div = document.createElement("div");
        div.draggable = true;
        div.className = 'stream-drag';
        div.addEventListener('drag', function () {
            drag = this.innerText;
        });
        div.addEventListener('dragover', function (e) {
            e.preventDefault();
            dragover = this.innerText;
        });
        div.addEventListener('drop', () => {
            const index1 = index(drag);
            const index2 = index(dragover);
            streams.splice(index1, 1);
            streams.splice(index2, 0, [drag,
                document.querySelector(`[name=${drag}]`).checked]);
            renderItems(streams);
        });
        div.id = 's' + i;
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = streams[i][0];
        input.className = 'stream-input';
        input.addEventListener('click', function () {
            streams[parseInt(this.parentElement.id.substring(1))][1] = this.checked;
            localStorage.setItem('streams', JSON.stringify(streams));
        });
        input.checked = streams[i][1];
        let label = document.createElement('label');
        label.className = 'stream-label';
        label.setAttribute('for', streams[i][0]);
        label.innerHTML = streams[i][0];
        div.append(input);
        div.append(label);
        list.append(div);
    }
    localStorage.setItem('streams', JSON.stringify(streams));
}
function index(title) {
    for (let i = 0; i < streams.length; i++) {
        if (title == streams[i][0]) {
            return i;
        }
    }
}
