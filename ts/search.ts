const titleList = Object.keys(Object.assign({}, STORE, PAST)).sort()
const search = <HTMLInputElement> document.getElementById('search')!
const titles = document.getElementById('titles')!
let indexLi = 99

search.oninput = e => results(e)
search.onfocus = e => e.relatedTarget && (<HTMLElement>e.relatedTarget).className ?
    (<HTMLElement>e.relatedTarget).className != "active" && results(e) : results(e)

search.onkeyup = e => {
    switch(e.key) {
        case "Enter":
            let input = document.getElementById((indexLi == 99 ? indexLi + 1: indexLi).toString())
            if (search.value && input) streamInfo(input.innerHTML)
            search.value = ""
            titles.style.display = "none"
            search.blur()
            break
        case "Escape":
            (<HTMLElement>e.target!).blur()
    }
}

search.onkeydown = e => {
    switch(e.keyCode) {
        case 38: //up
            move(-1)
            e.preventDefault();
            break
        case 40: //down
            move(1)
            e.preventDefault();
    }
}

search.addEventListener('focusout', e => {
    titles.style.display = "none"
    e.relatedTarget && ((<HTMLElement>e.relatedTarget).className == "active" ?
        titles.style.display = "" :
        (<HTMLElement>e.relatedTarget).parentElement!.id == "titles" &&
            (<HTMLElement>e.relatedTarget).click()
    )
})

function results(e: Event) {
    let input = (<HTMLInputElement>e.target!).value
    let i = 100
    indexLi = 99
    if (input) {
        titles.innerHTML = ""
        for (let title of titleList) {
            if (title.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                let li: HTMLLIElement = document.createElement('li')
                li.innerHTML = title
                li.id = i.toString()
                li.tabIndex = i - 100
                i++
                li.onclick = e => {
                    streamInfo((<HTMLElement>e.target).innerHTML)
                    search.value = ""
                    titles.style.display = "none"
                }
                li.onmousemove = e => {
                    indexLi = parseInt((<HTMLElement>e.target).id)
                    let active = document.querySelector('.active')
                    if (active) active.className = "";
                    (<HTMLElement>e.target)!.className = "active"
                }
                li.oncontextmenu = () => titles.style.display = 'none'
                titles.append(li)
            }
        }
    }
    titles.style.display = i > 100 ? "" : "none"
}

function move(num: number) {
    let li = document.getElementById((indexLi + num).toString())
    if (li) {
        li.className = 'active'
        li.focus()
        search.focus()
        if (li.nextElementSibling) li.nextElementSibling.className = "";
        if (li.previousElementSibling) li.previousElementSibling.className = "";
        if (document.getElementById((indexLi + num).toString())) indexLi += num;
    }
}
