$(function() {
    $('#navbarToggle').append(`
        <div class="navbar-nav">
            <div class="input-group ui-widget">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="tags">Search</label>
                </div>
                <input id="tags" size="30">
            </div>
        </div>`
    )
    fetch("./shows/shows.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            $("#tags").autocomplete({
                source: Object.keys(data)
            })
        })
})

$(document).ready(function() {
    $('#tags').on('input', function() {
        $(".ui-helper-hidden-accessible").remove();
    });
})
