$(document).ready(function () {
    let data = JSON.parse(localStorage.getItem("storage"));
    $(".show").click(function (e) {
        if (localStorage.getItem('info') == "0") {
            if ($("#cover").length == 1) {
                e.preventDefault();
            }
        }
        else {
            e.preventDefault();
        }
        streamInfo(data, $(this)[0].innerText);
    });
    $('#info').change(function () {
        localStorage.setItem('info', $(this)[0].value);
        if ($('#title')[0] != null) {
            streamInfo(data, $('#title')[0].innerText);
        }
    });
});
