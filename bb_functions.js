//************************************************************************** Backbone Events **************************************************************************//

/// a good test setup in firebug, to see what is the data structure look like in Backbone.Events.
var a = {};
var b = {};
var c = {};

_.extend(a, Backbone.Events);
_.extend(b, Backbone.Events);
_.extend(c, Backbone.Events);

a.on('event-a-1', function(){
  console.log('this is event-a-1');
});

a.on('event-a-2', function(){
  console.log('this is event-a-2');
});

b.on('event-b-1', function(){
	console.log('this is event-b-1');
});

b.listenTo(a, 'event-a-1', function(){
  console.log('this is event-a-1 trigging b\'s listening');
});

c.listenTo(a, 'event-a-2', function(){
  console.log('this is event-a-2 trigging c\'s listening');
});

c.listenTo(b, 'event-b-1', function(){
	console.log('this is event-b-1 trigging c\'s listening');
});


/// related global variables

//splitter for multiple 'splitter-separated' events
var eventSplitter = /\s+/;

//alias for Events.on and Events.off
Events.bind = Events.on;
Events.unbind = Events.off;

/// Internal Functions

//if an object extended Backbone.Events, it should contains the following data structure
eventObj = {
	_listenId: _.unique('l'),
	_listeners: {
		//
		listeningObjId: {
			obj: listenedObj,
			objId: listenedObjId,
			id: thisId,
			listeningTo: thisListeningTo, //
			count: 123,
		},

	},
	_listeningTo: {
		//
		listenedObjId: {
			obj: listenedObj,
			objId: listenedObjId,
			id: thisId,
			listeningTo: thisListeningTo, //
			count: 123,
		}

	},
	_events: {
		//
		eventName: [{
			callback: callbackFunction,
			context: this,
			ctx: ctx,
			listening: {
				obj: listenedObj,
				objId: listenedObjId,
				id: thisId,
				listeningTo: thisListeningTo, //
				count: 123,
			}
		}]

	}
};


/**
 * This is the function standarize every events related call.
 * It breaks different inputs into standard inputs. That is iteratee('name', callback(){}, context).
 * Therefore, every event related api needs to consult with this function to register or deregister the events.
 */
var eventsApi = function(iteratee, events, name, callback, opts){
	/**
	 * 1). if name is an object, which means it is in the format of
	 * 		{
	 * 			event1: event1-callback,
	 * 			event2: event2-callback,
	 * 			....
	 * 		}
	 * 		
	 * 	   it will first break the object into single token, as event and event-callback, and then register the event by calling itself.
	 *
	 * 2).	if the name is a string that contains the event splitter inside, which means it is in the format of
	 *
	 * 		"event1 event2 event3 ...", callback
	 *
	 * 		it will looping through all the events, and register them by calling it self by passing callback for the splitted events.
	 *
	 * 3).	if the name is in standard format, which means it is a string does not contain eventSplitter
	 *
	 * 		it will call the iteratee to register/deregister events, depends on the iteratee passed in.
	 * 			
	 */
	
	return events;
};

//--------------------------------------------------------- Register and listenTo events functions ---------------------------------------------------------//

/**
 * This is the function to call if an object tries to register an event or register an listening event on another object.
 */
var onApi = function(events, name, callback, options){
	if(callback){
		// check whether events object has corresponding key, if not create one as an array
		var handlers = events[name] || (events[name] = []); 
		// get contexts and listening from options
		var context = options.context,
			ctx = options.ctx,
			listening = options.listening;
		// if has listeing, need to add listening count
		if(listening) listening.count++;
		//push the new callback to the events[name] array
		handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
	}

	//returns the modified events object
	return events;
};

/**
 * This is internal version of Events.on function, in order to protect 'listening' argument from the public API(Event.on)
 */
var internalOn = function(obj, name, callback, context, listening){
	/**
	 * In order to understand this function, you need to checkout onApi
	 * This function guards the 'listening' argument from the public API.
	 */
	
	//inject events into obj._events
	obj._events = eventsApi(onApi/*iteratee*/, obj._events || {}/*events*/, name/*name*/, callback/*callback*/, {
		context: context,
		ctx: obj,
		listening: listening
	}/*options*/);

	//register listening event on the 'obj' object
	if(listening){
		var listeners = obj._listeners || (obj._listeners = {}); //check whether obj has _listeners, if not initialize on as an object
		listeners[listening.id] = listening;
	}
	//return modified object
	return obj;
};

/**
 * Binds an event to a callback function. Events will be stored in this._events[name]
 *
 * This function uses internalOn and onApi to register an event and its callback function on *this* object.
 */
Events.on = function(name, callback, context){
	return internalOn(this/*obj*/, name/*name*/, callback/*callback*/, context/*context*//*no listening argument*/);
};

/**
 * Similar as Events.on, this function register a listening event on *this* object to listen to the events on 'obj' object.
 * It gives unique id to both *this* object and 'obj' object to keep tracking the listening events.
 * Bottom line, it uses context and ctx to achieve that when 'obj' event triggered. the callback function will be triggered with *this* as context.
 */

Events.listenTo = function(obj, name, callback){
	//if no object passed in, just return
	if(!obj) return;
	//give a unique listen id to the object, if it does not have one
	var id = obj._listenId || (obj._listenId = _.unique('l'));
	//create listenTo in *this*
	var listeningTo = this._listeningTo || (this.listeningTo = {});
	// assign listening as the particular element
	var listening = listeningTo[id];

	//if this object is listening to any other events on 'obj' yet. setup necessary tracking
	if(!listening){
		//give *this* object an unique id
		var thisId = this._listenId || (this._listenId = _.unique('l'));
		//setup references
		listening = listeningTo[id] = {obj: obj/*stored a real reference to obj*/, objId: id, id: this.Id, listeningTo: listeningTo, count: 0 /*this count will be added later in the internalOn calls*/};
	}

	// bind callbacks on obj, and keep track of them on listening
	internalOn(obj/*obj*/, name/*name*/, callback/*callback*/, this/*context*/, listening/*listening*/);
	//return updated *this* object
	return this;
};

//--------------------------------------------------------- De-register and listenTo events functions ---------------------------------------------------------//

/**
 *	Reducing API that removes a callback from the 'events' object.
 *
 * 	This result and implementation of this function is similar to onApi
 */
var offApi = function(events, name, callback, options){
	//if there is no events just return
	if(!events) return;

	var i = 0,
		listening;
	var context = options.context,
		listeners = options.listeners;

	//if there is no name, no callback, and no context provided
	//delete all events listeners and remove all events, even those events used by Backbone framework itself.
	if(!name && !callback && !context){
		//get all the listeners that listen to *this* object
		var ids = _.keys(listeners);
		//loop throu
		for(; i < ids.length; i++){
			//get corresponding listener
			listening = listeners[ids[i]];
			//remove listener from object
			delete listeners[listening.id];
			//remove listenTo events from listening object
			delete listening.listeningTo[listening.objId]; //I think this line here is not necessarily. It does not achieve anything. Same thing has been deleted by the previous line.
		}
	}

	//check whether name is provided, if not remove all bounded callbacks
	var names = name ? [name] : _.keys(events);
	for(; i < names.length; i++){
		name = names[i];
		//get event with the name
		var handlers = events[name];

		//bail out if there are no events stored
		if(!handlers) break;

		//replace events if there are any remaining. Otherwise, cleanup
		var remaining = [];
		for(var j = 0; j < handlers.length; j++){
			var handler = handlers[j];
			if(
				callback && callback !== handler.callback && //handler's callback does not equal to the desired callback
				callback !== handler.callback._callback || //
				context && context !== handler.context //handler's context does not equal to desired context
			){
				remaining.push(handler);//keep the handler
			}else{
				//remove all the listening events and all the listeners
				
				listening = handler.listening;//Caveat: this is deleting the listeningTo in the elements of this._events array.
				
				if(listening && --listening === 0){
					delete listeners[listening.id];
                    delete listening.listeningTo[listening.objId];
				}
			}
		}

		//Update tail event if the list has any events. Otherwise, clean up.
		if(remaining.length){
			events[name] = remaining;//keep the remaining events
		}else{
			delete events[name]; //delete
		}
	}

	//return updated events
	return events;
};

/**
 * Pulic API for removing one or many callbacks. NOTE: it removes callbacks!
 *
 * 1). if 'context' is null, removes all callbacks with that function,
 * 2). if 'callback' is null, removes all callback for the events.
 * 3). if 'name' is null, removes all bound callbacks for all events.
 */
Events.off = function(name, callback, context){
	//if no registered events, just return.
	if(!this._events) return this;
	//call eventsApi and uses offApi as iteratee to remove callbacks
	this._events = eventsApi(offApi/*iteratee*/, this._events/*events*/, name/*name*/, callback/*callback*/, {
		context: context,
		listeners: this._listeners//objects that are listening to *this* object
	}/*options*/);
	//return updated *this* object
	return this;
};

/**
 * Public API for telling *this* object stop listeing to either specific events OR
 * to every object it is currently listening to.
 */
Events.stopListening = function(obj, name, callback){
	var listeningTo = this._listeningTo;
	//if not listening to any events, just return
	if(!listeningTo) return this;

	//check whether 'obj' is provided, if yes remove listening event to 'obj', else remove all listening events
	var ids = obj ? [obj._listenId] : _.keys(listeningTo);

	for(var i = 0; i < ids.length; i++){
		var listening = listeningTo[ids[i]];

		//If no listening, *this* object is not currently listening to 'obj' object. Break;
		if(!listening) break;

		//call listening.obj.off to achieve the removing goal
		listening.obj.off(name, callback, this);
	}
};

//--------------------------------------------------------- Once and ListenToOnce events and callbacks ---------------------------------------------------------//

/**
 * Internal API for reducing the event callbacks into a map of '{event: onceWrapper}'.
 * 'offer' unbinds the 'oncewrapper' after it has been called
 */
var onceMap = function(map, name, callback, offer){
	//if callback is provided
	if(callback){
		var once = map[name] = _.once(function(){
			//unbind this from 'name' event and 'once' callback
			offer/*this.off*/(name/*name*/, once/*callback*/);
			//apply callback function to this, with given arguments
			callback.apply(this, argument);
		});
		//
		once._callback = callback;
	}
	//return updated map
	return map;
};

Events.once = function(name, callback, context){

	var events = eventsApi(onceMap/*iteratee*/, {}/*events, map to onceMap*/, name/*name*/, callback/*callback*/, _.bind(this.off, this)/*opts, offer to onceMap*/);

	//if no context, no callbacks
	if (typeof name === 'string' && context == null) callback = void 0;
    
    //return this with updated events
    return this.on(events, callback, context);
};

Events.listenToOnce = function(obj, name, callback){
	// Map the event into a `{event: once}` object. Similar to Event.once
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    //return this with updatede listenTo
    return this.listenTo(obj, events);
};

//--------------------------------------------------------- Trigger related functions ---------------------------------------------------------//

/**
 * internal API for triggering event's callback function
 */
var triggerApi = function(objEvents, name, callback, args){
	if(objEvents){
		//get events handlers
		var events = objEvents[name];
		var allEvents = objEvents.all;
		//if events and allEvents both exist, make a clone of allEvents to protect the original copy
		if(events && allEvents) allEvents = allEvents.slice();
		//if event exists, call trigger API to trigger callback, and pass down arguments
		if(events) triggerEvents(events, args);
		//if all event exits, call trigger API to trigger callback, and pass down arguments together with name
		if(allEvents) triggerEvents(allEvents, [name].concat(args));
	}
};

/**
 * Internal dispatch function for triggering events.
 * Switch for different cases for optimizing execution speed.
 */
var triggerEvents = function(events, args){
	//since most internal backbone events has three arguments, make variables take first three argument
	var ev, i = -1,
		l = events.length,
		a1 = args[0],
		a2 = args[1],
		a3 = args[2];

	//switch on argument length
	switch (args.length) {
        case 0:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx);
            return;
        case 1:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
            return;
        case 2:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
            return;
        case 3:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            return;
        default:
            while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
            return;
    }
};

/**
 * Public API for triggering events and corresponding callbacks
 */
Events.trigger = function(name){
	//if there is no registered events in the object, then just return
	if(!this._events) return this;

	//make a copy of arguments to pass down, except 'name'
	var length = Math.max(0, arguments.length - 1);
	var args = Array(length);
	for(var i = 0; i < length; i++) args[i] = arguments[i + 1];

	eventsApi(triggerApi/*iteratee*/, this._events/*events(objEvents)*/, name/*name(name)*/, void 0/*callback(callback)*/, args/*opts(args)*/);
	//return this object, for channing?
	return this;
};

//extend backbone with definded events
_.extend(Backbone, Events);

//************************************************************************** Backbone View **************************************************************************//
//
var View = Backbone.View = function(options){
	//cid for view
	this.cid = _.unique('view');
	//preinitialize
	this.preinitialize.apply(this. arguments);
	//pickup the view options and extend the option
	_.extend(this, _.pick(options, viewOptions));
	//ensure view has a DOM element to render into
	this._ensureElement();
	//initialize
	this.initialize.apply(this, arguments);
};


// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// List of view options to be set as properties.
var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

//set up all inheritable **Backbone.View** properties and methdos
_.extend(View.prototype, Events, {
	//default tagname of view. default is a 'div'
	tagName: 'div',

	// jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
        return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the View
    preinitialize: function() {},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    //!! this is the important part. render() function should be able to attach the logical chunk of UI to DOM
    //!
    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
        return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
        this._removeElement();
        //*this* has stopListening event is because *this* contains Backbone.Events
        this.stopListening();
        return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
        this.$el.remove();
    },

    //! the two functions below bascially allows user to move the view to be attached to another DOM element
    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
        this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
        this.el = this.$el[0];
    },
    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
        events || (events = _.result(this, 'events'));
        if (!events) return this;
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[method];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
    	//.delegateEvents is for internal reference. it does not have technical meaning
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
        if (this.$el) this.$el.off('.delegateEvents' + this.cid);
        return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
        if (!this.el) {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.id) attrs.id = _.result(this, 'id');
            if (this.className) attrs['class'] = _.result(this, 'className');
            this.setElement(this._createElement(_.result(this, 'tagName')));
            this._setAttributes(attrs);
        } else {
        	//this is why you can assign a DOM element directly use el in the Backbone View definition and still works
            this.setElement(_.result(this, 'el'));
        }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
        this.$el.attr(attributes);
    }
});

//************************************************************************** Backbone Router and History **************************************************************************//

////////////////////////// Backbone.Router //////////////////////////

//constructor function for Backbone.Router
var router = Backbone.Router = function(options){
	options || (options = {});
	//pre-initialize
	this.preinitialize.apply(this, arguments);
	//When creating a new router, you may pass its routes hash directly as an option.
	if(options.routes) this.routes = options.routes;
	//bind all defiend routes to Backbone 'History'
	this._bindRoutes();
	//initialize
	this.initialize.apply(this, arguments);
};

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

//set up all inhertiable 'Backbone.Router' properties and methods.
//it takes proerties from Backbone.Events
_.extend(Router.prototype, Events, {

	//placeholder for overridding. runs before any instantiation logic is run in the router.
	preinitialize: function(){

	},

	//placeholder for overridding. initialization logic.
	initialize: function(){

	},

	// Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback){
    	//check if route is a Regular Expression, if not transfore
    	if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    	//check if a name has been provided, if not second argument is callback
    	if(_.isFunction(name)) {
    		callback = name;
    		name = '';
    	}
    	//if no callback is provided, then it will look for the function 'this[name]'
    	if(!callback) callback = this[name];
    	var router = this;
    	//definition for Backbone.history.route
    	//	route: function(route, callback) {
        //    	this.handlers.unshift({ route: route, callback: callback });
        //	},
    	Backbone.history.route(route, function(fragment){
    		//extract URL pieces
    		var args = router._extractParameters(route, fragment);

    		//if executing router handler does not return false, continue
    		if(route.execute(callback, args, name) !== false){
    			//trigger routing event ??what is the difference??
    			//--------------TODO: understand why trigger three events
    			router.trigger.apply(router, ['router:' + name].concats(args));
    			//trigger routing event
    			router.trigger('route', name, args);
    			//
    			Backbone.history.trigger('route', router, name, args);
    		}
    		return this;
    	});
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
        if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
        Backbone.history.navigate(fragment, options);
        return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
    	//if there are no routes in *this* object, just return
        if (!this.routes) return;
        //if routes is a function, execute it, and then return the valie
        this.routes = _.result(this, 'routes');
        //routes is all the routes names
        var route, 
        	routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
        	//
            this.route(route, this.routes[route]/*callback function, not name*/);
        }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
        route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },
    
    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
        var params = route.exec(fragment).slice(1);
        return _.map(params, function(param, i) {
            // Don't decode the search params.
            if (i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    }
});

////////////////////////// Backbone.History //////////////////////////

//define Backbone.History object
var History = Backbone.History = function(){
	this.handlers = [];
    this.checkUrl = _.bind(this.checkUrl, this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
    }
};

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^[#\/]|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for stripping urls of hash.
var pathStripper = /#.*$/;

// Has the history handling already been started?
History.started = false;

// Set up all inheritable **Backbone.History** properties and methods
_.extend(History.prototype, Events, {

	//default interval to poll for hash changes
	interval: 50,

	//check whether at app root
	atRoot: function(){
		var path = this.location.pathname.replace(/[^\/]$/, '$&/');//if there is no / at the end, add /
		return path === this.root && !this.getSearch();
	},

	//check whether pathname match the root?
	matchRoot: function(){
		//get fragment
		var path = this.decodeFragment(this.location.pathname);
		//get root path from the fragment
		var rootPath = path.slice(0, this.root.length - 1) + '/';
		//return result
		return rootPath === this.root;
	},

	//Unicode characters in `location.pathname` are percent encoded so they're decoded for comparison.	
	decodeFragment: function(){
		return decodeURI(fragment.replace(/%25/g, '%2525'));
	},

	//For compatibility of IE 6.
	// In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
        var match = (window || this).location.href.match(/#(.*)$/); //match from the '#' to the end of the string
        return match ? match[1] : '';//it returns an array, that's why if match exists return match[1]
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
    	//get the path by using pathname minus the root
        var path = this.decodeFragment(
            this.location.pathname + this.getSearch()
        ).slice(this.root.length - 1);
        //check whether the first character is '/', if yes, ignore it.
        return path.charAt(0) === '/' ? path.slice(1) : path;
    },

     // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
        if (fragment == null) {
        	//check whether the browswe supports pushstate
            if (this._usePushState || !this._wantsHashChange) {
                fragment = this.getPath();
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(routeStripper, '');
    },

    //real stuff starts here
    //
    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
    	//check whether history is already started
        if (History.started) throw new Error('Backbone.history has already been started');
        History.started = true;

        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options = _.extend({ root: '/' }, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        //IE API, hashchange only supported after version 7
        this._hasHashChange = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7); 
        //use hashchange or not
        this._useHashChange = this._wantsHashChange && this._hasHashChange;
        //want to use pushstate or not
        this._wantsPushState = !!this.options.pushState;
        //support pushstate or not?
        this._hasPushState = !!(this.history && this.history.pushState);
        //decide whether to use pushstate
        this._usePushState = this._wantsPushState && this._hasPushState;
        //get fragment('#...')
        this.fragment = this.getFragment();

        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');

        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if (this._wantsHashChange && this._wantsPushState) {

            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if (!this._hasPushState && !this.atRoot()) {
                var rootPath = this.root.slice(0, -1) || '/';
                this.location.replace(rootPath + '#' + this.getPath());
                // Return immediately as browser will do redirect to new url
                return true;

                // Or if we've started out with a hash-based route, but we're currently
                // in a browser where it could be `pushState`-based instead...
            } else if (this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), { replace: true });
            }

        }

        //for old browsers
        // Proxy an iframe to handle location events if the browser doesn't
        // support the `hashchange` event, HTML5 history, or the user wants
        // `hashChange` but not `pushState`.
        if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'javascript:0';
            this.iframe.style.display = 'none';
            this.iframe.tabIndex = -1;
            var body = document.body;
            // Using `appendChild` will throw on IE < 9 if the document is not ready.
            var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
            iWindow.document.open();
            iWindow.document.close();
            iWindow.location.hash = '#' + this.fragment;
        }

        // Add a cross-platform `addEventListener` shim for older browsers.
        // some older browser might not have addEventListener. so add one of them, if they do not have one.
        var addEventListener = window.addEventListener || function(eventName, listener) {
            return attachEvent('on' + eventName, listener);
        };

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._usePushState) {
        	//if pushstate is supported, then we need to listen to popstate event for the back button
            addEventListener('popstate', this.checkUrl/*callback function*/, false);
        } else if (this._useHashChange && !this.iframe) {
        	//if hashchange event is supported, just listen to hashchange event
            addEventListener('hashchange', this.checkUrl, false);
        } else if (this._wantsHashChange) {
        	//if neither pushstate nor hashchange is supported, poll url for every interval
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }

        //check whether change should be silent or not
        if (!this.options.silent) return this.loadUrl();
    },


    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
        // Add a cross-platform `removeEventListener` shim for older browsers.
        var removeEventListener = window.removeEventListener || function(eventName, listener) {
            return detachEvent('on' + eventName, listener);
        };

        // Remove window listeners.
        if (this._usePushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
            removeEventListener('hashchange', this.checkUrl, false);
        }

        // Clean up the iframe if necessary.
        if (this.iframe) {
            document.body.removeChild(this.iframe);
            this.iframe = null;
        }

        // Some environments will throw when clearing an undefined interval.
        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
        History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
        this.handlers.unshift({ route: route, callback: callback });
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
        var current = this.getFragment();

        // If the user pressed the back button, the iframe's hash will have
        // changed and we should use that for comparison.
        if (current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe.contentWindow);
        }

        if (current === this.fragment) return false;
        if (this.iframe) this.navigate(current);
        this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
        // If the root doesn't match, no routes can match either.
        if (!this.matchRoot()) return false;
        fragment = this.fragment = this.getFragment(fragment);
        return _.some(this.handlers, function(handler) {
        	//test whether there is a route match current fragment
        	//if yes, use the current callback
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return true;
            }
        });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
    	//if history is not started, return
        if (!History.started) return false;
        //default options
        if (!options || options === true) options = { trigger: !!options };

        // Normalize the fragment. (get fragment)
        fragment = this.getFragment(fragment || '');

        // Don't include a trailing slash on the root.
        var rootPath = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
            rootPath = rootPath.slice(0, -1) || '/';
        }
        var url = rootPath + fragment;

        // Strip the fragment of the query and hash for matching.
        fragment = fragment.replace(pathStripper, '');

        // Decode for matching.
        var decodedFragment = this.decodeFragment(fragment);

        if (this.fragment === decodedFragment) return; //already loaded desired URL
        this.fragment = decodedFragment;

        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._usePushState) {
            this.history[options.replace ? 'replaceState' : 'pushState'/*replace or push*/]({}, document.title, url);

            // If hash changes haven't been explicitly disabled, update the hash
            // fragment to store history.
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
                var iWindow = this.iframe.contentWindow;

                // Opening and closing the iframe tricks IE7 and earlier to push a
                // history entry on hash-tag change.  When replace is true, we don't
                // want this.
                if (!options.replace) {
                    iWindow.document.open();
                    iWindow.document.close();
                }

                this._updateHash(iWindow.location, fragment, options.replace);//for hashchange browser to load new page
            }

            // If you've told us that you explicitly don't want fallback hashchange-
            // based history, then `navigate` becomes a page refresh.
        } else {
            return this.location.assign(url);//older browser
        }
        if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
        if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            // Some browsers require that `hash` contains a leading #.
            location.hash = '#' + fragment;
        }
    }
});

// Create the default Backbone.history.
Backbone.history = new History();


//************************************************************************** Backbone Helpers **************************************************************************//
//

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
    	//this is if you have configured the 'constructor' in the protoProps argument
        child = protoProps.constructor;
    } else {
    	//this is if you have not configured.
    	//simply apply parent's constructor
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    
    //create the object with parent property and the property defined in protoProps
    child.prototype = _.create(parent.prototype, protoProps);

    //since child.prototype.constructor is the same as parent.prototype.constructor
    //we need to re-point the child.prototype.constructor to itserlf!
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Set up inheritance for the model, collection, router, view and history.
// all the extend function are using the extend defined above.
Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

// Throw an error when a URL is needed, and none is supplied.
var urlError = function() {
    throw new Error('A "url" property or function must be specified');
};

// Wrap an optional error callback with a fallback error event.
// For model
var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error.call(options.context, model, resp, options);
        model.trigger('error', model, resp, options);
    };
};
