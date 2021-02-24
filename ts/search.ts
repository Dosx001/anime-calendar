$(function() {
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            (<any>$("#search")).autocomplete({
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
            $("#search").on("autocompleteselect", function(event, ui) {
                streamInfo(data, ui.item.value)
                ui.item.value = ""
               $('#search').blur()
            });
            $('input').keyup(function(e) {
                if(e.keyCode == 13 && ($(this)[0] as HTMLInputElement).value in data)
                {
                    streamInfo(data, ($(this)[0] as HTMLInputElement).value);
                    ($(this)[0] as HTMLInputElement).value = ""
                }
            })
        });
})
