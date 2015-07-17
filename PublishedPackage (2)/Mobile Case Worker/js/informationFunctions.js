//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("AppMagic.Functions", {
        language: function() {
            return Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleName
        }, isNumeric: function(source) {
                switch (typeof source) {
                    case"number":
                        return !0;
                    case"string":
                        return !AppMagic.Functions.isBlank(AppMagic.Functions.value(source));
                    default:
                        return !1
                }
            }
    })
})(WinJS);