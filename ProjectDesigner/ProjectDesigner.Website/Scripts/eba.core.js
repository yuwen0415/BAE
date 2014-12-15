(function($) {

	var eba, models, domEvents,settings,utils;
	/**
	 *	@summary:
	 *		[global name space, function shortcut]
	 *	@param  {[type]} 
	 *	@param  {[type]} 
	 *	@return {[type]} 
	 */
	eba = window.eba = {

		watch: function(val) {
			return eba.glue.watch(val);
		},

		notify: function(property, callbck, context) {
			return eba.glue.notify(property, callbck, context);
		},

		bind: function(view, model, ui, alias) {
			return eba.glue.bind(view, model, ui, alias);
		},

		onWindowResize: function(fn) {
			eba.domEvents.windowResize(fn);
		},

		onDomReady: function(fn) {
			eba.domEvents.domReady(fn);
		},

		onDomLoad: function(fn) {
			eba.domEvents.domLoad(fn);
		},

		addModel: function (model, ui, alias) {
		    return eba.models.addModel(model, ui, alias);
		},

		getModel: function(ui, alias) {
		    return eba.models.getModel(ui, alias);
		},

		getModels: function (ui) {
		    return eba.models.getModels(ui);
		},

		removeModel: function(ui, alias) {
			// todo
		},

		removeAllModel: function() {
			// todo
		},

		getSetting:function( name ){
			if( !name ){ return ''; }
			return settings[name];
		},

		setSetting:function( name,val ){
			if( !name || !val ){ return; }
			return settings[name] = val;
		},

		openWindow : function( conf ){ 
			return eba.utils.openWindow( conf ); 
		},

		getRemoteImgSize: function(src, callbck) {

			if( !_.isString(src) ){
				return;
			}

			var img = new Image;
			img.onload = function() {
				var imgWidth = this.width;
				var imgHeight = this.height;

				if( _.isFunction(callbck) ){
					callbck( imgWidth,imgHeight );
				}
				
			};

		}
	};

	/**
	 *	@summary:
	 *		[glue water,you know, knockout.js]
	 *	@param  {[type]}
	 *	@param  {[type]}
	 *	@return {[type]}
	 */
	glue = eba.glue = {

		watch: function(val) {

			var observable;

			if (_.isFunction(val)) {
				observable = ko.computed(val);
			} else if (_.isArray(val)) {
				observable = ko.observableArray(val);
			} else {
				observable = ko.observable(val);
			}

			observable.ebaInited = true;
			return observable;

		},

		notify: function(property, callbck, context) {

			if (!callbck || !property) {
				return;
			}

			if (!property.ebaInited) {
				property = this.watch(undefined);
			}

			property.subscribe(function(last, origin) {
				callbck(last, origin, context);
			});

		},

		bind: function(view, model, ui, alias) {

			if (!view || !model) {
				return;
			}

			models.set(model, ui, alias);

			ko.applyBindings(model, view);

		}
	};

	models = eba.models = {

	    _collection: {},// {[type]} { ui_name : models [,...] }
	    _components: {},// {[type]} { ui_name : [ { alias,model } ] [,...] }

		addModel: function (model, ui, alias) {

			if (!this._components[ui]) {
				this._components[ui] = [];
			}

			this._components[ui].push({
				'alias': $.trim(alias),
				'model': model
			});

		},

		getModel: function (ui, alias) {

			if (!ui || ui == '') {
				return null;
			}

			var models = this._components[ui];

			if (!models || models.length <= 0) {
				return null;
			}

			if ($.trim(alias).length <= 0) {

				return models[0].model;

			} else {

				var toRet = null;
				for (var i = 0, l = models.length; i < l; i++) {
					var item = models[i];
					if (item.alias == alias) {
						toRet = item.model;
						break;
					}
				};

				return toRet;
			}

		},

		removeModel: function (ui, alias) {

		},

		getModels: function (ui) {
		    if (!_.isString(ui) || ui === '') {
		        return [];
		    }

		    var models = this._collection[ui];

		    if (models && models.length > 0) {
		        return models;
		    }

		    models = this._collection[ui] = [];
		    var coms = this._components[ui];
		    _.each(coms,function (item, index, list) {
		        models.push(item.model);
		    });

		    return models;
		},

		removeModels: function (ui) {

		    if (!_.isString(ui) || ui === '') {
		        return;
		    }
		    return this._components[ui] = [];

		}
	};

	domEvents = eba.domEvents = {

		_events: {
			'windowResize': [],
			'domReady': [],
			'domLoad': []
		},

		on: function(event, fn) {
			if (!_.isFunction(fn)) {
				return;
			}
			var handlers = this._events[event];
			if (!handlers) {
				this._events[event] = [];
			}

			handlers.push(fn);
		},

		off: function(event) {
			if (_.isString(event) && this._events[event]) {
				this._events[event] = [];
			}
		},

		trigger: function(event) {

			if (!event || !_.isString(event)) {
				return;
			}

			var handlers = this._events[event];

			if (!handlers) {
				return;
			}

			_.each(handlers, function(fn, index, list) {
				fn();
			});

		},

		windowResize: function(fn) {
			this.on('windowResize', fn);
		},

		domReady: function(fn) {
			this.on('domReady', fn);
		},

		domLoad: function(fn) {
			this.on('domLoad', fn);
		}

	};

	settings = eba.settings = { };

	utils = eba.utils = {

		getRandomNumber:function( range ){
			return Math.floor(Math.random() * range);
		},

		getRandomChar: function() {
			var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
			return chars.substr(this.getRandomNumber(62), 1);
		},

		getRandomID: function( size ) {

			var len = size ? size : 10;

			var str = "eba";
			for (var i = 0; i < len; i++) {
				str += this.getRandomChar();
			}

			return str;

		},

		openWindow:function( conf ){
			
			if( !conf ){ return; }

			var target = conf['target'] || '',
				url = conf['url'];

			var specs = [
				'height=' + conf.height,
				'width=' + conf.width,
				'top=' + conf.top,
				'left=' + conf.left,
				'toolbar=no', 
				'menubar=no', 
				'scrollbars=yes', 
				'resizable=yes', 
				'location=no', 
				'status=no'
			].join(',');

			return window.open(url, target ? target : '_blank', specs);
		}

	};

	$(function() {

		domEvents.trigger('domReady');

	});

	$(window).on('load', function() {

		domEvents.trigger('domLoad');

	});

	$(window).on('resize', function() {

		domEvents.trigger('windowResize');

	});

})(jQuery);