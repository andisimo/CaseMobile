//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var WaitDialogBodyView = Core.Class.define(function WaitDialogBodyView_ctor(element) {
            ko.applyBindings(element.viewModel, element.children[0])
        });
    AppMagic.UI.Pages.define("/controls/common/dialog/waitDialogBody.html", WaitDialogBodyView)
})(WinJS);