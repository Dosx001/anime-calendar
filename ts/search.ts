$(function() {
    (<any>$("#search")).autocomplete({
        source: Object.keys(JSON.parse(localStorage.getItem("storage")))
    })
})

$(document).ready(function() {
    $('#search').on('input', function() {
        $(".ui-helper-hidden-accessible").remove();
    });
    let data = JSON.parse(localStorage.getItem("storage"))
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
})
