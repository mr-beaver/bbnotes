/**
 * Backbone LayoutManager(LM) adds the 'render' part for Backbone, since Backbone does not implement
 * a render function. It helps user to attach piece rendered views into DOM elements, and it Creates
 * methods to help user to manage their views especially nested views. It stops duplication and make
 * sure child view renders before parent view. Also, helper functions like getView, setView(insertView)
 * helps user to dynamically change view on the fly.
 *
 * More importantly, it has methods for user to store templates elsewhere, and then fetch them
 * "asynchronously." However, the default implementation is not optimal, you might need some tweak.
 */

//---------------------------- external functions ----------------------------//
//
var constructor = function(){
    //takes options, extends LayoutManager object and call Backbone.View constructor.
    //Separate LayoutManager's constructor and Backbone.View constructor, but wraps
    //the Backbone.View constructor inside for easier debugging.
};

var async = function(){
    //tell LayoutManager a specific method is async.
    //Should only be used within the render chain.
};

var promise = function(){
    //return promise object. Default is $.deferred().promise();
};

//! check what does the promise look like for the children views
var renderViews = function(){
    //iterate over the provided views or delegate to 'getViews' to fatch children
    //views and aggregate all render promises and return the parent View.
};

var insertView = function(selector, view){
    //Shorthand version for setView
    //it calls this.setView differently based on arguments passed in.
};

var insertViews = function(){
    //insert multiple views by using iteratee and calling this.setViews.
};

var getView = function(fn){
    //returns the view that matches the 'getViews' filter function.
    //it calls this.getViews;
};

var getViews = function(fn){
    // Provide a filter function to get a flattened array of all the subviews.
    // If the filter function is omitted it will return all subviews.  If a
    // String is passed instead, it will return the Views for that selector.
};

var removeView = function(fn){
    //remove views. internally uses 'getViews', so it takes same arguments as getViews.
};

var setView = function(name, view, insert){
    // This takes in a partial name and view instance and assigns them to
    // the internal collection of views.  If a view is not a LayoutManager
    // instance, then mix in the LayoutManager prototype.  This ensures
    // all Views can be used successfully.
    //
    // Must definitely wrap any render method passed in or defaults to a
    // typical render function `return layout(this).render()`.
};

var setViews = function(views){
    //use iteratee and this.setView to achieve setup multiple views.
};

var render = function(){
    // By default this should find all nested views and render them into
    // the this.el and call done once all of them have successfully been
    // resolved.
    //
    // This function returns a promise that can be chained to determine
    // once all subviews and main view have been rendered into the view.el.
};

var remove = function(){
    // Ensure the cleanup function is called whenever remove is called.
};

//***** staticProps *****//

var cache = function(){
    // Cache templates into LayoutManager._cache.
};

var cleanViews = function(){
    // Accept either a single view or an array of views to clean of all DOM
    // events internal model and collection references and all Backbone.Events.
    // Call Backbone.view.model.off or Backbone.collection.off
};

var configure = function(){
    // This static method allows for global configuration of LayoutManager.
};

var setupView = function(){
    // Configure a View to work with the LayoutManager plugin.
    // Bascially, give Backbone Views some default settings, which uses the method
    // defined in layout manager.
};

//---------------------------- internal functions ----------------------------//
var _render = function(){
    //internal render function used in actuallyRender.
    //trigger beforeRender events and run beforeRender function.
};

var _applyTemplate = function(rendered, mamnager, def){
    //pairing the rendered template into the DOM element
};

var _viewRender = function(){
    // Creates a deferred and returns a function to call when finished.
    // This gets passed to all _render methods.  The `root` value here is passed
    // from the `manage(this).render()` line in the `_render` function
};

var _registerWithRAF = function(){
    // Register a view render with RAF.
};

var _cancelQueuedRAFRender = function(){
    // Cancel any queued render requests.
};

//***** staticProps *****//

var _removeView = function(){
    // Remove a single nested View.
};

var _removeViews = function(){
    // Remove all nested Views.
};
