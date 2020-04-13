$(document).ready(function(){
    var showHeaderAt = 150;
    var win = $(window),
            body = $('body');
    if(win.width() > 600){
        win.on('scroll', function(e){
            if(win.scrollTop() > showHeaderAt) {
                body.addClass('fixed');
            }
            else {
                body.removeClass('fixed');
            }
        });
    }
});