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
                streamInfo(data, $(this)[0].innerText)
            })
    })
})
