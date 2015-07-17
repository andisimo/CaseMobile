//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var _processClonedHtml = function(cloneRoot) {
            if (cloneRoot.removeAttribute("id"), cloneRoot.removeAttribute("data-bind"), cloneRoot.removeAttribute("data-win-control"), cloneRoot.removeAttribute("data-win-options"), cloneRoot.children)
                for (var i = 0, len = cloneRoot.children.length; i < len; i++)
                    _processClonedHtml(cloneRoot.children[i])
        };
    Core.Namespace.define("AppMagic.AuthoringTool.DomUtil", {
        cloneRenderedHtml: function(root) {
            var cloneRoot = root.cloneNode(!0);
            return _processClonedHtml(cloneRoot), cloneRoot
        }, empty: function(root) {
                while (root.hasChildNodes())
                    root.removeChild(root.lastChild)
            }, getElementChildIndex: function(parentElement, item) {
                for (var childIndex = -1, i = 0, count = parentElement.children.length; i < count; i++)
                    if (item === parentElement.children[i]) {
                        childIndex = i;
                        break
                    }
                return childIndex
            }, insertAfter: function(parentElement, newItem, existingItem) {
                var nextElement = null;
                if (existingItem)
                    for (var i = 0, count = parentElement.children.length; i < count; i++) {
                        var child = parentElement.children[i];
                        if (child === existingItem && i + 1 < count) {
                            nextElement = parentElement.children[++i];
                            break
                        }
                    }
                nextElement ? parentElement.insertBefore(newItem, nextElement) : parentElement.appendChild(newItem)
            }, injectScript: function(uri) {
                var script = document.createElement("script"),
                    clear = function() {
                        script.onload = null;
                        script.onerror = null
                    },
                    promise = new Core.Promise(function(complete, error) {
                        script.onload = function() {
                            complete();
                            clear()
                        };
                        script.onerror = function() {
                            error();
                            clear()
                        }
                    });
                return script.src = uri, script.type = "text/javascript", document.head.appendChild(script), promise
            }, injectCss: function(uri) {
                var css = document.createElement("link");
                return css.href = uri, css.type = "text/css", css.rel = "stylesheet", document.head.appendChild(css), Core.Promise.wrap(!0)
            }, injectMarkup: function(uri) {
                return AppMagic.MarkupService.instance.injectMarkup(uri)
            }
    });
    Core.Namespace.define("AppMagic.AnimationUtil", {
        quickFadeIn: function(element) {
            var executeFade = function() {
                    Core.Utilities.addClass(element, "appmagic-fadein-quick");
                    element.style.visibility = "visible";
                    element.addEventListener("animationend", function(evt) {
                        evt.animationName === "appmagic-fadein-keyframes" && Core.Utilities.removeClass(element, "appmagic-fadein-quick")
                    })
                };
            element.classList && element.classList.contains("appmagic-fadein-quick") ? (Core.Utilities.removeClass(element, "appmagic-fadein-quick"), element.style.visibility = "hidden", AppMagic.Utility.executeOnceAsync(executeFade, element.id + "_executeFade", 0)) : executeFade()
        }, quickFadeOut: function(element, remove) {
                Core.Utilities.addClass(element, "appmagic-fadeout-quick");
                remove && element.addEventListener("animationend", function(evt) {
                    evt.animationName === "appmagic-fadeout-keyframes" && element.parentElement && element.parentElement.removeChild(element)
                })
            }
    })
})(WinJS);