$(document).ready(function() {
    $(".show").click(function() {
        $("#show").remove()
        var show = $(this)[0].innerText
        fetch("./shows/shows.json")
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                var streams = '<table class="table table-hover"><tbody><tr><td>'
                    + show + '</td></tr>'
                if (Object.keys(data[show]['streams']) == 0) {
                    streams += '<tr><td>Streams not available</td>'
                }
                else {
                    for (stream in data[show]['streams']) {
                        streams += '<tr><td><a href="'
                        streams += data[show]['streams'][stream]
                        streams += '">' + stream + '</a></td>'
                    }
                }
                $("#content").append('<h3 id="show">'
                    + '<div style="float:inherit;display:inline-block;"><img src="'
                    + data[show]['cover']
                    + '" width="300" height="400">'
                    + '</div><div style="float:left;display:inline-block;width: 70%;">'
                    + streams
                    + '</div>'
                )
            })
    })
})
