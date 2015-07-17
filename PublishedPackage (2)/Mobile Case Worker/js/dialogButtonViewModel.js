//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var DialogButtonViewModel = Core.Class.define(function DialogButtonViewModel_ctor(title, clickFunction, isEnabledObservable) {
            this._clickFunction = clickFunction;
            this._title = title;
            this._isEnabled = isEnabledObservable || ko.observable(!0)
        }, {
            _clickFunction: null, _title: null, _isEnabled: null, title: {get: function() {
                        return this._title
                    }}, isEnabled: {get: function() {
                        return this._isEnabled()
                    }}, onButtonClick: function() {
                    return this._clickFunction(), !1
                }, onButtonKeyDown: function(e) {
                    return e.key === AppMagic.AuthoringTool.Keys.enter && !AppMagic.Utility.isNullOrUndefined(this._clickFunction) ? (this._clickFunction(), !1) : !0
                }
        });
    Core.Namespace.define("AppMagic.Popups", {DialogButtonViewModel: DialogButtonViewModel})
})(WinJS);