$(document).ready(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $(".show").click(function(e) {
                if (localStorage.getItem('info') == "0") {
                    if ($("#cover").length == 1) {
                        e.preventDefault();
                    }
                    streamInfo(data, $(this)[0].innerText)
                }
                else {
                    e.preventDefault();
                    streamInfoSide(data, $(this)[0].innerText)
                }
            })
            $('#info').change(function() {
                localStorage.setItem('info', $(this)[0].value)
            })
        })
})

function streamInfoSide(data, show) {
    $("#show").remove()
    $('.arrow').off('click.arrow')
    var shows = JSON.parse(localStorage.getItem('shows'))
    const but = (show in shows) ?
        '<button id="sub-aside" class="setter-aside">Remove from Your List</button>':
        '<button id="add-aside" class="setter-aside">Add to Your List</button>'
    var streams = "";
    for (stream in data[show]['streams']) {
        streams += '<div><a class="stream" href="'
        streams += data[show]['streams'][stream]
        streams += '" target="_blank">'
        switch(stream) {
            case "Crunchyroll":
                streams += '<img class="icon-compact" src="assets/crunchyroll.svg">'
                break;
            case "Funimation":
                streams += '<img class="icon-compact" src="assets/funimation.svg">'
                break;
            case "VRV":
                streams += '<img class="icon-compact" src="assets/vrv.svg">'
                break;
            case "AnimeLab":
                streams += '<img class="icon-compact" src="assets/animelab.svg">'
                break;
            case "Hulu":
                streams += '<img class="icon-compact" src="assets/hulu.svg">'
                break;
            case "HiDive":
                streams += '<img class="icon-compact" src="assets/hidive.svg">'
                break;
            case "Wakanim":
                streams += '<img class="icon-compact" src="assets/wakanim.svg">'
                break;
            case "YouTube":
                streams += '<img class="icon-compact" src="assets/youtube.svg">'
                break;
            case "Netflix":
                streams += '<img class="icon-compact" src="assets/netflix.svg">'
                break;
        }
        streams += ' ' + stream + '</div>'
    }
    $('#content').append('<aside id="show"><div id="title">' + show + '</div>' + but + streams + '</aside>')
    $('#clear').css({"visibility": "visible"})
    $('#list-js').remove()
    $('html').append('<script id="list-js" src="js/list.js"></script>')
}
