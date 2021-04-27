interface JQuery {
    autocomplete: (arg0: object) => void
}

$(function() {
    $("#search").autocomplete({
        source: Object.keys(Object.assign(JSON.parse(localStorage.getItem("storage")!)
                                         ,JSON.parse(localStorage.getItem("past")!)))
    })
})

$(document).ready(function() {
    $('#search').on('input', function() {
        $(".ui-helper-hidden-accessible").remove();
    });
    let data = JSON.parse(localStorage.getItem("storage")!)
    let past = JSON.parse(localStorage.getItem("past")!)
    $("#search").on("autocompleteselect", function(event, ui) {
        let title = ui.item.value;
        title in data ? streamInfo(data, title):streamInfo(past, title)
        ui.item.value = ""
        $('#search').blur()
    });
    $('input').keyup(function(e) {
        if(e.keyCode == 13 && ($(this)[0] as HTMLInputElement).value in data) {
            let title = ($(this)[0] as HTMLInputElement).value;
            title in data ? streamInfo(data, title):streamInfo(past, title);
            ($(this)[0] as HTMLInputElement).value = ""
        }
    })
})
