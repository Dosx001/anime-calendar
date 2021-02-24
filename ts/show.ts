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
                }
                else {
                    e.preventDefault();
                }
                streamInfo(data, $(this)[0].innerText)
            })
            $('#info').change(function() {
                localStorage.setItem('info', ($(this)[0] as HTMLInputElement).value)
                if ($('#title')[0] != null) {
                    streamInfo(data, $('#title')[0].innerText)
                }
            })
        })
})
