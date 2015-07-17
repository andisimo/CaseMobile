//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var Label = Core.Class.define(function Label_ctor(){}, {
            initView: function(container, controlContext) {
                ko.applyBindings(controlContext, container);
                container.addEventListener("keydown", this.onKeyDown)
            }, onKeyDown: function(evt) {
                    (evt.key === "End" || evt.key === "Home") && evt.stopPropagation()
                }
        }, {});
    Core.Namespace.define("AppMagic.Controls", {Label: Label})
})(WinJS);