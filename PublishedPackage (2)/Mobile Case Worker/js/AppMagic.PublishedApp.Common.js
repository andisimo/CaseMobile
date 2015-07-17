//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var AppActivationEventArgs = function() {
                    function AppActivationEventArgs(){}
                    return AppActivationEventArgs
                }();
            Application.AppActivationEventArgs = AppActivationEventArgs,
            function(ActivationType) {
                ActivationType[ActivationType.Launch = 0] = "Launch";
                ActivationType[ActivationType.Unknown = 1] = "Unknown"
            }(Application.ActivationType || (Application.ActivationType = {}));
            var ActivationType = Application.ActivationType;
            (function(AppExecutionState) {
                AppExecutionState[AppExecutionState.NotRunning = 0] = "NotRunning";
                AppExecutionState[AppExecutionState.Running = 1] = "Running";
                AppExecutionState[AppExecutionState.Suspended = 2] = "Suspended";
                AppExecutionState[AppExecutionState.Terminated = 3] = "Terminated";
                AppExecutionState[AppExecutionState.ClosedByUser = 4] = "ClosedByUser"
            })(Application.AppExecutionState || (Application.AppExecutionState = {}));
            var AppExecutionState = Application.AppExecutionState
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
            Application.GenericInitError = AppMagic.Strings.GenericInitError;
            Application.GenericInitTitle = AppMagic.Strings.GenericInitTitle
        })(Publish.Application || (Publish.Application = {}));
        var Application = Publish.Application
    })(AppMagic.Publish || (AppMagic.Publish = {}));
    var Publish = AppMagic.Publish
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(MarkupService) {
        var PackagedMarkupService = function() {
                function PackagedMarkupService() {
                    this._uriToConstructor = {}
                }
                return PackagedMarkupService.prototype.injectMarkup = function(uri) {
                        return WinJS.Promise.as(!0)
                    }, PackagedMarkupService.prototype.associateView = function(uri, viewConstructor) {
                        this._uriToConstructor[uri] = viewConstructor;
                        WinJS.UI && WinJS.UI.Pages && WinJS.UI.Pages.define && uri.indexOf("notification.html") >= 0 && WinJS.UI.Pages.define(uri, {ready: function(element) {
                                new viewConstructor(element)
                            }})
                    }, PackagedMarkupService.prototype.render = function(uri, element) {
                            var markupElement = document.getElementById(uri);
                            WinJS.Utilities.setInnerHTMLUnsafe(element, markupElement.innerHTML);
                            var viewConstructor = this._uriToConstructor[uri];
                            return viewConstructor && new viewConstructor(element), WinJS.Promise.as(element)
                        }, PackagedMarkupService
            }();
        MarkupService.PackagedMarkupService = PackagedMarkupService
    })(AppMagic.MarkupService || (AppMagic.MarkupService = {}));
    var MarkupService = AppMagic.MarkupService
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var Core = WinJS;
            Core.Namespace.define("Microsoft.AppMagic.Authoring.ControlRequirementType", {
                css: "Css", folder: "Folder", image: "Image", javaScript: "JavaScript", markup: "Markup", media: "Media", other: "Other"
            });
            function setSplashScreenColor(bgColor) {
                var splashScreen = document.getElementById("splashScreen");
                splashScreen.style.backgroundColor = bgColor
            }
            Core.Namespace.define("Microsoft.AppMagic", {setSplashScreenColor: setSplashScreenColor});
            function hideSplashScreen() {
                var splashScreen = document.getElementById("splashScreen");
                document.body.removeChild(splashScreen)
            }
            var PublishedApp = function() {
                    function PublishedApp(errorHandler, sessionState) {
                        this._viewBox = null;
                        this._errorHandler = errorHandler;
                        this._sessionState = sessionState
                    }
                    return PublishedApp.prototype.onActivated = function(activationArgs) {
                            var _this = this;
                            if (AppMagic.Utility.documentSetup(), this._scaleCanvasToFit(), activationArgs.ActivationType == 0) {
                                var prevState = activationArgs.PreviousExecutionState,
                                    startupPromise = this._loadPlugins(),
                                    isResumeFromTerminated = prevState === 3 && typeof this._sessionState.getSessionState() != "undefined";
                                if (prevState !== 1 && prevState !== 2) {
                                    if (isResumeFromTerminated)
                                        AppMagic.AuthoringTool.Runtime.onResumeFromTerminate(this._sessionState.getSessionState());
                                    startupPromise.then(function() {
                                        return _this._initializeApp(isResumeFromTerminated)
                                    })
                                }
                                return startupPromise
                            }
                        }, PublishedApp.prototype.onCheckpoint = function() {
                            var suspendState = {currentScreen: AppMagic.Publish.Canvas.currentScreen};
                            AppMagic.AuthoringTool.Runtime.onSuspend(suspendState);
                            AppMagic.Publish.Canvas.controlManager.onSuspend(suspendState);
                            this._sessionState.setSessionState(suspendState);
                            var serviceCallsInFlight = AppMagic.AuthoringTool.Runtime.getOutstandingServiceCallsPromises();
                            return serviceCallsInFlight.push(AppMagic.Settings.instance.save()), Core.Promise.join(serviceCallsInFlight)
                        }, PublishedApp.prototype._initializeApp = function(isResumeFromTerminated) {
                                var _this = this,
                                    loadingDialog = new AppMagic.Popups.WaitDialog(AppMagic.Strings.LoadingMessage);
                                loadingDialog.showAsync();
                                AppMagic.Settings.instance.load().then(function() {
                                    return initappmagic(Core, isResumeFromTerminated)
                                }).then(function() {
                                    return _this._initializeControlManager(isResumeFromTerminated)
                                }).then(function() {
                                    return loadingDialog.close()
                                }).then(function() {
                                    return _this._initializeRules(isResumeFromTerminated)
                                }).then(function() {
                                    return _this._navigateToFirstScreen(isResumeFromTerminated)
                                }).then(null, function(err) {
                                    return _this._handleInitializationErrors(err)
                                })
                            }, PublishedApp.prototype._scaleCanvasToFit = function() {
                                this._viewBox == null && (this._viewBox = new Application.ViewBox(document.body, document.getElementById("publishedCanvas")))
                            }, PublishedApp.prototype._initializeControlManager = function(isResumeFromTerminated) {
                                if (isResumeFromTerminated)
                                    try {
                                        AppMagic.Publish.Canvas.controlManager.onResume(this._sessionState.getSessionState())
                                    }
                                    catch(err) {
                                        this._errorHandler.terminate(err)
                                    }
                                return !0
                            }, PublishedApp.prototype._initializeRules = function(isResumeFromTerminated) {
                                return initrules(Core, isResumeFromTerminated), !0
                            }, PublishedApp.prototype._navigateToFirstScreen = function(isResumeFromTerminated) {
                                var sessionState = this._sessionState.getSessionState();
                                return isResumeFromTerminated && typeof sessionState != "undefined" && typeof sessionState.currentScreen != "undefined" && AppMagic.AuthoringTool.Runtime.navigateTo(sessionState.currentScreen, ""), hideSplashScreen(), !0
                            }, PublishedApp.prototype._handleInitializationErrors = function(err) {
                                this._errorHandler.showErrorAndTerminate(err)
                            }, PublishedApp.prototype._loadPlugins = function() {
                                if (window.cordova) {
                                    var completablePromise = AppMagic.Utility.createCompletablePromise(),
                                        deviceReadyFunction = function() {
                                            completablePromise.complete();
                                            document.removeEventListener("deviceready", deviceReadyFunction)
                                        };
                                    return document.addEventListener("deviceready", deviceReadyFunction), completablePromise.promise
                                }
                                else
                                    return WinJS.Promise.wrap()
                            }, PublishedApp
                }();
            Application.PublishedApp = PublishedApp
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
    (function(Services) {
        var PackagedServiceImporter = function() {
                function PackagedServiceImporter() {
                    this._loadedIds = []
                }
                return PackagedServiceImporter.prototype.importService = function(serviceName) {
                        var _this = this;
                        var serviceElement = document.getElementById(serviceName + "/package.json");
                        var serviceDefinition = JSON.parse(serviceElement.innerHTML);
                        return AppMagic.Services.load(serviceDefinition, "/services/" + serviceName).then(function(id) {
                                return _this._loadedIds.push(id), AppMagic.Services.byId(id)
                            })
                    }, PackagedServiceImporter.prototype.getLoadedServiceIds = function() {
                        return this._loadedIds
                    }, PackagedServiceImporter
            }();
        Services.PackagedServiceImporter = PackagedServiceImporter
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Publish) {
        (function(Application) {
            var Core = WinJS,
                ViewBox = function() {
                    function ViewBox(container, resizeElement) {
                        this._container = container;
                        this._resizeElement = resizeElement;
                        window.addEventListener("resize", this.onResize.bind(this));
                        this.forceUpdate()
                    }
                    return ViewBox.prototype.forceUpdate = function() {
                            var containerWidth = this._container.clientWidth,
                                containerHeight = this._container.clientHeight,
                                childWidth = this._resizeElement.clientWidth,
                                childHeight = this._resizeElement.clientHeight;
                            if (childWidth != 0 && childHeight !== 0) {
                                var scaleWidth = containerWidth / childWidth,
                                    scaleHeight = containerHeight / childHeight,
                                    scaleFactor = Math.min(scaleWidth, scaleHeight),
                                    xOffset = (childWidth * scaleFactor - childWidth) / 2,
                                    yOffset = (childHeight * scaleFactor - childHeight) / 2;
                                xOffset += (containerWidth - childWidth * scaleFactor) / 2;
                                yOffset += (containerHeight - childHeight * scaleFactor) / 2;
                                var translateString = "translate(" + xOffset + "px, " + yOffset + "px) scale(" + scaleFactor + ")";
                                this._resizeElement.style.transform = translateString;
                                this._resizeElement.style["-webkit-transform"] = translateString;
                                this._resizeElement.style["-moz-transform"] = translateString
                            }
                        }, ViewBox.prototype.onResize = function() {
                            var _this = this;
                            this._isUpdatePending || (this._isUpdatePending = !0, window.setImmediate(function() {
                                _this.forceUpdate();
                                _this._isUpdatePending = !1
                            }))
                        }, ViewBox
                }();
            Application.ViewBox = ViewBox
        })(Publish.Application || (Publish.Application = {}));
        var Application = Publish.Application
    })(AppMagic.Publish || (AppMagic.Publish = {}));
    var Publish = AppMagic.Publish
})(AppMagic || (AppMagic = {}));