/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )

 expand by kriku
 
 + Ajax
 
 + onEvent
 
 + window.Size { w: function () { return widnow width }, h: function () { return window height } }
 
 + window.Scroll { x: function () { return widnow scroll x }, y: function () { return window scroll y } }

 + setLimit(function () {}, n) - limit the rate at which this function can be called to n times in second
  // if n equal zero function will start just one time

 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

  'use strict';

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
    return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
    elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
    elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
    };
    removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // XMLHttpRequest
  // http://en.wikipedia.org/wiki/XMLHttpRequest
  var Ajax = function () {
    if (typeof XMLHttpRequest === 'undefined') {
    XMLHttpRequest = function() {
      try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch(e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch(e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP"); }
      catch(e) {}
      try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch(e) {}
      throw new Error("This browser does not support XMLHttpRequest.");
    };
    }
    return new XMLHttpRequest();
  };

  var onEvent = function (el, ev, fn) {
    if (el) {
    if (el.addEventListener) {
      el.addEventListener(ev, fn, false);
    } else {
      el.attachEvent('on' + ev, fn);
    }
    }
  };


  /**
   * Return actual size of window
   * @object {w(), h()}
   * @returns {Number}
   * @returns {Number}
   */


  var Size = {
    w: function () { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth },
    h: function () { return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight}
  };

  /**
   * Calculate how far to scroll
   * @private
   * @param {Element} anchor The anchor element to scroll to
   * @param {Number} headerHeight Height of a fixed header, if any
   * @param {Number} offset Number of pixels by which to offset scroll
   * @returns {Number}
   */

  var getLocation = function ( el ) {
    var location = 0;
    if (el.offsetParent) {
      do {
        location += el.offsetTop;
        el = el.offsetParent;
      } while (el);
    }
    return location;
  };

  var Scroll = {
    y: function () { return window.pageYOffset || window.document.documentElement.scrollTop },
    x: function () { return window.pageXOffset || window.document.documentElement.scrollLeft }
  };

  var setLimit = function (fn, n) {
    var locked = false;
    return function () {
      if (locked) return;
      locked = true;
      n && setTimeout(function () { locked = false }, 1000 / n); //escape division by zero
      fn.apply(this, arguments);
    }
  };

  /**
   * Animated scroll function
   * @param {Number} endLocation
   * @param {Number} time
   * @param {Function} callback
   */

  var animateScroll = function ( endLocation, time, callback ) {
    var animationInterval = null,
      timeLapsed = 0,
      startLocation = Scroll.y(),
      distance = endLocation - startLocation;

    var stopAnimateScroll = function (position, endLocation, animationInterval) {
      var currentLocation = Scroll.y();
      if ( position == endLocation || currentLocation == endLocation ) {
        clearInterval(animationInterval);
        callback();
      }
    };

    /**
     * Loop scrolling animation
     * @private
     */
    var percentage;

    var loopAnimateScroll = function () {
      timeLapsed += 16;
      percentage = ( timeLapsed / time );
      percentage = ( percentage > 1 ) ? 1 : percentage;
      // EasyInOut, cubic
      percentage = percentage < 0.5 ? 2 * percentage * percentage : -1 + (4 - 2 * percentage) * percentage;
      var position = Math.floor(startLocation + ( distance * percentage ));
      window.scrollTo( 0, position );
      stopAnimateScroll(position, endLocation, animationInterval);
    };

    percentage = null;

    /**
     * Set interval timer
     * @private
     */
    var startAnimateScroll = function () {
      animationInterval = setInterval(loopAnimateScroll, 16);
    };

    /**
     * Reset position to fix weird iOS bug
     * @link https://github.com/cferdinandi/smooth-scroll/issues/45
     */
    if ( window.pageYOffset === 0 ) {
      window.scrollTo( 0, 0 );
    }

    // Start scrolling animation

    startAnimateScroll();
  };

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( classie );
    define( Ajax );
    define( onEvent );
    define( Size );
    define( Scroll );
    define( setLimit );
    define( getLocation );

  } else {
    // browser global
    window.c = classie;
    window.Ajax = window.Ajax || Ajax;
    window.Size = window.Size || Size;
    window.Scroll = window.Scroll || Scroll;
    window.setLimit = window.setLimit || setLimit;
    window.onEvent = window.onEvent || onEvent;
    window.delConfirm = window.delConfirm || delConfirm;
    window.animateScroll = window.animateScroll || animateScroll;
  }

})( window );