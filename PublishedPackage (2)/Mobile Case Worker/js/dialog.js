//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var DialogClassName = "dialog",
        DialogContainerClassName = "dialog-container",
        InnerContentClassName = "content-inner",
        DialogManager = Core.Class.define(function DialogManager_ctor(){}, {}, {
            _openDialogs: ko.observableArray(), _activeDialog: null, cancelAll: function() {
                    for (var dialogs = this._openDialogs().slice(0), i = 0, len = dialogs.length; i < len; i++)
                        dialogs[i].cancel()
                }, notifyDialogOpened: function(dialog) {
                    DialogManager._openDialogs.push(dialog);
                    this._updateActiveDialog()
                }, notifyDialogClosed: function(dialog) {
                    DialogManager._openDialogs.remove(dialog);
                    this._updateActiveDialog()
                }, getOpenDialogCount: function() {
                    return DialogManager._openDialogs().length
                }, getActiveDialog: function() {
                    return DialogManager._activeDialog
                }, _updateActiveDialog: function() {
                    var newActiveDialog = DialogManager._getTopDialogOrNull();
                    DialogManager._activeDialog !== newActiveDialog && (AppMagic.Utility.isNullOrUndefined(DialogManager._activeDialog) || DialogManager._activeDialog._deactivate(), AppMagic.Utility.isNullOrUndefined(newActiveDialog) || newActiveDialog._activate(), DialogManager._activeDialog = newActiveDialog)
                }, _getTopDialogOrNull: function() {
                    var dialogsArray = DialogManager._openDialogs();
                    return dialogsArray.length === 0 ? null : dialogsArray[dialogsArray.length - 1]
                }
        });
    DialogManager._openDialogCount = ko.observable(0);
    var Dialog = Core.Class.define(function Dialog_ctor(viewModel) {
            this._viewModel = viewModel;
            typeof this._viewModel.fullScreen == "undefined" && (this._viewModel.fullScreen = !1);
            this._element = document.createElement("div");
            Core.Utilities.addClass(this._element, DialogContainerClassName);
            this._contentElement = document.createElement("div");
            Core.Utilities.addClass(this._contentElement, InnerContentClassName);
            this._contentElement.viewModel = viewModel;
            this._focusKeeper = new AppMagic.Utility.FocusKeeper(this._element);
            var dialogPromise = AppMagic.UI.Utility.createControlAsync(this._element, "/controls/common/dialog/dialog.html"),
                contentsPromise = AppMagic.UI.Utility.createControlAsync(this._contentElement, this._viewModel.url);
            this._renderPromise = Core.Promise.join([dialogPromise, contentsPromise]);
            this._keyDownHandler = this._onKeyDown.bind(this)
        }, {
            _state: AppMagic.Constants.DialogState.closed, _isActive: !1, _viewModel: null, _defaultCommandIndex: 0, _cancelCommandIndex: 0, _completionFunction: null, _element: null, _renderPromise: null, _keyDownHandler: null, _contentElement: null, element: {get: function() {
                        return this._element
                    }}, defaultCommandIndex: {
                    get: function() {
                        return this._defaultCommandIndex
                    }, set: function(value) {
                            this._defaultCommandIndex = value
                        }
                }, cancelCommandIndex: {
                    get: function() {
                        return this._cancelCommandIndex
                    }, set: function(value) {
                            this._cancelCommandIndex = value
                        }
                }, showAsync: function() {
                    var promise = new Core.Promise(function(c) {
                            this._completionFunction = c
                        }.bind(this));
                    return this._showDialog(), promise
                }, cancel: function() {
                    var buttonElements = this._element.getElementsByTagName("button");
                    0 <= this._cancelCommandIndex && this._cancelCommandIndex < buttonElements.length && buttonElements[this._cancelCommandIndex].click()
                }, close: function(dialogValue) {
                    DialogManager.notifyDialogClosed(this);
                    this._state === AppMagic.Constants.DialogState.rendered && (this._unbindKeyDown(), this._element.parentElement.removeChild(this._element));
                    this._state = AppMagic.Constants.DialogState.closed;
                    this._completionFunction(dialogValue);
                    this._completionFunction = null;
                    this.dispose()
                }, dispose: function() {
                    this._renderPromise.then(function() {
                        AppMagic.Utility.isNullOrUndefined(this._viewModel.dispose) || this._viewModel.dispose();
                        this._contentElement.viewModel = null;
                        ko.cleanNode(this._element)
                    }.bind(this))
                }, _showDialog: function() {
                    DialogManager.notifyDialogOpened(this);
                    this._state = AppMagic.Constants.DialogState.opened;
                    this._renderPromise.then(function() {
                        if (this._state !== AppMagic.Constants.DialogState.closed) {
                            ko.applyBindings(this._viewModel, this._element);
                            var contentContainerElements = this._element.getElementsByClassName("content");
                            contentContainerElements[0].appendChild(this._contentElement);
                            document.body.insertBefore(this._element, document.body.firstChild);
                            this._bindKeyDown();
                            this._state = AppMagic.Constants.DialogState.rendered;
                            this._isActive && this._activate()
                        }
                    }.bind(this))
                }, _activate: function() {
                    this._isActive = !0;
                    this._element.style.display = "";
                    this._state === AppMagic.Constants.DialogState.rendered && this._focusKeeper.addFocusOutHandler()
                }, _deactivate: function() {
                    this._isActive = !1;
                    this._focusKeeper.removeFocusOutHandler();
                    this._element.style.display = "none"
                }, _bindKeyDown: function() {
                    this._element.addEventListener("keydown", this._keyDownHandler, !1)
                }, _onKeyDown: function(e) {
                    var buttonElements = this._element.getElementsByTagName("button");
                    if (buttonElements.length !== 0)
                        if (e.key === AppMagic.AuthoringTool.Keys.esc)
                            this.cancel(),
                            e.stopPropagation();
                        else if (e.key === AppMagic.AuthoringTool.Keys.right || e.key === AppMagic.AuthoringTool.Keys.left) {
                            var idx = this.getFocusedButton(buttonElements);
                            e.key === AppMagic.AuthoringTool.Keys.right && idx < buttonElements.length - 1 && idx++;
                            e.key === AppMagic.AuthoringTool.Keys.left && idx > 0 && idx--;
                            buttonElements[idx].focus()
                        }
                }, getFocusedButton: function(buttonElements) {
                    for (var len = buttonElements.length, i = 0; i < len; i++)
                        if (document.activeElement === buttonElements[i])
                            return i;
                    return 0
                }, _unbindKeyDown: function() {
                    this._element.removeEventListener("keydown", this._keyDownHandler, !1)
                }
        }),
        CachedAuthDialogViewModel = Core.Class.define(function CachedAuthDialogViewModel_ctor(title, description, services) {
            this._title = ko.observable(title);
            this._description = ko.observable(description);
            this._services = ko.observable(services);
            this._buttons = [];
            this._url = ko.observable("/controls/common/dialog/cachedAuthDialog.html");
            this._cachedAuthDialogResult = ko.observable()
        }, {
            _buttons: null, _url: null, _title: null, _description: null, _services: null, _getServiceImageOrDefault: function(serviceName) {
                    var serviceImage = AppMagic.Constants.DataConnections.Icons_monochrome[serviceName];
                    return typeof serviceImage == "undefined" && (serviceImage = AppMagic.Constants.DataConnections.Icons_monochrome.rest), serviceImage
                }, buttons: {get: function() {
                        return this._buttons
                    }}, url: {get: function() {
                        return this._url()
                    }}, title: {get: function() {
                        return this._title()
                    }}, description: {get: function() {
                        return this._description()
                    }}, cachedAuthDialogResult: {get: function() {
                        return this._cachedAuthDialogResult()
                    }}, services: {get: function() {
                        return this._services().map(function(serviceName) {
                                return {
                                        name: serviceName, image: this._getServiceImageOrDefault(serviceName)
                                    }
                            }, this)
                    }}, onClickYes: function() {
                    this._cachedAuthDialogResult(CachedAuthDialog.UseCachedAuth);
                    Microsoft.AppMagic.Common.TelemetrySession.telemetry.logCachedAuthDialog("Yes")
                }, onClickNo: function() {
                    this._cachedAuthDialogResult(CachedAuthDialog.DisposeCachedAuth);
                    Microsoft.AppMagic.Common.TelemetrySession.telemetry.logCachedAuthDialog("No")
                }
        }),
        CachedAuthDialog = Core.Class.derive(Dialog, function CachedAuthDialog_ctor(description, title, serviceNames) {
            this._cachedAuthDialogViewModel = new CachedAuthDialogViewModel(description, title, serviceNames);
            this._cachedAuthDialogResult = ko.computed(function() {
                return this._cachedAuthDialogViewModel.cachedAuthDialogResult
            }, this);
            this._cachedAuthDialogResultSubscription = this._cachedAuthDialogResult.subscribe(function(result) {
                result === CachedAuthDialog.DisposeCachedAuth && AppMagic.AuthoringTool.Runtime.disposeSessionAuthData();
                this.close()
            }, this);
            this._cancelCommandIndex = 1;
            Dialog.call(this, this._cachedAuthDialogViewModel)
        }, {
            _cachedAuthDialogViewModel: null, _cachedAuthDialogResult: null, _cachedAuthDialogResultSubscription: null, _cancelCommandIndex: null, dispose: function() {
                    this._cachedAuthDialogResult.dispose();
                    this._cachedAuthDialogResultSubscription.dispose();
                    Dialog.prototype.dispose.call(this)
                }
        }, {
            DisposeCachedAuth: "dispose-cached-auth", UseCachedAuth: "use-cached-auth"
        }),
        MessageDialogViewModel = Core.Class.define(function MessageDialogViewModel_ctor(description, title, showWarningIcon) {
            this._title = ko.observable(title);
            this._description = ko.observable(description);
            this._showWarningIcon = ko.observable(showWarningIcon);
            this._buttons = ko.observableArray();
            this._url = ko.observable("/controls/common/dialog/messageDialogBody.html")
        }, {
            _buttons: null, _url: null, _title: null, _description: null, _showWarningIcon: null, buttons: {get: function() {
                        return this._buttons()
                    }}, url: {get: function() {
                        return this._url()
                    }}, title: {get: function() {
                        return this._title()
                    }}, description: {get: function() {
                        return this._description()
                    }}, showWarningIcon: {get: function() {
                        return this._showWarningIcon()
                    }}
        }),
        MessageDialog = Core.Class.derive(Dialog, function MessageDialog_ctor(description, title, showWarningIcon) {
            this._messageDialogViewModel = new MessageDialogViewModel(description, title, showWarningIcon);
            this._messageDialogViewModel.buttons.push(new AppMagic.Popups.DialogButtonViewModel(AppMagic.Strings.Close, function() {
                this.close()
            }.bind(this)));
            Dialog.call(this, this._messageDialogViewModel)
        }, {
            _messageDialogViewModel: null, _buttonsOverridden: !1, addButton: function(title, clickFunction) {
                    this._buttonsOverridden || (this._messageDialogViewModel._buttons.removeAll(), this._buttonsOverridden = !0);
                    var buttonViewModel = new AppMagic.Popups.DialogButtonViewModel(title, function() {
                            AppMagic.Utility.isNullOrUndefined(clickFunction) || clickFunction();
                            this.close(title)
                        }.bind(this));
                    this._messageDialogViewModel.buttons.push(buttonViewModel)
                }
        }),
        RestDialogViewModel = Core.Class.derive(AppMagic.Utility.Disposable, function RestDialogViewModel_ctor(icon, serviceId, templateVariableDefs, settings, connectFn, cancelFn, docDictionary, preferredLang) {
            AppMagic.Utility.Disposable.call(this);
            var constants = AppMagic.Constants.Services.Rest;
            this._icon = icon;
            this._serviceId = serviceId;
            this._settings = settings;
            this._connectFn = connectFn;
            var savedUserFormInput = this._getSettingsDataOrDefault();
            var userVariableNameValueMap = AppMagic.Utility.mapDefinitionsHashTableWithSort(templateVariableDefs, constants.JsonObjectPropertyKey_DisplayIdx, function(variableName, templateVariableDef) {
                    var varTitle = AppMagic.Services.Meta.RESTWorkerController.getDocTitleOrDefault(templateVariableDef, variableName, docDictionary, preferredLang);
                    var initialValue = savedUserFormInput[variableName] || "";
                    return {
                            name: variableName, def: templateVariableDef, title: varTitle, value: ko.observable(initialValue)
                        }
                });
            this._userVariables = ko.observableArray(userVariableNameValueMap);
            this._buttons = ko.observableArray();
            this._url = ko.observable("/controls/common/dialog/restDialogBody.html");
            this.track("_isConnectEnabled", ko.computed(function() {
                return this._userVariables().every(function(userVariable) {
                        return userVariable.value().length > 0
                    })
            }.bind(this)));
            this.buttons.push(new AppMagic.Popups.DialogButtonViewModel(AppMagic.Strings.Connect, this._onClickConnect.bind(this), this._isConnectEnabled));
            this.buttons.push(new AppMagic.Popups.DialogButtonViewModel(AppMagic.Strings.Cancel, cancelFn))
        }, {
            _buttons: null, _url: null, _serviceId: null, _userVariables: null, _icon: null, _isConnectEnabled: null, _connectFn: null, _settings: null, buttons: {get: function() {
                        return this._buttons()
                    }}, url: {get: function() {
                        return this._url()
                    }}, icon: {get: function() {
                        return this._icon
                    }}, title: {get: function() {
                        return this._serviceId
                    }}, userVariables: {get: function() {
                        return this._userVariables()
                    }}, onHelpLinkClick: function() {
                    AppMagic.AuthoringTool.Utility.openLinkInBrowser(AppMagic.Strings.RestDialogHelpUrl)
                }, onClickForgetInfo: function() {
                    for (var userVariables = this._userVariables(), i = 0, len = userVariables.length; i < len; i++)
                        userVariables[i].value("");
                    this._clearSettingsData()
                }, _onClickConnect: function() {
                    var newInitialValues = this.getUserVariableValuesByName();
                    this._setSettingsData({templateVariableInitialValues: newInitialValues});
                    this._connectFn()
                }, _setSettingsData: function(settingsData) {
                    var settingsMarker = RestDialogViewModel.SettingsMarkerImportedRestServicePackage,
                        importedRestServicesData = this._settings.getValue(settingsMarker);
                    importedRestServicesData = typeof importedRestServicesData == "undefined" ? {} : importedRestServicesData;
                    importedRestServicesData[this._serviceId] = settingsData;
                    this._settings.setValue(settingsMarker, importedRestServicesData)
                }, _getSettingsDataOrDefault: function() {
                    var importedRestServicesData = this._settings.getValue(RestDialogViewModel.SettingsMarkerImportedRestServicePackage);
                    return typeof importedRestServicesData == "undefined" || typeof importedRestServicesData[this._serviceId] == "undefined" ? {} : importedRestServicesData[this._serviceId].templateVariableInitialValues
                }, _clearSettingsData: function() {
                    var settingsMarker = RestDialogViewModel.SettingsMarkerImportedRestServicePackage,
                        importedRestServicesData = this._settings.getValue(settingsMarker);
                    importedRestServicesData && (delete importedRestServicesData[this._serviceId], this._settings.setValue(settingsMarker, importedRestServicesData))
                }, getUserVariableValuesByName: function() {
                    var valuesByName = {},
                        userVariables = this._userVariables();
                    return userVariables.forEach(function(userVar) {
                            valuesByName[userVar.name] = userVar.value()
                        }), valuesByName
                }
        }, {SettingsMarkerImportedRestServicePackage: "IMPORTED_SERVICE_SAVED_TEMPLATE_VALUES"}),
        RestDialog = Core.Class.derive(Dialog, function RestDialog_ctor(icon, serviceId, templateVariableDefs, settings, onConnectFunction, onCancelFunction, docDictionary, preferredLang) {
            var connectFn = function() {
                    var valuesByName = this._restDialogViewModel.getUserVariableValuesByName();
                    onConnectFunction(valuesByName);
                    this.close()
                }.bind(this),
                cancelFn = function() {
                    var valuesByName = this._restDialogViewModel.getUserVariableValuesByName();
                    onCancelFunction(valuesByName);
                    this.close()
                }.bind(this);
            this._restDialogViewModel = new RestDialogViewModel(icon, serviceId, templateVariableDefs, settings, connectFn, cancelFn, docDictionary, preferredLang);
            Dialog.call(this, this._restDialogViewModel)
        }, {_restDialogViewModel: null}),
        WaitDialogViewModel = Core.Class.define(function WaitDialogViewModel(text) {
            this._text = ko.observable(text);
            this._buttons = [];
            this._url = ko.observable("/controls/common/dialog/waitDialogBody.html")
        }, {
            _buttons: null, _text: null, _url: null, buttons: {get: function() {
                        return this._buttons
                    }}, text: {get: function() {
                        return this._text()
                    }}, url: {get: function() {
                        return this._url()
                    }}
        }),
        WaitDialog = Core.Class.derive(Dialog, function WaitDialog_ctor(text) {
            this._waitDialogViewModel = new WaitDialogViewModel(text);
            Dialog.call(this, this._waitDialogViewModel)
        }, {_waitDialogViewModel: null}),
        AuthenticationDialogViewModel = Core.Class.define(function AuthenticationDialogViewModel_ctor(requestUri, callbackUri) {
            this._requestUri = requestUri;
            this._callbackUri = callbackUri;
            this._buttons = [];
            this._url = ko.observable("/controls/common/dialog/authDialogBody.html");
            this._authenticationResult = ko.observable();
            this._isCompleted = !1;
            this._hasLoaded = ko.observable(!1)
        }, {
            _requestUri: null, _callbackUri: null, _buttons: null, _authenticationResult: null, _hasLoaded: null, hasLoaded: {
                    get: function() {
                        return this._hasLoaded()
                    }, set: function(val) {
                            this._hasLoaded(val)
                        }
                }, requestUri: {get: function() {
                        return this._requestUri
                    }}, callbackUri: {get: function() {
                        return this._callbackUri
                    }}, authenticationResult: {get: function() {
                        return this._authenticationResult()
                    }}, buttons: {get: function() {
                        return this._buttons
                    }}, fullScreen: {get: function() {
                        return !0
                    }}, url: {get: function() {
                        return this._url()
                    }}, notifyAuthenticationComplete: function(result) {
                    this._isCompleted || (result.authenticationStatus !== AppMagic.Services.AuthenticationStatus.inProgress && (this._isCompleted = !0), this._authenticationResult(result))
                }, onClickCancel: function() {
                    this.notifyAuthenticationComplete({
                        responseData: AppMagic.Strings.AuthenticationBrokerManagerErrorUserCanceled, authenticationStatus: AppMagic.Services.AuthenticationStatus.cancel, navigatedUris: []
                    })
                }
        }),
        AuthenticationDialog = Core.Class.derive(Dialog, function AuthenticationDialog_ctor(requestUri, callbackUri) {
            this._authenticationDialogViewModel = new AuthenticationDialogViewModel(requestUri, callbackUri);
            this._authenticationResult = ko.computed(function() {
                return this._authenticationDialogViewModel.authenticationResult
            }.bind(this));
            this._authenticationResultSubscription = this._authenticationResult.subscribe(function(newVal) {
                newVal.authenticationStatus !== AppMagic.Services.AuthenticationStatus.inProgress && this.close()
            }.bind(this));
            Dialog.call(this, this._authenticationDialogViewModel)
        }, {
            _authenticationDialogViewModel: null, _authenticationResult: null, _authenticationResultSubscription: null, _responseData: null, authenticationResult: {get: function() {
                        return this._authenticationResult()
                    }}, dispose: function() {
                    this._authenticationResult.dispose();
                    this._authenticationResultSubscription.dispose();
                    Dialog.prototype.dispose.call(this)
                }
        });
    Core.Namespace.define("AppMagic.Popups", {
        CachedAuthDialog: CachedAuthDialog, MessageDialog: MessageDialog, DialogManager: DialogManager, WaitDialog: WaitDialog, RestDialog: RestDialog, RestDialogViewModel: RestDialogViewModel, AuthenticationDialog: AuthenticationDialog
    })
})(WinJS);