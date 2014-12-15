(function ($) {
    $.fn.print = function (options) {
        var opts = $.extend({}, $.fn.print.defaults, options);
        return this.each(function () {

            var $this = $(this);
            var settings = opts.getSettings($this);

            var box = $('#print_' + $this.attr('id'));
            if (box.size() == 0) {
                box = $('<div class="print_box" id="print_' + $this.attr('id') + '">' +
        '<div class="print_box_win">' +
            '<div class="print_box_machine">' +
                '打印机：' +
                '<select name="printMachine">' +
                '</select>' +
                '<br/>请选择打印份数：' +
                '<input id="rad_print_1" type="radio" name="print_Number" value="1" checked="checked">' +
                    '<label for="rad_print_1">1张</label> ' +
                '<input id="rad_print_2" type="radio" name="print_Number" value="2">' +
                    '<label for="rad_print_2">2张</label> ' +
                '<input id="rad_print_4" type="radio" name="print_Number" value="4">' +
                    '<label for="rad_print_4">4张</label> ' +
                '<input id="rad_print_0" type="radio" name="print_Number" value="0">' +
                    '<label for="rad_print_0">其他</label> ' +
                    '<input id="txtPrintCopies" type="text" style="width: 40px;display:none">' +
            '</div>' +
            '<div class="print_box_queue">' +
                '<ul>' +
                '</ul>' +
            '</div>' +
            '<div class="print_box_button">' +
                                '<input type="button" class="button_out" data-print="print" value="打 印" />&nbsp;&nbsp;' +
                                '<input type ="button" class="button_out" data-print="download" value="导 出" />&nbsp;&nbsp;' +
                                '<input type="button" class="button_out" data-print="close" value="关 闭" />' +
            '</div>' +
       '</div>' +
        '<div class="print_box_cont">&nbsp;</div>' +
    '</div>').appendTo($('body'));

                $('.button_out').hover(function () {
                    $(this).removeClass('button_out').addClass('button_over');
                }, function () {
                    $(this).removeClass('button_over').addClass('button_out');
                });
            }
            var win = box.find('.print_box_win');
            var machine = box.find('select[name="printMachine"]');
            var queue = box.find('.print_box_queue');
            var print = box.find('[data-print="print"]');
            var close = box.find('[data-print="close"]');
            var download = box.find('[data-print="download"]');
            var radio = box.find('input[type=radio]');
            var files = [];
            var downloadfiles = [];
            var printer = [];
            var copies = 0;
            var time;
            var i;
            var isError = false;
            $(window).resize(function () {
                resize($(this));
            });

            function resize() {
                win.css({ 'left': ($(window).width() - win.width()) / 2 + 'px', 'top': ($(window).height() - win.height()) / 2 - 20 + 'px' });
            }

            $this.click(function (e) {
                e.preventDefault();

                print.show();

                readyFile();

                if (!isError) {
                    bindPrinter();

                    box.show();
                    resize();
                }

            })

            print.click(function (e) {
                e.preventDefault();
                //打印
                var filesPath = '';
                var printerId = machine.val();
                for (var i = 0 ; i < files.length; i++) {
                    filesPath += files[i].path + ',';
                }
                if (!printerId) { alert('请选择打印机！'); return; }
                if (!filesPath) {
                    var errormessage = $this.data('errormessage');
                    if (errormessage == undefined || errormessage == "") {
                        alert('没有打印文件！'); return;
                    }
                    else {
                        alert(errormessage); return;
                    }
                }

                var copies = box.find('input[type=radio]:checked').val() == '0' ? box.find('input[type=text]').val() : box.find('input[type=radio]:checked').val();
                if (copies == null) {
                    alert('请选择打印份数！');
                    return;
                }


                $.ajax({
                    url: sparrow.settings.baseUrl + 'Printing.ashx?_' + Math.random(),
                    type: 'GET',
                    data: {
                        printerId: printerId,
                        files: filesPath,
                        copies: copies
                    },
                    success: function (data) {
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i]) {
                                    files[i].taskId = data[i];
                                    queue.find('li[data-name="' + files[i].name + '"] a').data('id', files[i].taskId);
                                }
                            }
                            printing();
                        }
                    }
                })
            })

            close.click(function (e) {
                e.preventDefault();
                clearInterval(time);
                downloadfiles.length = 0;
                box.hide();
            })


            download.click(function (e) {
                e.preventDefault();

                var filesPath = '';
                for (var i = 0 ; i < downloadfiles.length; i++) {
                    filesPath += downloadfiles[i].path + ',';
                }
                if (!filesPath) {
                    var errormessage = $this.data('errormessage');
                    if (errormessage == undefined || errormessage == "") {
                        alert('没有打印文件！'); return;
                    }
                    else {
                        alert(errormessage); return;
                    }
                }

                for (var i = 0 ; i < downloadfiles.length; i++) {
                    window.open(sparrow.settings.baseUrl + 'Download.ashx?file=' + downloadfiles[i].path, 'file' + Math.round(Math.random() * 1000));
                }
            })



            radio.click(function (e) {
                var val = $(this).val();
                //console.log(val);
                if (val == '0') {
                    box.find('input[type=text]').show();
                    copies = 1;
                } else {
                    box.find('input[type=text]').hide();
                    copies = val;
                }
            })

            //添加remove,进行控制是否隐藏取消打印功能,true的时候进行隐藏，false的时候不进行隐藏
            function printQueue(file, nextFile, message, remove) {
                if (remove) {
                    queue.find('ul li[data-name="' + file.name + '"]').find('span').text(message).next().hide();
                }
                else {
                    queue.find('ul li[data-name="' + file.name + '"]').find('span').text(message).next().show();
                }
                if (files.length == 0) {
                    print.hide();
                } else {
                    queue.find('ul li[data-name="' + nextFile.name + '"]').find('span').text('正在打印...').next().hide();
                }
                clearInterval(time);
            }

            // 生成文件 
            function readyFile() {
                var data = null;
                var isselect = $this.data('print-isselect') === true;
                if (isselect) {
                    var params = $this.data('ready-params');
                    if (params != null) {
                        data = params;
                    }
                    var isbatch = $this.data("batch-print") === true;
                    if (isbatch) {
                        if (!data || data.__SelectedItems.length == 0) {
                            alert('请选择一条记录！'); isError = true; return;
                        } else {
                            isError = false;
                        }
                    }
                    else {
                        if (!data) {
                            alert('请选择一条记录！'); isError = true; return;
                        } else {
                            isError = false;
                        }
                    }
                    if (settings.readyVerifyFun) {
                        var readyVerifyFun = window[settings.readyVerifyFun];
                        isError = readyVerifyFun();
                    }
                    //var bill = "";
                    //var isbill = $this.data("print-bill") === true;
                    //if (isbill) {
                    //    var billlength = $('#OrderInfo').find('tr[class="selected"]').length
                    //    if (billlength > 22) {
                    //        alert("委托单数量超过22条！");
                    //        isError = true;
                    //        return;
                    //    }
                    //    $('#OrderInfo').find('tr[class="selected"]').each(function () {
                    //        if (!bill) {
                    //            tr = $(this);
                    //            bill = $.trim(tr.find('td:eq(4)').text());
                    //        }
                    //        else {
                    //            var newtr = $(this);
                    //            if (bill != $.trim(newtr.find('td:eq(4)').text())) {
                    //                isError = true;
                    //                return;
                    //            }
                    //        }
                    //    });
                    //    if (isError == true) {
                    //        alert("请选择相同的委托单位！");
                    //    }
                    //}

                    //var ems = "";
                    //var isems = $this.data("print-ems") === true;
                    //if (isems) {
                    //    $('#OrderInfo').find('tr[class="selected"]').each(function () {
                    //        if (!bill) {
                    //            tr = $(this);
                    //            bill = $.trim(tr.find('td:eq(4)').text());
                    //        }
                    //        else {
                    //            var newtr = $(this);
                    //            if (bill != $.trim(newtr.find('td:eq(4)').text())) {
                    //                isError = true;
                    //                return;
                    //            }
                    //        }
                    //    });
                    //    if (isError == true) {
                    //        alert("请选择相同的委托单位！");
                    //    }
                    //}
                }

                $(this).ajaxPost({
                    method: 'ProduceFiles', params: data, callback: function (data) {
                        if (data) {
                            files = [];
                            for (var i = 0; i < data.length; i++) {
                                files.push(data[i]);
                                downloadfiles.push(data[i]);
                            }

                            var ul = queue.find('ul');
                            ul.empty();
                            $.each(files, function () {
                                var li = $('<li data-name="' + this.name + '">' + this.name + ' <span>准备就绪</span> <a>取消</a></li>').appendTo(ul);
                                li.find('a').click(function (e) {
                                    e.preventDefault();

                                    delPrintingTask($(this));
                                })
                            })

                            //默认直接打印
                            if (settings.autoprint) {
                                print.click();
                                //var state = true;
                                //$.ajaxSetup({
                                //    complete: function () {
                                //        if (state) {
                                //            state = false;
                                //        }
                                //    }
                                //})
                                //setTimeout(function () {
                                //    print.click();
                                //}, 1000)
                            }
                        }
                        else {
                            alert('生成文件失败！');
                        }
                    }
                });


            }

            // 获取打印机
            function bindPrinter() {
                $.ajax({
                    url: sparrow.settings.baseUrl + 'GetPrinters.ashx?_' + Math.random(),
                    type: 'GET',
                    success: function (data) {
                        if (data) {
                            if (data.length > 0) {
                                printer = [];
                                for (var i = 0; i < data.length; i++) {
                                    var printername = data[i].NickName;
                                    if (!printername) {
                                        printername = data[i].Name;
                                    }
                                    var status = TranslatePrinterStatus(data[i].Status);
                                    printer.push({
                                        name: '[' + data[i].ServiceName + ']' + printername + '(' + status.StatusMessage + ')',
                                        value: data[i].Id,
                                        isActive: status.IsActive
                                    });
                                }

                                machine.empty();
                                $.each(printer, function () {
                                    if (!this.isActive) {
                                        $('<option value="' + this.value + '"' + ' disabled="disabled"' + '">' + this.name + '</option>').appendTo(machine);
                                    }
                                    else {
                                        $('<option value="' + this.value + '">' + this.name + '</option>').appendTo(machine);
                                    }
                                })
                            }
                            else {
                                alert("未安装打印机，请到打印机管理界面进行安装，谢谢！");
                            }
                        }
                    }
                });
            }

            //打印等待
            function printing() {
                queue.find('li span').text('打印等待中...');
                queue.find('li span:first').text('正在打印...').next().hide();

                i = 1;
                time = setInterval(function () {
                    if (files.length > 0) {
                        var item = files[0];
                        var state;
                        printingStatus(item);
                    }
                }, 3000);
            }

            //获取打印状态
            function printingStatus(item) {
                $.ajax({
                    url: sparrow.settings.baseUrl + 'PrintingStatus.ashx?_' + Math.random(),
                    type: 'GET',
                    data: {
                        taskId: item.taskId
                    },
                    success: function (data) {
                        if (data) {
                            if (data.status == 'True') {
                                files.shift();
                                printQueue(item, files[0], '打印成功！', true);
                                if (settings.successCallback) {
                                    var successCallback = window[settings.successCallback];
                                    successCallback();
                                }
                            } else
                                if (data.status == 'False') {
                                    files.shift();
                                    printQueue(item, files[0], '打印失败！  ' + data.message, true);
                                } else {
                                    i++;
                                    if (i >= 20) {
                                        files.shift();
                                        printQueue(item, files[0], '打印超时！', false);
                                        i = 1;
                                    }
                                }
                        }
                    }
                });
            }

            //删除打印任务
            function delPrintingTask(a) {
                var taskId = a.data('id');
                if (taskId) {
                    $.ajax({
                        url: sparrow.settings.baseUrl + 'DeletePrintingTask.ashx?_' + Math.random(),
                        type: 'GET',
                        data: {
                            taskId: taskId
                        },
                        success: function (data) {
                            if (data) {
                                if (data.status == 'True') {
                                    removeFile(a.parent().data('name'));
                                    a.parent().remove();
                                }
                            }
                        }
                    });
                }
            }

            function removeFile(name) {
                var newFiles = [];
                for (var i = 0 ; i < files.length; i++) {
                    if (files[i].name == name)
                        files[i] == null;
                    else
                        newFiles.push(files[i]);
                }
                files = newFiles;
            }

        });
    }

    $.fn.print.defaults = {
        getSettings: function (el) {
            var settings = {
                autoprint: el.data('auto-print') === true,
                readyVerifyFun: el.data('ready-verifyfun'),
                successCallback: el.data('success-callback')
            };
            return settings;
        }
    };
})(jQuery);

$(function () {
    $('.print').print();
})

var TranslatePrinterStatus = function (status) {
    var PrinterStatus = {};
    switch (status) {
        case 0:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "准备就绪（Ready）";
            break;
        case 512:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "忙(Busy）";
            break;
        case 4194304:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "打印机门被打开（Printer Door Open）";
            break;
        case 2:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "错误(Printer Error）";
            break;
        case 32768:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "初始化(Initializing）";
            break;
        case 256:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "正在输入,输出（I/O Active）";
            break;
        case 32:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "手工送纸（Manual Feed）";
            break;
        case 262144:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "无墨粉（No Toner）";
            break;
        case 4096:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "不可用（Not Available）";
            break;
        case 128:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "脱机（Off Line）";
            break;
        case 2097152:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "内存溢出（Out of Memory）";
            break;
        case 2048:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "输出口已满（Output Bin Full）";
            break;
        case 524288:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "当前页无法打印（Page Punt）";
            break;
        case 8:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "塞纸（Paper Jam）";
            break;
        case 16:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "打印纸用完（Paper Out）";
            break;
        case 64:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "纸张问题（Pager Problem）";
            break;
        case 1:
            PrinterStatus.IsActive = false;
            PrinterStatus.StatusMessage = "暂停（Paused）";
            break;
        case 4:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "正在删除（Pending Deletion）";
            break;
        case 1024:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "正在打印（Printing）";
            break;
        case 16384:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "正在处理（Processing）";
            break;
        case 131072:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "墨粉不足（Toner Low）";
            break;
        case 1048576:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "需要用户干预（User Intervention）";
            break;
        case 536870912:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "等待（Waiting）";
            break;
        case 65536:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "热机中（Warming Up）";
            break;
        default:
            PrinterStatus.IsActive = true;
            PrinterStatus.StatusMessage = "未知状态（Unknown Status）";
            break;
    }
    return PrinterStatus;
}