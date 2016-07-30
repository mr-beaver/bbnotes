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
					//parse attibutes using existing parse
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



});


//---------------------------------Backbone View---------------------------------//
//Backbone View is simply a Javascript object that represents a logical chunk of UI in the DOM.




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