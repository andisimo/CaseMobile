//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var authRequestQueue = [],
        currentRequest,
        nextAuthReqId = 0,
        sendNextRequest = function() {
            if (authRequestQueue.length !== 0) {
                currentRequest = authRequestQueue.shift();
                currentRequest.id = ++nextAuthReqId;
                var req = AppMagic.Services.Results.createAuth(currentRequest.id, currentRequest.providerName, currentRequest.config);
                AppMagic.Dispatch.postResult(0, req)
            }
        },
        requestAuthentication = function(providerName, config) {
            return new Core.Promise(function(complete, error) {
                    authRequestQueue.push({
                        providerName: providerName, config: config, complete: complete, error: error
                    });
                    currentRequest || sendNextRequest()
                })
        },
        completeAuthentication = function(result) {
            return result.succeeded ? currentRequest.complete(result.token) : currentRequest.error(result.error), currentRequest = null, sendNextRequest(), !0
        },
        MicrosoftAccountAuthMixin = {
            _authPromise: null, authenticate: function() {
                    return Core.Promise.is(this._authPromise) || (this._authPromise = requestAuthentication("msauth", {scope: "wl.photos"})), this._authPromise
                }
        },
        OAuthMixin = {authenticate: function(config) {
                return requestAuthentication("oauth", config)
            }},
        FacebookAuthMixin = {
            _authPromise: null, authenticate: function(nocache) {
                    return (nocache || !Core.Promise.is(this._authPromise)) && (this._authPromise = requestAuthentication("amsauth", {
                            provider: "facebook", nocache: nocache || !1
                        })), this._authPromise
                }
        },
        OAuth = Core.Class.define();
    Core.Class.mix(OAuth, OAuthMixin);
    Core.Namespace.define("AppMagic.Services.Auth", {
        Mixins: {
            Facebook: FacebookAuthMixin, MicrosoftAccount: MicrosoftAccountAuthMixin, OAuth: OAuthMixin
        }, oAuth: new OAuth, request: requestAuthentication, complete: completeAuthentication
    })
})(WinJS);