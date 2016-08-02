//---------------------------------Backbone Events---------------------------------//
//

//?? firgure out why there is so many copy of listeningTo

// Objects with events registered contains following data structures:
var object = {
    //this is the id store all the events, keys are events names.
    //inside each object, we have callback functons, contexts, listenings
    _events: {
        eventName: [{
            callback: callback, //callback function for the event
            context: context,
            ctx: ctx,
            listening: { //who is listening to this event
                obj: obj, //the object being listened to
                objId: id, //if of the object who is being listened to
                id: thisId, //the object id who is listening to this event
                listeningTo: {
                    id: { //this is another copy of who is listening to this event

                    }
                },
                count: 1 //such listening happens how many times
            },
        }]
    },
    //this is the unique id for other objects to reference
    _listenId: _.uniqueId('l'),
    //
    _listeners: {
        id /*who is listening to the object*/ : {
            obj: obj, //the object being listened to
            objId: id, //id of the object being listened to
            id: thisId, //id of the object who is listening to this object
            listeningTo: {
                id /*id of the object being listened to*/ : {

                }
            },
            count: 2 //the number of events that the other object is listening to this object
        }
    },
    //
    _listeningTo: {
        id /*the id of the object this object is listening to*/ : {
            obj: obj, //the other object
            objId: id, //the id of the other object
            id: thisId, //the id of this object
            listeningTo: {
                id: {
                    //another copy of listening to
                }
            },
            count: 2 //the number of events this object is listening to the other object
        }
    }
};

 

//
//HELPERs
//
//The main purpose of this function is to map name into standard form,
//and then pass those names to the desired iteratee, which is a function in the Events object,
//such as Events.on, Events.off, Events.listenTo....
var eventsApi = function(iteratee, events, name, callback, opts){
	/**
	 * It break events into standard form, which is a simple string,
	 * and then handle it to the iteratee function.
	 *
	 * It can take three type of events input
	 * 1). object, e.g.
	 * 		{
	 * 			'change': onChange
	 * 			...
	 * 		}
	 * 	2). a string with spliter, default is space, e.g.
	 * 		'change modified ...'
	 * 
	 * 	3). a simple string, which is the standard form.
	 */
};
//
//The main purpose of this function is to protect the 'listening' argument from the public API,
//since Events.on is exposed to public, and it should not contain listening argument.
//It relys on onApi to register those 'on' events, 
//and if the requesting object does not contain a _listener, it creats one. 
var internalOn = function(obj, name, callback, context, listening){
	/**
	 * This function guards the `listening` argument from the public API,
	 * which is passed by some public APIs.
	 * it registers the events by calling eventsApi and pass onApi as the iteratee, and
	 * stores the events in object by using key _events.
	 * That is events are stored in object._events
	 */
	obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
		context: context,
		ctx: obj,
		listening: listening
	});

	if(listening){
		var listener = obj._listeners || (obj._listeners = {});
		listeners[listening.id] = listening;
	}

	return obj;
};
//
//This is the real function that register those 'on' events on objects.
//object._events[name] is an array, and each object contains the following keys:
//callback, context, ctx and listening.
var onApi = function(events, name, callback, options){
	/**
	 * This function adds a callback to the `event` object
	 * It pushes an object to event[name]
	 */
	var handlers = events[name] || (events[name] = []);
	handlers.push({
		callback: callback,
		context: context,
		ctx: context || ctx,
		listening: listening
	});
	return events;
};
//
//This is the real function that de-register the 'on' events.
var offApi = function(events, name, callback, options){
	/**
	 * This function removes a callback from the `events` object.
	 *
	 * ~~ if no name, no callbacks and no context are provided 
	 * 		then delete all the callbacks from the object, by extracting the ids from
	 * 		_.keys(options.listeners)
	 *
	 * ~~ it will go through the named event or all the events, and then
	 * 		only add those who does not much the desription(e.g. name, callback, context)
	 * 		back to the event for the objects.
	 *
	 * ~~ Also if there is no more listener for the object, it will also delete the listener
	 * 		and the unique listener id for the object.
	 */
	return events;
	
};
//
//The main purpose of this function is to change the function(fn), which should only be invoke once
//to the format of _.once(fn)
var onceMap = function(map, name, callback, offer){
	/**
	 * This function reduces the event callback into a map of `{event: onceWrapper}.`
	 * `offer` unbinds the `oncewrapper` after it has been called.
	 *
	 * It changs the function of map[name] to the function with _.once(...)
	 */
	
	//In Events.Once, it has the following lines
	//var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
	//the _.bind(this.off, this) returns the Events.off function with its context bind to Events

	//...
	return map;
};
//
//The main purpose of the function is to send those events needed to be trigger 
//to the function triggerEvents
var triggerApi = function(objEvents, name, callback, args){
	/**
	 * tiggers event by calling triggerEvents function
	 */
	//allEvents.slice() is to protect the original array.
	if (events && allEvents) allEvents = allEvents.slice();

	return objEvents;
};
//The main purpose of the function is to 'trigger' events. This is achieved by
//calling the callback functions directly for those 'triggered' events
var triggerEvents = function(events, args){
	/**
	 * core dispatch function for triggering events
	 *
	 * It uses callback.call(...) to invoke the callback functions of an event.
	 *
	 * ??There is no real trigger! The trigger actually is a function that calls the callback
	 * 		functions based on event names.
	 */
};

//
//EVENT.KEYs
//
Events.on = function(name, callback, context){
	/**
	 * This is the function register the on event objects.
	 * It calls the function internalOn
	 */
	return internalOn(this, name, callback, context);
};
//
Event.listenTo = function(obj, name, callback){
	/**
	 * This function tells 'this' object to listen to an event in another object.
	 * Keeping track of what it is listening to, for easier unbinding later
	 *
	 * ~~ if this object is not listening, then it gives the object an unique listening id
	 * 		and pass the listening object to the object
	 *
	 * It calls internalOn to bind callbacks on obj, and keep track of them on listening
	 * 
	 */
	internalOn(obj, name, callback, this, listening);
	return this;
};
//
Events.off = function(name, callback, context){
	/**
	 * This is the function removes one or many callbacks.
	 *
	 * ~~ if `context` is null, removes all callbacks with that function.
	 * ~~ if `callback` is null, removes all callbacks for the event.
	 * ~~ if `name` is null, removes all bound callbacks for all events.
	 *
	 * It calls eventsApi and passes offApi as interatee to achieve preceding descriptions.
	 */
	this._events = eventsApi(offApi, this._events, name, callback, {
		context: context,
		listeners: this._listeners
	});
	return this;
};
//
Events.stopListening = function(obj, name, callback){
	/**
	 * This function calls listening objects's off function,
	 * that is listening.obj.off to stop the listening event
	 */
};
//
Events.once = function(name, callback, context){
	/**
	 * This function registers those events fired only once,
	 * after being invoked for the first time, the listener will be removed.
	 *
	 * It calls eventsApi and passes onceMap as iteratee.
	 */
	var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
	return this.on(events, callback, context);
};
//
Events.listenToOnce = function(obj, name, callback){
	/**
	 * it calls eventsApi and passes onceMap as itratee.
	 */
	var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
};
//
Events.trigger = function(name){
	/**
	 * Tigger one or many events, and firing all bound callbacks.
	 *
	 * It calls eventsApi and passes triggerApi as iteratee.
	 * Since the first argument is the name, and the rest of the arguments is optional, 
	 * when calling the triggerApi it builts a new argument array ignores the first argument.
	 */
	
};

//---------------------------------Backbone Model---------------------------------//
//Models are the basic data object in the framework
//-- usually represents a row in a table in a database in your server.
//

//Following is the base data structure of a Backbone Model
var Model = Backbone.Model = function(attributes, options){
	var attrs = attributes || {};
	options || (options = {});
	//this is an empty function, you can override it.
	this.preinitialize.apply(this, arguments);
	this.cid = _.uniqueId(this.cidPrefix);
	this.attributes = {};
	//If pass in a collection in options, the model will gain a collection property.
	//It tells this model belongs to which collection.
	if(options.collection) this.collection = options.collection;
	//If pass 'parse = true' in options, the attributes will first be converted by parse,
	//and then set to model
	if(options.parse) attr = this.parse(attrs, options) || {};
	//Check whether user has given defaults
	var defaults = _.result(this, 'defaults');
	//Extend attributes with default values, if not given in attributes
	attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
	//set model
	this.set(attrs, options);
	//changed starts with an empty object
	this.changed = {};
	//initialize the model
	this.initialize.apply(this, arguments);
};

//Give all inheritable methods to the Model prototype
_.extend(Model.prototype, Events, {
	//A hash of attributes whose current and previous value differ
	changed: null,

	//The value returned during the last failed validation
	validationError: null,

	//What key of the Model contributes as 'id'
	idAttribte: 'id',

	//the prefix of cid
	cidPrefix: 'c',

	//preinitialize will run before any instantiation logic is run in the model
	preinitialize: function(){},

	//initialization logic
	initialize: function(){},

	//returns a copy of the model's `attributes` object
	toJSON: function(options){
		return _.clone(this.attributes);//shallow copy
	},

	//use 'Backbone.sync' by default. Check Backbone.sync in later comments
	sync: function(){
		return Backbone.sync.apply(this, arguments);
	},

	//Get the value of an attribute.
	get: function(attr){
		return this.attributes[attr];
	},

	//Get the HTML-escaped value of an attribute
	escape: function(attr){
		return _.escape(this.get(attr));
	},

	//Returns 'true' if the attribute contains a value that is not null or undefined
	has: function(attr){
		return this.get(attr) != null; //undefined == null
	},

	//special-cased proxy to underscore's '_.matches' method
	matches: function(attrs){
		return !!_.iteratee(attrs, this)(this.attributes);
	},

	//Set a hash of model attributes on the object, firing "change".
	//Heart of the beast.
	set: function(key, val, options){
		if(key == null) return this; //either null or undefined

		//reduce key
		var attrs;
		if(typeof key === 'object'){
			attrs = key;
			options = val;
		}else{
			(attrs = {})[key] = val;
		}

		options || (options = {});

		//check validation
		if(!this._validate(attrs, options)) return false;

		//Extract attributes and options
		var unset = options.unset,
			silent = options. silent,
			changes = [],//intermedium variable
			changing = this._changing;
		this._changing = true;

		//only highest layer of changing has a falsy changing.
		if(!changing){
			this._previousAttributes = _.clone(this.attributes);
			this.changed = {};
		}

		var current = this.attributes,
			changed = this.changed,
			prev = this._previousAttributes;

		//go through every 'set' attribute, update or delete the current value
		for(var attr in attrs){
			val = attrs[attr];
			//if not equal to current value, push into changes
			if(!_.isEqual(current[attr], val)) changes.push(attr);
			//if not equal to previous value, then changed[attr] set to val
			if(!_.isEqual(prev[attr], val)){
				changed[attr] = val;
			}else{//not changed
				delete changed[attr];
			}
			unset ? delete current[attr] : current[attr] = val;
		}

		//update the 'id'
		if(this.idAttribte in attrs) this.id = this.get(this.idAttribte);

		//Trigger all relevant attribute changes
		if(!silent){//if not silent, otherwise no triggering
			if(changes.length) this._pending = options;
			for(var i = 0; i < changes.length; i++){
				this.trigger('change:' + changes[i]/*key name*/, this, current[changes[i]]/*changed to what value*/, options);
			}
		}

		//Changes can be recursively nested within 'change' events
		//Changing true then return is because only the highest layer of nesting has a falsy chaning.
		//In other words, if changing is true, it is a lower layer change, so 'return to higher layer'.
		if(changing) return this;
		if(!silent){
			while(this._pending){
				options = this._pending;
				this._pending = false;
				this.trigger('change', this, options);
			}
		}
		this._pending = false;
		this._changing = false;
		return this;
	},

	//Remove an attribute from the model, firing 'change'.
	//'unset' is a noop, if the attribute does not exist.
	unset: function(attr, options){
		return this.set(attr, void 0, _.extend({}, options, {unset: true}));
	},

	//clear all attributes on the model, firing 'change'
	clear: function(options){
		var attrs = {};
		for(var key in this.attributes) 
			attrs[key] = void 0;
		return this.set(attrs, _.extend({}, options, {unset: true}));
	},

	//Check whether the model has changed since the last 'change' event.
	//You can also specified an attribute to check
	hasChanged: function(attr){
		if(attr == null/*undefined and null*/) return !_.isEmpty(this.changed);
		return _.has(this.changed. attr);
	},

	//Retuen an object containing all the attributes that have changed, or
	//false if there are no changed attributes. 
	//You can also pass an attributes object to diff against the model to 
	//check whether there would be a change.
	changedAttributes: function(diff){
		if(!diff) return this.hasChanged() ? _.clone(this.changed) : false;
		//check diff against current model
		var old = this._changing ? this._previousAttributes : this.attributes,
			changed = {},
			hasChanged;

		for(var attr in diff){
			var val = diff[attr];
			//if same, continue
			if(_.isEqual(old[attr], val)) continue;
			//if not same, take a record
			changed[attr] = val;
			hasChanged = true;
		}
		return hasChanged ? changed : false;
	},

	//Get the previous value of an attribute, recoreded at the time the last
	//'change' event was fired.
	previous: function(attr){
		if(attr == null || !this._previousAttributes) return null;
		return this._previousAttributes[attr];
	},

	//Get all of the attributes of the model at the time of the previous 'change' event
	previousAttributes: function(){
		return _.clone(this._previousAttributes);
	},

	//Fetch the model from the server, *mergin* the response with the model's local attributes
	//Any changed attributes will trigger a 'change' event.
	fetch: function(options){
		options = _.extend({parse: true}, options);
		var model = this,
			success = options.success;
		options.success = function(resp){
			var serverAttrs = options.parse ? model.parse(resp, options) : resp;
			//nothing changed
			if(!model.set(serverAttrs, options)) return false;
			//changed
			if(success) success.call(options.context, model, resp, options);
			//uses Backbone.sync
			model.trigger('sync', model, resp, options);
		};
		//see definition later. this is for error fetch
		wrapError(this, options);
		return this.sync('read', this, options);
	},

	//Set a hash of model attributes, and sync the model to the server.
	//If the server returns an attributes hash that differs, the model's
	//state will be 'set' again.
	save: function(key, val, options){
		//redecing key & val to standard format
		var attrs;
		if(key == null || typeof key === 'object'){
			attrs = key;
			options = val;
		}else{
			(attrs = {})[key] = val;
		}

		//parse and validate attributes
		options = _.extend({validate: true, parse: true}, options);
		var wait = options.wait;

		//if not waiting and attributes exist, then
		//'set(attr).save(null, options)' with validation. Otherwise,
		//check if the model will be valid when the attributes are set, if any.
		if(attrs && !wait){
			//validation
			if(!this.set(attrs, options)) return false;
		}else if(!this._validate(attrs, options)){
			return false;
		}

		//After a successful server-side save, the client is (optionally)
		//updated with ther server-side state.
		var model = this,
			success = options.success,
			attributes = this.attributes;
		options.success = function(resp){
			//ensure attributes are restored during synchronous save.
			model.attributes = attributes;
			var serverAttrs = options.parse ? model.parse(resp, options) : resp;
	        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
	        if (serverAttrs && !model.set(serverAttrs, options)) return false;
	        if (success) success.call(options.context, model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);

	      //set temporary attributes if '{wait: true}' to properly find new ids.
	      if(attrs && wait) this.attributes = _.extend({}, attributes, attrs);

	      var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
	      if(method === 'patch' && !options.attrs) options.attrs = attrs;
	      var xhr = this.sync(method, this, options);

	      //Restore attributes
	      this.attributes = attributes;

	      return xhr;
	},

	// Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

	// Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }
});

  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  addUnderscoreMethods(Model, modelMethods, 'attributes');

//---------------------------------Backbone Collection---------------------------------//
//If Backbone Model tends to represent a single row of data, 
//a Backbone Collection represents a table full of data.

//Create a new 'Collection', perhaps to contain a specific type of 'model'.
//If a 'comparator' is specified, the Colloection will maintain
//its models in sort order, as they're added and removed.

var Collection = Backbone.Collection = function(models, options){
	options || (options = {});
	//preinitialize
	this.preinitialize.apply(this, arguments);
	//model
	if(options.model) this.model = options.model;
	//comparator
	if(options.comparator !== void 0) this.comparator = options.comparator;
	//??
	this._reset();
	this.initialize.apply(this, arguments);
	//reset collection without triggering reset event
	if(models) this.reset(models. _.extend({silnet: true}, options));
};

//Deafult options for 'Collection#set'.
var setOptions = {add: true, remove: true, merge: true},
	addOptions = {add: true, remove: false};

//splices 'insert' into 'array' at index 'at'.
var splice = function(array, insert, at){
	at = Math.min(Math.max(at, 0), array.length);
	var tail = Array(array.length - at),
		length = insert.length;
	var i;
	//preserve elements on tails
	for( i = 0; i < tail.length; i++) tail[i] = array[i + at];
	//insert
	for (i = 0; i < length; i++) array[i + at] = insert[i];
	//copy back tail elements
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
};

_.extend(Collection.prototype, Events, {

	//Default model is just a backbone model, should be overridden
	model: Model,

	//preinitialize
	preinitialize: function(){},

	//initialize
	initialize: function(){},

	//returns an array of the model's attributes
	toJSON: function(options){
		return this.map(function(model){ return model.toJSON(options); });
	},

	//Proxy 'Backbone.sync' by default
	sync: function(){
		return Backbone.sync.apply(this, arguments);
	},

	//Add a model, or a list of models to the collection.
	//'models' may be Backbone Models or raw Javascript objects to be
	//converted to Models, or any combination of the tow.
	add: function(models, options){
		return this.set(models, _.extend({merge: false}, options, addOptions));
	},

	//remove a model, or a list of models from the set.
	remove: function(models, options){
		options = _.extend({}, options);
		//check a model or models
		var singular = !_.isArray(models);
		models = singualr ? [models] : models.slice();//protect the original copy
		var removed = this._removeModels(models, options);
		//trigger event if not silent
		if(!options.silent && removed.length){
			options.changes = {add: [], merged: [], removed: removed};
			//update event will tell you what has been added, merged or removed
			this.trigger('update', this, options);
		}
		//return removed models
		return singular ? removed[0] : removed;
	},

	//Update a collection. Add, merge or remove
	//Core operation!
	set: function(models, options){
		if(models == null/*null or undefined*/) return;

		options = _.extend({}, setOptions, options);
		//parse model if models is not Model
		if(options.parse && !this._isModel(models)){
			models = this.parse(models, options) || [];
		}

		//check a model or models
		var singular = !_.isArray(models);
		//arraify
		models = singular ? [models] : models.slice();//protect original copy

		var at = options.at;
		if (at != null) at = +at;//??protect original at?
		if(at > this.length) at = this.length;
		if(at < 0) at += this.length + 1;

		var set = [],
			toAdd = [],
			toMeger = [],
			toRemove = [],
			modelMap = {};

		var add = options.add,
			merge = options.merge,
			remove = options.remove;

		var sort = false,//initial value is false
			sortable = this.comparator && at == null && options.sort !== false,
			sortAttr = _.isString(this.comparator) ? this.comparator : null;

		//Turn bare objects into model references, and 
		//prevent invalid modes from being added.
		var model, i;
		for(i = 0; i < models.length; i++){
			model = models[i];

			//check duplication. If yes, try to merge.
			var existing = this.get(model);
			if(existing){
				if(merge && model !== existing){
					var attrs = this._isModel(model) ? model.attributes : model;
					//parse attributes using existing parse
					if (options.parse) attrs = existing.parse(attrs, options);
					//merge
					existing.set(attrs, options);
					//push it to the 'toMerge' list
            		toMerge.push(existing);
            		//check whether needs to be re-sorted
            		if (sortable && !sort) sort = existing.hasChanged(sortAttr);
				}	
			//If this is a new, valid model, push it to the 'toAdd' list
			}else if(add){
				model = models[i] = this._prepareModel(model, options);
				//valid
				if(model){
					toAdd.push(model);
					this._addReference(model, options);
					modelMap[model.cid] = true;
					set.push(model);
				}
			}
		}

		// Remove stale models.
		if (remove) {
		    for (i = 0; i < this.length; i++) {
		        model = this.models[i];
		        if (!modelMap[model.cid]) toRemove.push(model);
		    }
		    if (toRemove.length) this._removeModels(toRemove, options);
		}

		// See if sorting is needed, update `length` and splice in new models.
		var orderChanged = false;
		var replace = !sortable && add && remove;
		if (set.length && replace) {
			//check whether length equal or
			//if length equal whether same index same value
		    orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
		        return m !== set[index];
		    });
		    //reset this.models
		    this.models.length = 0;
		    //put set array into this.models
		    splice(this.models, set, 0);
		    //reset this.length
		    this.length = this.models.length;
		} else if (toAdd.length) {
			//if not replacable, just add and re-sort
		    if (sortable) sort = true;
		    splice(this.models, toAdd, at == null ? this.length : at);
		    this.length = this.models.length;
		}

		// Silently sort the collection if appropriate.
		if (sort) this.sort({silent: true});

		// Unless silenced, it's time to fire all appropriate add/sort/update events.
		if (!options.silent) {
		    for (i = 0; i < toAdd.length; i++) {
		        if (at != null) options.index = at + i;
		        model = toAdd[i];
		        //add event for a perticular model
		        model.trigger('add', model, this, options);
		    }
		    //sort event
		    if (sort || orderChanged) this.trigger('sort', this, options);
		    //update event
		    if (toAdd.length || toRemove.length || toMerge.length) {
		        options.changes = {
		            added: toAdd,
		            removed: toRemove,
		            merged: toMerge
		        };
		        this.trigger('update', this, options);
		    }
		}

		// Return the added (or merged) model (or models).
    	return singular ? models[0] : models;
	},

	//You can reset the entire set with a new list of models, 
	//without firing a larger amount of 'add' or 'remove' events.
	//Fires reset when finished.
	reset: function(models, options){
		options = options ? _.clone(options) : {};
		for(var i = 0; i < this.models.length; i++){
			this._removeReference(this.models[i], options);
		}
		options.previousModels = this.models;
		this._reset();
		//only trigger one event
		models = this.add(models, _.extend({silent: true}, options));
		//trigger reset, if not silent
		if(!options.silent) this.trigger('reset', this, options);
		return models;
	},

	// Add a model to the end of the collection.
	push: function(model, options) {
		//The reson of using extend here is, if only use a push
		//it only returns an array with an additional element, while
		//the original array was not extended.
		//
		//Same reason as the following couples of _.extend
        return this.add(model, _.extend({ at: this.length }, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
        var model = this.at(this.length - 1);
        return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
        return this.add(model, _.extend({ at: 0 }, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
        var model = this.at(0);
        return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
        return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj){
    	if(obj == null/*null or undefined*/) return void 0;
    	return this._byId[obj] || //id
    		this._byId[this.modelId(obj.attributes || obj)] || //translate id
    		obj.cid && this._byId[obj.cid] //cid
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
    	//check whether first is true,
    	//if yes return first one by using 'find'
    	//else return all the matches by using 'filter'
      return this[first ? 'find' : 'filter'](attrs);
    },


    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      //underscore method where, return all matches
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options){
    	var comparator = this.comparator;
    	//must have a comparator in order to sort
    	if(!comparator) throw new Error('Cannot sort a set without a comparator');
    	options || (options = {});

    	var length = comparator.length;
    	//comparator can be this.
      	if (_.isFunction(comparator)) comparator = _.bind(comparator, this);

      	 // Run sort based on type of `comparator`.
		if (length === 1 || _.isString(comparator)) {
		    //single comparator
		    this.models = this.sortBy(comparator);
		} else {
		    this.models.sort(comparator);
		}
		//trigger sort event, if not sort
		if (!options.silent) this.trigger('sort', this, options);
		return this;


    }, 
    
    // get value of an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options){
    	options = _.extend({parse: true}, options);
    	//save a copy of original success before overridden
    	var success = options.success;
    	var collection = this;
    	options.success = function(){
    		//check whether to reset
    		var method = options.reset ? 'reset' : 'set';
    		collection[method](resp, options);
    		if(success) success.call(options.context, collection, resp, options);
    		collection.trigger('sync', collection, resp, options);
    	};
    	wrapError(this, options);
    	return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
	// collection. The default implementation is just to pass it through.
	parse: function(resp, options) {
        return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
        return new this.constructor(this.models, {
            model: this.model,
            comparator: this.comparator
        });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs) {
        return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Get an iterator of all models in this collection.
    values: function() {
    	//call self defined iterator
        return new CollectionIterator(this, ITERATOR_VALUES);
    },

    // Get an iterator of all model IDs in this collection.
    keys: function() {
        return new CollectionIterator(this, ITERATOR_KEYS);
    },

    // Get an iterator of all [ID, model] tuples in this collection.
    entries: function() {
        return new CollectionIterator(this, ITERATOR_KEYSVALUES);
    },


	//======private methods======//
	
	//Reset all internal state. 
	//Called when the collection is first initialized or reset.
	_reset: function(){
		this.length = 0;
		this.models = [];
		this._byId = {};
	},

	// Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

	//Cut a model's ties to a collection.
	_removeReference: function(model, options){
		//delete refernce id
		delete this._byId[model.cid];
		//generate a unique model id.
		var id = this.modelId(model.attributes);
		if(id != null/*null or undefined*/) delete this._byId[id];
		//remove the refernece of model belong to what collection
		if(this === model.collection) delete model.collection;
		//de-register all the events on the model
		model.off('all', this._onModelEvent, this);
	},

	// Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

});

//======collection iterator======//

// Defining an @@iterator method implements JavaScript's Iterable protocol.
// In modern ES2015 browsers, this value is found at Symbol.iterator.
/* global Symbol */

//check whether browser supports Symbol
var $$iterator = typeof Symbol === 'function' && Symbol.iterator;

if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
}

// CollectionIterator
// ------------------

// A CollectionIterator implements JavaScript's Iterator protocol, allowing the
// use of `for of` loops in modern browsers and interoperation between
// Backbone.Collection and other JavaScript functions and third-party libraries
// which can operate on Iterables.
var CollectionIterator = function(collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
};

// This "enum" defines the three possible kinds of values which can be emitted
// by a CollectionIterator that correspond to the values(), keys() and entries()
// methods on Collection, respectively.
var ITERATOR_VALUES = 1;
var ITERATOR_KEYS = 2;
var ITERATOR_KEYSVALUES = 3;

// All Iterators should themselves be Iterable.
if ($$iterator) {
    CollectionIterator.prototype[$$iterator] = function() {
        return this;
    };
}

//'next' function for iterator
CollectionIterator.prototype.next = function() {
    if (this._collection) {

        // Only continue iterating if the iterated collection is long enough.
        if (this._index < this._collection.length) {
            var model = this._collection.at(this._index);
            this._index++;

            // Construct a value depending on what kind of values should be iterated.
            var value;
            if (this._kind === ITERATOR_VALUES) {
                value = model;
            } else {
                var id = this._collection.modelId(model.attributes);
                if (this._kind === ITERATOR_KEYS) {
                    value = id;
                } else { // ITERATOR_KEYSVALUES
                    value = [id, model];
                }
            }
            return { value: value, done: false };
        }

        // Once exhausted, remove the reference to the collection so future
        // calls to the next method always return done.
        this._collection = void 0;
    }

    return { value: void 0, done: true };
};

// Underscore methods
var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
  foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
  select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
  contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
  head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
  without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
  isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
  sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};

// Mix in each Underscore method as a proxy to `Collection#models`.
addUnderscoreMethods(Collection, collectionMethods, 'models');

//---------------------------------Backbone View---------------------------------//
//Backbone View is simply a Javascript object that represents a logical chunk of UI in the DOM.

//Creating a Backbone.View creates its initial element outside of the DOM.
//if an existing element is not provided.
var View = Backbone.View = function(options){
	//unique view id
	this.cid = _.uniqueId('view');
	this.preinitialize.apply(this, arguments);
	//pick up view options
	_.extend(this, _.pick(options, ViewOptions));
	//ensure that view has a DOM element to render into.
	this._ensureElement();
	//initialize
	this.initialize.apply(this, arguments);
};

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

//List of view options to be set as properties.
var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

_.extend(View.prototype, Events, {

	//default tagName
	tagName: 'div',

	// jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the View
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

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
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
    	//use jQuery's remove
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      //unbind events
      this.undelegateEvents();
      //set element
      this._setElement(element);
      //bind event
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
      //get events by arguments or resolve it from ''this
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      //unbind previous events
      this.undelegateEvents();
      //loop
      for (var key in events) {
        var method = events[key];
        //check whether value is a function or not
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
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
      	//attributes should be an object or a function
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }
});

//---------------------------------Backbone Helpers---------------------------------//
//By default, makes a RESTful Ajax request to the model's 'url()'.

//Alias for methods
var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };

Backbone.sync = function(method, model, options){
	var type = methodMap[method];

	//Default options, unless specified.
	_.defaults(options || (options = {}), {
		emulateHTTP: Backbone.emulateHTTP,
      	emulateJSON: Backbone.emulateJSON
	});

	//Default JSON-request options.
	var params = {type: type, dataType: 'json'};

	//Ensure, url exists
	if(!options.url){
		params.url = _.result(model, 'url') || urlError();
	}

	// Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    // Uses Backbone.ajax
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
};

// Set the default implementation of `Backbone.ajax` to proxy through to `$`.
Backbone.ajax = function(){
	return Backbone.$.ajax.apply(Backbone.$/*give back this argument to jQuery*/, arguments);
};

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
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

//---------------------------------Backbone Router---------------------------------//
// Routers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
var Router = Backbone.Router = function(options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
};

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Set up all inheritable **Backbone.Router** properties and methods.
_.extend(Router.prototype, Events, {
	// preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Router.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
      //should return something
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
    	//this.route calls Backbone.History
		if (!this.routes) return;
		this.routes = _.result(this, 'routes');
		var route, routes = _.keys(this.routes);
		while ((route = routes.pop()) != null) {
			this.route(route, this.routes[route]);
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

    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

});

//---------------------------------Backbone History---------------------------------//

//Uses either 'pushState' or 'onhashChange' and URL fragments.
//If the browser supports neither(old IE, natch), falls back to polling.
var History = Backbone.History = function(){
	//store route names and their callbacks
	this.handlers = [];
	//check current url to see whether it has changed?
	this.checkUrl = _.bind(this.checkUrl, this);

	//Ensure that 'History' can be used outside of browser.
	if(typeof window !== 'undefined'){
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

//Set up all inhertiable 'Backbone.History' properties and methods.
_.extend(History.prototype, Events, {

	//The default interval to poll for hash changes.
	interval: 50,

	//check at app root or not?
	atRoot: function(){
		var path = this.location.pathname.replace(/[^\/]$/, '$&/');//add a slash at the end of pathname
		return path === this.root && !this.getSearch(); //getSearch check for IE6
	},

	//pathname match the root?
	matchRoot: function(){
		var path = this.decodeFragment(this.location.pathname);
		var rootPath = path.slice(0, this.root.length - 1) + '/';//replace the end of string with '/'
		return rootPath === this.root;
	},

	// Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded paramethttp://www.ebay.com/itm/AMD-A8-7600-3-1GHz-Quad-Core-Processor-with-cooler-/182226614086?hash=item2a6d8d7746:g:XWwAAOSw3xJXnna1er.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));//preserve one set of %25, that is %
    },

	// In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    //Gets the true has value. Cannot use location.hash directly due to bug in Firefox, 
    //where location.hash will always be decoded.
    getHash: function(window){
    	var match = (window || this).location.href.match(/#(.*)$/); //get the '#......' at the end of the string
    	return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    //start the hash change handling, 
    //returning 'true' if the current URL matches an existing route,
    //otherwise return 'false'
    start: function(options){
    	//check whether history has already been started?
    	if (History.started) throw new Error('Backbone.history has already been started');
      	History.started = true;

		// Figure out the initial configuration. Do we need an iframe?
		// Is pushState desired ... is it available?
		this.options          = _.extend({root: '/'}, this.options, options);//default root is '/'
		this.root             = this.options.root;
		this._wantsHashChange = this.options.hashChange !== false;
		this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
		this._useHashChange   = this._wantsHashChange && this._hasHashChange;
		this._wantsPushState  = !!this.options.pushState;
		this._hasPushState    = !!(this.history && this.history.pushState);
		this._usePushState    = this._wantsPushState && this._hasPushState;
		this.fragment         = this.getFragment();

		// Normalize root to always include a leading and trailing slash.
      	this.root = ('/' + this.root + '/').replace(rootStripper, '/');

		// Transition from hashChange to pushState or vice versa if both are requested.
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


			// Add a cross-platform `addEventListener` shim for older browsers.
			var addEventListener = window.addEventListener || function(eventName, listener) {
			    return attachEvent('on' + eventName, listener);
			};

			// Depending on whether we're using pushState or hashes, and whether
			// 'onhashchange' is supported, determine how we check the URL state.
			if (this._usePushState) {
			    addEventListener('popstate', this.checkUrl, false);
			} else if (this._useHashChange && !this.iframe) {
			    addEventListener('hashchange', this.checkUrl, false);
			} else if (this._wantsHashChange) {
			    this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
			}

			if (!this.options.silent) return this.loadUrl();

		}

    },//? understand haschange and pushstate


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
    	this.handlers.unshift({route: route, callback: callback});
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
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
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

      if (this.fragment === decodedFragment) return;
      this.fragment = decodedFragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

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

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
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
Backbone.history = new History;