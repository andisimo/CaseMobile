//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var Polygon = AppMagic.Controls.Shapes.Polygon,
        Pentagon = Core.Class.derive(Polygon, function Pentagon_ctor(){}, {
            initView: function(container, controlContext) {
                Polygon.prototype.initView.call(this, container, controlContext)
            }, _getPoints: function(controlContext) {
                    var borderThickness = controlContext.modelProperties.BorderStyle.getValue() !== "none" ? controlContext.modelProperties.BorderThickness.getValue() : 0,
                        borderThicknessByTwo = borderThickness * .5,
                        width = controlContext.modelProperties.Width.getValue() - borderThickness,
                        height = controlContext.modelProperties.Height.getValue() - borderThickness,
                        p1x = width * .5 + borderThicknessByTwo,
                        p1y = borderThicknessByTwo,
                        p2x = borderThicknessByTwo,
                        p2y = height * .4 + borderThicknessByTwo,
                        p3x = width * .2 + borderThicknessByTwo,
                        p3y = height + borderThicknessByTwo,
                        p4x = width * .8 + borderThicknessByTwo,
                        p4y = height + borderThicknessByTwo,
                        p5x = width + borderThicknessByTwo,
                        p5y = height * .4 + borderThicknessByTwo;
                    return Polygon.formatPoints([p1x, p2x, p3x, p4x, p5x], [p1y, p2y, p3y, p4y, p5y])
                }
        }, {});
    Core.Namespace.define("AppMagic.Controls.Shapes", {Pentagon: Pentagon})
})(WinJS);