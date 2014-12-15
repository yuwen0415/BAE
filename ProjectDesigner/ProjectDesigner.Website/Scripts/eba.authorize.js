$(function () {
    var actionIds = [];
    $('[data-role="action"]').each(function () {
        $(this).hide();
    });

    if ($('[data-role="action"]').size() > 0) {
        var baseUrl = (typeof (eba) != 'undefined' && eba.settings != 'undefined' && eba.setting.baseUrl != 'undefined') ? eba.setting.baseUrl : '/';

        $.ajax(baseUrl + 'eba.authorize.ashx', {
            type: 'get',
            dataType: 'json',
            cache:false
        }).success(function (data) {
            var i = 0;
            if (typeof (data) != 'undefined' && data != null) {
                for (i = 0; i < data.length; i++) {
                    $('[data-action-id="' + data[i] + '"]').show();
                }
            }
        });
    }
});