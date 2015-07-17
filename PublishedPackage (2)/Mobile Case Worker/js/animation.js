//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var ScreenTransitionType = {
            cover: "cover", fade: "fade", uncover: "uncover", none: "none"
        };
    function screenTransition(type, incomingElement, outgoingElement) {
        if (incomingElement === outgoingElement)
            return Core.Promise.wrap(!0);
        outgoingElement || (outgoingElement = {style: {}});
        function finish() {
            incomingElement.style.display = "block";
            incomingElement.style.opacity = 1;
            incomingElement.style.zIndex = 1;
            incomingElement.style.transform = "none";
            Core.Utilities.removeClass(incomingElement, "offScreen");
            Core.Utilities.removeClass(incomingElement, "disabled");
            outgoingElement.style.zIndex = 0;
            outgoingElement.style.transform = "none";
            Core.Utilities.addClass(outgoingElement, "offScreen");
            Core.Utilities.removeClass(outgoingElement, "disabled")
        }
        incomingElement.style.display = "block";
        outgoingElement.style.display = "block";
        Core.Utilities.addClass(incomingElement, "disabled");
        Core.Utilities.addClass(outgoingElement, "disabled");
        Core.Utilities.removeClass(incomingElement, "offScreen");
        switch (type) {
            case ScreenTransitionType.cover:
                return incomingElement.style.zIndex = 2, outgoingElement.style.zIndex = 1, Core.UI.executeTransition(incomingElement, {
                            property: "transform", delay: 0, duration: 500, timing: "cubic-bezier(.13, .3, .02, .98)", from: "translate(100%, 0px)", to: "none"
                        }).then(finish);
            case ScreenTransitionType.uncover:
                return incomingElement.style.zIndex = 1, outgoingElement.style.zIndex = 2, Core.UI.executeTransition(outgoingElement, {
                            property: "transform", delay: 0, duration: 350, timing: "cubic-bezier(.41, .1, .86, .71)", from: "none", to: "translate(-100%, 0px)"
                        }).then(finish);
            case ScreenTransitionType.fade:
                return incomingElement.style.zIndex = 2, outgoingElement.style.zIndex = 1, Core.UI.executeTransition(incomingElement, {
                            property: "opacity", delay: 0, duration: 200, timing: "ease-out", from: 0, to: 1
                        }).then(finish);
            case ScreenTransitionType.none:
            default:
                return finish(), Core.Promise.wrap(!0)
        }
    }
    Core.Namespace.define("AppMagic.AuthoringTool.Animation", {
        ScreenTransitionType: ScreenTransitionType, screenTransition: screenTransition
    })
})(WinJS);