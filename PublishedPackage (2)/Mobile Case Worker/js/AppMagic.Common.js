//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    var AsyncWhile = function() {
            function AsyncWhile(condition) {
                this._condition = condition
            }
            return AsyncWhile.prototype.loop = function(body) {
                    var complete,
                        promise = new WinJS.Promise(function(c) {
                            complete = c
                        });
                    return this._scheduleNext(body, complete), promise
                }, AsyncWhile.prototype._scheduleNext = function(body, complete) {
                    var _this = this;
                    this._condition() ? body().then(function() {
                        _this._scheduleNext(body, complete)
                    }) : complete()
                }, AsyncWhile
        }();
    AppMagic.AsyncWhile = AsyncWhile
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Collections;
(function(Collections) {
    (function(Generic) {
        var Set = function() {
                function Set() {
                    this._items = []
                }
                return Object.defineProperty(Set.prototype, "count", {
                        get: function() {
                            return this._items.length
                        }, enumerable: !0, configurable: !0
                    }), Set.prototype.add = function(item) {
                        return this._items.indexOf(item) < 0 ? (this._items.push(item), !0) : !1
                    }, Set.prototype.remove = function(item) {
                            var i = this._items.indexOf(item);
                            return i >= 0 ? (this._items.splice(i, 1), !0) : !1
                        }, Set.prototype.clear = function() {
                            this._items = []
                        }, Set.prototype.contains = function(item) {
                            return this._items.indexOf(item) >= 0
                        }, Set.prototype.items = function() {
                            return this._items.slice(0)
                        }, Set.prototype.toggle = function(item) {
                            this.contains(item) ? this.remove(item) : this.add(item)
                        }, Set
            }();
        Generic.Set = Set
    })(Collections.Generic || (Collections.Generic = {}));
    var Generic = Collections.Generic
})(Collections || (Collections = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
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
    Collections;
(function(Collections) {
    (function(Generic) {
        var ObservableSet = function(_super) {
                __extends(ObservableSet, _super);
                function ObservableSet() {
                    _super.apply(this, arguments);
                    this._listeners = [];
                    this._observedItems = []
                }
                return ObservableSet.prototype.add = function(item) {
                        return _super.prototype.add.call(this, item) ? (this._invoke(item, !0), !0) : !1
                    }, ObservableSet.prototype.remove = function(item) {
                        return _super.prototype.remove.call(this, item) ? (this._invoke(item, !1), !0) : !1
                    }, ObservableSet.prototype.clear = function() {
                            var items = this.items();
                            _super.prototype.clear.call(this);
                            for (var i = 0, len = items.length; i < len; i++)
                                this._invoke(items[i], !1)
                        }, ObservableSet.prototype.subscribe = function(item, listener) {
                            var i = this._observedItems.indexOf(item);
                            i < 0 && (i = this._observedItems.length, this._observedItems.push(item), this._listeners.push([]));
                            this._listeners[i].push(listener)
                        }, ObservableSet.prototype.unsubscribe = function(item, listener) {
                            var i = this._observedItems.indexOf(item);
                            if (!(i < 0)) {
                                var listeners = this._listeners[i],
                                    j = listeners.indexOf(listener);
                                j < 0 || (listeners.splice(j, 1), listeners.length === 0 && (this._observedItems.splice(i, 1), this._listeners.splice(i, 1)))
                            }
                        }, ObservableSet.prototype._invoke = function(item, isContained) {
                            var i = this._observedItems.indexOf(item);
                            i < 0 || this._listeners[i].forEach(function(listener) {
                                return listener(isContained)
                            })
                        }, ObservableSet
            }(Generic.Set);
        Generic.ObservableSet = ObservableSet
    })(Collections.Generic || (Collections.Generic = {}));
    var Generic = Collections.Generic
})(Collections || (Collections = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Schema) {
        Schema.KeyName = "name";
        Schema.KeyType = "type";
        Schema.KeyPtr = "ptr";
        Schema.TypeArray = "array";
        Schema.TypeObject = "object";
        Schema.TypeBoolean = "b";
        Schema.TypeCurrency = "$";
        Schema.TypeDateTime = "d";
        Schema.TypeHyperlink = "h";
        Schema.TypeImage = "i";
        Schema.TypeMedia = "m";
        Schema.TypeNumber = "n";
        Schema.TypeString = "s"
    })(AppMagic.Schema || (AppMagic.Schema = {}));
    var Schema = AppMagic.Schema
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var HttpRequest = function() {
                function HttpRequest(method, url, headers, queryParameters) {
                    this._method = method;
                    this._url = url;
                    this._headers = headers;
                    this._queryParameters = queryParameters
                }
                return HttpRequest.prototype.getRequestData = function() {
                        return null
                    }, HttpRequest.prototype._getRequestDataWithoutBody = function() {
                        var _this = this,
                            headers = {},
                            queryParameters = {};
                        return Object.keys(this._headers).forEach(function(key) {
                                return headers[key] = _this._headers[key]
                            }), Object.keys(this._queryParameters).forEach(function(key) {
                                return queryParameters[key] = _this._queryParameters[key]
                            }), {
                                    method: this._method, url: this._url, headers: headers, queryParameters: queryParameters
                                }
                    }, HttpRequest
            }();
        Services.HttpRequest = HttpRequest
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var BodilessHttpRequest = function(_super) {
                __extends(BodilessHttpRequest, _super);
                function BodilessHttpRequest(method, url, headers, queryParameters) {
                    _super.call(this, method, url, headers, queryParameters)
                }
                return BodilessHttpRequest.prototype.getRequestData = function() {
                        var data = [],
                            requestData = this._getRequestDataWithoutBody();
                        return {
                                method: requestData.method, url: requestData.url, headers: requestData.headers, queryParameters: requestData.queryParameters, data: data
                            }
                    }, BodilessHttpRequest
            }(Services.HttpRequest);
        Services.BodilessHttpRequest = BodilessHttpRequest
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var BooleanParamValueStringifier = function() {
                function BooleanParamValueStringifier(){}
                return BooleanParamValueStringifier.prototype.getStringValue = function(value) {
                        return value.toString()
                    }, BooleanParamValueStringifier
            }();
        Services.BooleanParamValueStringifier = BooleanParamValueStringifier
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var NamedHttpRequestParam = function() {
                function NamedHttpRequestParam(paramName, value, paramValueStringifier) {
                    this._paramName = paramName;
                    this._value = value;
                    this._paramValueStringifier = paramValueStringifier
                }
                return NamedHttpRequestParam.prototype.apply = function(builder) {
                        var stringValue = this._paramValueStringifier.getStringValue(this._value);
                        this._applyValue(builder, stringValue)
                    }, NamedHttpRequestParam.prototype._applyValue = function(httpRequestBuilder, value){}, NamedHttpRequestParam
            }();
        Services.NamedHttpRequestParam = NamedHttpRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Collections;
(function(Collections) {
    (function(Generic) {
        var Dictionary = function() {
                function Dictionary() {
                    this._dict = Object.create(null)
                }
                return Object.defineProperty(Dictionary.prototype, "count", {
                        get: function() {
                            return Object.keys(this._dict).length
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(Dictionary.prototype, "keys", {
                        get: function() {
                            return Object.keys(this._dict)
                        }, enumerable: !0, configurable: !0
                    }), Dictionary.prototype.containsKey = function(key) {
                            return typeof this._dict[key] != "undefined"
                        }, Dictionary.prototype.getValue = function(key) {
                            return this._dict[key]
                        }, Dictionary.prototype.tryGetValue = function(key) {
                            return typeof this._dict[key] == "undefined" ? {
                                    value: !1, outValue: null
                                } : {
                                    value: !0, outValue: this._dict[key]
                                }
                        }, Dictionary.prototype.setValue = function(key, value) {
                            this._dict[key] = value
                        }, Dictionary.prototype.deleteValue = function(key) {
                            delete this._dict[key]
                        }, Dictionary
            }();
        Generic.Dictionary = Dictionary
    })(Collections.Generic || (Collections.Generic = {}));
    var Generic = Collections.Generic
})(Collections || (Collections = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var Dictionary = Collections.Generic.Dictionary,
            BodilessHttpRequestBuilder = function() {
                function BodilessHttpRequestBuilder() {
                    this._method = "";
                    this._baseUrl = "";
                    this._headers = {};
                    this._queryParameters = {};
                    this._paths = []
                }
                return BodilessHttpRequestBuilder.prototype.clone = function() {
                        var clone = new BodilessHttpRequestBuilder;
                        return this._cloneTo(clone), clone
                    }, BodilessHttpRequestBuilder.prototype._cloneTo = function(destination) {
                        var _this = this;
                        destination._method = this._method;
                        destination._baseUrl = this._baseUrl;
                        Object.keys(this._headers).forEach(function(key) {
                            return destination._headers[key] = _this._headers[key]
                        });
                        Object.keys(this._queryParameters).forEach(function(key) {
                            return destination._queryParameters[key] = _this._queryParameters[key]
                        });
                        for (var i = 0, len = this._paths.length; i < len; i++) {
                            var pathItem = this._paths[i],
                                templateValuesClone = new Dictionary;
                            pathItem.templateValuesByParamName.keys.forEach(function(paramName) {
                                templateValuesClone.setValue(paramName, templateValuesClone.getValue(paramName))
                            });
                            destination._paths.push({
                                path: pathItem.path, templateValuesByParamName: templateValuesClone
                            })
                        }
                    }, BodilessHttpRequestBuilder.prototype.setMethod = function(method) {
                            this._method = method
                        }, BodilessHttpRequestBuilder.prototype.setBaseUrl = function(baseUrl) {
                            this._baseUrl = baseUrl
                        }, BodilessHttpRequestBuilder.prototype.addHeader = function(name, value) {
                            this._headers[name] = value
                        }, BodilessHttpRequestBuilder.prototype.addQueryParameter = function(name, value) {
                            this._queryParameters[name] = value
                        }, BodilessHttpRequestBuilder.prototype.addPath = function(path) {
                            var templateValuesByParamName = new Dictionary;
                            return this._paths.push({
                                    path: path, templateValuesByParamName: templateValuesByParamName
                                }), this._paths.length - 1
                        }, BodilessHttpRequestBuilder.prototype.addTemplateToPath = function(pathIndex, paramName, templateValue) {
                            this._paths[pathIndex].templateValuesByParamName.setValue(paramName, templateValue)
                        }, BodilessHttpRequestBuilder.prototype.getHttpRequest = function() {
                            var requestInfo = this._getHttpRequest();
                            return WinJS.Promise.wrap(new Services.BodilessHttpRequest(requestInfo.method, requestInfo.url, requestInfo.headers, requestInfo.queryParameters))
                        }, BodilessHttpRequestBuilder.prototype._getHttpRequest = function() {
                            var _this = this,
                                url = BodilessHttpRequestBuilder.buildUrl(this._baseUrl, this._paths),
                                headers = {};
                            Object.keys(this._headers).forEach(function(key) {
                                return headers[key] = _this._headers[key]
                            });
                            var queryParameters = {};
                            return Object.keys(this._queryParameters).forEach(function(key) {
                                    return queryParameters[key] = _this._queryParameters[key]
                                }), {
                                    method: this._method, url: url, headers: headers, queryParameters: queryParameters
                                }
                        }, BodilessHttpRequestBuilder.buildUrl = function(baseUrl, paths) {
                            for (var replaceRegex = /{([\$\d\w:\-\.]+)}/g, replacedPaths = paths.map(function(pathItem) {
                                    return pathItem.path === null || pathItem.path.length === 0 ? "" : pathItem.templateValuesByParamName.count === 0 ? pathItem.path : pathItem.path.replace(replaceRegex, function(match, paramName) {
                                            var result = pathItem.templateValuesByParamName.tryGetValue(paramName);
                                            if (!result.value)
                                                return match;
                                            var replacement = result.outValue;
                                            return replacement
                                        })
                                }), lastCharWasForwardSlash = baseUrl.length > 0 && baseUrl.charAt(baseUrl.length - 1) === "/", i = 0, len = replacedPaths.length; i < len; i++)
                                replacedPaths[i].length !== 0 && (lastCharWasForwardSlash || (replacedPaths[i] = "/" + replacedPaths[i]), lastCharWasForwardSlash = replacedPaths[i].charAt(replacedPaths[i].length - 1) === "/");
                            return replacedPaths.unshift(baseUrl), replacedPaths.join("")
                        }, BodilessHttpRequestBuilder
            }();
        Services.BodilessHttpRequestBuilder = BodilessHttpRequestBuilder
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var Dictionary = Collections.Generic.Dictionary,
            FormUrlEncodedHttpRequestBuilder = function(_super) {
                __extends(FormUrlEncodedHttpRequestBuilder, _super);
                function FormUrlEncodedHttpRequestBuilder() {
                    _super.call(this);
                    this._formBody = new Dictionary
                }
                return FormUrlEncodedHttpRequestBuilder.prototype.clone = function() {
                        var clone = new FormUrlEncodedHttpRequestBuilder;
                        return _super.prototype._cloneTo.call(this, clone), this._cloneTo(clone), clone
                    }, FormUrlEncodedHttpRequestBuilder.prototype._cloneTo = function(destination) {
                        var _this = this;
                        this._formBody.keys.forEach(function(key) {
                            var value = _this._formBody.getValue(key);
                            destination._formBody.setValue(key, value)
                        })
                    }, FormUrlEncodedHttpRequestBuilder.prototype.getHttpRequest = function() {
                            var requestInfo = this._getHttpRequest();
                            return WinJS.Promise.wrap(new Services.FormUrlEncodedHttpRequest(requestInfo.method, requestInfo.url, requestInfo.headers, requestInfo.queryParameters, this._formBody))
                        }, FormUrlEncodedHttpRequestBuilder.prototype.setFormValue = function(key, value) {
                            this._formBody.setValue(key, value)
                        }, FormUrlEncodedHttpRequestBuilder
            }(Services.BodilessHttpRequestBuilder);
        Services.FormUrlEncodedHttpRequestBuilder = FormUrlEncodedHttpRequestBuilder
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var FormUrlEncodedBodyRequestParam = function(_super) {
                __extends(FormUrlEncodedBodyRequestParam, _super);
                function FormUrlEncodedBodyRequestParam(paramName, value, paramValueStringifier) {
                    _super.call(this, paramName, value, paramValueStringifier)
                }
                return FormUrlEncodedBodyRequestParam.prototype._applyValue = function(httpRequestBuilder, value) {
                        httpRequestBuilder.setFormValue(this._paramName, value)
                    }, FormUrlEncodedBodyRequestParam
            }(Services.NamedHttpRequestParam);
        Services.FormUrlEncodedBodyRequestParam = FormUrlEncodedBodyRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var FormUrlEncodedHttpRequest = function(_super) {
                __extends(FormUrlEncodedHttpRequest, _super);
                function FormUrlEncodedHttpRequest(method, url, headers, queryParameters, unencodedFormData) {
                    var _this = this;
                    _super.call(this, method, url, headers, queryParameters);
                    this._encodedFormBody = {};
                    unencodedFormData.keys.forEach(function(unencodedkey) {
                        var unencodedValue = unencodedFormData.getValue(unencodedkey);
                        var encodedKey = AppMagic.Services.AuthUtility.fixedEncodeURIComponent(unencodedkey);
                        _this._encodedFormBody[encodedKey] = AppMagic.Services.AuthUtility.fixedEncodeURIComponent(unencodedValue)
                    })
                }
                return FormUrlEncodedHttpRequest.prototype.getEncodedForm = function() {
                        var _this = this,
                            encodedFormParameterKeyValues = {};
                        return Object.keys(this._encodedFormBody).forEach(function(encodedKey) {
                                var encodedValue = _this._encodedFormBody[encodedKey];
                                encodedFormParameterKeyValues[encodedKey] = encodedValue
                            }), encodedFormParameterKeyValues
                    }, FormUrlEncodedHttpRequest.prototype.getRequestData = function() {
                        var encodedFormParameterKeyValues = this.getEncodedForm(),
                            bodyString = Object.keys(encodedFormParameterKeyValues).map(function(key) {
                                return key + "=" + encodedFormParameterKeyValues[key]
                            }).join("&"),
                            data = [new Services.HttpRequestBodyDatum(bodyString)],
                            requestData = this._getRequestDataWithoutBody();
                        return requestData.headers["content-type"] = "application/x-www-form-urlencoded", {
                                method: requestData.method, url: requestData.url, headers: requestData.headers, queryParameters: requestData.queryParameters, data: data
                            }
                    }, FormUrlEncodedHttpRequest
            }(Services.HttpRequest);
        Services.FormUrlEncodedHttpRequest = FormUrlEncodedHttpRequest
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var HeaderRequestParam = function(_super) {
                __extends(HeaderRequestParam, _super);
                function HeaderRequestParam(paramName, value, paramValueStringifier) {
                    _super.call(this, paramName, value, paramValueStringifier)
                }
                return HeaderRequestParam.prototype._applyValue = function(httpRequestBuilder, value) {
                        httpRequestBuilder.addHeader(this._paramName, value)
                    }, HeaderRequestParam
            }(Services.NamedHttpRequestParam);
        Services.HeaderRequestParam = HeaderRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var IdentityJsonValueModifier = function() {
                function IdentityJsonValueModifier(){}
                return IdentityJsonValueModifier.prototype.getJsonValue = function(value) {
                        return value
                    }, IdentityJsonValueModifier
            }();
        Services.IdentityJsonValueModifier = IdentityJsonValueModifier
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var NumberParamValueStringifier = function() {
                function NumberParamValueStringifier(xsdType) {
                    this._xsdType = xsdType
                }
                return NumberParamValueStringifier.prototype.getStringValue = function(value) {
                        return Services.JsonNumberXsdTypeCoercer.coerceNumberToXsdType(value, this._xsdType).toString()
                    }, NumberParamValueStringifier
            }();
        Services.NumberParamValueStringifier = NumberParamValueStringifier
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1FlowCreator = function() {
                function OAuth1FlowCreator(authStore, fixedParams, controller, responseDef) {
                    this._authStore = authStore;
                    this._fixedParams = fixedParams;
                    this._controller = controller;
                    this._responseDef = responseDef
                }
                return OAuth1FlowCreator.prototype.constructFlow = function(dynamicParams) {
                        return null
                    }, OAuth1FlowCreator.prototype._applyParamsToBuilder = function(builder, fixedParams, dynamicParams) {
                        fixedParams.forEach(function(param) {
                            return param.apply(builder)
                        });
                        dynamicParams.forEach(function(param) {
                            return param.apply(builder)
                        })
                    }, OAuth1FlowCreator
            }();
        Services.OAuth1FlowCreator = OAuth1FlowCreator
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1BasicFlowCreator = function(_super) {
                __extends(OAuth1BasicFlowCreator, _super);
                function OAuth1BasicFlowCreator(authStore, factory, fixedParams, controller, responseDef) {
                    _super.call(this, authStore, fixedParams, controller, responseDef);
                    this._factory = factory
                }
                return OAuth1BasicFlowCreator.prototype.constructFlow = function(dynamicParams) {
                        var _this = this,
                            builder = this._factory.createHttpRequestBuilder();
                        return this._applyParamsToBuilder(builder, this._fixedParams, dynamicParams), builder.getHttpRequest().then(function(httpRequest) {
                                return {
                                        success: !0, message: null, result: new Services.OAuth1BasicFlow(_this._authStore, _this._controller, _this._responseDef, httpRequest)
                                    }
                            })
                    }, OAuth1BasicFlowCreator
            }(Services.OAuth1FlowCreator);
        Services.OAuth1BasicFlowCreator = OAuth1BasicFlowCreator
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1FormUrlEncodedFlowCreator = function(_super) {
                __extends(OAuth1FormUrlEncodedFlowCreator, _super);
                function OAuth1FormUrlEncodedFlowCreator(authStore, factory, fixedParams, controller, responseDef) {
                    _super.call(this, authStore, fixedParams, controller, responseDef);
                    this._factory = factory
                }
                return OAuth1FormUrlEncodedFlowCreator.prototype.constructFlow = function(dynamicParams) {
                        var _this = this,
                            builder = this._factory.createHttpRequestBuilder();
                        return this._applyParamsToBuilder(builder, this._fixedParams, dynamicParams), builder.getHttpRequest().then(function(httpRequest) {
                                return WinJS.Promise.wrap({
                                        success: !0, message: null, result: new Services.OAuth1FormUrlEncodedFlow(_this._authStore, _this._controller, _this._responseDef, httpRequest)
                                    })
                            })
                    }, OAuth1FormUrlEncodedFlowCreator
            }(Services.OAuth1FlowCreator);
        Services.OAuth1FormUrlEncodedFlowCreator = OAuth1FormUrlEncodedFlowCreator
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var RequestDefinitionDeserializer = function() {
                    function RequestDefinitionDeserializer(builder) {
                        this._builder = builder;
                        this._fixedRequestParams = [];
                        this._dynamicRequestParamsByParameterName = {}
                    }
                    return RequestDefinitionDeserializer.prototype.parseMethodAndBaseUrl = function(fnDef) {
                            this._builder.setMethod(fnDef.request.method);
                            this._builder.setBaseUrl(fnDef.request.url.base)
                        }, RequestDefinitionDeserializer.prototype.parseHeaderParamDefinitionListing = function(listing, nameKey) {
                            ServiceConfigDeserialization.parseHeaderParamDefinitionListing(listing, nameKey, this._fixedRequestParams, this._dynamicRequestParamsByParameterName)
                        }, RequestDefinitionDeserializer.prototype.parseQueryParamDefinitionListing = function(listing, nameKey) {
                                ServiceConfigDeserialization.parseQueryParamDefinitionListing(listing, nameKey, this._fixedRequestParams, this._dynamicRequestParamsByParameterName)
                            }, RequestDefinitionDeserializer.prototype.parsePathItemDefinitions = function(pathItemDefs) {
                                ServiceConfigDeserialization.parsePathItemDefinitions(pathItemDefs, this._builder, this._fixedRequestParams, this._dynamicRequestParamsByParameterName)
                            }, RequestDefinitionDeserializer.prototype.parseBody = function(bodyDefinition){}, RequestDefinitionDeserializer.prototype.getParams = function() {
                                return {
                                        httpRequestBuilder: this._builder, fixedRequestParams: this._fixedRequestParams, dynamicRequestParamsByParameterName: this._dynamicRequestParamsByParameterName
                                    }
                            }, RequestDefinitionDeserializer
                }();
            ServiceConfigDeserialization.RequestDefinitionDeserializer = RequestDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var BodilessRequestDefinitionDeserializer = function(_super) {
                    __extends(BodilessRequestDefinitionDeserializer, _super);
                    function BodilessRequestDefinitionDeserializer() {
                        _super.call(this, new Services.BodilessHttpRequestBuilder)
                    }
                    return BodilessRequestDefinitionDeserializer.prototype.parseBody = function(bodyDefinition){}, BodilessRequestDefinitionDeserializer
                }(ServiceConfigDeserialization.RequestDefinitionDeserializer);
            ServiceConfigDeserialization.BodilessRequestDefinitionDeserializer = BodilessRequestDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var FormUrlEncodedRequestDefinitionDeserializer = function(_super) {
                    __extends(FormUrlEncodedRequestDefinitionDeserializer, _super);
                    function FormUrlEncodedRequestDefinitionDeserializer() {
                        _super.call(this, new Services.FormUrlEncodedHttpRequestBuilder)
                    }
                    return FormUrlEncodedRequestDefinitionDeserializer.prototype.parseBody = function(bodyDefinition) {
                            var constants = AppMagic.Constants.Services.Rest,
                                listing = bodyDefinition[constants.RequestBodyJsonKey_Params];
                            ServiceConfigDeserialization.parseFormUrlEncodedBodyParamDefinitionListing(listing, this._fixedRequestParams, this._dynamicRequestParamsByParameterName)
                        }, FormUrlEncodedRequestDefinitionDeserializer
                }(ServiceConfigDeserialization.RequestDefinitionDeserializer);
            ServiceConfigDeserialization.FormUrlEncodedRequestDefinitionDeserializer = FormUrlEncodedRequestDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var FunctionDefinitionDeserializer = function() {
                    function FunctionDefinitionDeserializer(restWorkerController, paramDeserializer) {
                        this._paramDeserializer = paramDeserializer;
                        this._restWorkerController = restWorkerController
                    }
                    return FunctionDefinitionDeserializer.prototype._parseFunctionDefinition = function(fnDef) {
                            var constants = AppMagic.Constants.Services.Rest;
                            var requestDef = fnDef.request;
                            this._paramDeserializer.parseMethodAndBaseUrl(fnDef);
                            this._paramDeserializer.parseHeaderParamDefinitionListing(requestDef.headers, constants.ParamKey_Key);
                            this._paramDeserializer.parseQueryParamDefinitionListing(requestDef.querystringparameters, constants.ParamKey_Key);
                            var pathItemDefs = fnDef.request.url.paths;
                            this._paramDeserializer.parsePathItemDefinitions(pathItemDefs);
                            this._paramDeserializer.parseBody(requestDef.body)
                        }, FunctionDefinitionDeserializer.prototype._createFlowInfo = function(fnDef) {
                            return null
                        }, FunctionDefinitionDeserializer.prototype.getFlowInfo = function(fnDef) {
                                return this._parseFunctionDefinition(fnDef), this._createFlowInfo(fnDef)
                            }, FunctionDefinitionDeserializer
                }();
            ServiceConfigDeserialization.FunctionDefinitionDeserializer = FunctionDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var JsonHttpRequest = function(_super) {
                __extends(JsonHttpRequest, _super);
                function JsonHttpRequest(method, url, headers, queryParameters, jsonBody) {
                    _super.call(this, method, url, headers, queryParameters);
                    this._jsonBodyString = typeof jsonBody == "undefined" ? "" : JSON.stringify(jsonBody)
                }
                return JsonHttpRequest.prototype.getRequestData = function() {
                        var data = [new Services.HttpRequestBodyDatum(this._jsonBodyString)],
                            requestData = this._getRequestDataWithoutBody();
                        return requestData.headers["content-type"] = "application/json", {
                                method: requestData.method, url: requestData.url, headers: requestData.headers, queryParameters: requestData.queryParameters, data: data
                            }
                    }, JsonHttpRequest
            }(Services.HttpRequest);
        Services.JsonHttpRequest = JsonHttpRequest
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var HttpRequestBuilderFactory = function() {
                function HttpRequestBuilderFactory(prototype) {
                    this._prototype = prototype
                }
                return HttpRequestBuilderFactory.prototype.createHttpRequestBuilder = function() {
                        return this._prototype.clone()
                    }, HttpRequestBuilderFactory
            }();
        Services.HttpRequestBuilderFactory = HttpRequestBuilderFactory
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var JsonNumberXsdTypeCoercer = function() {
                function JsonNumberXsdTypeCoercer(xsdType) {
                    this._xsdType = xsdType
                }
                return JsonNumberXsdTypeCoercer.prototype.getJsonValue = function(value) {
                        return JsonNumberXsdTypeCoercer.coerceNumberToXsdType(value, this._xsdType)
                    }, JsonNumberXsdTypeCoercer.coerceNumberToXsdType = function(value, xsdType) {
                        switch (xsdType) {
                            case 0:
                            case 1:
                                return value;
                            case 2:
                            case 3:
                                return value > 0 ? Math.floor(value) : Math.ceil(value);
                            case 4:
                            case 5:
                                return Math.abs(value > 0 ? Math.floor(value) : Math.ceil(value));
                            default:
                                break
                        }
                    }, JsonNumberXsdTypeCoercer
            }();
        Services.JsonNumberXsdTypeCoercer = JsonNumberXsdTypeCoercer
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var JsonStringFormatterAndEscaper = function() {
                function JsonStringFormatterAndEscaper(format, escapeChar, charsToEscape) {
                    this._format = format;
                    this._escapeChar = escapeChar;
                    this._charsToEscape = charsToEscape
                }
                return JsonStringFormatterAndEscaper.prototype.getJsonValue = function(value) {
                        return AppMagic.Services.RequestParamUtility.escapeAndFormat(value, this._charsToEscape, this._escapeChar, this._format)
                    }, JsonStringFormatterAndEscaper
            }();
        Services.JsonStringFormatterAndEscaper = JsonStringFormatterAndEscaper
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(NumericXsdType) {
            NumericXsdType[NumericXsdType.Decimal = 0] = "Decimal";
            NumericXsdType[NumericXsdType.Float = 1] = "Float";
            NumericXsdType[NumericXsdType.Int = 2] = "Int";
            NumericXsdType[NumericXsdType.Long = 3] = "Long";
            NumericXsdType[NumericXsdType.UnsignedInt = 4] = "UnsignedInt";
            NumericXsdType[NumericXsdType.UnsignedLong = 5] = "UnsignedLong"
        })(Services.NumericXsdType || (Services.NumericXsdType = {}));
        var NumericXsdType = Services.NumericXsdType
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var QueryRequestParam = function(_super) {
                __extends(QueryRequestParam, _super);
                function QueryRequestParam(paramName, value, paramValueStringifier) {
                    _super.call(this, paramName, value, paramValueStringifier)
                }
                return QueryRequestParam.prototype._applyValue = function(httpRequestBuilder, value) {
                        httpRequestBuilder.addQueryParameter(this._paramName, value)
                    }, QueryRequestParam
            }(Services.NamedHttpRequestParam);
        Services.QueryRequestParam = QueryRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(RequestParamUtility) {
            function escapeAndFormat(input, charsToEscape, escapeChar, format) {
                var value = input;
                if (charsToEscape !== null) {
                    var escapableRegexCharsRegex = /[.\\+*?\[\^\]$(){}=!<>|:\-]/,
                        charsToEscapeRegexString = charsToEscape.split("").map(function(charToEscape) {
                            return charToEscape.replace(escapableRegexCharsRegex, "\\$&")
                        }).join("|");
                    charsToEscapeRegexString = "(" + charsToEscapeRegexString + ")";
                    value = value.replace(new RegExp(charsToEscapeRegexString, "g"), function(charToEscape) {
                        return escapeChar + charToEscape
                    })
                }
                return format !== null && (value = AppMagic.Utility.formatString(format, value)), value
            }
            RequestParamUtility.escapeAndFormat = escapeAndFormat
        })(Services.RequestParamUtility || (Services.RequestParamUtility = {}));
        var RequestParamUtility = Services.RequestParamUtility
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(AuthenticationStatus) {
            AuthenticationStatus[AuthenticationStatus.inProgress = 0] = "inProgress";
            AuthenticationStatus[AuthenticationStatus.success = 1] = "success";
            AuthenticationStatus[AuthenticationStatus.cancel = 2] = "cancel";
            AuthenticationStatus[AuthenticationStatus.invalidUrl = 3] = "invalidUrl";
            AuthenticationStatus[AuthenticationStatus.httpError = 4] = "httpError"
        })(Services.AuthenticationStatus || (Services.AuthenticationStatus = {}));
        var AuthenticationStatus = Services.AuthenticationStatus
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(AuthUtility) {
            var AuthScheme_OAuth = "OAuth",
                OAuthHeaderName_OAuthSignature = "oauth_signature",
                EncodedParameter = function() {
                    function EncodedParameter(){}
                    return EncodedParameter
                }();
            AuthUtility.EncodedParameter = EncodedParameter;
            function getNonce(length) {
                for (var nonce = new Array(length), i = 0; i < length; i++) {
                    var r = Math.floor(Math.random() * 62);
                    nonce[i] = r < 10 ? r.toString() : r < 36 ? String.fromCharCode(r - 10 + "a".charCodeAt(0)) : String.fromCharCode(r - 36 + "A".charCodeAt(0))
                }
                return nonce.join("")
            }
            AuthUtility.getNonce = getNonce;
            function getTimestamp() {
                return Math.round((new Date).getTime() / 1e3).toString()
            }
            AuthUtility.getTimestamp = getTimestamp;
            function fixedEncodeURIComponent(str) {
                return encodeURIComponent(str).replace(/!|'|\(|\)|\*/g, function(char) {
                        switch (char) {
                            case"!":
                                return "%21";
                            case"'":
                                return "%27";
                            case"(":
                                return "%28";
                            case")":
                                return "%29";
                            case"*":
                                return "%2A"
                        }
                        return char
                    })
            }
            AuthUtility.fixedEncodeURIComponent = fixedEncodeURIComponent;
            function signHmacSha1ForOAuth1(method, unencodedEndpoint, unencodedClientSecret, unencodedTokenSecret, encodedParameters) {
                var sorted = [];
                encodedParameters.forEach(function(encodedParameter) {
                    sorted.push({
                        key: encodedParameter.key, value: encodedParameter.value
                    })
                });
                sorted.sort(function(lhs, rhs) {
                    return lhs.key === rhs.key ? lhs.value.localeCompare(rhs.value) : lhs.key.localeCompare(rhs.key)
                });
                var parameterString = sorted.map(function(encodedParameter) {
                        return encodedParameter.key + "=" + encodedParameter.value
                    }).join("&"),
                    keyText = fixedEncodeURIComponent(unencodedClientSecret) + "&" + fixedEncodeURIComponent(unencodedTokenSecret),
                    sigBaseString = method + "&" + fixedEncodeURIComponent(unencodedEndpoint) + "&" + fixedEncodeURIComponent(parameterString);
                return AppMagic.Encryption.instance.generateHmacSha1Signature(sigBaseString, keyText)
            }
            function getOAuth1HmacSha1SignatureForParameters(encodedOAuthParameters, encodedParameters, unencodedClientSecret, unencodedOAuthTokenSecret, httpMethod, unencodedEndpoint) {
                var encodedParametersToBeSigned = [];
                Object.keys(encodedOAuthParameters).forEach(function(key) {
                    encodedParametersToBeSigned.push({
                        key: key, value: encodedOAuthParameters[key]
                    })
                });
                encodedParameters.forEach(function(encodedParameter) {
                    encodedParametersToBeSigned.push(encodedParameter)
                });
                var encodedTokenSecret = fixedEncodeURIComponent(unencodedOAuthTokenSecret);
                return signHmacSha1ForOAuth1(httpMethod, unencodedEndpoint, unencodedClientSecret, encodedTokenSecret, encodedParametersToBeSigned)
            }
            AuthUtility.getOAuth1HmacSha1SignatureForParameters = getOAuth1HmacSha1SignatureForParameters;
            function getHmacSha1SignedOAuthAuthorizationHeader(unencodedSignature, unsignedEncodedOAuthHeaders) {
                var encodedOAuthHeadersCopy = {};
                Object.keys(unsignedEncodedOAuthHeaders).forEach(function(key) {
                    encodedOAuthHeadersCopy[key] = unsignedEncodedOAuthHeaders[key]
                });
                encodedOAuthHeadersCopy[OAuthHeaderName_OAuthSignature] = fixedEncodeURIComponent(unencodedSignature);
                return AuthScheme_OAuth + " " + Object.keys(encodedOAuthHeadersCopy).sort(function(lhs, rhs) {
                        return lhs.localeCompare(rhs)
                    }).map(function(key) {
                        return key + '="' + encodedOAuthHeadersCopy[key] + '"'
                    }).join(", ")
            }
            AuthUtility.getHmacSha1SignedOAuthAuthorizationHeader = getHmacSha1SignedOAuthAuthorizationHeader
        })(Services.AuthUtility || (Services.AuthUtility = {}));
        var AuthUtility = Services.AuthUtility
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var JsonBodyRequestParam = function() {
                function JsonBodyRequestParam(value, path, modifier) {
                    this._value = value;
                    this._path = path;
                    this._jsonValueModifier = modifier
                }
                return JsonBodyRequestParam.prototype.apply = function(httpRequestBuilder) {
                        var value = this._jsonValueModifier.getJsonValue(this._value);
                        httpRequestBuilder.setJsonValue(this._path, value)
                    }, JsonBodyRequestParam
            }();
        Services.JsonBodyRequestParam = JsonBodyRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(OAuth1Constants) {
            OAuth1Constants.OAuthHeaderName_OAuthNonce = "oauth_nonce";
            OAuth1Constants.OAuthHeaderName_OAuthCallBack = "oauth_callback";
            OAuth1Constants.OAuthHeaderName_OAuthSignatureMethod = "oauth_signature_method";
            OAuth1Constants.OAuthHeaderName_OAuthTimestamp = "oauth_timestamp";
            OAuth1Constants.OAuthHeaderName_OAuthConsumerKey = "oauth_consumer_key";
            OAuth1Constants.OAuthHeaderName_OAuthVersion = "oauth_version";
            OAuth1Constants.OAuthHeaderName_OAuthSignature = "oauth_signature";
            OAuth1Constants.OAuthHeaderName_OAuthToken = "oauth_token";
            OAuth1Constants.OAuthHeaderName_OAuthVerifier = "oauth_verifier";
            OAuth1Constants.OAuthHeaderValue_OAuthVersion = "1.0"
        })(Services.OAuth1Constants || (Services.OAuth1Constants = {}));
        var OAuth1Constants = Services.OAuth1Constants
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var PrimitiveDArgument = function() {
                function PrimitiveDArgument(value) {
                    this._value = value
                }
                return Object.defineProperty(PrimitiveDArgument.prototype, "value", {
                        get: function() {
                            return this._value
                        }, enumerable: !0, configurable: !0
                    }), PrimitiveDArgument
            }();
        Services.PrimitiveDArgument = PrimitiveDArgument
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Settings) {
        Settings.instance = null
    })(AppMagic.Settings || (AppMagic.Settings = {}));
    var Settings = AppMagic.Settings
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    (function(MarkupService) {
        MarkupService.instance = null
    })(AppMagic.MarkupService || (AppMagic.MarkupService = {}));
    var MarkupService = AppMagic.MarkupService
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        DynamicDataSource.instance = null
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    (function(Encryption) {
        Encryption.instance = null
    })(AppMagic.Encryption || (AppMagic.Encryption = {}));
    var Encryption = AppMagic.Encryption
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(Importer) {
            Importer.instance = null
        })(Services.Importer || (Services.Importer = {}));
        var Importer = Services.Importer
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(CookieManager) {
            CookieManager.instance = null
        })(Services.CookieManager || (Services.CookieManager = {}));
        var CookieManager = Services.CookieManager
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var EventObject = function() {
        function EventObject() {
            this._listeners = []
        }
        return EventObject.prototype.addListener = function(callback) {
                this._listeners.push(callback)
            }, EventObject.prototype.removeListener = function(callback) {
                var listenerIndex = this._listeners.indexOf(callback);
                if (listenerIndex === -1)
                    throw"Invalid callback. Cannot remove listener that has not been previously added.";
                listenerIndex >= 0 && this._listeners.splice(listenerIndex, 1)
            }, EventObject.prototype.dispatch = function(val) {
                    for (var i = 0, len = this._listeners.length; i < len; i++)
                        this._listeners[i](val)
                }, EventObject.prototype.dispose = function() {
                    this._listeners = null
                }, EventObject
    }();
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        var DynamicDataSourceFactory = function() {
                function DynamicDataSourceFactory() {
                    this.dynamicDataSources = {}
                }
                return DynamicDataSourceFactory.prototype.getDynamicDataSource = function(signalName) {
                        return this.dynamicDataSources[signalName]
                    }, DynamicDataSourceFactory
            }();
        DynamicDataSource.DynamicDataSourceFactory = DynamicDataSourceFactory
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        var HTML5LocationDataSource = function() {
                function HTML5LocationDataSource() {
                    this._isEnabled = !1
                }
                return Object.defineProperty(HTML5LocationDataSource.prototype, "isEnabled", {
                        get: function() {
                            return this._isEnabled
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(HTML5LocationDataSource.prototype, "locationService", {
                        get: function() {
                            return navigator.geolocation
                        }, enumerable: !0, configurable: !0
                    }), HTML5LocationDataSource.prototype.subscribe = function() {
                            this._watchId = navigator.geolocation.watchPosition(this.onPositionSignalChanged.bind(this));
                            this._isEnabled = !0
                        }, HTML5LocationDataSource.prototype.unSubscribe = function() {
                            navigator.geolocation.clearWatch(this._watchId);
                            this._isEnabled = !1;
                            this._watchId = null
                        }, HTML5LocationDataSource.prototype.getData = function(errorFunction) {
                            return navigator.geolocation.getCurrentPosition(this.onPositionSignalChanged, errorFunction), new DynamicDataSource.LocationData(0, 0, 0)
                        }, HTML5LocationDataSource.prototype.onPositionSignalChanged = function(position) {
                            var coords = position.coords,
                                retVal = new DynamicDataSource.LocationData(coords.latitude, coords.longitude, coords.altitude);
                            AppMagic.AuthoringTool.Runtime.updateDynamicDatasource(AppMagic.Strings.LocationDataSourceName, retVal)
                        }, HTML5LocationDataSource
            }();
        DynamicDataSource.HTML5LocationDataSource = HTML5LocationDataSource
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var AuthenticationCache = function() {
                function AuthenticationCache(settings) {
                    this._settings = settings
                }
                return AuthenticationCache.prototype.getToken = function(serviceName, authId) {
                        var cachedTokens = this._getCachedTokens(),
                            cacheKey = this._generateCacheKey(serviceName, authId);
                        return typeof cachedTokens[cacheKey] != "undefined" ? cachedTokens[cacheKey] : null
                    }, AuthenticationCache.prototype.setToken = function(serviceName, authId, value) {
                        var cachedTokens = this._getCachedTokens(),
                            cacheKey = this._generateCacheKey(serviceName, authId);
                        cachedTokens[cacheKey] = value;
                        this._settings.setValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY, cachedTokens)
                    }, AuthenticationCache.prototype.removeToken = function(serviceName, authId) {
                            var cachedTokens = this._getCachedTokens(),
                                cacheKey = this._generateCacheKey(serviceName, authId);
                            delete cachedTokens[cacheKey];
                            this._settings.setValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY, cachedTokens)
                        }, AuthenticationCache.prototype.clearTokens = function() {
                            this._settings.setValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY, {})
                        }, AuthenticationCache.prototype._getCachedTokens = function() {
                            return this._settings.getValue(AppMagic.Constants.Services.OAUTH_SETTINGS_KEY) || {}
                        }, AuthenticationCache.prototype._generateCacheKey = function(serviceName, authId) {
                            return [serviceName.length.toString(), "+", authId.length.toString(), "_", serviceName, authId].join("")
                        }, AuthenticationCache
            }();
        Services.AuthenticationCache = AuthenticationCache
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(DynamicDataSource) {
        var LocationData = function() {
                function LocationData(latitude, longitude, altitude) {
                    this.Latitude = latitude;
                    this.Longitude = longitude;
                    this.Altitude = altitude
                }
                return LocationData
            }();
        DynamicDataSource.LocationData = LocationData
    })(AppMagic.DynamicDataSource || (AppMagic.DynamicDataSource = {}));
    var DynamicDataSource = AppMagic.DynamicDataSource
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1Flow = function() {
                function OAuth1Flow(authStore, controller, responseDef) {
                    this._authStore = authStore;
                    this._controller = controller;
                    this._responseDef = responseDef
                }
                return OAuth1Flow.prototype.callFlow = function(onBeforeAsyncStep, onAfterAsyncStep) {
                        var _this = this;
                        if (this._authStore.isAcquired) {
                            var version = this._authStore.credentialVersion,
                                tokenTimeStamp = this._authStore.tokenTimeStamp;
                            return this._authStore.acquire(onBeforeAsyncStep, onAfterAsyncStep).then(function(response) {
                                    var dummyOnBeforeAndAfterStep = function(){};
                                    return _this._formSignAndSend(response, dummyOnBeforeAndAfterStep, dummyOnBeforeAndAfterStep)
                                }).then(function(response) {
                                    return response.success ? response : tokenTimeStamp + Services.OAuth1Store.DefaultExpiresInMilliseconds > Date.now() ? response : (version === _this._authStore.credentialVersion && _this._authStore.clear(), _this.callFlow(onBeforeAsyncStep, onAfterAsyncStep))
                                })
                        }
                        else
                            return this._authStore.isAcquiring ? this._authStore.acquire(onBeforeAsyncStep, onAfterAsyncStep).then(function(response) {
                                    return response.success ? _this.callFlow(onBeforeAsyncStep, onAfterAsyncStep) : WinJS.Promise.wrap(response)
                                }) : this._authStore.acquire(onBeforeAsyncStep, onAfterAsyncStep).then(function(response) {
                                    return response.success ? _this._formSignAndSend(response, onBeforeAsyncStep, onAfterAsyncStep) : WinJS.Promise.wrap(response)
                                })
                    }, OAuth1Flow.prototype._formSignAndSend = function(response, onBeforeAsyncStep, onAfterAsyncStep) {
                        var httpReqData = this._formAndSign(),
                            body = httpReqData.data.map(function(datum) {
                                return datum.value
                            });
                        return onBeforeAsyncStep(), this._controller.sendHttpAndParse(httpReqData.url, httpReqData.method, httpReqData.headers, httpReqData.queryParameters, body, this._responseDef).then(function(response) {
                                return onAfterAsyncStep(), response
                            }, function(error) {
                                onAfterAsyncStep();
                                throw error;
                            })
                    }, OAuth1Flow.prototype._formAndSign = function() {
                            return null
                        }, OAuth1Flow.prototype._getEncodedOAuth1Parameters = function() {
                            var encodedOAuth1Parameters = this._authStore.getEncodedBaseOAuth1Parameters();
                            return encodedOAuth1Parameters[Services.OAuth1Constants.OAuthHeaderName_OAuthToken] = Services.AuthUtility.fixedEncodeURIComponent(this._authStore.unencodedOAuthToken), encodedOAuth1Parameters
                        }, OAuth1Flow.NonceLength = 16, OAuth1Flow
            }();
        Services.OAuth1Flow = OAuth1Flow
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1BasicFlow = function(_super) {
                __extends(OAuth1BasicFlow, _super);
                function OAuth1BasicFlow(authStore, controller, responseDef, httpRequest) {
                    _super.call(this, authStore, controller, responseDef);
                    this._httpRequest = httpRequest
                }
                return OAuth1BasicFlow.prototype._formAndSign = function() {
                        var httpReqData = this._httpRequest.getRequestData(),
                            authorizationHeader = OAuth1BasicFlow.getAuthorizationHeader(this._getEncodedOAuth1Parameters(), httpReqData.queryParameters, this._authStore.unencodedOAuthTokenSecret, this._authStore.clientSecret, httpReqData.method, httpReqData.url);
                        return httpReqData.headers.Authorization = authorizationHeader, httpReqData
                    }, OAuth1BasicFlow.getAuthorizationHeader = function(encodedOAuth1Parameters, unencodedQueryParams, unencodedOAuthTokenSecret, clientSecret, httpMethod, url) {
                        var encodedParametersToBeSigned = [];
                        Object.keys(unencodedQueryParams).forEach(function(key) {
                            encodedParametersToBeSigned.push({
                                key: AppMagic.Services.AuthUtility.fixedEncodeURIComponent(key), value: AppMagic.Services.AuthUtility.fixedEncodeURIComponent(unencodedQueryParams[key])
                            })
                        });
                        var signature = Services.AuthUtility.getOAuth1HmacSha1SignatureForParameters(encodedOAuth1Parameters, encodedParametersToBeSigned, clientSecret, unencodedOAuthTokenSecret, httpMethod, url);
                        return Services.AuthUtility.getHmacSha1SignedOAuthAuthorizationHeader(signature, encodedOAuth1Parameters)
                    }, OAuth1BasicFlow
            }(Services.OAuth1Flow);
        Services.OAuth1BasicFlow = OAuth1BasicFlow
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var OAuth1FormUrlEncodedFlow = function(_super) {
                __extends(OAuth1FormUrlEncodedFlow, _super);
                function OAuth1FormUrlEncodedFlow(authStore, controller, responseDef, formRequest) {
                    _super.call(this, authStore, controller, responseDef);
                    this._formRequest = formRequest
                }
                return OAuth1FormUrlEncodedFlow.prototype._formAndSign = function() {
                        var encodedFormParameterKeyValues = this._formRequest.getEncodedForm(),
                            timeStamp = AppMagic.Services.AuthUtility.getTimestamp(),
                            encodedNonce = AppMagic.Services.AuthUtility.getNonce(Services.OAuth1Flow.NonceLength),
                            httpReqData = this._formRequest.getRequestData(),
                            authorizationHeader = OAuth1FormUrlEncodedFlow.getAuthorizationHeader(this._getEncodedOAuth1Parameters(), encodedFormParameterKeyValues, httpReqData.queryParameters, this._authStore.unencodedOAuthTokenSecret, this._authStore.clientSecret, httpReqData.method, httpReqData.url);
                        return httpReqData.headers.Authorization = authorizationHeader, httpReqData
                    }, OAuth1FormUrlEncodedFlow.getAuthorizationHeader = function(encodedOAuth1Parameters, encodedFormParameters, unencodedQueryParams, unencodedOAuthTokenSecret, clientSecret, httpMethod, url) {
                        var encodedParametersToBeSigned = [];
                        Object.keys(encodedFormParameters).forEach(function(key) {
                            encodedParametersToBeSigned.push({
                                key: key, value: encodedFormParameters[key]
                            })
                        });
                        Object.keys(unencodedQueryParams).forEach(function(key) {
                            encodedParametersToBeSigned.push({
                                key: AppMagic.Services.AuthUtility.fixedEncodeURIComponent(key), value: AppMagic.Services.AuthUtility.fixedEncodeURIComponent(unencodedQueryParams[key])
                            })
                        });
                        var signature = Services.AuthUtility.getOAuth1HmacSha1SignatureForParameters(encodedOAuth1Parameters, encodedParametersToBeSigned, clientSecret, unencodedOAuthTokenSecret, httpMethod, url);
                        return Services.AuthUtility.getHmacSha1SignedOAuthAuthorizationHeader(signature, encodedOAuth1Parameters)
                    }, OAuth1FormUrlEncodedFlow
            }(Services.OAuth1Flow);
        Services.OAuth1FormUrlEncodedFlow = OAuth1FormUrlEncodedFlow
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var AsyncResult = function() {
                function AsyncResult(){}
                return AsyncResult
            }();
        Services.AsyncResult = AsyncResult
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services){})(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var JsonRequestDefinitionDeserializer = function(_super) {
                    __extends(JsonRequestDefinitionDeserializer, _super);
                    function JsonRequestDefinitionDeserializer() {
                        _super.call(this, new Services.JsonHttpRequestBuilder)
                    }
                    return JsonRequestDefinitionDeserializer.prototype.parseBody = function(bodyDefinition) {
                            var constants = AppMagic.Constants.Services.Rest,
                                listing = bodyDefinition[constants.RequestBodyJsonKey_Params];
                            ServiceConfigDeserialization.parseJsonBodyParamDefinitionListing(listing, this._fixedRequestParams, this._dynamicRequestParamsByParameterName)
                        }, JsonRequestDefinitionDeserializer
                }(ServiceConfigDeserialization.RequestDefinitionDeserializer);
            ServiceConfigDeserialization.JsonRequestDefinitionDeserializer = JsonRequestDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var OAuth1BasicFlowFunctionDefinitionDeserializer = function(_super) {
                    __extends(OAuth1BasicFlowFunctionDefinitionDeserializer, _super);
                    function OAuth1BasicFlowFunctionDefinitionDeserializer(authStore, restWorkerController, paramDeserializer) {
                        _super.call(this, restWorkerController, paramDeserializer);
                        this._authStore = authStore
                    }
                    return OAuth1BasicFlowFunctionDefinitionDeserializer.prototype._createFlowInfo = function(fnDef) {
                            var responseDef = fnDef.response;
                            var result = this._paramDeserializer.getParams(),
                                factory = new AppMagic.Services.HttpRequestBuilderFactory(result.httpRequestBuilder),
                                flowCreator = new AppMagic.Services.OAuth1BasicFlowCreator(this._authStore, factory, result.fixedRequestParams, this._restWorkerController, responseDef);
                            return {
                                    flowCreator: flowCreator, dynamicRequestParamsByParameterName: result.dynamicRequestParamsByParameterName
                                }
                        }, OAuth1BasicFlowFunctionDefinitionDeserializer
                }(ServiceConfigDeserialization.FunctionDefinitionDeserializer);
            ServiceConfigDeserialization.OAuth1BasicFlowFunctionDefinitionDeserializer = OAuth1BasicFlowFunctionDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer = function(_super) {
                    __extends(OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer, _super);
                    function OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer(authStore, restWorkerController, paramDeserializer) {
                        _super.call(this, restWorkerController, paramDeserializer);
                        this._authStore = authStore
                    }
                    return OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer.prototype._createFlowInfo = function(fnDef) {
                            var responseDef = fnDef.response;
                            var result = this._paramDeserializer.getParams(),
                                factory = new AppMagic.Services.HttpRequestBuilderFactory(result.httpRequestBuilder),
                                flowCreator = new AppMagic.Services.OAuth1FormUrlEncodedFlowCreator(this._authStore, factory, result.fixedRequestParams, this._restWorkerController, responseDef);
                            return {
                                    flowCreator: flowCreator, dynamicRequestParamsByParameterName: result.dynamicRequestParamsByParameterName
                                }
                        }, OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer
                }(ServiceConfigDeserialization.FunctionDefinitionDeserializer);
            ServiceConfigDeserialization.OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer = OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var StringParamValueStringifier = function() {
                function StringParamValueStringifier(format, escapeChar, charsToEscape) {
                    this._format = typeof format == "undefined" ? null : format;
                    this._escapeChar = typeof escapeChar == "undefined" ? null : escapeChar;
                    this._charsToEscape = typeof charsToEscape == "undefined" ? null : charsToEscape
                }
                return StringParamValueStringifier.prototype.getStringValue = function(value) {
                        return AppMagic.Services.RequestParamUtility.escapeAndFormat(value, this._charsToEscape, this._escapeChar, this._format)
                    }, StringParamValueStringifier
            }();
        Services.StringParamValueStringifier = StringParamValueStringifier
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        (function(ServiceConfigDeserialization) {
            var ParamValueType_Fixed = "fixed";
            function parseFormUrlEncodedBodyParamDefinitionListing(listing, fixedRequestParams, dynamicRequestParamsByParameterName) {
                var createBooleanFunction = function(paramName) {
                        return function(value) {
                                return new Services.FormUrlEncodedBodyRequestParam(paramName, value, new Services.BooleanParamValueStringifier)
                            }
                    },
                    createNumberFunction = function(paramName, xsdType) {
                        return function(value) {
                                return new Services.FormUrlEncodedBodyRequestParam(paramName, value, new Services.NumberParamValueStringifier(xsdType))
                            }
                    },
                    createStringFunction = function(paramName, format, escapeChar, charsToEscape) {
                        return function(value) {
                                return new Services.FormUrlEncodedBodyRequestParam(paramName, value, new Services.StringParamValueStringifier(format, escapeChar, charsToEscape))
                            }
                    },
                    constants = AppMagic.Constants.Services.Rest,
                    nameKey = constants.ParamKey_Name;
                return parseParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName, createBooleanFunction, createNumberFunction, createStringFunction)
            }
            ServiceConfigDeserialization.parseFormUrlEncodedBodyParamDefinitionListing = parseFormUrlEncodedBodyParamDefinitionListing;
            function parseJsonBodyParamDefinitionListing(listing, fixedRequestParams, dynamicRequestParamsByParameterName) {
                var createBooleanFunction = function(path) {
                        return function(value) {
                                return new Services.JsonBodyRequestParam(value, path, new Services.IdentityJsonValueModifier)
                            }
                    },
                    createNumberFunction = function(path, xsdType) {
                        return function(value) {
                                return new Services.JsonBodyRequestParam(value, path, new Services.JsonNumberXsdTypeCoercer(xsdType))
                            }
                    },
                    createStringFunction = function(path, format, escapeChar, charsToEscape) {
                        return function(value) {
                                return format = typeof format == "undefined" ? null : format, escapeChar = typeof escapeChar == "undefined" ? null : escapeChar, charsToEscape = typeof charsToEscape == "undefined" ? null : charsToEscape, new Services.JsonBodyRequestParam(value, path, new Services.JsonStringFormatterAndEscaper(format, escapeChar, charsToEscape))
                            }
                    },
                    constants = AppMagic.Constants.Services.Rest;
                listing.forEach(function(paramDef) {
                    var path = paramDef.path,
                        paramValueType = paramDef.value.type,
                        paramValueDef = paramDef.value.definition;
                    var isFixed = paramValueType === constants.ParamValueType_Fixed;
                    var createFunction,
                        xsdType = null;
                    switch (paramDef.type) {
                        case constants.XsdType.Boolean:
                            createFunction = createBooleanFunction(path);
                            break;
                        case constants.XsdType.Decimal:
                            xsdType = xsdType === null ? 0 : xsdType;
                        case constants.XsdType.Float:
                            xsdType = xsdType === null ? 1 : xsdType;
                        case constants.XsdType.Int:
                            xsdType = xsdType === null ? 2 : xsdType;
                        case constants.XsdType.Long:
                            xsdType = xsdType === null ? 3 : xsdType;
                        case constants.XsdType.UnsignedInt:
                            xsdType = xsdType === null ? 4 : xsdType;
                        case constants.XsdType.UnsignedLong:
                            xsdType = xsdType === null ? 5 : xsdType;
                            createFunction = createNumberFunction(path, xsdType);
                            break;
                        case constants.XsdType.String:
                            createFunction = createStringFunction(path, paramDef.format, paramDef.escapechar, paramDef.charstoescape);
                            break;
                        default:
                            break
                    }
                    isFixed ? fixedRequestParams.push(createFunction(paramValueDef)) : dynamicRequestParamsByParameterName[paramValueDef] = createFunction
                })
            }
            ServiceConfigDeserialization.parseJsonBodyParamDefinitionListing = parseJsonBodyParamDefinitionListing;
            function parseParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName, createBooleanFunction, createNumberFunction, createStringFunction) {
                var constants = AppMagic.Constants.Services.Rest;
                listing.forEach(function(paramDef) {
                    var paramName = paramDef[nameKey],
                        paramValueType = paramDef.value.type,
                        paramValueDef = paramDef.value.definition;
                    var isFixed = paramValueType === constants.ParamValueType_Fixed;
                    var createFunction,
                        xsdType = null;
                    switch (paramDef.type) {
                        case constants.XsdType.Boolean:
                            createFunction = createBooleanFunction(paramName);
                            break;
                        case constants.XsdType.Decimal:
                            xsdType = xsdType === null ? 0 : xsdType;
                        case constants.XsdType.Float:
                            xsdType = xsdType === null ? 1 : xsdType;
                        case constants.XsdType.Int:
                            xsdType = xsdType === null ? 2 : xsdType;
                        case constants.XsdType.Long:
                            xsdType = xsdType === null ? 3 : xsdType;
                        case constants.XsdType.UnsignedInt:
                            xsdType = xsdType === null ? 4 : xsdType;
                        case constants.XsdType.UnsignedLong:
                            xsdType = xsdType === null ? 5 : xsdType;
                            createFunction = createNumberFunction(paramName, xsdType);
                            break;
                        case constants.XsdType.String:
                            createFunction = createStringFunction(paramName, paramDef.format, paramDef.escapechar, paramDef.charstoescape);
                            break;
                        default:
                            break
                    }
                    isFixed ? fixedRequestParams.push(createFunction(paramValueDef)) : dynamicRequestParamsByParameterName[paramValueDef] = createFunction
                })
            }
            function parseHeaderParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName) {
                var createBooleanFunction = function(paramName) {
                        return function(value) {
                                return new Services.HeaderRequestParam(paramName, value, new Services.BooleanParamValueStringifier)
                            }
                    },
                    createNumberFunction = function(paramName, xsdType) {
                        return function(value) {
                                return new Services.HeaderRequestParam(paramName, value, new Services.NumberParamValueStringifier(xsdType))
                            }
                    },
                    createStringFunction = function(paramName, format, escapeChar, charsToEscape) {
                        return function(value) {
                                return new Services.HeaderRequestParam(paramName, value, new Services.StringParamValueStringifier(format, escapeChar, charsToEscape))
                            }
                    };
                return parseParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName, createBooleanFunction, createNumberFunction, createStringFunction)
            }
            ServiceConfigDeserialization.parseHeaderParamDefinitionListing = parseHeaderParamDefinitionListing;
            function parseQueryParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName) {
                var createBooleanFunction = function(paramName) {
                        return function(value) {
                                return new Services.QueryRequestParam(paramName, value, new Services.BooleanParamValueStringifier)
                            }
                    },
                    createNumberFunction = function(paramName, xsdType) {
                        return function(value) {
                                return new Services.QueryRequestParam(paramName, value, new Services.NumberParamValueStringifier(xsdType))
                            }
                    },
                    createStringFunction = function(paramName, format, escapeChar, charsToEscape) {
                        return function(value) {
                                return new Services.QueryRequestParam(paramName, value, new Services.StringParamValueStringifier(format, escapeChar, charsToEscape))
                            }
                    };
                return parseParamDefinitionListing(listing, nameKey, fixedRequestParams, dynamicRequestParamsByParameterName, createBooleanFunction, createNumberFunction, createStringFunction)
            }
            ServiceConfigDeserialization.parseQueryParamDefinitionListing = parseQueryParamDefinitionListing;
            function parsePathItemDefinitions(pathItemDefs, builder, fixedRequestParams, dynamicRequestParamsByParameterName) {
                var constants = AppMagic.Constants.Services.Rest;
                pathItemDefs.forEach(function(pathItemDef) {
                    var path = pathItemDef.path,
                        pathIndex = builder.addPath(path),
                        createBooleanFunction = function(paramName) {
                            return function(value) {
                                    return new Services.TemplateRequestParam(paramName, value, new Services.BooleanParamValueStringifier, pathIndex)
                                }
                        },
                        createNumberFunction = function(paramName, xsdType) {
                            return function(value) {
                                    return new Services.TemplateRequestParam(paramName, value, new Services.NumberParamValueStringifier(xsdType), pathIndex)
                                }
                        },
                        createStringFunction = function(paramName, format, escapeChar, charsToEscape) {
                            return function(value) {
                                    return new Services.TemplateRequestParam(paramName, value, new Services.StringParamValueStringifier(format, escapeChar, charsToEscape), pathIndex)
                                }
                        },
                        templateDefs = pathItemDef.templates;
                    parseParamDefinitionListing(templateDefs, constants.ParamKey_Name, fixedRequestParams, dynamicRequestParamsByParameterName, createBooleanFunction, createNumberFunction, createStringFunction)
                })
            }
            ServiceConfigDeserialization.parsePathItemDefinitions = parsePathItemDefinitions
        })(Services.ServiceConfigDeserialization || (Services.ServiceConfigDeserialization = {}));
        var ServiceConfigDeserialization = Services.ServiceConfigDeserialization
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var Dictionary = Collections.Generic.Dictionary,
            SyncAndResolveInfo = function() {
                function SyncAndResolveInfo(){}
                return SyncAndResolveInfo
            }();
        Services.SyncAndResolveInfo = SyncAndResolveInfo;
        var RowDiff = function() {
                function RowDiff(){}
                return RowDiff
            }();
        Services.RowDiff = RowDiff;
        var Field = function() {
                function Field(){}
                return Field
            }();
        Services.Field = Field,
        function(SharePointType) {
            SharePointType[SharePointType.DateTime = 0] = "DateTime";
            SharePointType[SharePointType.Currency = 1] = "Currency";
            SharePointType[SharePointType.Url = 2] = "Url";
            SharePointType[SharePointType.Number = 3] = "Number";
            SharePointType[SharePointType.Integer = 4] = "Integer";
            SharePointType[SharePointType.Text = 5] = "Text";
            SharePointType[SharePointType.Note = 6] = "Note";
            SharePointType[SharePointType.Choice = 7] = "Choice";
            SharePointType[SharePointType.LookUp = 8] = "LookUp";
            SharePointType[SharePointType.Boolean = 9] = "Boolean"
        }(Services.SharePointType || (Services.SharePointType = {}));
        var SharePointType = Services.SharePointType,
            ListSchemaItem = function() {
                function ListSchemaItem(){}
                return ListSchemaItem
            }();
        Services.ListSchemaItem = ListSchemaItem;
        var ProcessListSchemaResult = function() {
                function ProcessListSchemaResult(){}
                return ProcessListSchemaResult
            }();
        Services.ProcessListSchemaResult = ProcessListSchemaResult;
        var Method = function() {
                function Method(){}
                return Method
            }();
        Services.Method = Method;
        var SharePointSyncWorker = function() {
                function SharePointSyncWorker(){}
                return SharePointSyncWorker.getUnreservedKeys = function(obj) {
                        return Object.keys(obj).filter(function(key) {
                                return SharePointSyncWorker.ReservedKeys.indexOf(key) < 0
                            })
                    }, SharePointSyncWorker.sharePointTypeToDType = function(sharePointType) {
                        switch (sharePointType.toLowerCase()) {
                            case SharePointSyncWorker.SharePointColumnType_AllDayEvent:
                            case SharePointSyncWorker.SharePointColumnType_Recurrence:
                            case SharePointSyncWorker.SharePointColumnType_Boolean:
                                return {
                                        dtype: AppMagic.Schema.TypeBoolean, sharePointType: 9
                                    };
                            case SharePointSyncWorker.SharePointColumnType_MultiChoice:
                            case SharePointSyncWorker.SharePointColumnType_GridChoice:
                            case SharePointSyncWorker.SharePointColumnType_Choice:
                                return {
                                        dtype: AppMagic.Schema.TypeString, sharePointType: 7
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Currency:
                                return {
                                        dtype: AppMagic.Schema.TypeCurrency, sharePointType: 1
                                    };
                            case SharePointSyncWorker.SharePointColumnType_DateTime:
                                return {
                                        dtype: AppMagic.Schema.TypeDateTime, sharePointType: 0
                                    };
                            case SharePointSyncWorker.SharePointColumnType_LookUp:
                                return {
                                        dtype: AppMagic.Schema.TypeString, sharePointType: 8
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Note:
                                return {
                                        dtype: AppMagic.Schema.TypeString, sharePointType: 6
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Number:
                                return {
                                        dtype: AppMagic.Schema.TypeNumber, sharePointType: 3
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Integer:
                                return {
                                        dtype: AppMagic.Schema.TypeNumber, sharePointType: 4
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Url:
                                return {
                                        dtype: AppMagic.Schema.TypeHyperlink, sharePointType: 2
                                    };
                            case SharePointSyncWorker.SharePointColumnType_Calculated:
                            case SharePointSyncWorker.SharePointColumnType_Computed:
                            case SharePointSyncWorker.SharePointColumnType_User:
                            case SharePointSyncWorker.SharePointColumnType_UserMulti:
                            case SharePointSyncWorker.SharePointColumnType_Facilities:
                            case SharePointSyncWorker.SharePointColumnType_FreeBusy:
                            case SharePointSyncWorker.SharePointColumnType_Overbook:
                            case SharePointSyncWorker.SharePointColumnType_Counter:
                            case SharePointSyncWorker.SharePointColumnType_File:
                            case SharePointSyncWorker.SharePointColumnType_LayoutVariationsField:
                            case SharePointSyncWorker.SharePointColumnType_Guid:
                            case SharePointSyncWorker.SharePointColumnType_TargetTo:
                            case SharePointSyncWorker.SharePointColumnType_Html:
                            case SharePointSyncWorker.SharePointColumnType_CrossProjectLink:
                            case SharePointSyncWorker.SharePointColumnType_LookUpMulti:
                            case SharePointSyncWorker.SharePointColumnType_Text:
                                return {
                                        dtype: AppMagic.Schema.TypeString, sharePointType: 5
                                    };
                            default:
                                return {
                                        dtype: AppMagic.Schema.TypeString, sharePointType: 5
                                    }
                        }
                    }, SharePointSyncWorker.dValueToSharePointValue = function(value, sharePointType) {
                            switch (sharePointType) {
                                case 9:
                                    return value ? SharePointSyncWorker.SharePointBooleanValue_True : SharePointSyncWorker.SharePointBooleanValue_False;
                                    break;
                                case 0:
                                    var d = new Date;
                                    d.setTime(value);
                                    var isoString = d.toISOString();
                                    return isoString.substring(0, 10) + " " + isoString.substring(11, 19);
                                case 1:
                                case 3:
                                case 4:
                                    return value.toString();
                                case 7:
                                case 8:
                                case 6:
                                case 5:
                                case 2:
                                    return value;
                                default:
                                    return value
                            }
                        }, SharePointSyncWorker.sharePointValueToDValue = function(value, dtype) {
                            switch (dtype) {
                                case AppMagic.Schema.TypeBoolean:
                                    return value === SharePointSyncWorker.SharePointBooleanValue_True;
                                case AppMagic.Schema.TypeDateTime:
                                    var dateMatch = value.match(/^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/);
                                    if (dateMatch === null)
                                        return null;
                                    var utcTimeValues = dateMatch.splice(1);
                                    return utcTimeValues[1] = (parseInt(utcTimeValues[1]) - 1).toString(), Date.UTC.apply(null, utcTimeValues);
                                case AppMagic.Schema.TypeCurrency:
                                case AppMagic.Schema.TypeNumber:
                                    return parseFloat(value);
                                case AppMagic.Schema.TypeHyperlink:
                                    var urls = value.split(",");
                                    return urls.length > 0 ? urls[0].trim() : value;
                                case AppMagic.Schema.TypeString:
                                    return value;
                                default:
                                    return value
                            }
                        }, SharePointSyncWorker.prototype.syncAndResolve = function(syncAndResolveInfo) {
                            return SharePointSyncWorker.getList(syncAndResolveInfo.configuration.siteUri, syncAndResolveInfo.configuration.listName).then(function(getListSchemaResponse) {
                                    if (!getListSchemaResponse.success)
                                        return WinJS.Promise.wrap(getListSchemaResponse);
                                    var processedListSchemaResponse = SharePointSyncWorker.getFieldsFromListSchema(getListSchemaResponse.result);
                                    return processedListSchemaResponse.success ? SharePointSyncWorker.updateListItemsAndComputeNewWorkspace(syncAndResolveInfo.configuration.siteUri, syncAndResolveInfo.configuration.listName, syncAndResolveInfo.workspaceData, syncAndResolveInfo.localData, processedListSchemaResponse.result, SharePointSyncWorker.UpdateListItems_MaxBatchSize) : WinJS.Promise.wrap(processedListSchemaResponse)
                                }, function(error) {
                                    throw error;
                                })
                        }, SharePointSyncWorker.updateListItemsAndComputeNewWorkspace = function(siteUri, listName, workspaceData, localData, listSchema, maxBatchSize) {
                            var updateMethods = SharePointSyncWorker.buildUpdateListItemsMethods(workspaceData, localData, listSchema);
                            if (updateMethods.length > 0) {
                                for (var numberOfBatches = Math.ceil(updateMethods.length / maxBatchSize), updateResponses = new Array(numberOfBatches), chainedUpdatesPromise = WinJS.Promise.wrap(), i = 0, len = numberOfBatches; i < len; i++)
                                    (function() {
                                        var index = i,
                                            methodBatch = updateMethods.splice(0, maxBatchSize);
                                        chainedUpdatesPromise = chainedUpdatesPromise.then(function() {
                                            return SharePointSyncWorker.updateListItems(siteUri, listName, methodBatch)
                                        }).then(function(updateListItemsResponse) {
                                            return updateResponses[index] = updateListItemsResponse, WinJS.Promise.wrap()
                                        })
                                    })();
                                var newLocalDataById = new Dictionary,
                                    localDataBySpId = new Dictionary;
                                return localData.forEach(function(datum) {
                                        var spId = datum[SharePointSyncWorker.SpIdProperty];
                                        if (typeof spId != "undefined")
                                            localDataBySpId.setValue(spId.toString(), datum);
                                        else {
                                            var id = datum[SharePointSyncWorker.IdProperty].toString();
                                            newLocalDataById.setValue(id, datum)
                                        }
                                    }), chainedUpdatesPromise.then(function() {
                                        var updateResults = updateResponses.filter(function(updateResponse) {
                                                return updateResponse.success
                                            }).map(function(updateResponse) {
                                                return updateResponse.result
                                            });
                                        return SharePointSyncWorker.mergeUpdateListItemsResponsesIntoLocalData(localData, updateResults), SharePointSyncWorker.getListItemsAndComputeNewWorkspace(siteUri, listName, listSchema, localData)
                                    })
                            }
                            else
                                return SharePointSyncWorker.getListItemsAndComputeNewWorkspace(siteUri, listName, listSchema, localData)
                        }, SharePointSyncWorker.getListItemsAndComputeNewWorkspace = function(siteUri, listName, listSchema, localData) {
                            return SharePointSyncWorker.getListItems(siteUri, listName).then(function(getListItemsResponse) {
                                    if (!getListItemsResponse.success)
                                        return WinJS.Promise.wrap(getListItemsResponse);
                                    var processedlistItemsResponse = SharePointSyncWorker.processGetListItemsResponse(listSchema, getListItemsResponse.result);
                                    return processedlistItemsResponse.success ? (SharePointSyncWorker.mergeServerDataIntoLocalData(localData, processedlistItemsResponse.result), WinJS.Promise.wrap({
                                            success: !0, message: null, result: localData
                                        })) : WinJS.Promise.wrap(processedlistItemsResponse)
                                })
                        }, SharePointSyncWorker.processListItem = function(listSchema, listItem) {
                            var attributes = listItem.$attributes;
                            if (typeof attributes == "undefined" || typeof attributes[SharePointSyncWorker.RowAttribute_OwsId] != "string")
                                return null;
                            var spId = parseInt(attributes[SharePointSyncWorker.RowAttribute_OwsId]);
                            if (!isFinite(spId))
                                return null;
                            for (var row = Object.create(null), i = 0, len = listSchema.length; i < len; i++) {
                                var listSchemaItem = listSchema[i],
                                    attributeName = SharePointSyncWorker.RowAttributePrefix_Ows + listSchemaItem.internalName,
                                    attributeValue = attributes[attributeName];
                                typeof attributeValue == "string" && (row[listSchemaItem.displayName] = SharePointSyncWorker.sharePointValueToDValue(attributeValue, listSchemaItem.dtype))
                            }
                            return row[SharePointSyncWorker.SpIdProperty] = spId, row
                        }, SharePointSyncWorker.processGetListItemsResponse = function(listSchema, xmlResponseAsJson) {
                            var rows = [];
                            try {
                                var data = AppMagic.Utility.getJsonValueViaJsonPointer(xmlResponseAsJson, "/soap:Body/GetListItemsResponse/GetListItemsResult/listitems/rs:data"),
                                    itemCount = parseInt(data.$attributes.ItemCount, 10);
                                if (!isFinite(itemCount))
                                    throw new Error;
                                if (itemCount > 0) {
                                    if (typeof data["z:row"] == "undefined")
                                        throw new Error;
                                    for (var listItems = data["z:row"] instanceof Array ? data["z:row"] : [data["z:row"]], i = 0, len = listItems.length; i < len; i++) {
                                        var row = SharePointSyncWorker.processListItem(listSchema, listItems[i]);
                                        row !== null && rows.push(row)
                                    }
                                }
                            }
                            catch(e) {
                                return {
                                        success: !1, message: AppMagic.Strings.SharePointSyncError_ListItemHasInvalidFormat, result: null
                                    }
                            }
                            return {
                                    success: !0, message: null, result: rows
                                }
                        }, SharePointSyncWorker.mergeUpdateListItemsResponsesIntoLocalData = function(localData, updateListItemsResults) {
                            var newLocalDataById = new Dictionary,
                                localDataBySpId = new Dictionary;
                            localData.forEach(function(datum) {
                                var spId = datum[SharePointSyncWorker.SpIdProperty];
                                if (typeof spId != "undefined")
                                    localDataBySpId.setValue(spId.toString(), datum);
                                else {
                                    var id = datum[SharePointSyncWorker.IdProperty].toString();
                                    newLocalDataById.setValue(id, datum)
                                }
                            });
                            for (var i = 0, len = updateListItemsResults.length; i < len; i++) {
                                var updateListItemsResult = updateListItemsResults[i],
                                    mergeResult = SharePointSyncWorker.mergeUpdateListItemsResponseIntoLocalData(newLocalDataById, localDataBySpId, updateListItemsResult);
                                if (!mergeResult.success && mergeResult.message === AppMagic.Strings.SharePointSyncError_UpdateListItemsResponseListWasRecreated) {
                                    localData.splice(0, localData.length);
                                    break
                                }
                            }
                        }, SharePointSyncWorker.mergeUpdateListItemsResponseIntoLocalData = function(newLocalDataById, localDataBySpId, updateListItemsResult) {
                            var resultArray;
                            if (resultArray = AppMagic.Utility.getJsonValueViaJsonPointer(updateListItemsResult, "/soap:Body/UpdateListItemsResponse/UpdateListItemsResult/Results/Result"), typeof resultArray != "object" || resultArray === null)
                                return {
                                        success: !1, message: AppMagic.Strings.SharePointSyncError_UpdateListItemsResponseHasNoResults, result: null
                                    };
                            resultArray = resultArray instanceof Array ? resultArray : [resultArray];
                            for (var i = 0, len = resultArray.length; i < len; i++) {
                                var resultObj = resultArray[i];
                                try {
                                    var resultId = AppMagic.Utility.getJsonValueViaJsonPointer(resultObj, "/$attributes/ID"),
                                        resultIdMatch = resultId.match("^(.+),New$");
                                    if (resultIdMatch !== null) {
                                        var errorCodeStr = AppMagic.Utility.getJsonValueViaJsonPointer(resultObj, "/ErrorCode/$text");
                                        if (errorCodeStr === SharePointSyncWorker.UpdateListItemsResponseCode_Success) {
                                            var result = newLocalDataById.tryGetValue(resultIdMatch[1]);
                                            if (!result.value)
                                                continue;
                                            var spId = AppMagic.Utility.getJsonValueViaJsonPointer(resultObj, "/z:row/$attributes/ows_ID");
                                            var localRow = result.outValue;
                                            if (localDataBySpId.containsKey(spId))
                                                return {
                                                        success: !1, message: AppMagic.Strings.SharePointSyncError_UpdateListItemsResponseListWasRecreated, result: null
                                                    };
                                            var spIdNumValue = parseInt(spId);
                                            if (!isFinite(spIdNumValue))
                                                continue;
                                            localRow[SharePointSyncWorker.SpIdProperty] = spIdNumValue
                                        }
                                    }
                                }
                                catch(e) {
                                    continue
                                }
                            }
                            return {
                                    success: !0, message: null, result: null
                                }
                        }, SharePointSyncWorker.mergeServerDataIntoLocalData = function(localData, serverData) {
                            var serverDataBySpId = new Dictionary;
                            serverData.forEach(function(row) {
                                serverDataBySpId.setValue(row[SharePointSyncWorker.SpIdProperty].toString(), row)
                            });
                            var localDataBySpId = new Dictionary,
                                localDataById = new Dictionary;
                            localData.forEach(function(row) {
                                localDataById.setValue(row[SharePointSyncWorker.IdProperty].toString(), row);
                                var spId = row[SharePointSyncWorker.SpIdProperty];
                                typeof spId != "undefined" && localDataBySpId.setValue(spId.toString(), row)
                            });
                            for (var diffs = SharePointSyncWorker.computeTableDifferences(serverDataBySpId, localDataById, localDataBySpId), i = localData.length - 1; i >= 0; i--) {
                                var localDatum = localData[i],
                                    spId,
                                    spIdNumValue = localDatum[SharePointSyncWorker.SpIdProperty];
                                if (typeof spIdNumValue != "undefined" && (spId = spIdNumValue.toString(), !serverDataBySpId.containsKey(spId))) {
                                    localData.splice(i, 1);
                                    continue
                                }
                                var rowId = localDatum[SharePointSyncWorker.IdProperty].toString();
                                if (!diffs.addSet.containsKey(rowId) && diffs.editSet.containsKey(spId)) {
                                    var edit = diffs.editSet.getValue(spId),
                                        serverDatum = serverDataBySpId.getValue(spId);
                                    edit.addSet.keys.forEach(function(key) {
                                        delete localDatum[key]
                                    });
                                    edit.editSet.keys.forEach(function(key) {
                                        localDatum[key] = serverDatum[key]
                                    });
                                    edit.deleteSet.keys.forEach(function(key) {
                                        localDatum[key] = serverDatum[key]
                                    });
                                    delete localDatum[SharePointSyncWorker.IdProperty]
                                }
                            }
                            diffs.deleteSet.keys.forEach(function(spId) {
                                var serverDatum = serverDataBySpId.getValue(spId);
                                localData.push(AppMagic.Utility.jsonClone(serverDatum))
                            })
                        }, SharePointSyncWorker.buildUpdateListItemsMethods = function(workspaceData, localData, listSchema) {
                            var workspaceDataBySpId = new Dictionary;
                            workspaceData.forEach(function(row) {
                                workspaceDataBySpId.setValue(row[SharePointSyncWorker.SpIdProperty].toString(), row)
                            });
                            var localDataBySpId = new Dictionary,
                                localDataById = new Dictionary;
                            localData.forEach(function(row) {
                                localDataById.setValue(row[SharePointSyncWorker.IdProperty].toString(), row);
                                var spId = row[SharePointSyncWorker.SpIdProperty];
                                typeof spId != "undefined" && localDataBySpId.setValue(spId.toString(), row)
                            });
                            var tableDiffs = SharePointSyncWorker.computeTableDifferences(workspaceDataBySpId, localDataById, localDataBySpId),
                                schemaByDisplayNames = new Dictionary;
                            listSchema.forEach(function(field) {
                                schemaByDisplayNames.setValue(field.displayName, field)
                            });
                            for (var methods = [], addSetRowIds = tableDiffs.addSet.keys, i = 0, len = addSetRowIds.length; i < len; i++) {
                                for (var id = addSetRowIds[i], addedRow = tableDiffs.addSet.getValue(id), fieldValuesByInternalName = new Dictionary, unreservedKeys = SharePointSyncWorker.getUnreservedKeys(addedRow), j = 0, jlen = unreservedKeys.length; j < jlen; j++) {
                                    var displayName = unreservedKeys[j];
                                    if (schemaByDisplayNames.containsKey(displayName)) {
                                        var schemaItem = schemaByDisplayNames.getValue(displayName),
                                            dValue = addedRow[unreservedKeys[j]];
                                        if (dValue !== null) {
                                            var sharePointValue = SharePointSyncWorker.dValueToSharePointValue(dValue, schemaItem.sharePointType);
                                            fieldValuesByInternalName.setValue(schemaItem.internalName, sharePointValue)
                                        }
                                    }
                                }
                                var method = SharePointSyncWorker.buildMethodNode(id, SharePointSyncWorker.UpdateListItemsCmd_New, fieldValuesByInternalName);
                                methods.push(method)
                            }
                            for (var deleteSetSpIds = tableDiffs.deleteSet.keys, i = 0, len = deleteSetSpIds.length; i < len; i++) {
                                var spId = deleteSetSpIds[i],
                                    id = workspaceDataBySpId.getValue(spId)[SharePointSyncWorker.IdProperty].toString(),
                                    fieldValuesByInternalName = new Dictionary;
                                fieldValuesByInternalName.setValue(SharePointSyncWorker.IdFieldName, spId);
                                var method = SharePointSyncWorker.buildMethodNode(id, SharePointSyncWorker.UpdateListItemsCmd_Delete, fieldValuesByInternalName);
                                methods.push(method)
                            }
                            for (var editSetSpIds = tableDiffs.editSet.keys, i = 0, len = editSetSpIds.length; i < len; i++) {
                                var spId = editSetSpIds[i],
                                    rowDiff = tableDiffs.editSet.getValue(spId),
                                    editedRow = localDataBySpId.getValue(spId),
                                    id = editedRow[SharePointSyncWorker.IdProperty].toString(),
                                    fieldValuesByInternalName = new Dictionary;
                                rowDiff.addSet.keys.concat(rowDiff.editSet.keys).forEach(function(key) {
                                    var dValue = editedRow[key],
                                        schemaItem = schemaByDisplayNames.getValue(key),
                                        sharePointValue = dValue === null ? "" : SharePointSyncWorker.dValueToSharePointValue(dValue, schemaItem.sharePointType);
                                    fieldValuesByInternalName.setValue(schemaItem.internalName, sharePointValue)
                                });
                                rowDiff.deleteSet.keys.forEach(function(key) {
                                    var schemaItem = schemaByDisplayNames.getValue(key);
                                    fieldValuesByInternalName.setValue(schemaItem.internalName, "")
                                });
                                fieldValuesByInternalName.setValue(SharePointSyncWorker.IdFieldName, spId);
                                var method = SharePointSyncWorker.buildMethodNode(id, SharePointSyncWorker.UpdateListItemsCmd_Update, fieldValuesByInternalName);
                                methods.push(method)
                            }
                            return methods
                        }, SharePointSyncWorker.getFieldsFromListSchema = function(getListSchemaJson) {
                            var fields = AppMagic.Utility.getJsonValueViaJsonPointer(getListSchemaJson, "/soap:Body/GetListResponse/GetListResult/List/Fields/Field");
                            if (!(fields instanceof Array))
                                return {
                                        success: !1, message: AppMagic.Strings.SharePointSyncError_GetListResponseMissingFields, result: null
                                    };
                            for (var excludeByType = ["Attachments", "Content Type", "ContentTypeId", "ContentTypeIdFieldType"], excludeByInternalName = ["ContentType"], filteredFields = [], i = 0, len = fields.length; i < len; i++) {
                                var field = fields[i],
                                    hidden,
                                    readOnly,
                                    displayName,
                                    internalName,
                                    dtype,
                                    sharePointType;
                                try {
                                    var attributes = field.$attributes;
                                    readOnly = attributes.ReadOnly;
                                    typeof readOnly == "string" && (readOnly = readOnly.toLowerCase());
                                    hidden = attributes.Hidden;
                                    typeof hidden == "string" && (hidden = hidden.toLowerCase());
                                    displayName = attributes.DisplayName;
                                    internalName = attributes.Name;
                                    var typeAttributeValue = attributes.Type;
                                    if (typeof displayName != "string" || typeof internalName != "string" || typeof typeAttributeValue != "string")
                                        throw new Error;
                                    if (hidden === "true" || readOnly === "true" || excludeByType.indexOf(typeAttributeValue) >= 0 || excludeByInternalName.indexOf(internalName) >= 0)
                                        continue;
                                    var type = SharePointSyncWorker.sharePointTypeToDType(typeAttributeValue);
                                    dtype = type.dtype;
                                    sharePointType = type.sharePointType
                                }
                                catch(e) {
                                    return {
                                            success: !1, message: AppMagic.Strings.SharePointSyncError_GetListResponseHasMalformedField, result: null
                                        }
                                }
                                filteredFields.push({
                                    displayName: displayName, internalName: internalName, dtype: dtype, sharePointType: sharePointType
                                })
                            }
                            return {
                                    success: !0, message: null, result: filteredFields
                                }
                        }, SharePointSyncWorker.buildMethodNode = function(methodId, cmd, fieldValuesByInternalName) {
                            for (var keys = fieldValuesByInternalName.keys, fields = new Array(keys.length), i = 0, len = keys.length; i < len; i++) {
                                var key = keys[i];
                                fields[i] = {
                                    $name: "Field", $attributes: {Name: key}, $text: fieldValuesByInternalName.getValue(key)
                                }
                            }
                            return {
                                    $name: "Method", $attributes: {
                                            ID: methodId, Cmd: cmd
                                        }, Field: fields
                                }
                        }, SharePointSyncWorker.computeTableDifferences = function(originalDataBySpId, modifiedDataById, modifiedDataBySpId) {
                            var addSet = new Dictionary;
                            modifiedDataById.keys.forEach(function(key) {
                                var datum = modifiedDataById.getValue(key),
                                    spId = datum[SharePointSyncWorker.SpIdProperty];
                                if (typeof spId == "undefined") {
                                    var id = datum[SharePointSyncWorker.IdProperty];
                                    addSet.setValue(id.toString(), datum)
                                }
                            });
                            for (var editSet = new Dictionary, deleteSet = new Dictionary, oriSpIds = originalDataBySpId.keys, i = 0, len = oriSpIds.length; i < len; i++) {
                                var spId = oriSpIds[i];
                                if (modifiedDataBySpId.containsKey(spId)) {
                                    var modDataRow = modifiedDataBySpId.getValue(spId),
                                        oriDataRow = originalDataBySpId.getValue(spId),
                                        rowDiff = SharePointSyncWorker.computeRowDifferences(oriDataRow, modDataRow);
                                    (rowDiff.addSet.count > 0 || rowDiff.deleteSet.count > 0 || rowDiff.editSet.count > 0) && editSet.setValue(spId, rowDiff)
                                }
                                else
                                    deleteSet.setValue(spId, !0)
                            }
                            return {
                                    addSet: addSet, editSet: editSet, deleteSet: deleteSet
                                }
                        }, SharePointSyncWorker.computeRowDifferences = function(row0, row1) {
                            var unreservedKeys0 = SharePointSyncWorker.getUnreservedKeys(row0),
                                newUnreservedKeys1 = SharePointSyncWorker.getUnreservedKeys(row1),
                                addSet = new Dictionary,
                                editSet = new Dictionary,
                                deleteSet = new Dictionary;
                            newUnreservedKeys1.forEach(function(key) {
                                addSet.setValue(key, !0)
                            });
                            for (var i = 0, len = unreservedKeys0.length; i < len; i++) {
                                var key0 = unreservedKeys0[i],
                                    cell1 = row1[key0];
                                typeof cell1 != "undefined" ? (row0[key0] !== cell1 && editSet.setValue(key0, !0), addSet.deleteValue(key0)) : deleteSet.setValue(key0, !0)
                            }
                            return {
                                    addSet: addSet, editSet: editSet, deleteSet: deleteSet
                                }
                        }, SharePointSyncWorker.createListChannel = function(siteUri, action, contentLength) {
                            return new Services.Channel(siteUri).path("_vti_bin").path("Lists.asmx").header("Content-Type", "text/xml; charset=utf-8").header("Content-Length", contentLength.toString()).header("SOAPAction", action)
                        }, SharePointSyncWorker.updateListItems = function(siteUri, listName, updateMethods) {
                            var updatesNode = {
                                    $name: "updates", Batch: {
                                            $name: "Batch", $attributes: {OnError: "Continue"}, Method: updateMethods
                                        }
                                },
                                listNameNode = SharePointSyncWorker.createSharePointListNameNode(listName),
                                functionNode = SharePointSyncWorker.createSharePointFunctionNode(SharePointSyncWorker.SoapFunctionName_UpdateListItems);
                            functionNode.listName = listNameNode;
                            functionNode.updates = updatesNode;
                            var soapPackage = SharePointSyncWorker.createSoapPackage([functionNode]);
                            return SharePointSyncWorker.sendSoapPackage(siteUri, SharePointSyncWorker.SoapActionName_UpdateListItems, soapPackage)
                        }, SharePointSyncWorker.getListItems = function(siteUri, listName) {
                            var listNameNode = SharePointSyncWorker.createSharePointListNameNode(listName),
                                functionNode = SharePointSyncWorker.createSharePointFunctionNode(SharePointSyncWorker.SoapFunctionName_GetListItems);
                            functionNode.listName = listNameNode;
                            functionNode.rowLimit = {
                                $name: "rowLimit", $text: SharePointSyncWorker.GetListItems_RowLimit
                            };
                            var soapPackage = SharePointSyncWorker.createSoapPackage([functionNode]);
                            return SharePointSyncWorker.sendSoapPackage(siteUri, SharePointSyncWorker.SoapActionName_GetListItems, soapPackage)
                        }, SharePointSyncWorker.getList = function(siteUri, listName) {
                            var listNameNode = SharePointSyncWorker.createSharePointListNameNode(listName),
                                functionNode = SharePointSyncWorker.createSharePointFunctionNode(SharePointSyncWorker.SoapFunctionName_GetList);
                            functionNode.listName = listNameNode;
                            var soapPackage = SharePointSyncWorker.createSoapPackage([functionNode]);
                            return SharePointSyncWorker.sendSoapPackage(siteUri, SharePointSyncWorker.SoapActionName_GetList, soapPackage)
                        }, SharePointSyncWorker.sendSoapPackage = function(siteUri, actionName, soapPackage) {
                            var clen = soapPackage.length;
                            return SharePointSyncWorker.createListChannel(siteUri, actionName, clen).send("POST", soapPackage).then(function(response) {
                                    var responseText = response.responseText,
                                        json;
                                    try {
                                        json = AppMagic.Services.xml2json(responseText)
                                    }
                                    catch(e) {
                                        return WinJS.Promise.wrap({
                                                success: !1, message: AppMagic.Strings.SharePointSyncError_ServerResponseHasMalformedXml, result: null
                                            })
                                    }
                                    return WinJS.Promise.wrap({
                                            success: !0, message: null, result: json
                                        })
                                }, function(response) {
                                    return WinJS.Promise.wrap({
                                            success: !1, message: AppMagic.Strings.SharePointSyncError_UnableToReachServer, result: null
                                        })
                                })
                        }, SharePointSyncWorker.createSharePointFunctionNode = function(fnName) {
                            return {
                                    $name: fnName, $ns: {"": SharePointSyncWorker.SharePointSoapNamespace}
                                }
                        }, SharePointSyncWorker.createSharePointListNameNode = function(listName) {
                            return {
                                    $name: "listName", $text: listName
                                }
                        }, SharePointSyncWorker.createSoapPackage = function(xmlBodyContentsAsJson) {
                            for (var body = {$name: "soap:Body"}, i = 0, len = xmlBodyContentsAsJson.length; i < len; i++)
                                body[i] = xmlBodyContentsAsJson[i];
                            var envelope = {
                                    $name: "soap:Envelope", $ns: {
                                            xsi: SharePointSyncWorker.XmlSchemaInstanceNamespace, xsd: SharePointSyncWorker.XmlSchemaNamespace, soap: SharePointSyncWorker.XmlSoapNamespace
                                        }, "soap:Body": body
                                };
                            return AppMagic.Services.json2xml(envelope)
                        }, SharePointSyncWorker.XmlSchemaNamespace = "http://www.w3.org/2001/XMLSchema", SharePointSyncWorker.XmlSchemaInstanceNamespace = "http://www.w3.org/2001/XMLSchema-instance", SharePointSyncWorker.XmlSoapNamespace = "http://schemas.xmlsoap.org/soap/envelope/", SharePointSyncWorker.SharePointSoapNamespace = "http://schemas.microsoft.com/sharepoint/soap/", SharePointSyncWorker.SoapActionName_GetList = "http://schemas.microsoft.com/sharepoint/soap/GetList", SharePointSyncWorker.SoapActionName_GetListItems = "http://schemas.microsoft.com/sharepoint/soap/GetListItems", SharePointSyncWorker.SoapActionName_UpdateListItems = "http://schemas.microsoft.com/sharepoint/soap/UpdateListItems", SharePointSyncWorker.SoapFunctionName_GetList = "GetList", SharePointSyncWorker.SoapFunctionName_GetListItems = "GetListItems", SharePointSyncWorker.SoapFunctionName_UpdateListItems = "UpdateListItems", SharePointSyncWorker.UpdateListItemsCmd_New = "New", SharePointSyncWorker.UpdateListItemsCmd_Update = "Update", SharePointSyncWorker.UpdateListItemsCmd_Delete = "Delete", SharePointSyncWorker.IdFieldName = "ID", SharePointSyncWorker.UpdateListItems_MaxBatchSize = 500, SharePointSyncWorker.UpdateListItemsResponseCode_Success = "0x00000000", SharePointSyncWorker.GetListItems_RowLimit = "5000", SharePointSyncWorker.RowAttributePrefix_Ows = "ows_", SharePointSyncWorker.RowAttribute_OwsId = "ows_ID", SharePointSyncWorker.SpIdProperty = AppMagic.Constants.Services.SpIdProperty, SharePointSyncWorker.SyncVersionProperty = AppMagic.Constants.Services.VERSION_PROPERTY, SharePointSyncWorker.IdProperty = AppMagic.Constants.Services.ID_PROPERTY, SharePointSyncWorker.SharePointColumnType_Boolean = "boolean", SharePointSyncWorker.SharePointColumnType_Choice = "choice", SharePointSyncWorker.SharePointColumnType_MultiChoice = "multichoice", SharePointSyncWorker.SharePointColumnType_GridChoice = "gridchoice", SharePointSyncWorker.SharePointColumnType_Currency = "currency", SharePointSyncWorker.SharePointColumnType_DateTime = "datetime", SharePointSyncWorker.SharePointColumnType_LookUp = "lookup", SharePointSyncWorker.SharePointColumnType_LookUpMulti = "lookupmulti", SharePointSyncWorker.SharePointColumnType_Note = "note", SharePointSyncWorker.SharePointColumnType_Number = "number", SharePointSyncWorker.SharePointColumnType_Integer = "integer", SharePointSyncWorker.SharePointColumnType_Text = "text", SharePointSyncWorker.SharePointColumnType_Url = "url", SharePointSyncWorker.SharePointColumnType_AllDayEvent = "alldayevent", SharePointSyncWorker.SharePointColumnType_Recurrence = "recurrence", SharePointSyncWorker.SharePointColumnType_Attachments = "attachments", SharePointSyncWorker.SharePointColumnType_Calculated = "calculated", SharePointSyncWorker.SharePointColumnType_Computed = "computed", SharePointSyncWorker.SharePointColumnType_User = "user", SharePointSyncWorker.SharePointColumnType_UserMulti = "usermulti", SharePointSyncWorker.SharePointColumnType_Facilities = "facilities", SharePointSyncWorker.SharePointColumnType_FreeBusy = "freebusy", SharePointSyncWorker.SharePointColumnType_Overbook = "overbook", SharePointSyncWorker.SharePointColumnType_Counter = "counter", SharePointSyncWorker.SharePointColumnType_File = "file", SharePointSyncWorker.SharePointColumnType_Guid = "guid", SharePointSyncWorker.SharePointColumnType_TargetTo = "targetto", SharePointSyncWorker.SharePointColumnType_LayoutVariationsField = "layoutvariationsfield", SharePointSyncWorker.SharePointColumnType_Html = "html", SharePointSyncWorker.SharePointColumnType_CrossProjectLink = "crossprojectlink", SharePointSyncWorker.SharePointBooleanValue_True = "1", SharePointSyncWorker.SharePointBooleanValue_False = "0", SharePointSyncWorker.ReservedKeys = [SharePointSyncWorker.SpIdProperty, SharePointSyncWorker.SyncVersionProperty, SharePointSyncWorker.IdProperty], SharePointSyncWorker
            }();
        Services.SharePointSyncWorker = SharePointSyncWorker
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var SharePointSyncWorkerController = function() {
                function SharePointSyncWorkerController(dispatcher) {
                    this._workerHandle = dispatcher.createWorker(["AppMagic", "Services", "SharePointSyncWorker"], [])
                }
                return SharePointSyncWorkerController.prototype.synchronize = function(configuration, localData, workspaceData) {
                        var parameters = [{
                                    configuration: configuration, localData: localData, workspaceData: workspaceData
                                }];
                        return this._workerHandle.invokeWorker(SharePointSyncWorkerController.OpName_SyncAndResolve, parameters).then(function(response) {
                                return response.result
                            }, function(error) {
                                throw error;
                            })
                    }, SharePointSyncWorkerController.OpName_SyncAndResolve = "syncAndResolve", SharePointSyncWorkerController
            }();
        Services.SharePointSyncWorkerController = SharePointSyncWorkerController
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var TemplateRequestParam = function(_super) {
                __extends(TemplateRequestParam, _super);
                function TemplateRequestParam(paramName, value, paramValueStringifier, pathIndex) {
                    _super.call(this, paramName, value, paramValueStringifier);
                    this._pathIndex = pathIndex
                }
                return TemplateRequestParam.prototype._applyValue = function(httpRequestBuilder, value) {
                        httpRequestBuilder.addTemplateToPath(this._pathIndex, this._paramName, value)
                    }, TemplateRequestParam
            }(Services.NamedHttpRequestParam);
        Services.TemplateRequestParam = TemplateRequestParam
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var TypesByPrefixAndName = function() {
                function TypesByPrefixAndName(typesByPrefix) {
                    this._typesByEncodedFullName = TypesByPrefixAndName._computeTypesByEncodedFullName(typesByPrefix)
                }
                return TypesByPrefixAndName.prototype.getTypeDefinition = function(typedDefinition) {
                        var typeDef = typedDefinition.type;
                        if (typeof typeDef == "undefined") {
                            var prefix = typedDefinition.typeref.prefix,
                                typeName = typedDefinition.typeref.name;
                            typeDef = this._typesByEncodedFullName.getValue(prefix, typeName)
                        }
                        return typeDef
                    }, TypesByPrefixAndName.prototype.getType = function(prefix, typeName) {
                        return this._typesByEncodedFullName.getValue(prefix, typeName)
                    }, TypesByPrefixAndName._computeTypesByEncodedFullName = function(typesByPrefix) {
                            var typesByEncodedTypeName = new AppMagic.Utility.TwoKeyDictionary,
                                prefixes = Object.keys(typesByPrefix);
                            return prefixes.forEach(function(prefix) {
                                    var namespaceDef = typesByPrefix[prefix],
                                        typesByName = namespaceDef.typesbyname,
                                        typeNames = Object.keys(typesByName);
                                    typeNames.forEach(function(typeName) {
                                        var typeDef = typesByName[typeName];
                                        typesByEncodedTypeName.setValue(prefix, typeName, typeDef)
                                    })
                                }), typesByEncodedTypeName
                        }, TypesByPrefixAndName
            }();
        Services.TypesByPrefixAndName = TypesByPrefixAndName
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var AuthenticationBrokerManager = function() {
                function AuthenticationBrokerManager(broker) {
                    this._broker = broker;
                    this._promiseQueue = new AppMagic.Services.PromiseQueue
                }
                return AuthenticationBrokerManager.prototype.requestAccessToken = function(unEncodedAuthUri, unEncodedCallbackUri, unEncodedQueryParameters) {
                        var _this = this;
                        return this._promiseQueue.pushJob(function() {
                                return _this._requestAccessToken(unEncodedAuthUri, unEncodedCallbackUri, unEncodedQueryParameters)
                            })
                    }, AuthenticationBrokerManager.prototype._requestAccessToken = function(unEncodedAuthUri, unEncodedCallbackUri, unEncodedQueryParameters) {
                        var authUri = unEncodedAuthUri,
                            unEncodedQueryParametersKeys = Object.keys(unEncodedQueryParameters);
                        if (unEncodedQueryParametersKeys.length > 0) {
                            var qps = unEncodedQueryParametersKeys.filter(function(qpKey) {
                                    return unEncodedQueryParameters[qpKey] !== null
                                }).map(function(qpKey) {
                                    return qpKey + "=" + encodeURIComponent(unEncodedQueryParameters[qpKey])
                                }).join("&");
                            authUri += "?" + qps
                        }
                        if (!AppMagic.Utility.validateUri(authUri))
                            return WinJS.Promise.wrap({
                                    success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorCannotFormAuthUrl
                                });
                        if (!AppMagic.Utility.validateUri(unEncodedCallbackUri))
                            return WinJS.Promise.wrap({
                                    success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorCannotFormCallbackUrl
                                });
                        return this._broker.authenticateAsync(authUri, unEncodedCallbackUri).then(function(authenticationResult) {
                                var result;
                                return authenticationResult.authenticationStatus === 1 ? result = typeof authenticationResult.responseData != "string" ? {
                                        success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorNoResponseDataReturnedFromServer
                                    } : {
                                        success: !0, result: authenticationResult.responseData
                                    } : authenticationResult.authenticationStatus === 2 ? result = {
                                        success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorUserCanceled
                                    } : authenticationResult.authenticationStatus === 4 ? result = {
                                        success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorHttp
                                    } : authenticationResult.authenticationStatus === 3 && (result = {
                                        success: !1, message: AppMagic.Strings.AuthenticationBrokerManagerErrorHttp
                                    }), result.domains = authenticationResult.navigatedUris, result
                            })
                    }, AuthenticationBrokerManager
            }();
        Services.AuthenticationBrokerManager = AuthenticationBrokerManager
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var HttpRequestBodyDatum = function() {
                function HttpRequestBodyDatum(value) {
                    this._value = value
                }
                return Object.defineProperty(HttpRequestBodyDatum.prototype, "value", {
                        get: function() {
                            return this._value
                        }, enumerable: !0, configurable: !0
                    }), HttpRequestBodyDatum
            }();
        Services.HttpRequestBodyDatum = HttpRequestBodyDatum
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var JsonHttpRequestBuilder = function(_super) {
                __extends(JsonHttpRequestBuilder, _super);
                function JsonHttpRequestBuilder() {
                    _super.call(this);
                    this._jsonBody = null;
                    this._isBodyUndefined = !0
                }
                return JsonHttpRequestBuilder.prototype.clone = function() {
                        var clone = new JsonHttpRequestBuilder;
                        return _super.prototype._cloneTo.call(this, clone), this._cloneTo(clone), clone
                    }, JsonHttpRequestBuilder.prototype._cloneTo = function(destination) {
                        destination._jsonBody = AppMagic.Utility.jsonClone(this._jsonBody);
                        destination._isBodyUndefined = this._isBodyUndefined
                    }, JsonHttpRequestBuilder.prototype.getHttpRequest = function() {
                            var requestInfo = this._getHttpRequest();
                            return this._isBodyUndefined ? WinJS.Promise.wrap(new Services.JsonHttpRequest(requestInfo.method, requestInfo.url, requestInfo.headers, requestInfo.queryParameters)) : WinJS.Promise.wrap(new Services.JsonHttpRequest(requestInfo.method, requestInfo.url, requestInfo.headers, requestInfo.queryParameters, this._jsonBody))
                        }, JsonHttpRequestBuilder.prototype._setBody = function(value) {
                            this._isBodyUndefined = !1;
                            this._jsonBody = value
                        }, JsonHttpRequestBuilder.prototype.setJsonValue = function(jsonPointer, value) {
                            var path = AppMagic.Utility.parseJsonPointer(jsonPointer);
                            if (path.length === 0) {
                                this._setBody(value);
                                return
                            }
                            this._setBody(this._isBodyUndefined ? Object.create(null) : this._jsonBody);
                            for (var context = this._jsonBody, j = 0, jlen = path.length - 1; j < jlen; j++) {
                                var keyOrIndex = path[j];
                                typeof context[keyOrIndex] == "undefined" && (context[keyOrIndex] = Object.create(null));
                                context = context[keyOrIndex]
                            }
                            context[path[path.length - 1]] = value
                        }, JsonHttpRequestBuilder
            }(Services.BodilessHttpRequestBuilder);
        Services.JsonHttpRequestBuilder = JsonHttpRequestBuilder
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Services) {
        var HeaderName_Authorization = "Authorization",
            QueryParameterName_OAuthToken = "oauth_token",
            FormParameterRegex_OAuthToken = /(&|^)oauth_token=(.*?)(&|$)/,
            FormParameterRegex_OAuthTokenSecret = /(&|^)oauth_token_secret=(.*?)(&|$)/,
            QueryParameterRegex_OAuthToken = /\?([^=]*=[^&]*&)*?(oauth_token=(.*?))(&|$|#)/,
            QueryParameterRegex_OAuthVerifier = /\?([^=]*=[^&]*&)*?(oauth_verifier=(.*?))(&|$|#)/,
            AcquireResult = function() {
                function AcquireResult(){}
                return AcquireResult
            }();
        Services.AcquireResult = AcquireResult;
        var OAuth1Store = function() {
                function OAuth1Store(signatureMethod, temporaryCredentialRequestUrl, temporaryCredentialRequestMethod, resourceOwnerAuthorizationUrl, callbackUrl, tokenRequestUrl, tokenRequestMethod, clientId, clientSecret, controller, authBrokerManager, cache) {
                    this._signatureMethod = signatureMethod;
                    this._temporaryCredentialRequestUrl = temporaryCredentialRequestUrl;
                    this._temporaryCredentialRequestMethod = temporaryCredentialRequestMethod;
                    this._resourceOwnerAuthorizationUrl = resourceOwnerAuthorizationUrl;
                    this._callbackUrl = callbackUrl;
                    this._tokenRequestUrl = tokenRequestUrl;
                    this._tokenRequestMethod = tokenRequestMethod;
                    this._clientId = clientId;
                    this._clientSecret = clientSecret;
                    this._controller = controller;
                    this._authBrokerManager = authBrokerManager;
                    this._credentialVersion = 0;
                    this._acquirePromise = null;
                    this._tokenAwaiters = {};
                    this._tokenAwaiterCtr = 0;
                    this._cache = cache
                }
                return Object.defineProperty(OAuth1Store.prototype, "unencodedOAuthToken", {
                        get: function() {
                            return this._getCachedValueOrNull(OAuth1Store.CacheKey_UnencodedOAuthToken)
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(OAuth1Store.prototype, "unencodedOAuthTokenSecret", {
                        get: function() {
                            return this._getCachedValueOrNull(OAuth1Store.CacheKey_UnencodedOAuthTokenSecret)
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(OAuth1Store.prototype, "tokenTimeStamp", {
                            get: function() {
                                return this._getCachedValueOrNull(OAuth1Store.CacheKey_TokenTimeStamp)
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(OAuth1Store.prototype, "clientSecret", {
                            get: function() {
                                return this._clientSecret
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(OAuth1Store.prototype, "isAcquired", {
                            get: function() {
                                return this.unencodedOAuthToken !== null
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(OAuth1Store.prototype, "isAcquiring", {
                            get: function() {
                                return this._acquirePromise !== null
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(OAuth1Store.prototype, "credentialVersion", {
                            get: function() {
                                return this._credentialVersion
                            }, enumerable: !0, configurable: !0
                        }), OAuth1Store.prototype.cancelAll = function() {
                            var _this = this;
                            this.isAcquiring && (Object.keys(this._tokenAwaiters).forEach(function(key) {
                                _this._tokenAwaiters[key].promise.cancel()
                            }), this._acquirePromise.cancel());
                            this.clear()
                        }, OAuth1Store.prototype.clear = function() {
                            this._credentialVersion++;
                            this._cache.clearValues(OAuth1Store.CacheKeys)
                        }, OAuth1Store.prototype.getEncodedBaseOAuth1Parameters = function() {
                            var encodedOAuthParameters = {};
                            return encodedOAuthParameters[Services.OAuth1Constants.OAuthHeaderName_OAuthSignatureMethod] = this._signatureMethod, encodedOAuthParameters[Services.OAuth1Constants.OAuthHeaderName_OAuthTimestamp] = Services.AuthUtility.getTimestamp(), encodedOAuthParameters[Services.OAuth1Constants.OAuthHeaderName_OAuthVersion] = Services.OAuth1Constants.OAuthHeaderValue_OAuthVersion, encodedOAuthParameters[Services.OAuth1Constants.OAuthHeaderName_OAuthNonce] = Services.AuthUtility.getNonce(OAuth1Store.NonceLength), encodedOAuthParameters[Services.OAuth1Constants.OAuthHeaderName_OAuthConsumerKey] = Services.AuthUtility.fixedEncodeURIComponent(this._clientId), encodedOAuthParameters
                        }, OAuth1Store.prototype._getHeadersFromUnsignedEncodedOAuthHeaders = function(method, unencodedEndpoint, unencodedClientSecret, unencodedTokenSecret, unsignedEncodedOAuthHeaders) {
                            var signature = Services.AuthUtility.getOAuth1HmacSha1SignatureForParameters(unsignedEncodedOAuthHeaders, [], unencodedClientSecret, unencodedTokenSecret, method, unencodedEndpoint),
                                headers = {};
                            return headers[HeaderName_Authorization] = Services.AuthUtility.getHmacSha1SignedOAuthAuthorizationHeader(signature, unsignedEncodedOAuthHeaders), headers
                        }, OAuth1Store.prototype.acquire = function(onBeforeAsyncStep, onAfterAsyncStep) {
                            var _this = this;
                            if (this.isAcquired)
                                return WinJS.Promise.wrap({success: !0});
                            if (this.isAcquiring) {
                                var complete,
                                    ticket = this._tokenAwaiterCtr++,
                                    p = new WinJS.Promise(function(c) {
                                        complete = c
                                    }).then(function(response) {
                                        return delete _this._tokenAwaiters[ticket], response
                                    }, function(error) {
                                        delete _this._tokenAwaiters[ticket];
                                        throw error;
                                    });
                                return this._tokenAwaiters[ticket] = {
                                        complete: complete, promise: p
                                    }, p
                            }
                            return this._getTemporaryCredentials(onBeforeAsyncStep, onAfterAsyncStep)
                        }, OAuth1Store.prototype._getTemporaryCredentials = function(onBeforeAsyncStep, onAfterAsyncStep) {
                            var _this = this,
                                encodedOAuthHeaders = this.getEncodedBaseOAuth1Parameters();
                            encodedOAuthHeaders[Services.OAuth1Constants.OAuthHeaderName_OAuthCallBack] = AppMagic.Services.AuthUtility.fixedEncodeURIComponent(this._callbackUrl);
                            var headers = this._getHeadersFromUnsignedEncodedOAuthHeaders(this._temporaryCredentialRequestMethod, this._temporaryCredentialRequestUrl, this._clientSecret, "", encodedOAuthHeaders);
                            return onBeforeAsyncStep(), this._acquirePromise = this._controller.sendHttp(this._temporaryCredentialRequestUrl, this._temporaryCredentialRequestMethod, headers, {}, [""]).then(function(response) {
                                    return onAfterAsyncStep(), _this._getAuthorization(response, onBeforeAsyncStep, onAfterAsyncStep)
                                }, function(error) {
                                    onAfterAsyncStep();
                                    throw error;
                                }).then(function(response) {
                                    _this._acquirePromise = null;
                                    var notification;
                                    return notification = response.success ? response : {
                                            success: !1, message: response.message, result: null
                                        }, _this._notifyTokenAwaiters(notification), response
                                }, function(error) {
                                    _this._acquirePromise = null;
                                    _this._notifyTokenAwaiters({
                                        success: !1, message: AppMagic.Strings.OAuth1WaitingOnTokenAcquisitionFailed, result: null
                                    });
                                    throw error;
                                }), this._acquirePromise
                        }, OAuth1Store.prototype._notifyTokenAwaiters = function(ar) {
                            var _this = this;
                            Object.keys(this._tokenAwaiters).forEach(function(ticket) {
                                _this._tokenAwaiters[ticket].complete(JSON.parse(JSON.stringify(ar)))
                            })
                        }, OAuth1Store.prototype._getAuthorization = function(temporaryCredentialsResponse, onBeforeAsyncStep, onAfterAsyncStep) {
                            var _this = this;
                            if (!temporaryCredentialsResponse.success)
                                return temporaryCredentialsResponse;
                            var responseText = temporaryCredentialsResponse.result.responseText,
                                oauthTokenMatch = responseText.match(FormParameterRegex_OAuthToken),
                                oauthTokenSecretMatch = responseText.match(FormParameterRegex_OAuthTokenSecret);
                            if (oauthTokenMatch === null || oauthTokenSecretMatch === null)
                                return WinJS.Promise.wrap({
                                        success: !1, message: AppMagic.Strings.OAuth1BadResponseFromTempCredEndpoint
                                    });
                            var oauthToken = oauthTokenMatch[2],
                                oauthTokenSecret = oauthTokenSecretMatch[2],
                                queryParameters = {};
                            return queryParameters[QueryParameterName_OAuthToken] = oauthToken, this._authBrokerManager.requestAccessToken(this._resourceOwnerAuthorizationUrl, this._callbackUrl, queryParameters).then(function(response) {
                                    return _this._getTokenCredentials(response, oauthTokenSecret, onBeforeAsyncStep, onAfterAsyncStep)
                                })
                        }, OAuth1Store.prototype._getTokenCredentials = function(brokerResponse, unencodedOAuthTokenSecret, onBeforeAsyncStep, onAfterAsyncStep) {
                            var _this = this;
                            if (!brokerResponse.success)
                                return brokerResponse;
                            var responseData = brokerResponse.result,
                                oauthTokenMatch = responseData.match(QueryParameterRegex_OAuthToken),
                                oauthVerifierMatch = responseData.match(QueryParameterRegex_OAuthVerifier);
                            if (oauthTokenMatch === null || oauthVerifierMatch === null)
                                return WinJS.Promise.wrap({
                                        success: !1, message: AppMagic.Strings.OAuth1AuthRedirectionFailed
                                    });
                            var oauthToken = oauthTokenMatch[3],
                                oauthVerifier = oauthVerifierMatch[3],
                                encodedOAuthHeaders = this.getEncodedBaseOAuth1Parameters();
                            encodedOAuthHeaders[Services.OAuth1Constants.OAuthHeaderName_OAuthToken] = oauthToken;
                            encodedOAuthHeaders[Services.OAuth1Constants.OAuthHeaderName_OAuthVerifier] = oauthVerifier;
                            var encodedTokenSecret = Services.AuthUtility.fixedEncodeURIComponent(unencodedOAuthTokenSecret),
                                headers = this._getHeadersFromUnsignedEncodedOAuthHeaders(this._tokenRequestMethod, this._tokenRequestUrl, this._clientSecret, encodedTokenSecret, encodedOAuthHeaders);
                            return onBeforeAsyncStep(), this._controller.sendHttp(this._tokenRequestUrl, this._tokenRequestMethod, headers, {}, [""]).then(function(response) {
                                    return onAfterAsyncStep(), _this._extractAndStoreTokenCredentials(response)
                                }, function(error) {
                                    onAfterAsyncStep();
                                    throw error;
                                })
                        }, OAuth1Store.prototype._extractAndStoreTokenCredentials = function(tokenCredentialsResponse) {
                            if (!tokenCredentialsResponse.success)
                                return tokenCredentialsResponse;
                            var responseText = tokenCredentialsResponse.result.responseText,
                                oauthTokenMatch = responseText.match(FormParameterRegex_OAuthToken),
                                oauthTokenSecretMatch = responseText.match(FormParameterRegex_OAuthTokenSecret);
                            return oauthTokenMatch === null || oauthTokenSecretMatch === null ? WinJS.Promise.wrap({
                                    success: !1, message: AppMagic.Strings.OAuth1BadResponseFromTokenCredEndpoint
                                }) : (this._setTokenCredentials(oauthTokenMatch[2], oauthTokenSecretMatch[2]), WinJS.Promise.wrap({
                                    success: !0, message: null
                                }))
                        }, OAuth1Store.prototype._setTokenCredentials = function(unencodedOAuthToken, unencodedOAuthTokenSecret) {
                            this._credentialVersion++;
                            var cacheValue = {};
                            cacheValue[OAuth1Store.CacheKey_UnencodedOAuthToken] = unencodedOAuthToken;
                            cacheValue[OAuth1Store.CacheKey_UnencodedOAuthTokenSecret] = unencodedOAuthTokenSecret;
                            cacheValue[OAuth1Store.CacheKey_TokenTimeStamp] = Date.now();
                            this._cache.setValues(cacheValue)
                        }, OAuth1Store.prototype._getCachedValueOrNull = function(cacheKey) {
                            var cachedToken = this._cache.getValue(cacheKey);
                            return typeof cachedToken != "undefined" ? cachedToken : null
                        }, OAuth1Store.NonceLength = 16, OAuth1Store.DefaultExpiresInMilliseconds = 36e5, OAuth1Store.CacheKey_UnencodedOAuthToken = "UnencodedOAuthToken", OAuth1Store.CacheKey_UnencodedOAuthTokenSecret = "UnencodedOAuthTokenSecret", OAuth1Store.CacheKey_TokenTimeStamp = "TokenTimeStamp", OAuth1Store.CacheKeys = [OAuth1Store.CacheKey_UnencodedOAuthToken, OAuth1Store.CacheKey_UnencodedOAuthTokenSecret, OAuth1Store.CacheKey_TokenTimeStamp], OAuth1Store
            }();
        Services.OAuth1Store = OAuth1Store
    })(AppMagic.Services || (AppMagic.Services = {}));
    var Services = AppMagic.Services
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(UI) {
        var Utility = function() {
                function Utility(){}
                return Utility.createControlAsync = function(element, uri) {
                        return element.renderedHtmlControlUri = uri, AppMagic.MarkupService.instance.render(uri, element)
                    }, Utility
            }();
        UI.Utility = Utility
    })(AppMagic.UI || (AppMagic.UI = {}));
    var UI = AppMagic.UI
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(UI) {
        var Pages = function() {
                function Pages(){}
                return Pages.define = function(uri, viewConstructor) {
                        AppMagic.MarkupService.instance.associateView(uri, viewConstructor)
                    }, Pages
            }();
        UI.Pages = Pages
    })(AppMagic.UI || (AppMagic.UI = {}));
    var UI = AppMagic.UI
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Common) {
        var util = AppMagic.Utility,
            PromiseCollection = function() {
                function PromiseCollection() {
                    this._jobs = {};
                    this._nextJobId = 0
                }
                return PromiseCollection.prototype.addJob = function(fn) {
                        var complete,
                            promise = new WinJS.Promise(function(c) {
                                complete = c
                            }),
                            that = this,
                            jobId = this._getNextJobId();
                        return promise = promise.then(fn).then(function(result) {
                                return delete that._jobs[jobId], result
                            }, function(error) {
                                delete that._jobs[jobId];
                                throw error;
                            }), this._jobs[jobId] = promise, complete(), promise
                    }, PromiseCollection.prototype.cancelAll = function() {
                        var that = this,
                            keys = Object.keys(this._jobs);
                        keys.forEach(function(key) {
                            that._jobs[key].cancel()
                        })
                    }, PromiseCollection.prototype.getJobsCount = function() {
                            return Object.keys(this._jobs).length
                        }, PromiseCollection.prototype._getNextJobId = function() {
                            var result = util.getNextId(this._nextJobId, this._jobs);
                            return this._nextJobId = result.newCounter, result.id
                        }, PromiseCollection
            }();
        Common.PromiseCollection = PromiseCollection
    })(AppMagic.Common || (AppMagic.Common = {}));
    var Common = AppMagic.Common
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Log = function() {
        function Log(){}
        return Log.writeln = function(msg) {
                var debugNameSpace = window.Debug;
                debugNameSpace && debugNameSpace.writeln ? debugNameSpace.writeln(msg) : window.console && window.console.log(msg)
            }, Log
    }(),
    AppMagic;
(function(AppMagic) {
    //!
    //! Copyright (C) Microsoft Corporation.  All rights reserved.
    //!
    (function(Utility) {
        var ElementRenderer = function() {
                function ElementRenderer() {
                    this._offscreenCanvas = document.createElement("canvas");
                    this._offscreenCanvas.style.display = "none";
                    this._offscreenCanvas.setAttribute("aria-role", "presentation");
                    this._canvasContext = this._offscreenCanvas.getContext("2d")
                }
                return ElementRenderer.prototype.renderElementToDataUrl = function(element, width, height, imageType) {
                        return imageType = imageType || "image/jpeg", typeof width == "undefined" && (width = element.offsetWidth), typeof height == "undefined" && (height = element.offsetHeight), this._resizeCanvas(width, height), this._canvasContext.drawImage(element, 0, 0, width, height), this._offscreenCanvas.toDataURL(imageType)
                    }, ElementRenderer.prototype.dispose = function() {
                        this._offscreenCanvas = null;
                        this._canvasContext = null
                    }, ElementRenderer.prototype._resizeCanvas = function(width, height) {
                            this._offscreenCanvas.width = width;
                            this._offscreenCanvas.height = height;
                            this._offscreenCanvas.style.width = width.toString() + "px";
                            this._offscreenCanvas.style.height = height.toString() + "px"
                        }, ElementRenderer
            }();
        Utility.ElementRenderer = ElementRenderer
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var Enum;
(function(Enum) {
    function count(enumNamespace) {
        return Object.keys(enumNamespace).length / 2
    }
    Enum.count = count
})(Enum || (Enum = {}));
var AppMagic;
(function(AppMagic) {
    (function(Utility) {
        //!
        //! Copyright (C) Microsoft Corporation.  All rights reserved.
        //!
        (function(MimeType) {
            MimeType.MimeType_ImagePng = "image/png";
            MimeType.MimeType_ImageJpeg = "image/jpeg";
            MimeType.MimeType_ImageGif = "image/gif";
            MimeType.MimeType_ImageBmp = "image/bmp";
            MimeType.MimeType_ImageTiff = "image/tiff";
            MimeType.MimeType_ImageSvgXml = "image/svg+xml";
            MimeType.MimeType_AudioMpeg = "audio/mpeg";
            MimeType.MimeType_AudioWav = "audio/wav";
            MimeType.MimeType_AudioXMsWma = "audio/x-ms-wma";
            MimeType.MimeType_VideoMp4 = "video/mp4";
            MimeType.MimeType_VideoXMsWmv = "video/x-ms-wmv";
            MimeType.FileExt_Png = "png";
            MimeType.FileExt_Jpg = "jpg";
            MimeType.FileExt_Gif = "gif";
            MimeType.FileExt_Bmp = "bmp";
            MimeType.FileExt_Tiff = "tiff";
            MimeType.FileExt_Svg = "svg";
            MimeType.FileExt_Mpeg = "mpeg";
            MimeType.FileExt_Wav = "wav";
            MimeType.FileExt_Wma = "wma";
            MimeType.FileExt_Mp4 = "mp4";
            MimeType.FileExt_Wmv = "wmv";
            function mimeTypeToFileExtension(mimeType) {
                switch (mimeType) {
                    case MimeType.MimeType_ImagePng:
                        return MimeType.FileExt_Png;
                    case MimeType.MimeType_ImageJpeg:
                        return MimeType.FileExt_Jpg;
                    case MimeType.MimeType_ImageGif:
                        return MimeType.FileExt_Gif;
                    case MimeType.MimeType_ImageBmp:
                        return MimeType.FileExt_Bmp;
                    case MimeType.MimeType_ImageTiff:
                        return MimeType.FileExt_Tiff;
                    case MimeType.MimeType_ImageSvgXml:
                        return MimeType.FileExt_Svg;
                    case MimeType.MimeType_AudioMpeg:
                        return MimeType.FileExt_Mpeg;
                    case MimeType.MimeType_AudioWav:
                        return MimeType.FileExt_Wav;
                    case MimeType.MimeType_AudioXMsWma:
                        return MimeType.FileExt_Wma;
                    case MimeType.MimeType_VideoMp4:
                        return MimeType.FileExt_Mp4;
                    case MimeType.MimeType_VideoXMsWmv:
                        return MimeType.FileExt_Wmv;
                    default:
                        return ""
                }
            }
            MimeType.mimeTypeToFileExtension = mimeTypeToFileExtension
        })(Utility.MimeType || (Utility.MimeType = {}));
        var MimeType = Utility.MimeType
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Utility) {
        var ParentNamespaceCache = function() {
                function ParentNamespaceCache(){}
                return ParentNamespaceCache.prototype._getPrefixedNamespaceKey = function(keyName) {
                        return ParentNamespaceCache.PrefixNamespace + keyName
                    }, ParentNamespaceCache.prototype._getPrefixedValueKey = function(keyName) {
                        return ParentNamespaceCache.PrefixValue + keyName
                    }, ParentNamespaceCache.prototype.notifyWrite = function() {
                            throw new Error("virtual method");
                        }, ParentNamespaceCache.PrefixDelimiter = "~", ParentNamespaceCache.PrefixNamespace = "n" + ParentNamespaceCache.PrefixDelimiter, ParentNamespaceCache.PrefixValue = "v" + ParentNamespaceCache.PrefixDelimiter, ParentNamespaceCache
            }();
        Utility.ParentNamespaceCache = ParentNamespaceCache;
        var RootNamespaceCache = function(_super) {
                __extends(RootNamespaceCache, _super);
                function RootNamespaceCache(initialData, settings, cacheKey) {
                    _super.call(this);
                    this._data = JSON.parse(JSON.stringify(initialData));
                    this._settings = settings;
                    this._cacheKey = cacheKey;
                    this._wrappedSelf = new ChildNamespaceCache(this._data, this)
                }
                return RootNamespaceCache.prototype.createNamespaceCache = function(ns) {
                        return this._wrappedSelf.createNamespaceCache(ns)
                    }, RootNamespaceCache.prototype.getNamespaceCache = function(ns) {
                        return this._wrappedSelf.getNamespaceCache(ns)
                    }, RootNamespaceCache.prototype.notifyWrite = function() {
                            this._settings.setValue(this._cacheKey, this._data)
                        }, RootNamespaceCache.prototype.clear = function() {
                            this._wrappedSelf.clear();
                            this.notifyWrite()
                        }, RootNamespaceCache.SettingsKey = "AUTH_CACHE_KEY", RootNamespaceCache
            }(ParentNamespaceCache);
        Utility.RootNamespaceCache = RootNamespaceCache;
        var ChildNamespaceCache = function(_super) {
                __extends(ChildNamespaceCache, _super);
                function ChildNamespaceCache(data, parentCache) {
                    _super.call(this);
                    this._data = data;
                    this._caches = {};
                    this._parentCache = parentCache
                }
                return ChildNamespaceCache.prototype.getNamespaceCache = function(ns) {
                        var nsKey = this._getPrefixedNamespaceKey(ns);
                        return typeof this._data[nsKey] == "undefined" ? null : (typeof this._caches[ns] == "undefined" && (this._caches[ns] = new ChildNamespaceCache(this._data[nsKey], this)), this._caches[ns])
                    }, ChildNamespaceCache.prototype.createNamespaceCache = function(ns) {
                        var nsKey = this._getPrefixedNamespaceKey(ns);
                        this._data[nsKey] = {};
                        this._parentCache.notifyWrite();
                        var cache = new ChildNamespaceCache(this._data[nsKey], this);
                        return this._caches[ns] = cache, cache
                    }, ChildNamespaceCache.prototype.getValue = function(key) {
                            var prefixedKey = this._getPrefixedValueKey(key),
                                value = this._data[prefixedKey];
                            return typeof value == "undefined" ? value : JSON.parse(JSON.stringify(value))
                        }, ChildNamespaceCache.prototype.setValues = function(keyValuePairs) {
                            var _this = this;
                            Object.keys(keyValuePairs).forEach(function(key) {
                                var prefixedKey = _this._getPrefixedValueKey(key);
                                _this._data[prefixedKey] = keyValuePairs[key]
                            });
                            this._parentCache.notifyWrite()
                        }, ChildNamespaceCache.prototype.clear = function() {
                            var _this = this,
                                prefixedValueKeys = Object.keys(this._data).filter(function(dataKey) {
                                    return dataKey.indexOf(ParentNamespaceCache.PrefixValue) === 0
                                });
                            prefixedValueKeys.forEach(function(prefixedValueKey) {
                                return delete _this._data[prefixedValueKey]
                            });
                            var cacheKeys = Object.keys(this._caches);
                            cacheKeys.forEach(function(cacheKey) {
                                return _this._caches[cacheKey].clear()
                            })
                        }, ChildNamespaceCache.prototype.clearValues = function(keys) {
                            var _this = this;
                            keys.forEach(function(key) {
                                var prefixedKey = _this._getPrefixedValueKey(key);
                                delete _this._data[prefixedKey]
                            });
                            this._parentCache.notifyWrite()
                        }, ChildNamespaceCache.prototype.notifyWrite = function() {
                            this._parentCache.notifyWrite()
                        }, ChildNamespaceCache
            }(ParentNamespaceCache)
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Utility) {
        var TwoKeyDictionary = function() {
                function TwoKeyDictionary() {
                    this._dict = {}
                }
                return Object.defineProperty(TwoKeyDictionary.prototype, "count", {
                        get: function() {
                            return Object.keys(this._dict).length
                        }, enumerable: !0, configurable: !0
                    }), TwoKeyDictionary.prototype.getValue = function(k0, k1) {
                        return this._dict[TwoKeyDictionary._encodeKeys(k0, k1)]
                    }, TwoKeyDictionary.prototype.setValue = function(k0, k1, value) {
                            this._dict[TwoKeyDictionary._encodeKeys(k0, k1)] = value
                        }, TwoKeyDictionary._encodeKeys = function(k0, k1) {
                            return k0.length.toString() + "+" + k1.length.toString() + "_" + k0 + k1
                        }, TwoKeyDictionary
            }();
        Utility.TwoKeyDictionary = TwoKeyDictionary
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Utility) {
        function jsonClone(json) {
            return JSON.parse(JSON.stringify(json))
        }
        Utility.jsonClone = jsonClone;
        function escapeXmlString(input) {
            return input.replace(/<|>|&|'|"/g, function(char) {
                    switch (char) {
                        case"<":
                            return "&lt;";
                        case">":
                            return "&gt;";
                        case"&":
                            return "&amp;";
                        case"'":
                            return "&#39;";
                        case'"':
                            return "&quot;"
                    }
                    return char
                })
        }
        Utility.escapeXmlString = escapeXmlString;
        function parseJsonPointer(jsonPointer) {
            if (typeof jsonPointer != "string")
                throw new Error;
            if (jsonPointer === "")
                return [];
            if (jsonPointer[0] !== "/" || jsonPointer.match(/~[^01]/) !== null)
                throw new Error("Invalid json pointer");
            var result = jsonPointer.split("/");
            return result.splice(0, 1), result.map(function(x) {
                    var replaced = x.replace(/~1/g, "/");
                    return replaced.replace(/~0/g, "~")
                })
        }
        Utility.parseJsonPointer = parseJsonPointer;
        function getJsonValueViaJsonPointer(rootJsonValue, jsonPointer) {
            for (var jsonPointerArray = parseJsonPointer(jsonPointer), resultJsonValue = rootJsonValue, i = 0; i < jsonPointerArray.length && typeof resultJsonValue != "undefined"; i++)
                if (resultJsonValue === null) {
                    resultJsonValue = {};
                    resultJsonValue = resultJsonValue.undefined;
                    break
                }
                else
                    resultJsonValue = resultJsonValue[jsonPointerArray[i]];
            return resultJsonValue
        }
        Utility.getJsonValueViaJsonPointer = getJsonValueViaJsonPointer;
        function getNextId(currentCounter, valuesById) {
            var id,
                newCounter = currentCounter;
            do
                id = newCounter,
                newCounter === AppMagic.Constants.MaxInteger ? newCounter = 0 : newCounter++;
            while (typeof valuesById[id] != "undefined");
            return {
                    id: id, newCounter: newCounter
                }
        }
        Utility.getNextId = getNextId
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
var AppMagic;
(function(AppMagic) {
    //!
    //! Copyright (C) Microsoft Corporation.  All rights reserved.
    //!
    (function(Utility) {
        var XPathTokenType;
        (function(XPathTokenType) {
            XPathTokenType[XPathTokenType.Element = 0] = "Element";
            XPathTokenType[XPathTokenType.Text = 1] = "Text"
        })(XPathTokenType || (XPathTokenType = {}));
        var XPathToken = function() {
                function XPathToken(rawToken) {
                    this.index = this._parseIndex(rawToken);
                    this.tagName = this._parseTagName(rawToken);
                    this.tokenType = this._parseTokenType(rawToken)
                }
                return XPathToken.prototype.nodeTest = function(node) {
                        switch (this.tokenType) {
                            case 0:
                                return node.nodeType === Node.ELEMENT_NODE && node.nodeName === this.tagName;
                                break;
                            case 1:
                                return node.nodeType === Node.TEXT_NODE;
                                break;
                            default:
                                return !1;
                                break
                        }
                    }, XPathToken.prototype._parseTagName = function(rawToken) {
                        return rawToken.match(XPathToken.RegEx.TagName)[1]
                    }, XPathToken.prototype._parseIndex = function(rawToken) {
                            if (XPathToken.RegEx.Index.test(rawToken)) {
                                var parsedIndex = parseInt(rawToken.match(XPathToken.RegEx.Index)[1], 10) - 1;
                                return parsedIndex
                            }
                            return null
                        }, XPathToken.prototype._parseTokenType = function(rawToken) {
                            return rawToken.match(XPathToken.RegEx.TagName)[1] === XPathToken.TextNodeTagName ? 1 : 0
                        }, XPathToken.RegEx = {
                            TagName: /(\w[\w\d.-]*)/, Index: /\[([1-9]\d*)\]/
                        }, XPathToken.TextNodeTagName = "text", XPathToken
            }(),
            XmlSelection = function() {
                function XmlSelection(){}
                return XmlSelection.selectNodes = function(xmlDoc, xPath) {
                        return XmlSelection._selectNodes(xmlDoc, XmlSelection._tokenizeXPath(xPath))
                    }, XmlSelection._selectNodes = function(contextNode, tokens) {
                        if (tokens.length === 0)
                            return [contextNode];
                        for (var matches = [], currentToken = tokens.shift(), i = 0; i < contextNode.childNodes.length; i++) {
                            var childNode = contextNode.childNodes[i];
                            currentToken.nodeTest(childNode) && matches.push(childNode)
                        }
                        var result;
                        return result = currentToken.index !== null ? currentToken.index < matches.length ? XmlSelection._selectNodes(matches[currentToken.index], tokens) : [] : matches.map(function(node) {
                                return XmlSelection._selectNodes(node, tokens)
                            }).reduce(function(a, b) {
                                return a.concat(b)
                            }, []), tokens.unshift(currentToken), result
                    }, XmlSelection._tokenizeXPath = function(xPath) {
                            return xPath.split(XmlSelection.XPathSeperator).filter(function(rawToken) {
                                    return rawToken !== "" && rawToken !== "."
                                }).map(function(rawToken) {
                                    return new XPathToken(rawToken)
                                })
                        }, XmlSelection.XPathSeperator = "/", XmlSelection
            }();
        Utility.XmlSelection = XmlSelection
    })(AppMagic.Utility || (AppMagic.Utility = {}));
    var Utility = AppMagic.Utility
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var AbstractMessageHandler = function() {
                function AbstractMessageHandler(onComplete, onError) {
                    this._onComplete = onComplete;
                    this._onError = onError
                }
                return AbstractMessageHandler
            }();
        Workers.AbstractMessageHandler = AbstractMessageHandler
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers){})(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var util = AppMagic.Utility,
            Dispatcher = function() {
                function Dispatcher(workerFactory) {
                    this._workerFactory = workerFactory;
                    this._cid = 0;
                    this._pendingCalls = {};
                    this._worker = null;
                    this._workerIdCounter = 0;
                    this._workerInfoByWorkerId = {}
                }
                return Dispatcher.prototype._onMessage = function(evt) {
                        var message = evt.data,
                            pendingCall = this._pendingCalls[message.messageid];
                        delete this._pendingCalls[message.messageid];
                        pendingCall.handleMessage(message)
                    }, Dispatcher.prototype.terminate = function() {
                        this._worker !== null && (this._worker.terminate(), this._worker = null)
                    }, Dispatcher.prototype._getNextWorkerId = function() {
                            var result = util.getNextId(this._workerIdCounter, this._workerInfoByWorkerId);
                            return this._workerIdCounter = result.newCounter, result.id
                        }, Dispatcher.prototype._getNextJobId = function() {
                            var result = util.getNextId(this._cid, this._pendingCalls);
                            return this._cid = result.newCounter, result.id
                        }, Dispatcher.prototype.createWorker = function(classSpecifier, ctorArgs, workerScript) {
                            var _this = this,
                                workerId = this._getNextWorkerId();
                            classSpecifier = util.jsonClone(classSpecifier);
                            ctorArgs = util.jsonClone(ctorArgs);
                            var workerInfo = {
                                    isCreated: !1, workerScript: null, classSpecifier: classSpecifier, ctorArgs: ctorArgs
                                };
                            return typeof workerScript != "undefined" && (workerInfo.workerScript = workerScript), this._workerInfoByWorkerId[workerId] = workerInfo, new Workers.WorkerHandle(workerId, function() {
                                        return _this._destroyWorker.apply(_this, arguments)
                                    }, function() {
                                        return _this._invokeWorker.apply(_this, arguments)
                                    })
                        }, Dispatcher.prototype._createWorker = function(workerId, classSpecifier, ctorArgs, workerScript) {
                            var _this = this;
                            var messageId = this._getNextJobId(),
                                detail = {
                                    classspecifier: classSpecifier, ctorargs: ctorArgs, workerid: workerId
                                };
                            workerScript !== null && (detail.workerscript = workerScript);
                            new WinJS.Promise(function(complete, error) {
                                _this._pendingCalls[messageId] = new Workers.SimpleMessageCompletionHandler(complete, error)
                            });
                            this._worker.postMessage({
                                type: "createworker", messageid: messageId, detail: detail
                            });
                            this._workerInfoByWorkerId[workerId].isCreated = !0
                        }, Dispatcher.prototype._destroyWorker = function(workerId) {
                            var _this = this;
                            if (this._worker === null)
                                return WinJS.Promise.wrap();
                            var workerInfo = this._workerInfoByWorkerId[workerId];
                            if (!workerInfo.isCreated)
                                return WinJS.Promise.wrap();
                            var messageId = this._getNextJobId();
                            return this._worker.postMessage({
                                    type: "destroyworker", messageid: messageId, detail: {workerid: workerId}
                                }), new WinJS.Promise(function(complete, error) {
                                    _this._pendingCalls[messageId] = new Workers.SimpleMessageCompletionHandler(complete, error)
                                })
                        }, Dispatcher.prototype._invokeWorker = function(workerId, functionName, parameters) {
                            var _this = this;
                            this._worker === null && (this._worker = this._workerFactory.createWorker(Dispatcher.WorkerDispatcherScript), this._worker.addEventListener("message", function() {
                                return _this._onMessage.apply(_this, arguments)
                            }, !1));
                            var workerInfo = this._workerInfoByWorkerId[workerId];
                            workerInfo.isCreated || (this._createWorker(workerId, workerInfo.classSpecifier, workerInfo.ctorArgs, workerInfo.workerScript), delete workerInfo.classSpecifier, delete workerInfo.ctorArgs, delete workerInfo.workerScript);
                            var messageId = this._getNextJobId(),
                                promise = new WinJS.Promise(function(complete, error) {
                                    _this._pendingCalls[messageId] = new Workers.InvokeWorkerHandler(complete, error)
                                });
                            return this._worker.postMessage({
                                    type: "invokeworker", messageid: messageId, detail: {
                                            workerid: workerId, functionname: functionName, parameters: parameters
                                        }
                                }), promise
                        }, Dispatcher.WorkerDispatcherScript = "/js/common/workerDispatcher.js", Dispatcher
            }();
        Workers.Dispatcher = Dispatcher
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers){})(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var DispatcherFactory = function() {
                function DispatcherFactory(workerFactory) {
                    this._workerFactory = workerFactory
                }
                return DispatcherFactory.prototype.createDispatcher = function() {
                        return new Workers.Dispatcher(this._workerFactory)
                    }, DispatcherFactory
            }();
        Workers.DispatcherFactory = DispatcherFactory
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var InvokeWorkerHandler = function(_super) {
                __extends(InvokeWorkerHandler, _super);
                function InvokeWorkerHandler(onComplete, onError) {
                    _super.call(this, onComplete, onError)
                }
                return InvokeWorkerHandler.prototype.handleMessage = function(message) {
                        message.type === "invokeworkersuccess" ? this._onComplete({
                            success: !0, result: message.detail.result
                        }) : this._onComplete({success: !1})
                    }, InvokeWorkerHandler
            }(Workers.AbstractMessageHandler);
        Workers.InvokeWorkerHandler = InvokeWorkerHandler
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var SimpleMessageCompletionHandler = function(_super) {
                __extends(SimpleMessageCompletionHandler, _super);
                function SimpleMessageCompletionHandler(onComplete, onError) {
                    _super.call(this, onComplete, onError)
                }
                return SimpleMessageCompletionHandler.prototype.handleMessage = function(message) {
                        this._onComplete()
                    }, SimpleMessageCompletionHandler
            }(Workers.AbstractMessageHandler);
        Workers.SimpleMessageCompletionHandler = SimpleMessageCompletionHandler
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var WebWorkerFactory = function() {
                function WebWorkerFactory(){}
                return WebWorkerFactory.prototype.createWorker = function(workerScript) {
                        return new Worker(workerScript)
                    }, WebWorkerFactory
            }();
        Workers.WebWorkerFactory = WebWorkerFactory
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Workers) {
        var WorkerHandle = function() {
                function WorkerHandle(workerId, destroyWorker, invokeWorker) {
                    this._workerId = workerId;
                    this._destroyWorker = destroyWorker;
                    this._invokeWorker = invokeWorker;
                    this._isDestroyed = !1
                }
                return WorkerHandle.prototype.destroyWorker = function() {
                        return this._isDestroyed = !0, this._destroyWorker(this._workerId)
                    }, WorkerHandle.prototype.invokeWorker = function(functionName, parameters) {
                        return this._invokeWorker(this._workerId, functionName, parameters)
                    }, WorkerHandle
            }();
        Workers.WorkerHandle = WorkerHandle
    })(AppMagic.Workers || (AppMagic.Workers = {}));
    var Workers = AppMagic.Workers
})(AppMagic || (AppMagic = {}));