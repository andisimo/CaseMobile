//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core, Platform) {"use strict";
    var WebViewAuthenticationBroker = Core.Class.define(function WebViewAuthenticationBroker_ctor(){}, {authenticateAsync: function(requestUri, callbackUri) {
                var completed,
                    promise = new Core.Promise(function(comp) {
                        completed = comp
                    }),
                    dialog = new AppMagic.Popups.AuthenticationDialog(requestUri, callbackUri);
                return dialog.showAsync().then(function() {
                        var result = dialog.authenticationResult;
                        completed(result)
                    }), promise
            }});
    Core.Namespace.define("AppMagic.Services", {WebViewAuthenticationBroker: WebViewAuthenticationBroker})
})(WinJS, Windows);