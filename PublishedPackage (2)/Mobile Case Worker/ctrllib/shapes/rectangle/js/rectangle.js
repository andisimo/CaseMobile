//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var Polygon = AppMagic.Controls.Shapes.Polygon,
        Rectangle = Core.Class.derive(Polygon, function Rectangle_ctor(){}, {
            initView: function(container, controlContext) {
                Polygon.prototype.initView.call(this, container, controlContext)
            }, _getPoints: function(controlContext) {
                    var borderThickness = controlContext.modelProperties.BorderStyle.getValue() !== "none" ? controlContext.modelProperties.BorderThickness.getValue() : 0,
                        borderThicknessByTwo = borderThickness * .5,
                        width = controlContext.modelProperties.Width.getValue() - borderThickness,
                        height = controlContext.modelProperties.Height.getValue() - borderThickness,
                        p1x = borderThicknessByTwo,
                        p1y = borderThicknessByTwo,
                        p2x = borderThicknessByTwo,
                        p2y = height + borderThicknessByTwo,
                        p3x = width + borderThicknessByTwo,
                        p3y = height + borderThicknessByTwo,
                        p4x = width + borderThicknessByTwo,
                        p4y = borderThicknessByTwo;
                    return Polygon.formatPoints([p1x, p2x, p3x, p4x], [p1y, p2y, p3y, p4y])
                }
        }, {});
    Core.Namespace.define("AppMagic.Controls.Shapes", {Rectangle: Rectangle})
})(WinJS);