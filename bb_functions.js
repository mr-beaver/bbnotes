//********************* Backbone Events *********************//

/// Internal Functions

var eventsApi = function(iteratee, events, name, callback, opts){};

var internalOn = function(obj, name, callback, context, listening){};

var onApi = function(events, name, callback, options){};

var offApi = function(events, name, callback, options){};

var onceMap = function(map, name, callback, offer){};

var triggerApi = function(objEvents, name, callback, args){};

var triggerEvents = function(events, args){};


/// External Functions

Events.on = function(name, callback, context){};

Events.listenTo = function(obj, name, callback){};

Events.off = function(name, callback, context){};

Events.stopListening = function(obj, name, callback){};

Events.once = function(name, callback, context){};

Events.listenToOnce = function(obj, name, callback){};

Events.trigger = function(name){};

Events.bind = Events.on;
Events.unbind = Events.off;

//extend backbone with definded events
_.extend(Backbone, Events);