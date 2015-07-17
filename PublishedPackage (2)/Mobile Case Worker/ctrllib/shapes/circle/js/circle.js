//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var Shape = AppMagic.Controls.Shapes.Shape,
        Circle = Core.Class.derive(Shape, function Circle_ctor(){}, {
            initView: function(container, controlContext) {
                var borderThicknessByTwo = controlContext.modelProperties.BorderThickness.getValue() * .5,
                    halfWidth = controlContext.modelProperties.Width.getValue() * .5,
                    halfHeight = controlContext.modelProperties.Height.getValue() * .5,
                    shape = {
                        cx: ko.observable(halfWidth), cy: ko.observable(halfHeight), rx: ko.observable(halfWidth - borderThicknessByTwo), ry: ko.observable(halfHeight - borderThicknessByTwo)
                    };
                Object.defineProperty(controlContext, "shape", {
                    configurable: !1, enumerable: !0, value: shape, writable: !0
                });
                Shape.prototype.initView.call(this, container, controlContext)
            }, draw: function(controlContext) {
                    var borderThickness = controlContext.modelProperties.BorderStyle.getValue() !== "none" ? controlContext.modelProperties.BorderThickness.getValue() : 0,
                        borderThicknessByTwo = borderThickness * .5,
                        halfWidth = controlContext.modelProperties.Width.getValue() * .5,
                        halfHeight = controlContext.modelProperties.Height.getValue() * .5;
                    controlContext.shape.cx(halfWidth);
                    controlContext.shape.rx(halfWidth - borderThicknessByTwo);
                    controlContext.shape.cy(halfHeight);
                    controlContext.shape.ry(halfHeight - borderThicknessByTwo)
                }
        }, {});
    Core.Namespace.define("AppMagic.Controls.Shapes", {Circle: Circle})
})(WinJS);