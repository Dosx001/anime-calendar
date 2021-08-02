"use strict";
var drag, dragover;
var streams = JSON.parse(localStorage.getItem('streams'));
if (streams == null) {
    streams = [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
        ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]];
}
renderItems(streams);
function renderItems(data) {
    var ul = document.querySelector('.stream-box');
    ul.innerText = '';
    for (const i in data) {
        var li = document.createElement("li");
        li.draggable = true;
        li.classList.add('stream-drag');
        li.addEventListener('drag', function () {
            drag = [this.innerText, this.childNodes[0].checked];
        });
        li.addEventListener('dragover', function (e) {
            e.preventDefault();
            dragover = [this.innerText, this.childNodes[0].checked];
        });
        li.addEventListener('drop', function () {
            const index1 = index(drag);
            const index2 = index(dragover);
            streams.splice(index1, 1);
            streams.splice(index2, 0, drag);
            renderItems(streams);
        });
        li.setAttribute("id", 's' + i);
        var input = document.createElement('input');
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", streams[i][0]);
        input.style.cursor = "pointer";
        input.addEventListener('click', function () {
            streams[parseInt(this.parentElement.id.substring(1))][1] = this.checked;
            localStorage.setItem('streams', JSON.stringify(streams));
        });
        input.checked = streams[i][1];
        var label = document.createElement('label');
        label.classList.add('stream-label');
        label.setAttribute("for", streams[i][0]);
        label.innerText = streams[i][0];
        li.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);
    }
    localStorage.setItem('streams', JSON.stringify(streams));
}
function index(item) {
    for (var i = 0; i < streams.length; i++) {
        if (item[0] == streams[i][0] && item[1] == streams[i][1]) {
            return i;
        }
    }
}
