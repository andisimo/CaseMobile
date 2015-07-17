//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var NotificationView = Core.Class.define(function NotificationView_ctor(element) {
            ko.applyBindings(AppMagic.AuthoringTool.Runtime.notificationViewModel, element)
        }, {}, {});
    AppMagic.UI.Pages.define("/controls/common/notification/notification.html", NotificationView)
})(WinJS);