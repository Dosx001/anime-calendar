let titleList = Object.keys(Object.assign(JSON.parse(localStorage.getItem("storage")!)
                                           ,JSON.parse(localStorage.getItem("past")!)))
const search = document.getElementById('search')!
const titles = document.getElementById('titles')!
//let index = 100

search.onkeyup = (e) => {
    switch(e.keyCode) {
        case 38: //up
            console.log('up')
            break
        case 40: //down
            console.log('down')
            break
        default:
            let input = (<HTMLInputElement>e.target!).value
            if(input){
                titles.style.display = ""
                titles.innerHTML = ""
                for (let i in titleList) {
                    if (titleList[i].toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                        let li = document.createElement('li')
                        li.innerHTML = titleList[i]
                        li.classList.add('highlight')
                        li.setAttribute('id', (i + 100).toString())
                        li.addEventListener('click', function() {
                            console.log(this.innerHTML)
                        })
                        titles.append(li)
                    }
                }
            }
            else {
                titles.style.display = "none"
            }
    }
}
