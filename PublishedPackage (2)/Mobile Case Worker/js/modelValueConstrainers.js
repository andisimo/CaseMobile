//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(global, Core) {"use strict";
    Core.Namespace.define("AppMagic.Controls.modelValueConstrainers", {
        valueRangeConstrainer: function(value, minValue, maxValue) {
            return value === null ? null : minValue !== null && value < minValue ? minValue : maxValue !== null && value > maxValue ? maxValue : value
        }, screenWidthConstrainer: function(value) {
                return value === null ? 0 : AppMagic.Controls.modelValueConstrainers.valueRangeConstrainer(value, 0, AppMagic.Constants.ScreenWidth)
            }, screenHeightConstrainer: function(value) {
                return value === null ? 0 : AppMagic.Controls.modelValueConstrainers.valueRangeConstrainer(value, 0, AppMagic.Constants.ScreenHeight)
            }, templateWidthConstrainer: function(value) {
                return value === null ? AppMagic.Constants.MinimumTemplateWidth : AppMagic.Controls.modelValueConstrainers.valueRangeConstrainer(value, AppMagic.Constants.MinimumTemplateWidth, AppMagic.Constants.ScreenWidth)
            }, templateHeightConstrainer: function(value) {
                return value === null ? AppMagic.Constants.MinimumTemplateHeight : AppMagic.Controls.modelValueConstrainers.valueRangeConstrainer(value, AppMagic.Constants.MinimumTemplateHeight, AppMagic.Constants.ScreenHeight)
            }
    })
})(this, WinJS);