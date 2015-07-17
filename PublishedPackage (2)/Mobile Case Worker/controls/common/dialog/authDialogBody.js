//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var MSWebViewNavigationStartingEvent = "MSWebViewNavigationStarting",
        MSWebViewNavigationCompletedEvent = "MSWebViewNavigationCompleted",
        AuthDialogBodyView = Core.Class.define(function AuthDialogBodyView_ctor(element) {
            ko.applyBindings(element.viewModel, element.children[0]);
            this._authenticationViewModel = element.viewModel;
            var webViewElements = element.getElementsByTagName("x-ms-webview");
            this._webViewElement = webViewElements[0];
            this._eventTracker = new AppMagic.Utility.EventTracker;
            this._eventTracker.add(this._webViewElement, MSWebViewNavigationStartingEvent, this._onNavigationStarting.bind(this));
            this._eventTracker.add(this._webViewElement, MSWebViewNavigationCompletedEvent, this._onNavigationCompleted.bind(this));
            this._navigatedUris = [];
            Core.UI.Animation.enterContent(element);
            setImmediate(function() {
                this._navigate(this._authenticationViewModel.requestUri)
            }.bind(this));
            ko.utils.domNodeDisposal.addDisposeCallback(element.children[0], this._dispose.bind(this))
        }, {
            _eventTracker: null, _onNavigationCompletedHandler: null, _onNavigationStartingHandler: null, _webViewElement: null, _authenticationViewModel: null, _navigatedUris: null, _dispose: function() {
                    this._eventTracker.dispose()
                }, _navigate: function(uri) {
                    try {
                        this._webViewElement.src = uri
                    }
                    catch(e) {
                        this._authenticationViewModel.notifyAuthenticationComplete({
                            responseData: uri, authenticationStatus: AppMagic.Services.AuthenticationStatus.invalidUrl, navigatedUris: this._navigatedUris
                        })
                    }
                }, _onNavigationStarting: function(navigationEvent) {
                    this._navigatedUris.push(navigationEvent.uri);
                    navigationEvent.uri.indexOf(this._authenticationViewModel.callbackUri) === 0 && this._authenticationViewModel.notifyAuthenticationComplete({
                        responseData: navigationEvent.uri, authenticationStatus: AppMagic.Services.AuthenticationStatus.success, navigatedUris: this._navigatedUris
                    })
                }, _onNavigationCompleted: function(navigationEvent) {
                    this._authenticationViewModel.hasLoaded = !0;
                    this._webViewElement.focus();
                    navigationEvent.isSuccess || this._authenticationViewModel.notifyAuthenticationComplete({
                        responseData: navigationEvent.uri, authenticationStatus: AppMagic.Services.AuthenticationStatus.httpError, navigatedUris: this._navigatedUris
                    })
                }
        });
    AppMagic.UI.Pages.define("/controls/common/dialog/authDialogBody.html", AuthDialogBodyView)
})(WinJS);