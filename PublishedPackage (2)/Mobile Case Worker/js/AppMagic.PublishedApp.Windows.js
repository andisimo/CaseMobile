﻿//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var WindowsErrorHandler = function() {
                    function WindowsErrorHandler(){}
                    return WindowsErrorHandler.prototype.showErrorAndTerminate = function(error) {
                            var content = error.message || Application.GenericInitError,
                                md = new AppMagic.Popups.MessageDialog(content, Application.GenericInitTitle);
                            return md.showAsync().then(function() {
                                    MSApp.terminateApp(error)
                                })
                        }, WindowsErrorHandler.prototype.terminate = function(error) {
                            MSApp.terminateApp(error)
                        }, WindowsErrorHandler
                }();
            Application.WindowsErrorHandler = WindowsErrorHandler
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
            var WindowsSessionState = function() {
                    function WindowsSessionState(){}
                    return WindowsSessionState.prototype.setSessionState = function(state) {
                            WinJS.Application.sessionState = state
                        }, WindowsSessionState.prototype.getSessionState = function() {
                            return WinJS.Application.sessionState
                        }, WindowsSessionState
                }();
            Application.WindowsSessionState = WindowsSessionState
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
        (function(Core) {"use strict";
            Core.Binding.optimizeBindingReferences = !0;
            var errorHandler = new AppMagic.Publish.Application.WindowsErrorHandler,
                sessionState = new AppMagic.Publish.Application.WindowsSessionState,
                applicationModel = new AppMagic.Publish.Application.PublishedApp(errorHandler, sessionState),
                app = Core.Application;
            app.onactivated = function(args) {
                var appMagicActivationEventArgs = createActivationEventFromWinJS(args),
                    promise = applicationModel.onActivated(appMagicActivationEventArgs),
                    startupPromise = promise.then(Core.UI.processAll);
                args.setPromise(startupPromise)
            };
            app.oncheckpoint = function(args) {
                var promise = applicationModel.onCheckpoint();
                args.setPromise(promise)
            };
            app.start()
        })(WinJS)
    }
    AppMagic.start = start;
    function createActivationEventFromWinJS(args) {
        var retArgs = new AppMagic.Publish.Application.AppActivationEventArgs,
            activationKind = window.Windows.ApplicationModel.Activation.ActivationKind;
        switch (args.detail.kind) {
            case activationKind.launch:
                retArgs.ActivationType = 0;
                break;
            default:
                retArgs.ActivationType = 1
        }
        var executionState = window.Windows.ApplicationModel.Activation.ApplicationExecutionState;
        switch (args.detail.previousExecutionState) {
            case executionState.notRunning:
                retArgs.PreviousExecutionState = 0;
                break;
            case executionState.running:
                retArgs.PreviousExecutionState = 1;
                break;
            case executionState.suspended:
                retArgs.PreviousExecutionState = 2;
                break;
            case executionState.terminated:
                retArgs.PreviousExecutionState = 3;
                break;
            case executionState.closedByUser:
                retArgs.PreviousExecutionState = 4;
                break;
            default:
                throw new Error("Unknown execution state");
        }
        return retArgs
    }
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
AppMagic.Services.CookieManager.instance = new AppMagic.Services.WindowsCookieManager;
AppMagic.Services.Importer.instance = new AppMagic.Services.PackagedServiceImporter;
AppMagic.Settings.instance = new AppMagic.Settings.WindowsSettingsProvider;
AppMagic.MarkupService.instance = new AppMagic.MarkupService.PackagedMarkupService;
AppMagic.DynamicDataSource.instance = new AppMagic.DynamicDataSource.WindowsDynamicDataSourceFactory;
AppMagic.Encryption.instance = new AppMagic.Encryption.WindowsEncryptionProvider;