//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var ProgressIndicatorView = Core.Class.define(function ProgressIndicatorView_ctor(element) {
            ko.applyBindings(element.viewModel, element.children[0])
        }, {}, {});
    AppMagic.UI.Pages.define("/controls/common/progressIndicator/progressIndicator.html", ProgressIndicatorView)
})(WinJS);