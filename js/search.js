$(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $("#search").autocomplete({
                source: Object.keys(data)
            })
        })
})

$(document).ready(function() {
    $('#search').on('input', function() {
        $(".ui-helper-hidden-accessible").remove();
    });
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $('input').keyup(function(e) {
                if(e.keyCode == 13 && $(this)[0].value in data)
                {
                    streamInfo(data, $(this)[0].value)
                }
            })
        });
})