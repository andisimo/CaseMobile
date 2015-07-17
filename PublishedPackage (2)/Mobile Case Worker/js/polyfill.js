//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
if (window.Windows || (window.Windows = {}), navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, window.setImmediate || (window.setImmediate = function(functionToExecute) {
        return window.setTimeout(functionToExecute, 0)
    }, window.clearImmediate = function(handle) {
        window.clearTimeout(handle)
    }), !window.PointerEvent) {
    function nop(){}
    var pointerEventsMap = {};
    function addPointerHandlers(element, eventNameLowercase, callback, capture) {
        pointerEventsMap[element.uniqueID] || (pointerEventsMap[element.uniqueID] = {});
        pointerEventsMap[element.uniqueID][eventNameLowercase] || (pointerEventsMap[element.uniqueID][eventNameLowercase] = []);
        var mouseWrapper,
            touchWrapper,
            translations = eventTranslations[eventNameLowercase];
        translations.mouse && (mouseWrapper = function(e) {
            return e.type = eventNameLowercase, mouseEventTranslator(translations.mouse, callback, e)
        }, element.addEventListener(translations.mouse, mouseWrapper, capture));
        translations.touch && (touchWrapper = function(e) {
            return e.type = eventNameLowercase, touchEventTranslator(callback, e)
        }, element.addEventListener(translations.touch, touchWrapper, capture));
        pointerEventsMap[element.uniqueID][eventNameLowercase].push({
            originalCallback: callback, mouseWrapper: mouseWrapper, touchWrapper: touchWrapper, capture: capture
        })
    }
    function removePointerHandlers(element, eventNameLowercase, callback, capture) {
        if (pointerEventsMap[element.uniqueID] && pointerEventsMap[element.uniqueID][eventNameLowercase])
            for (var mappedEvents = pointerEventsMap[element.uniqueID][eventNameLowercase], i = 0; i < mappedEvents.length; i++) {
                var mapping = mappedEvents[i];
                if (mapping.originalCallback === callback && !!capture == !!mapping.capture) {
                    var translations = eventTranslations[eventNameLowercase];
                    mapping.mouseWrapper && element.removeEventListener(translations.mouse, mapping.mouseWrapper, capture);
                    mapping.touchWrapper && element.removeEventListener(translations.touch, mapping.touchWrapper, capture);
                    mappedEvents.splice(i, 1);
                    break
                }
            }
    }
    var touchPropertiesToCopy = ["screenX", "screenY", "clientX", "clientY", "pageX", "pageY", "radiusX", "radiusY", "rotationAngle", "force"];
    function moveTouchPropertiesToEventObject(eventObject, touchObject) {
        eventObject.pointerId = touchObject.identifier;
        eventObject.pointerType = "touch";
        for (var i = 0; i < touchPropertiesToCopy.length; i++) {
            var prop = touchPropertiesToCopy[i];
            eventObject[prop] = touchObject[prop]
        }
    }
    function touchEventTranslator(callback, eventObject) {
        eventObject.preventDefault();
        for (var changedTouches = eventObject.changedTouches, retVal = null, i = 0; i < changedTouches.length; i++)
            moveTouchPropertiesToEventObject(eventObject, changedTouches[i]),
            retVal = retVal || callback(eventObject);
        return retVal
    }
    var lastMouseID = -1;
    function mouseEventTranslator(name, callback, eventObject) {
        return eventObject.pointerType = "mouse", eventObject.pointerId = lastMouseID, name === "mouseup" && lastMouseID--, callback(eventObject)
    }
    var eventTranslations = {
            pointerdown: {
                touch: "touchstart", mouse: "mousedown"
            }, pointerup: {
                    touch: "touchend", mouse: "mouseup"
                }, pointermove: {
                    touch: "touchmove", mouse: "mousemove"
                }, pointerenter: {
                    touch: null, mouse: "mouseenter"
                }, pointerover: {
                    touch: null, mouse: "mouseover"
                }, pointerout: {
                    touch: "touchleave", mouse: "mouseout"
                }, pointercancel: {
                    touch: "touchcancel", mouse: null
                }
        },
        originalAddEventListener = HTMLElement.prototype.addEventListener,
        originalRemoveEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.addEventListener = function(name, callback, capture) {
        var eventNameLower = name && name.toLowerCase();
        return eventTranslations[eventNameLower] ? addPointerHandlers(this, eventNameLower, callback, capture) : originalAddEventListener.call(this, name, callback, capture)
    };
    HTMLElement.prototype.removeEventListener = function(name, callback, capture) {
        var eventNameLower = name && name.toLowerCase();
        return eventTranslations[eventNameLower] ? removePointerHandlers(this, eventNameLower, callback, capture) : originalRemoveEventListener.call(this, name, callback, capture)
    };
    HTMLElement.prototype.setPointerCapture = nop;
    HTMLElement.prototype.releasePointerCapture = nop
}