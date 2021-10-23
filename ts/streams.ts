type Stream = [string, boolean]
let drag: string
let dragover: string
let streams: Stream[] = JSON.parse(localStorage.getItem('streams')!) ??
    [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
    ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]];
renderItems(streams)

function renderItems(data: Stream[]) {
    let list = (document.querySelector('.stream-box')! as HTMLElement)
    list.innerText = ''
    for (const i in data) {
        let div = document.createElement("div");
        div.draggable = true
        div.className = 'stream-drag'
        div.ondrag = function(this: any) {
            drag = this.innerText
        }
        div.ondragover = function(this: any, e) {
            e.preventDefault()
            dragover = this.innerText
        }
        div.ondrop = () => {
            const index1: number = index(drag)!;
            const index2: number = index(dragover)!;
            streams.splice(index1, 1)
            streams.splice(index2, 0, [drag,
                (<HTMLInputElement>document.querySelector(`[name=${drag}]`)!).checked])
            renderItems(streams)
        }
        div.id = 's' + i
        let input = document.createElement('input')
        input.type = 'checkbox'
        input.name = streams[i][0]
        input.className = 'stream-input'
        input.onclick = function(this: any) {
            streams[parseInt(this.parentElement!.id.substring(1))][1] = this.checked
            localStorage.setItem('streams', JSON.stringify(streams))
        }
        input.checked = streams[i][1]
        let label = document.createElement('label')
        label.className = 'stream-label'
        label.setAttribute('for', streams[i][0])
        label.innerHTML = streams[i][0]
        div.append(input)
        div.append(label)
        list.append(div)
    }
    localStorage.setItem('streams', JSON.stringify(streams))
}

function index(title: string) {
    for (let i = 0; i < streams.length; i++) if (title == streams[i][0]) return i;
}
