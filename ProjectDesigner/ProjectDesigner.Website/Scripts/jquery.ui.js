/// <reference path='jquery-1.7.min.js' />



$(function () {
    $('.button_out').hover(function () {
        $(this).attr('class', 'button_over');
    }, function () {
        $(this).attr('class', 'button_out');
    });
    $('.button_out2').hover(function () {
        $(this).attr('class', 'button_over2');
    }, function () {
        $(this).attr('class', 'button_out2');
    });
    //dataRowStyle();
    $('.btnEdit').click(function () {
        var url = $(this).attr('URL');
        var Width = $(this).attr('EditWidth');
        var Height = $(this).attr('EditHeight');
        var IsEdit = $(this).attr('IsEdit');
        IsEdit = typeof (IsEdit) != 'undefined' ? IsEdit : '';
        var id = getDataID().split(',');
        if (IsEdit != '' && id.length != 2) {
            alert('请选择一条记录进行修改！');
            return false;
        }
        $('#iframeEdit').unbind().load(function () {
            $(window.frames['iframeEdit'].document).find('#btnClose').unbind().bind('click', function () {
                $('#formEdit').dialog('close');
            });
        })
        $('#iframeEdit').attr('src', url + '?_' + Math.random() + '&type=' + (IsEdit == '' ? 'add' : 'edit&id=' + id[0]));
        showEdit(IsEdit == '' ? '新增' : '编辑', Height, Width);
        return false;
    })
    $('.btnDelete').click(function () {
        var ids = getDataID();
        if (ids == '') {
            alert('请选择记录进行删除！')
            return false;
        }
        if (confirm('确认删除所选记录吗？')) {
            $('#ctl00_MainContent_hdnIds').val(ids);
            return true;
        }
        return false;
    })

    var isCtrl = false;
    $(document).keydown(function (e) {
        isCtrl = e.which == 17;
    }).keyup(function (e) {
        if (e.which == 17) {
            isCtrl = false;
        }
    });
    function dataRowStyle() {
        $('.gridview tbody tr').not('.gridview tbody tr.notdata').unbind().hover(function () {
            $(this).find('td').addClass('hover');
        }, function () {
            $(this).find('td').removeClass('hover');
        })
        .click(function () {
            if (isCtrl === true) {
                $(this).toggleClass('selected');
            } else {
                if ($(this).is('.selected')) {
                    $(this).removeClass('selected');
                } else {
                    $('.gridview tbody tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            }
        });
    }
    function showEdit(title, height, width) {
        $('#formEdit').dialog({
            modal: true,
            position: 'top',
            height: height,
            title: title,
            width: width,
            closeText: '关闭',
            close: function (ev, ui) {
                UpdateRow(title);
            }
        });
    }
    function getDataID() {
        var ids = '';
        $('.gridview tbody tr.selected').each(function () {
            var dataid = $(this).attr('data-itemid');
            if (typeof (dataid) != 'undefined')
                ids += dataid + ',';
        });
        return ids;
    }
    function UpdateRow(title) {
        var id = $(window.frames['iframeEdit'].document).find('#ctl00_MainContent_hdnID').val();
        if (id != '') {
            var html = '';
            $('.gridview thead th').each(function () {
                var title = '';
                if ($($.trim($(this).html())).is('a'))
                    title = $($.trim($(this).html())).html();
                else
                    title = $.trim($(this).html());
                html += getDataRow(title, getEditCol(title, id));
            })
            if (title == '新增') {
                html = '<tr data-itemid="' + id + '" >' + html + '</tr>';
                $('.gridview tr').eq(1).before(html);
                dataRowStyle();
                var total = $('.last-child').find('span:first').html().split(':')[1];
                $('.last-child').find('span:first').html('总记录数: ' + (Number($.trim(total)) + 1));
                if ($('.notdata').length > 0)
                    $('.notdata').remove();
            }
            else {
                var datatr = getDataEditRow(id);
                if (datatr != null)
                    datatr.html(html);
            }
            $('.gridview tbody tr').each(function (index, item) {
                $(item).find('th:eq(0)').html(index + 1);
            });
        }
    }
    function getDataRow(title, value) {
        if ($.trim(title) == '序号')
            return '<th class="word-2 first-child"> ' + value + ' </th>';
        else
            return '<td> ' + value + ' </td>';
    }
    function getEditCol(title, id) {
        var val = '';
        $(window.frames['iframeEdit'].document).find('th').each(function () {
            if ($.trim($(this).html()) == $.trim(title)) {
                var e = $.trim($(this).next().html());
                if ($(e).is('select'))
                    val = $(e).find('option:selected').text();
                else
                    if ($(e).is('table'))
                        val = $(e).find('input:checked').next().html();
                    else
                        val = $(e).val();
            }
        })
        return val;
    }
    function getDataEditRow(id) {
        var datatr = null;
        $('.gridview tbody tr').each(function () {
            var dataid = $(this).attr('data-itemid');
            if (typeof (dataid) != 'undefined') {
                if (dataid == id) {
                    datatr = $(this);
                    return false;
                }
            }
        })
        return datatr;
    }
})

function closeDialog() {
    $('#formEdit').dialog('close'); 
}

function closeEdit() { 
    window.parent.closeDialog();
}