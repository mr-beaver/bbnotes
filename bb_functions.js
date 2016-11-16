//************************************************************************** Backbone Events **************************************************************************//


/// related global variables

//splitter for multiple 'splitter-separated' events
var eventSplitter = /\s+/;

/// Internal Functions


/////TODO: 1). understand more thoroughly of once and listenToOnce; 2). write down the data structure of obj.events

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

	//returns the modified evetns object
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
	//if there is no evetns just return
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
			delete listening.listeningTo[listening.objId];
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
				listening = handler.listening;
				if(listening && --listening === 0){
					delete listeners[listening.id];
                    delete listening.listeningTo[listening.objId];
				}
			}
		}

		//Update tail event if the list has any events. Otherwise, clean up.
		if(remaining.length){
			evetns[name] = remaining;//keep the remaining events
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

var triggerApi = function(objEvents, name, callback, args){};

var triggerEvents = function(events, args){};

Events.trigger = function(name){};

/// External Functions
Events.bind = Events.on;
Events.unbind = Events.off;

//extend backbone with definded events
_.extend(Backbone, Events);