let titleList = Object.keys(Object.assign(JSON.parse(localStorage.getItem("storage")!)
                                           ,JSON.parse(localStorage.getItem("past")!)))
const search = document.getElementById('search')!
const titles = document.getElementById('titles')!
let indexLi = 99

search.onkeyup = (e) => {
    if (e.key.length == 1 || e.key == "Backspace" || e.key == "Delete") {
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
                        console.log(this.innerHTML)
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

function move(num: number) {
    let mark = document.getElementById((indexLi + num).toString())!
    if (mark) {
        mark.classList.add('active')
        mark.focus()
        search.focus()
        if (mark.nextElementSibling) {
            mark.nextElementSibling.classList.remove('active')
        }
        if (mark.previousElementSibling) {
            mark.previousElementSibling.classList.remove('active')
        }
        if (document.getElementById((indexLi + num).toString())) {
            indexLi += num
        }
    }
}

search.addEventListener('focusout', (e) => {
    titles.style.display = (e.relatedTarget) ?
        (((<HTMLElement>e.relatedTarget).classList[1] == "active") ? "":"none" ): "none"
})
