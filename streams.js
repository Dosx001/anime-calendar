var drag, dragover;
var streams = localStorage.getItem('streams')
if (streams == null) {
    streams = [['AnimeLab', false], ['Crunchyroll', false], ['Funimation', false],
        ['HiDive', false], ['Hulu', false], ['VRV', false], ['Wakanim', false], ['YouTube', false]]
}
else {
    streams = JSON.parse(streams)
}
renderItems(streams)

function renderItems(data) {
    var ul = document.querySelector('.stream-box')
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
    const index1 = index(drag);
    const index2 = index(dragover);
    streams.splice(index1, 1)
    streams.splice(index2, 0, drag)
    renderItems(streams)
};

function setDragover(e) {
    e.preventDefault();
    dragover = [e.target.innerText, false]
}

function setDrag(e) {
    drag = [e.target.innerText, false]
}

function index(item) {
    for (var i = 0; i < streams.length; i++) {
        if (item[0] == streams[i][0] && item[1] == streams[i][1]) {
            return i
        }
    }
}
