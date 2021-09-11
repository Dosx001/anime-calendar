interface HTMLImageElement {
    loading: string
}

function season() {
    let div = document.createElement('div')
    div.id = 'season'
    div.tabIndex = 1
    document.body.append(div)
    fetch('season/shows.json')
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            let count = 0
            for (let show in data) {
                let content = document.createElement('div')
                content.className = 'show-season'
                let table = document.createElement('table')
                table.className = 'info'
                let tr = document.createElement('tr')
                let th = document.createElement('th')
                th.innerHTML = show
                tr.append(th)
                table.append(tr)
                for (let item in data[show]) {
                    switch(item) {
                        case "cover":
                            let cover = document.createElement('div')
                            cover.className = 'cover-season'
                            cover.align = 'right'
                            let img = document.createElement('img')
                            img.src = data[show][item]
                            img.width = 340
                            img.height = 440
                            count < 2 ? count++ : img.loading = 'lazy'
                            cover.append(img)
                            let observer = new IntersectionObserver((entries, observer) => {
                                entries.forEach(entry => {
                                    if (!entry.isIntersecting) return;
                                    let img = <HTMLImageElement>entry.target;
                                    img.src = img.src.substring(0, img.src.length - 8);
                                    observer.unobserve(img);
                                })
                            }, {root: div, rootMargin: '500px 0px'});
                            observer.observe(img);
                            content.append(cover)
                            break
                        case "Genres":
                            table.append(row(item, data[show][item].join(", ")))
                            break
                        default:
                            table.append(row(item, data[show][item]))
                    }
                }
                content.append(table)
                div.append(content)
            }
        })
}

function row(item: string, content: string) {
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = item + ': ' + content
    tr.append(td)
    return tr
}
