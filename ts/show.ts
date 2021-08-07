document.querySelectorAll('.show').forEach(but => {
    (<HTMLButtonElement>but).onclick = function(e: Event) {
        localStorage.getItem('info') == '0' ?
            (document.getElementById('title') ? e.preventDefault(): null) : e.preventDefault()
        streamInfo((<HTMLElement>this).innerHTML)
    }
})

document.getElementById('info')!.onchange = function() {
    localStorage.setItem('info', (<HTMLSelectElement>this).value)
    if (document.getElementById('title')) {
        streamInfo(document.getElementById('title')!.innerHTML)
    }
}
