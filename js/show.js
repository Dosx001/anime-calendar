"use strict";
document.querySelectorAll('.show').forEach(but => {
    but.onclick = function (e) {
        localStorage.getItem('info') == '0' ?
            (document.getElementById('title') ? e.preventDefault() : null) : e.preventDefault();
        streamInfo(this.innerHTML);
    };
});
document.getElementById('info').onchange = function () {
    localStorage.setItem('info', this.value);
    if (document.getElementById('title')) {
        streamInfo(document.getElementById('title').innerHTML);
    }
};
