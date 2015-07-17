﻿//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var WindowsCookieManager = function() {
                function WindowsCookieManager() {
                    this._platformCookieManager = (new Windows.Web.Http.Filters.HttpBaseProtocolFilter).cookieManager
                }
                return WindowsCookieManager.prototype.deleteCookies = function(uri) {
                        var _this = this,
                            cookies = this.getCookies(uri);
                        cookies.forEach(function(cookie) {
                            _this._platformCookieManager.deleteCookie(cookie)
                        })
                    }, WindowsCookieManager.prototype.getCookies = function(uriString) {
                        try {
                            var uri = new Windows.Foundation.Uri(uriString)
                        }
                        catch(e) {
                            return []
                        }
                        return this._platformCookieManager.getCookies(uri)
                    }, WindowsCookieManager
            }();
        Services.WindowsCookieManager = WindowsCookieManager
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
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
        var WindowsDynamicDataSourceFactory = function(_super) {
                __extends(WindowsDynamicDataSourceFactory, _super);
                function WindowsDynamicDataSourceFactory() {
                    _super.call(this);
                    this.dynamicDataSources[AppMagic.Strings.LocationDataSourceName] = WinJS.Utilities.hasWinRT ? new DynamicDataSource.WindowsLocationDataSource : new DynamicDataSource.HTML5LocationDataSource
                }
                return WindowsDynamicDataSourceFactory
            }(DynamicDataSource.DynamicDataSourceFactory);
        DynamicDataSource.WindowsDynamicDataSourceFactory = WindowsDynamicDataSourceFactory
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Encryption) {
        var WindowsEncryptionProvider = function() {
                function WindowsEncryptionProvider(){}
                return WindowsEncryptionProvider.prototype.generateHmacSha1Signature = function(sigBaseString, keyText) {
                        var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8),
                            macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1"),
                            key = macAlgorithmProvider.createKey(keyMaterial),
                            tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8),
                            signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                        return Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer)
                    }, WindowsEncryptionProvider
            }();
        Encryption.WindowsEncryptionProvider = WindowsEncryptionProvider
    })(AppMagic.Encryption || (AppMagic.Encryption = {}));
    var Encryption = AppMagic.Encryption
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        var WindowsLocationDataSource = function() {
                function WindowsLocationDataSource() {
                    this._locationService = new Windows.Devices.Geolocation.Geolocator;
                    this._isEnabled = !1
                }
                return Object.defineProperty(WindowsLocationDataSource.prototype, "isEnabled", {
                        get: function() {
                            return this._isEnabled
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(WindowsLocationDataSource.prototype, "locationService", {
                        get: function() {
                            return this._locationService
                        }, enumerable: !0, configurable: !0
                    }), WindowsLocationDataSource.prototype.subscribe = function() {
                            this._locationService !== null && (this._locationService.addEventListener("positionchanged", this.onPositionSignalChanged.bind(this)), this._isEnabled = !0)
                        }, WindowsLocationDataSource.prototype.unSubscribe = function() {
                            if (this._locationService === null) {
                                this._isEnabled = !1;
                                return
                            }
                            this._locationService.removeEventListener("positionchanged", this.onPositionSignalChanged.bind(this));
                            this._isEnabled = !1
                        }, WindowsLocationDataSource.prototype.getData = function(errorFunction) {
                            return this._locationService === null ? null : (this._locationService.getGeopositionAsync().then(this.onGetPosition.bind(this), errorFunction), new DynamicDataSource.LocationData(0, 0, 0))
                        }, WindowsLocationDataSource.prototype.onPositionSignalChanged = function(args) {
                            this.onGetPosition(args.position)
                        }, WindowsLocationDataSource.prototype.onGetPosition = function(position) {
                            var coordinate = position.coordinate;
                            var retVal = new DynamicDataSource.LocationData(coordinate.latitude, coordinate.longitude, coordinate.altitude);
                            AppMagic.AuthoringTool.Runtime.updateDynamicDatasource(AppMagic.Strings.LocationDataSourceName, retVal)
                        }, WindowsLocationDataSource
            }();
        DynamicDataSource.WindowsLocationDataSource = WindowsLocationDataSource
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Settings) {
        var crypto = Windows.Security.Cryptography,
            store = WinJS.Application.local,
            WindowsSettingsProvider = function() {
                function WindowsSettingsProvider() {
                    this.settings = {};
                    this.protEnc = null;
                    this.protDec = null;
                    this.dirty = !1;
                    this.savePromise = null;
                    this.protEnc = crypto.DataProtection.DataProtectionProvider(WindowsSettingsProvider.PROTECTION_DESCRIPTOR);
                    this.protDec = crypto.DataProtection.DataProtectionProvider()
                }
                return WindowsSettingsProvider.prototype.load = function() {
                        var _this = this,
                            errorFn = function() {
                                return _this.settings = {}, !1
                            },
                            loadFile = function(exists) {
                                return exists ? store.readText(WindowsSettingsProvider.SETTINGS_FILE, "").then(decryptData) : WinJS.Promise.wrap(errorFn())
                            },
                            decryptData = function(encData) {
                                if (!encData)
                                    return errorFn();
                                var encBuffer = crypto.CryptographicBuffer.decodeFromBase64String(encData);
                                return _this.protDec.unprotectAsync(encBuffer).then(parseSettings)
                            },
                            parseSettings = function(buffer) {
                                var data = crypto.CryptographicBuffer.convertBinaryToString(WindowsSettingsProvider.PROTECTION_ENCODING, buffer);
                                return _this.settings = JSON.parse(data), !0
                            };
                        return store.exists(WindowsSettingsProvider.SETTINGS_FILE).then(loadFile).then(null, errorFn)
                    }, WindowsSettingsProvider.prototype.save = function() {
                        var _this = this;
                        if (this.dirty && !this.savePromise) {
                            var encryptData = function(data) {
                                    var buffer = crypto.CryptographicBuffer.convertStringToBinary(data, WindowsSettingsProvider.PROTECTION_ENCODING);
                                    return _this.protEnc.protectAsync(buffer)
                                },
                                saveFile = function(encBuffer) {
                                    var encData = crypto.CryptographicBuffer.encodeToBase64String(encBuffer);
                                    return store.writeText(WindowsSettingsProvider.SETTINGS_FILE, encData)
                                },
                                saveComplete = function() {
                                    return _this.savePromise = null, !0
                                },
                                saveError = function() {
                                    return _this.savePromise = null, !1
                                };
                            this.dirty = !1;
                            this.savePromise = encryptData(JSON.stringify(this.settings)).then(saveFile).then(saveComplete, saveError)
                        }
                        return this.savePromise || WinJS.Promise.as(!1)
                    }, WindowsSettingsProvider.prototype.getValue = function(key) {
                            return this.settings[key]
                        }, WindowsSettingsProvider.prototype.removeValue = function(key) {
                            delete this.settings[key];
                            this.markSaveAndDelayed()
                        }, WindowsSettingsProvider.prototype.setValue = function(key, value) {
                            this.settings[key] = value;
                            this.markSaveAndDelayed()
                        }, WindowsSettingsProvider.prototype.markSaveAndDelayed = function() {
                            var _this = this;
                            this.dirty || (this.dirty = !0, window.setImmediate(function() {
                                return _this.save
                            }))
                        }, WindowsSettingsProvider.SETTINGS_FILE = "appsettings.json", WindowsSettingsProvider.PROTECTION_DESCRIPTOR = "LOCAL=user", WindowsSettingsProvider.PROTECTION_ENCODING = Windows.Security.Cryptography.BinaryStringEncoding.utf8, WindowsSettingsProvider
            }();
        Settings.WindowsSettingsProvider = WindowsSettingsProvider
    })(AppMagic.Settings || (AppMagic.Settings = {}));
    var Settings = AppMagic.Settings
})(AppMagic || (AppMagic = {}));