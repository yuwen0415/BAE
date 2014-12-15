$(function () {
    divsize();

    $(document).resize(function () {
        $(window).trigger('resize');
    });
    $(window).resize(function () {
        divsize();
    })

    $('.tab-link[href="Index.aspx"]').trigger('click');

     
    $('#col2').click(function () {
        var c1 = $('#col1');
        var c3 = $('#col3');
        if (c1.is(':hidden')) {
            c3.width(c3.width() - c1.width()).css('left', '215px');
            c1.show();
            $(this).find('img').attr('src', 'images/LeftMenu/left_switch_on.gif');
        } else {
            c3.width(c3.width() + c1.width()).css('left', '10px');
            c1.hide();
            $(this).find('img').attr('src', 'images/LeftMenu/left_switch_off.gif');
        }
        $(window).trigger('resize');
    })
})
function divsize() {
    var bodyh = $(window).height();
    var bodyw = $(window).width(); 
    var divw = bodyw - ($('#col1').is(':hidden') ? 0 : $('#col1').width()) - $('#col2').width() - 4;
    var divh = bodyh - 100;
    $('.divMain').height(divh).width(divw);
    $('#main>div').height(divh);
    $('.tabs_content').height(divh - 31);
}
window.showTab = function (id, name, data) {

    $('.tabs').tabs().showTab(id, name, data);

}
window.hideTab = function (id) {
    $('.tabs').tabs().hideTab(id);
}
window.hideCurentTab = function () {

    var selected = $('.tabs_items li.selected');
    if (selected.size() == 1) {
        $('.tabs').tabs().hideTab(selected.attr('data-tab-id'));
    }
} 