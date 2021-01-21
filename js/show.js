$(document).ready(function() {
        fetch("./shows/shows.json")
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                $(".show").click(function(e) {
                    if ($("#cover").length == 1) {
                        e.preventDefault();
                    }
                    $("#show").remove()
                    var show = $(this)[0].innerText
                    var streams = '<table class="table table-hover"><tbody><tr><td id="title">'
                        + show + '</td></tr>'
                    if (Object.keys(data[show]['streams']) == 0) {
                        streams += '<tr><td>Streams not available</td></tr><tr><td>'
                            + '<img id="cry"'
                            + 'src="https://giffiles.alphacoders.com/349/34979.gif">'
                            + '</td></tr>'
                    }
                    else {
                        for (stream in data[show]['streams']) {
                            streams += '<tr><td><a class="stream" href="'
                            streams += data[show]['streams'][stream]
                            streams += '" target="_blank">'
                            switch(stream) {
                                case "Crunchyroll":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/crunchyroll-5cbb55eafe.svg">'
                                    break;
                                case "Funimation":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/funimation-462779f3a7.svg">'
                                    break;
                                case "VRV":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/vrv-bf6ed46045.svg">'
                                    break;
                                case "AnimeLab":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/animelab-c94f1496fd.svg">'
                                    break;
                                case "Hulu":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/hulu-f98114256c.svg">'
                                    break;
                                case "Hidive":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/hidive-52e3526fbf.svg">'
                                    break;
                                case "Wakanim":
                                    streams += '<img class="image" src="https://animeschedule.s3.amazonaws.com/production/assets/public/img/logos/wakanim-4c57bba81f.svg">'
                                    break;
                                case "YouTube":
                                    streams += '<img class="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1280px-YouTube_full-color_icon_%282017%29.svg.png">'
                                    break;
                            }
                            streams += ' ' + stream + '</a></td>'
                        }
                    }
                    var shows = JSON.parse(localStorage.getItem('shows'))
                    if (shows == null) {
                        shows = {}
                    }
                    var but = (show in shows) ?
                        '<button id="sub" class="setter">Remove from Your List</button>':
                        '<button id="add" class="setter">Add to Your List</button>'
                    $("#content").append('<h3 id="show">'
                        + but
                        + '<div id="cover"><img src="'
                        + data[show]['cover'] + '" width="300" height="400">'
                        + '</div><div id="streams">'
                        + streams + '</div>'
                    )
                    $('#calendar').css({"height": "25rem"})
                    $('#clear').css({"visibility": "visible"})
                    $('#list-js').remove()
                    $('html').append('<script id="list-js" src="js/list.js"></script>')
                })
        })
})
