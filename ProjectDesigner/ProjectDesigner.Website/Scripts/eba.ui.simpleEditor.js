;;
(function($) {

	CKEDITOR.disableAutoInline = true;

	/**
	 *	@summary:
	 *		[p,div,h1,h2,h3] supports inline editor
	 *		[textarea] supports framed editor,you can use ckeditor's appendTo or replace mode
	 *	@dependencies:
	 *		ckeditor : http://ckeditor.com/
	 *				   http://docs.ckeditor.com/#!/api/CKEDITOR.event
	 *	@param  {[string]} name
	 *	@param  {[string]} [data-ui-alias] alias,default value is name
	 *	@param  {[string]} [data-ui-mode] none inline replace appendto, and default value is replace. for more details you can read this api doc : http://docs.ckeditor.com/#!/api/CKEDITOR
	 *	@param  {[boolean]} [data-ui-multiline] indicated multiple line or sinle line, default value is single line
	 *	@return {[type]}
	 */
	var simple = {
		language: 'zh-cn',
		toolbar: [
			['Bold', 'Italic', 'Underline', 'RemoveFormat']
		],
		resize_enabled: false,
		removePlugins: 'elementspath',
		autoParagraph: false,
		enterMode: CKEDITOR.ENTER_BR,
		shiftEnterMode: CKEDITOR.ENTER_P,
		removePlugins: 'magicline'
	};

	var shift_enter = 2228237;

	var stripHtml = function (html) {

		var div = document.createElement("DIV");
		div.innerHTML = html;
		var text = div.textContent || div.innerText;

		div = null;
		return text;
	};

	$.fn.simpleEditor = function() {

		this.each(function(index, el) {

			var $this = $(el),
				dom = $this.get(0),
				tagname = dom.tagName.toLowerCase(),
				name = $this.attr('name'),
				uiAlias = $this.attr('data-ui-alias') || name,
				mode = $.trim($this.attr('data-ui-mode')) || 'inline',
				multiline = $.trim($this.attr('data-ui-multiline')) === 'true' ? true : false; // default is single line

			if (tagname === 'textarea') {
				multiline = true;
				mode = 'replace';
			}

			$this.after('<input type="hidden" name="text_[name]" value="" />'.replace('[name]', name));
			$this.after('<input type="hidden" name="formated_[name]" value="" />'.replace('[name]', name));

			var editor = null;

			switch (mode) {
				case "inline":
					editor = CKEDITOR.inline(dom, simple);
					break;
			    case "replace":
			        editor = CKEDITOR.replace(dom, simple);
					break;
			}

			if (!multiline) {

				editor.on('key', function(evt) {
					/**
					 *	@summary:
					 *		[disable the shift+enter key]
					 *	@param  {[type]}
					 *	@return {[type]}
					 */
					if (evt.data.keyCode == shift_enter) {
						evt.cancel();
						evt.stop();
					}
				});

			}

			/**
			 *	@summary:
			 *		[save value to hidden inputs]
			 *	@param  {[type]}
			 *	@param  {[type]}
			 *	@return {[type]}
			 */
			editor.on('change', function(evt) {

				var formated = editor.getData(),
					text = '';

				text = stripHtml(formated);

				var txtSelector = 'input[name="text_' + name + '"]';
				var formatedSelector = 'input[name="formated_' + name + '"]'

				$(txtSelector).val(text);
				$(formatedSelector).val(formated);

			});

			var formated = editor.getData();
			var txtSelector = 'input[name="text_' + name + '"]';
			var formatedSelector = 'input[name="formated_' + name + '"]';

			$(txtSelector).val(stripHtml(formated));
			$(formatedSelector).val(formated);

			var model = {
			    'addClass': function (className) {

			        var dom = editor.element; 
			        if (dom && !dom.hasClass(className)) {
			            dom.addClass(className);
			        }

			    },
			    'removeClass': function (className) {

			        var dom = editor.element;
			        if (dom && dom.hasClass(className)) {
			            dom.removeClass(className);
			        }

			    },
			    'insertHtml': function (html) {
			        editor.insertHtml(html);
			    },
			    'insertElement': function (element) {
			        editor.insertElement(element);
			    },
			    'insertText': function (text) {
			        editor.insertText(text);
			    },
			    'focus': function () {
			        editor.focus();
			    },
			    'onFocus': function (fn) {
			        editor.on('focus', fn);
			    },
			    'onBlur': function (fn) {
			        editor.on('blur', fn);
			    },
			    'destroy': function () {
			        editor.destroy();
			    }
			};

			eba.addModel(model, 'simpleEditor', uiAlias);

		});

	}

	eba.onDomReady(function () {
	    $('[data-ui="simpleEditor"]').simpleEditor();
	});

})(jQuery);