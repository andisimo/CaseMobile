//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var util = AppMagic.Utility,
        MSAuth = Core.Class.define(function MSAuth_ctor(){}, {
            _processAuth: function(auth) {
                return auth.tickets[0].value
            }, authenticate: function(config) {
                    var cfg = config || {},
                        scope = cfg.scope || AppMagic.Constants.Services.DEFAULT_MSAUTH_SCOPE,
                        authNS = Windows.Security.Authentication.OnlineId,
                        authenticator = new authNS.OnlineIdAuthenticator,
                        ticketRequest = new authNS.OnlineIdServiceTicketRequest(scope, "DELEGATION");
                    return authenticator.authenticateUserAsync(ticketRequest).then(this._processAuth)
                }
        }, {}),
        OAuth = Core.Class.define(function OAuth_ctor(){}, {
            _processAuth: function(config, resp) {
                if (resp.responseStatus !== 0)
                    throw new Error(AppMagic.Strings.OAuthErrorBadResponse);
                var data = resp.responseData,
                    resultString = data.substr(data.lastIndexOf("#") + 1).trim(),
                    token = {};
                if (resultString) {
                    resultString.split("&").forEach(function(s) {
                        var kv = s.split("="),
                            key = kv[0],
                            value = decodeURIComponent(kv[1] || "");
                        switch (key) {
                            case AppMagic.Constants.Services.OAUTH_TOKEN_PARAM:
                                token.access_token = value;
                                break;
                            case AppMagic.Constants.Services.OAUTH_EXPIRES_PARAM:
                                token.expires = Date.now();
                                var tmp = parseInt(value, 10);
                                isNaN(tmp) || (token.expires += tmp * 1e3);
                                break;
                            case AppMagic.Constants.Services.OAUTH_ERROR_PARAM:
                                throw new Error(value);
                        }
                    });
                    var cachedTokens = AppMagic.Settings.instance.getValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY) || {},
                        cacheKey = config.authUri + "|" + config.clientId;
                    cachedTokens[cacheKey] = token;
                    AppMagic.Settings.instance.setValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY, cachedTokens)
                }
                return token.access_token || ""
            }, authenticate: function(config) {
                    var endpoint = config.authUri,
                        callback = config.callbackUri,
                        clientId = config.clientId,
                        scope = (config.scope || []).map(encodeURIComponent).join("+"),
                        cachedTokens = AppMagic.Settings.instance.getValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY) || {},
                        cacheKey = endpoint + "|" + clientId + "|" + scope,
                        cachedToken = cachedTokens[cacheKey];
                    if (typeof cachedToken != "undefined")
                        if (!cachedToken.expires || cachedToken.expires > Date.now())
                            return cachedToken.access_token;
                        else
                            delete cachedTokens[cacheKey],
                            AppMagic.Settings.instance.setValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY, cachedTokens);
                    var broker = Windows.Security.Authentication.Web.WebAuthenticationBroker,
                        options = Windows.Security.Authentication.Web.WebAuthenticationOptions.none,
                        sep = endpoint.indexOf("?") === -1 ? "?" : "&",
                        uri = new Windows.Foundation.Uri(endpoint + sep + "response_type=token" + "&redirect_uri=" + encodeURIComponent(callback) + "&client_id=" + encodeURIComponent(clientId) + "&scope=" + scope + "&access_type=online"),
                        callbackUri = new Windows.Foundation.Uri(callback);
                    return broker.authenticateAsync(options, uri, callbackUri).then(this._processAuth.bind(this, config))
                }
        }),
        AMS_AUTH_URI_BASE = AppMagic.Constants.Services.ZUMO_APP_URI + "login/",
        AMS_AUTH_CALLBACK_URI = AMS_AUTH_URI_BASE + "done",
        AMS_TOKEN_SETTINGS_KEY = AppMagic.Constants.Services.ZUMO_AUTH_TOKENS_SETTINGS_KEY,
        AzureMobileAuth = Core.Class.define(function AzureMobileAuth_ctor(){}, {
            _processProviderTokens: function(targetProvider, identities) {
                for (var keys = Object.keys(identities), len = keys.length, cachedTokens = AppMagic.Settings.instance.getValue(AMS_TOKEN_SETTINGS_KEY) || {}, i = 0; i < len; i++) {
                    var provider = keys[i],
                        token = identities[provider];
                    cachedTokens[provider] = token
                }
                return AppMagic.Settings.instance.setValue(AMS_TOKEN_SETTINGS_KEY, cachedTokens), cachedTokens[targetProvider]
            }, _acquireProviderToken: function(targetProvider, amsToken) {
                    return new AppMagic.Services.Channel(AppMagic.Constants.Services.ZUMO_APP_URI).path("tables").path(AppMagic.Constants.Services.ZUMO_AUTH_TABLE).header("X-ZUMO-AUTH", amsToken.authenticationToken).get().then(this._processProviderTokens.bind(this, targetProvider))
                }, _processAuth: function(targetProvider, auth) {
                    var data = auth.responseData,
                        i = data.indexOf(AppMagic.Constants.Services.AMS_TOKEN_ANCHOR);
                    if (i > 0)
                        return data = data.substr(i + AppMagic.Constants.Services.AMS_TOKEN_ANCHOR.length), data = decodeURIComponent(data), this._acquireProviderToken(targetProvider, JSON.parse(data));
                    else if (i = data.indexOf(AppMagic.Constants.Services.AMS_ERROR_ANCHOR), i > 0) {
                        data = data.substr(i + AppMagic.Constants.Services.AMS_ERROR_ANCHOR.length);
                        data = decodeURIComponent(data);
                        throw new Error(data);
                    }
                    throw new Error(AppMagic.Strings.AMSAuthInvalidResponse);
                }, authenticate: function(config) {
                    var provider = config.provider,
                        nocache = config.nocache || !1,
                        cachedTokens = AppMagic.Settings.instance.getValue(AMS_TOKEN_SETTINGS_KEY) || {};
                    if (nocache)
                        delete cachedTokens[provider],
                        AppMagic.Settings.instance.setValue(AMS_TOKEN_SETTINGS_KEY, cachedTokens);
                    else {
                        var cachedToken = cachedTokens[provider];
                        if (typeof cachedToken != "undefined")
                            return cachedToken
                    }
                    var broker = Windows.Security.Authentication.Web.WebAuthenticationBroker,
                        options = Windows.Security.Authentication.Web.WebAuthenticationOptions.none,
                        authUri = AMS_AUTH_URI_BASE + provider,
                        uri = new Windows.Foundation.Uri(authUri),
                        callbackUri = new Windows.Foundation.Uri(AMS_AUTH_CALLBACK_URI);
                    return broker.authenticateAsync(options, uri, callbackUri).then(this._processAuth.bind(this, provider))
                }
        }, {}),
        AuthManager = Core.Class.define(function AuthManager_ctor() {
            util.createOrSetPrivate(this, "_providers", {})
        }, {
            authenticate: function(providerName, config) {
                providerName = providerName.toLowerCase();
                var provider = this._providers[providerName];
                if (!provider)
                    throw new Error(AppMagic.Strings.UnknownAuthProvider);
                return provider.authenticate(config)
            }, register: function(providerName, provider) {
                    if (providerName = providerName.toLowerCase(), this._providers[providerName])
                        throw new Error(AppMagic.Strings.DuplicateAuthProvider);
                    if (typeof provider.authenticate != "function")
                        throw new Error(AppMagic.Strings.InvalidAuthProvider);
                    this._providers[providerName] = provider
                }
        }, {});
    Core.Namespace.define("AppMagic.Services.Authentication", {manager: new AuthManager});
    AppMagic.Services.Authentication.manager.register("msauth", new MSAuth);
    AppMagic.Services.Authentication.manager.register("oauth", new OAuth);
    AppMagic.Services.Authentication.manager.register("amsauth", new AzureMobileAuth)
})(WinJS);