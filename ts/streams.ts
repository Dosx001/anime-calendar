type Stream = [string, boolean]
let drag: Stream
let dragover: Stream;
let streams: Stream[] = JSON.parse(localStorage.getItem('streams')!)
if (streams == null) {
    streams = [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
        ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]]
}
renderItems(streams)

function renderItems(data: Stream[]) {
    let ul = (document.querySelector('.stream-box')! as HTMLElement)
    ul.innerText = ''
    for (const i in data) {
        let li = document.createElement("li");
        li.draggable = true
        li.classList.add('stream-drag')
        li.addEventListener('drag', function() {
            drag = [this.innerText, (this.childNodes[0] as HTMLInputElement).checked]
        })
        li.addEventListener('dragover', function(e) {
            e.preventDefault()
            dragover = [this.innerText, (this.childNodes[0] as HTMLInputElement).checked]
        })
        li.addEventListener('drop', function() {
            const index1: number = index(drag)!;
            const index2: number = index(dragover)!;
            streams.splice(index1, 1)
            streams.splice(index2, 0, drag)
            renderItems(streams)
        })
        li.setAttribute("id", 's' + i)
        let input = document.createElement('input')
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", streams[i][0])
        input.classList.add('stream-input')
        input.addEventListener('click', function() {
            streams[parseInt(this.parentElement!.id.substring(1))][1] = this.checked
            localStorage.setItem('streams', JSON.stringify(streams))
        })
        input.checked = streams[i][1]
        let label = document.createElement('label')
        label.classList.add('stream-label')
        label.setAttribute("for", streams[i][0])
        label.innerText = streams[i][0]
        li.appendChild(input)
        li.appendChild(label)
        ul.appendChild(li)
    }
    localStorage.setItem('streams', JSON.stringify(streams))
}

function index(item: Stream) {
    for (let i = 0; i < streams.length; i++) {
        if (item[0] == streams[i][0] && item[1] == streams[i][1]) {
            return i
        }
    }
}
