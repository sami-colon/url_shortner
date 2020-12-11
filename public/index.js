function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}
function handleClick() {
    const box = $('#results');
    const longUrl = $('#fullUrl').val().trim();
    if (!validURL(longUrl)) {
        box.val('Enter valid url\n' + box.val());
        return
    }
    box.val('Generating short url please wait............\n' + box.val());
    $.post('/url', {fullUrl: longUrl })
        .done(data => {
            console.log(data);
            if (data.data) {
                box.val(`${data.msg} ${window.location.origin}/${data.data.shortUrl.toString()}\n` + box.val());
            } else {
                box.val(`${data.msg}\n` + box.val());
            }
        })
        .catch(err => {
            console.log(err);
            box.val(`${err.toString()}\n` + box.val());
        });
}
document.getElementById('btn1').addEventListener('click', handleClick);
