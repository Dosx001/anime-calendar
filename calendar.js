$(function() {
    var send = '<div>';
    dates = testing();
    dates.forEach(async function(date) {
        send += '<div class="row">' + date + '</div>';
    })
    $("body").append(send);
})

function testing() {
    var dates = []
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    switch(date.getDay()) {
        case 0:
            day -= 14;
            break;
        case 1:
            day -= 13;
            break;
        case 2:
            day -= 12;
            break;
        case 3:
            day -= 11;
            break;
        case 4:
            day -= 10;
            break;
        case 5:
            day -= 9;
            break;
        case 6:
            day -= 7;
            break;
    }
    for (i = 0; i < 21; i++) {
        dates.push(new Date(year, month, day + i))
    }
    return dates
}

