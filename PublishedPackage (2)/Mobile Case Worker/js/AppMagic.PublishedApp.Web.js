//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var WebErrorHandler = function() {
                    function WebErrorHandler(){}
                    return WebErrorHandler.prototype.showErrorAndTerminate = function(error) {
                            var content = error.message || Application.GenericInitError,
                                md = new AppMagic.Popups.MessageDialog(content, Application.GenericInitTitle);
                            return md.showAsync()
                        }, WebErrorHandler.prototype.terminate = function(error){}, WebErrorHandler
                }();
            Application.WebErrorHandler = WebErrorHandler
        })(Publish.Application || (Publish.Application = {}));
        var Application = Publish.Application
    })(AppMagic.Publish || (AppMagic.Publish = {}));
    var Publish = AppMagic.Publish
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var WebSessionState = function() {
                    function WebSessionState() {
                        this._state = null
                    }
                    return WebSessionState.prototype.setSessionState = function(state) {
                            this._state = state
                        }, WebSessionState.prototype.getSessionState = function() {
                            return this._state
                        }, WebSessionState
                }();
            Application.WebSessionState = WebSessionState
        })(Publish.Application || (Publish.Application = {}));
        var Application = Publish.Application
    })(AppMagic.Publish || (AppMagic.Publish = {}));
    var Publish = AppMagic.Publish
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    function start() {
        var errorHandler = new AppMagic.Publish.Application.WebErrorHandler,
            sessionState = new AppMagic.Publish.Application.WebSessionState,
            application = new AppMagic.Publish.Application.PublishedApp(errorHandler, sessionState),
            applicationEventArgs = new AppMagic.Publish.Application.AppActivationEventArgs;
        applicationEventArgs.ActivationType = 0;
        applicationEventArgs.PreviousExecutionState = 0;
        application.onActivated(applicationEventArgs)
    }
    AppMagic.start = start
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Settings) {
        var WebSettingsProvider = function() {
                function WebSettingsProvider(){}
                return WebSettingsProvider.prototype.load = function() {
                        return WinJS.Promise.as(!0)
                    }, WebSettingsProvider.prototype.save = function() {
                        return WinJS.Promise.as(!0)
                    }, WebSettingsProvider.prototype.getValue = function(key) {
                            return null
                        }, WebSettingsProvider.prototype.removeValue = function(key){}, WebSettingsProvider.prototype.setValue = function(key, value){}, WebSettingsProvider
            }();
        Settings.WebSettingsProvider = WebSettingsProvider
    })(AppMagic.Settings || (AppMagic.Settings = {}));
    var Settings = AppMagic.Settings
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var __extends = this.__extends || function(d, b) {
        for (var p in b)
            b.hasOwnProperty(p) && (d[p] = b[p]);
        function __() {
            this.constructor = d
        }
        __.prototype = b.prototype;
        d.prototype = new __
    },
    AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        var WebDynamicDataSourceFactory = function(_super) {
                __extends(WebDynamicDataSourceFactory, _super);
                function WebDynamicDataSourceFactory() {
                    _super.call(this);
                    this.dynamicDataSources[AppMagic.Strings.LocationDataSourceName] = new DynamicDataSource.HTML5LocationDataSource
                }
                return WebDynamicDataSourceFactory
            }(DynamicDataSource.DynamicDataSourceFactory);
        DynamicDataSource.WebDynamicDataSourceFactory = WebDynamicDataSourceFactory
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
AppMagic.Services.Importer.instance = new AppMagic.Services.PackagedServiceImporter;
AppMagic.Settings.instance = new AppMagic.Settings.WebSettingsProvider;
AppMagic.MarkupService.instance = new AppMagic.MarkupService.PackagedMarkupService;
AppMagic.DynamicDataSource.instance = new AppMagic.DynamicDataSource.WebDynamicDataSourceFactory;
AppMagic.Encryption.instance = new AppMagic.Encryption.WebEncryptionProvider;
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Encryption) {
        var WebEncryptionProvider = function() {
                function WebEncryptionProvider(){}
                return WebEncryptionProvider.prototype.generateHmacSha1Signature = function(sigBaseString, keyText) {
                        return ""
                    }, WebEncryptionProvider
            }();
        Encryption.WebEncryptionProvider = WebEncryptionProvider
    })(AppMagic.Encryption || (AppMagic.Encryption = {}));
    var Encryption = AppMagic.Encryption
})(AppMagic || (AppMagic = {}));