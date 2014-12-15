(function ($) {

    var container;
    var shadow;
    var target;

    //    function getMousePosition(timeoutMilliSeconds) {
    //        // "one" attaches the handler to the event and removes it after it has executed once 
    //        $(document).one("mousemove", function (event) {
    //            window.mouseXPos = event.pageX;
    //            window.mouseYPos = event.pageY;
    //            // set a timeout so the handler will be attached again after a little while
    //            setTimeout(function () { getMousePosition(timeoutMilliSeconds) }, timeoutMilliSeconds);
    //        });
    //    }

    //    // start storing the mouse position every 100 milliseconds
    //    getMousePosition(100);

    $(function () {
        if (!container) {
            container = $('<div class="hover_info"></div>').hide().appendTo($('body'));
            shadow = $('<div class="hover_info"></div>').hide().appendTo($('body')); //.show();
        }
    });

    $.fn.showTips = function (info, data) {


        var content = $.trim(info);

        if (content.length == 0) {
            container.hide();
        } else {
            container.html(info);
            shadow.html(info);



            var h = shadow.height();
            var w = shadow.width() + 30;

            // container.height(h).width(w);

            var offset = {};


            if (data.mouse) {
                offset = { left: data.mouse.pageX, top: data.mouse.pageY };


            } else {
                offset = $(this).offset();
            }



            //  console.log('left+=' + ($(this).offset().left + offset.left));


            if ((offset.left + w) > $(document).width()) {
                offset.left = $(document).width() - w;
            }


            // console.log('doc.h =' + $(document).height());
            //  console.log('h=' + h);
            // console.log('top=' + offset.top);
            //  console.log('top+h=' + (offset.top + h));

            if ((offset.top + h + 30) > $(document).height()) {
                offset.top = offset.top - h - 10;
            } else {
                offset.top = offset.top + 23;
            }


            container.css({ 'top': offset.top, 'left': offset.left });


            if (data) {
                if (data.w) {
                    container.width(data.w);
                } else {
                    // container.css('width', '');
                    container.width(shadow.width()+2);
                }
            }
            target = data.target;
            container.show();

        }
    }

    $.fn.hideTips = function () {
        if (container) {
            container.hide();
            //container.fadeOut(10);
        }
    }


})(jQuery);