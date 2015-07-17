//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var NotificationViewModel = Core.Class.define(function NotificationViewModel_ctor() {
            this._pageViewModel = ko.observable(null)
        }, {
            _pageViewModel: null, pageViewModel: {
                    get: function() {
                        return this._pageViewModel()
                    }, set: function(value) {
                            this._pageViewModel(value)
                        }
                }
        }, {});
    Core.Namespace.define("AppMagic.AuthoringTool.ViewModels", {NotificationViewModel: NotificationViewModel})
})(WinJS);