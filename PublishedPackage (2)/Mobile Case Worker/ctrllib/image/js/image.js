//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var converters = AppMagic.Controls.converters,
        Image = Core.Class.define(function Image_ctor(){}, {
            initControlContext: function(controlContext) {
                AppMagic.Utility.createOrSetPrivate(controlContext, "imageUrl", ko.observable(""));
                AppMagic.Utility.createOrSetPrivate(controlContext, "_isLoaded", !0)
            }, disposeControlContext: function(controlContext) {
                    controlContext._isLoaded = !1;
                    delete controlContext.imageUrl
                }, initView: function(container, controlContext) {
                    ko.applyBindings(controlContext, container)
                }, onChangeImage: function(evt, controlContext) {
                    AppMagic.Utility.mediaUrlHelper(evt.oldValue, evt.newValue, !0).then(function(src) {
                        controlContext._isLoaded && controlContext.imageUrl(src)
                    }, function(){})
                }
        }, {});
    Core.Namespace.define("AppMagic.Controls", {Image: Image})
})(WinJS);