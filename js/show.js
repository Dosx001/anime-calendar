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
                if (localStorage.getItem('info') == "0") {
                    streamInfo(data, $(this)[0].innerText)
                }
                else {
                    console.log(1)
                }
            })
            $('#info').change(function() {
                localStorage.setItem('info', $(this)[0].value)
            })
        })
})
