//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(global, Core) {"use strict";
    Core.Namespace.define("AppMagic.Controls.converters", {
        encodeImageUrl: {view: function(value) {
                return value === null ? value : (value = AppMagic.Utility.decodeImageUrl(value), encodeURI(decodeURI(value)))
            }}, imagePositionConverter: {view: function(value) {
                    var retValue = {};
                    if (value === null)
                        return retValue;
                    switch (value.toLowerCase()) {
                        case"fill":
                            retValue = {
                                size: "cover", repeat: "no-repeat", position: "center"
                            };
                            break;
                        case"stretch":
                            retValue = {
                                size: "100% 100%", repeat: "no-repeat", position: "center"
                            };
                            break;
                        case"tile":
                            retValue = {
                                size: "auto auto", repeat: "repeat", position: "left top"
                            };
                            break;
                        case"center":
                            retValue = {
                                size: "auto", repeat: "no-repeat", position: "center"
                            };
                            break;
                        case"fit":
                        default:
                            retValue = {
                                size: "contain", repeat: "no-repeat", position: "center"
                            };
                            break
                    }
                    return retValue
                }}, argbConverter: {view: function(argb) {
                    if (argb === null)
                        return null;
                    var color = AppMagic.Utility.Color.create(argb);
                    return color.toCss()
                }}, fontConverter: {view: function(value) {
                    return value === null ? "Segoe UI" : value + ", Segoe UI"
                }}, ptConverter: {
                view: function(value) {
                    return AppMagic.Controls.converters._appendUnit(value, "pt")
                }, model: function(value) {
                        return AppMagic.Controls.converters._stripUnit(value, "pt")
                    }
            }, pxConverter: {
                view: function(value) {
                    return AppMagic.Controls.converters._appendUnit(value, "px")
                }, model: function(value) {
                        return AppMagic.Controls.converters._stripUnit(value, "px")
                    }
            }, strokeConverter: {
                view: function(value) {
                    value === null && (value = "");
                    switch (value.toLowerCase()) {
                        case"dotted":
                            return "2,2";
                        case"dashed":
                            return "5,2";
                        case"solid":
                            return "none";
                        case"none":
                            return "0,0";
                        default:
                            return "0,0"
                    }
                }, model: function(value) {
                        switch (value.toLowerCase()) {
                            case"0,0":
                                return "none";
                            case"2,2":
                                return "dotted";
                            case"5,2":
                                return "dashed";
                            case"none":
                                return "solid";
                            default:
                                return "none"
                        }
                    }
            }, italicConverter: {view: function(value) {
                    return value ? "italic" : "normal"
                }}, overflowConverter: {view: function(value) {
                    return value !== null && (value = value.toLowerCase()), value === "scroll" ? "auto" : "hidden"
                }}, borderStyleConverter: {view: function(value) {
                    return (value !== null && (value = value.toLowerCase()), value === "solid" || value === "dotted" || value === "dashed") ? value : "none"
                }}, _appendUnit: function(value, unit) {
                return value === null ? value : value.toString() + unit
            }, _stripUnit: function(value, unit) {
                return value === null ? value : parseInt(value.substr(0, value.length - unit.length))
            }
    })
})(this, WinJS);