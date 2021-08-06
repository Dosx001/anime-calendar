$(document).ready(function() {
    $(".show").click(function(e) {
        if (localStorage.getItem('info') == "0") {
            if ($("#cover").length == 1) {
                e.preventDefault();
            }
        }
        else {
            e.preventDefault();
        }
        streamInfo(this.innerHTML)
    })
    $('#info').change(function() {
        localStorage.setItem('info', ($(this)[0] as HTMLInputElement).value)
        if ($('#title')[0] != null) {
            streamInfo(document.getElementById('title')!.innerHTML)
        }
    })
})
