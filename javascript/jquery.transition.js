var animationEvent, durations, prefix, transitionEvent,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

durations = {
  fast: 200,
  slow: 600
};

prefix = null;

transitionEvent = null;

animationEvent = null;

$(function() {
  var style;
  style = document.body.style;
  if ("WebkitTransition" in style) {
    prefix = "WebkitTransition";
    transitionEvent = "webkitTransitionEnd";
    return animationEvent = "webkitAnimationEnd";
  } else if ("MozTransition" in style) {
    prefix = "MozTransition";
    transitionEvent = "transitionend";
    return animationEvent = "animationend";
  }
});

$.fn.transition = function(properties, options) {
  var duration, name, performTransition, propertyNames, ref, ref1, ref2;
  if (options == null) {
    options = {};
  }
  duration = (ref = options.duration) != null ? ref : "fast";
  if (duration in durations) {
    duration = durations[duration];
  }
  performTransition = (function(_this) {
    return function() {
      var transitionEnded;
      _this.css(properties);
      if (prefix) {
        transitionEnded = false;
        _this.one(transitionEvent, function() {
          transitionEnded = true;
          _this.css(prefix, "");
          return typeof options.complete === "function" ? options.complete() : void 0;
        });
        return setTimeout(function() {
          if (!transitionEnded) {
            return _this.trigger(transitionEvent);
          }
        }, duration + 800);
      } else {
        return typeof options.complete === "function" ? options.complete() : void 0;
      }
    };
  })(this);
  if (prefix) {
    propertyNames = (function() {
      var results;
      results = [];
      for (name in properties) {
        results.push(name);
      }
      return results;
    })();
    properties[prefix + "Property"] = propertyNames.join(", ");
    properties[prefix + "Duration"] = duration + "ms";
    properties[prefix + "TimingFunction"] = (ref1 = options.timing) != null ? ref1 : "ease-in-out";
    properties[prefix + "Delay"] = (ref2 = options.delay) != null ? ref2 : 0;
    setTimeout(performTransition, 1);
  } else {
    performTransition();
  }
  return this;
};

$.fn.onTransitionEnd = function(property, callback) {
  if (callback == null) {
    callback = property;
    property = null;
  }
  if (prefix) {
    this.one(transitionEvent + " " + animationEvent, function(event) {
      var ref;
      if (!property || (ref = event.originalEvent.propertyName, indexOf.call(property.split(' '), ref) >= 0)) {
        return callback();
      }
    });
  } else {
    callback();
  }
  return this;
};

$.fn.transitionClass = function(klass) {
  $element = $(this);
  $element.addClass(klass).onTransitionEnd(function(){
    $element.removeClass(klass);
  });
};

// ---
// generated by coffee-script 1.9.2
