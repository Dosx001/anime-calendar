$(document).ready(function() {
    let data = JSON.parse(localStorage.getItem("storage")!)
    let past = JSON.parse(localStorage.getItem("past")!)
    $(".show").click(function(e) {
        if (localStorage.getItem('info') == "0") {
            if ($("#cover").length == 1) {
                e.preventDefault();
            }
        }
        else {
            e.preventDefault();
        }
        let title = $(this)[0].innerText;
        title in data ? streamInfo(data, title):streamInfo(past, title)
    })
    $('#info').change(function() {
        localStorage.setItem('info', ($(this)[0] as HTMLInputElement).value)
        if ($('#title')[0] != null) {
            let title = $('#title')[0].innerText;
            title in data ? streamInfo(data, title):streamInfo(past, title)
        }
    })
})
