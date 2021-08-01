type Stream = [string, boolean]
var drag: Stream, dragover: Stream;
var streams: Stream[] = JSON.parse(localStorage.getItem('streams')!)
if (streams == null) {
    streams = [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
        ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]]
}
renderItems(streams)

function renderItems(data: Stream[]) {
    var ul = (document.querySelector('.stream-box')! as HTMLElement)
    ul.innerText = ''
    data.forEach(item => {
        var li = document.createElement("li");
        li.draggable = true
        li.classList.add('stream-drag')
        li.addEventListener('drag', setDrag)
        li.addEventListener('dragover', setDragover)
        li.addEventListener('drop', drop)
        var input = document.createElement('input')
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", item[0])
        var label = document.createElement('label')
        label.classList.add('stream-label')
        label.setAttribute("for", item[0])
        label.innerText = item[0]
        li.appendChild(input)
        li.appendChild(label)
        ul.appendChild(li)
    })
    localStorage.setItem('streams', JSON.stringify(streams))
}

function drop() {
    const index1: number = index(drag)!;
    const index2: number = index(dragover)!;
    streams.splice(index1, 1)
    streams.splice(index2, 0, drag)
    renderItems(streams)
}

function setDragover(e: any) {
    e.preventDefault();
    dragover = [e.target.innerText, false]
}

function setDrag(e: any) {
    drag = [e.target.innerText, false]
}

function index(item: Stream) {
    for (var i = 0; i < streams.length; i++) {
        if (item[0] == streams[i][0] && item[1] == streams[i][1]) {
            return i
        }
    }
}
