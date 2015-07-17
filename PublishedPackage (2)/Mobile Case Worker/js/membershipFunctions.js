//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("AppMagic.Functions", {
        in_SS: function(left, right) {
            return left === null ? right === null : right === null ? !1 : typeof left != "string" || typeof right != "string" ? null : right.indexOf(left) >= 0
        }, in_ST: function(value, source) {
                if (source === null)
                    return !1;
                var lhsIsControl = AppMagic.AuthoringTool.Runtime.isOpenAjaxControl(value);
                if (!(source instanceof Array) || value !== null && !lhsIsControl && typeof value == "object")
                    return null;
                for (var i = 0, len = source.length; i < len; i++) {
                    var row = source[i];
                    if (typeof row == "object") {
                        var colNames = Object.keys(row);
                        if (colNames.length === 1) {
                            if (lhsIsControl) {
                                if (AppMagic.Utility.deepCompare(value, row[colNames[0]]))
                                    return !0;
                                continue
                            }
                            if (value === row[colNames[0]])
                                return !0
                        }
                    }
                }
                return !1
            }, in_RT: function(value, source) {
                if (source === null)
                    return !1;
                if (!(source instanceof Array) || typeof value != "object")
                    return null;
                for (var i = 0, len = source.length; i < len; i++) {
                    var row = source[i];
                    if (typeof row == "object" && AppMagic.Utility.deepCompare(value, row))
                        return !0
                }
                return !1
            }
    })
})(WinJS);