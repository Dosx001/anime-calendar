$(document).ready(function() {
    $(".setter").click(function() {
        var title = $("#title")[0].textContent
        var store = JSON.parse(localStorage.getItem("shows"))
        if ($(this)[0].id == "add") {
            if (store == null) {
                store = {}
            }
            store[title] = null
        }
        else {
            delete store[title]
        }
        localStorage.setItem('shows', JSON.stringify(store))
    })
})
