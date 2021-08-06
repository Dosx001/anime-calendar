let titleList = Object.keys(Object.assign(STORE, PAST))
const search = <HTMLInputElement> document.getElementById('search')!
const titles = document.getElementById('titles')!
let indexLi = 99

search.onkeyup = (e) => {
    switch(e.key) {
        case "Enter":
            let input = document.getElementById((indexLi == 99 ? indexLi + 1: indexLi).toString())
            if (input) {
                callStreamInfo(input.innerHTML)
            }
            search.value = ""
            titles.style.display = "none"
            search.blur()
            break
        case "Backspace":
        case "Delete":
            results(e)
            break
        default:
            if (e.key.length == 1) {
                results(e)
            }
    }
}

search.onkeydown = (e) => {
    switch(e.keyCode) {
        case 38: //up
            move(-1)
            e.preventDefault();
            break
        case 40: //down
            move(1)
            e.preventDefault();
            break
    }
}

search.onclick = (e) => {
    results(e)
}

search.addEventListener('focusout', (e) => {
    if (e.relatedTarget) {
        if ((<HTMLElement>e.relatedTarget).classList[1] == "active") {
            titles.style.display = ""
        }
        else if ((<HTMLElement>e.relatedTarget).className == "highlight") {
            (<HTMLElement>e.relatedTarget).click()
            titles.style.display = "none"
        }
        else {
            titles.style.display = "none"
        }
    }
    else {
        titles.style.display = "none"
    }
})

function results(e: Event) {
    let input = (<HTMLInputElement>e.target!).value
    indexLi = 99
    if(input){
        titles.style.display = ""
        titles.innerHTML = ""
        let i = 100
        for (let title of titleList) {
            if (title.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                let li = document.createElement('li')
                li.innerHTML = title
                li.classList.add('highlight')
                li.setAttribute('id', i.toString())
                li.setAttribute('tabindex', (i - 100).toString())
                i++
                li.addEventListener('click', function() {
                    callStreamInfo(this.innerHTML)
                })
                titles.append(li)
            }
        }
        if (i == 100) {
            titles.style.display = "none"
        }
    }
    else {
        titles.style.display = "none"
    }
}

function move(num: number) {
    let li = document.getElementById((indexLi + num).toString())!
    if (li) {
        li.classList.add('active')
        li.focus()
        search.focus()
        if (li.nextElementSibling) {
            li.nextElementSibling.classList.remove('active')
        }
        if (li.previousElementSibling) {
            li.previousElementSibling.classList.remove('active')
        }
        if (document.getElementById((indexLi + num).toString())) {
            indexLi += num
        }
    }
}

function callStreamInfo(title: string) {
    streamInfo(title)
    search.value = ""
    titles.style.display = "none"
}
