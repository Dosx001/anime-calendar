"use strict";
function menu() {
    let menu = document.getElementById('menu');
    menu.style.visibility = menu.style.visibility == 'visible' ? 'hidden' : 'visible';
}
window.matchMedia('(min-width: 800px)').addListener(_ => {
    document.getElementById('menu').style.visibility = 'hidden';
});
