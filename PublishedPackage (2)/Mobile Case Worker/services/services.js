//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var util = AppMagic.Utility,
        validateType = function(value, type) {
            return type.charAt(0) === "*" && type.charAt(1) === "[" ? (value instanceof Array) ? value.every(function(x) {
                    return typeof x == "object"
                }) : !1 : type.charAt(0) === "!" && type.charAt(1) === "[" ? typeof value == "object" : type.charAt(0) === "[" ? (value instanceof Array) ? (type = type.substr(1, type.length - 2), value.every(function(x) {
                    return typeof x === type
                })) : !1 : typeof value === type
        },
        errorHandler = function(err) {
            throw new Error(err);
        },
        createServiceFunction = function(service, id, fnDef) {
            var args = fnDef.arguments || [],
                throwIfError = function(result) {
                    if (result.type === AppMagic.Services.Results.Type.error)
                        throw new Error(result.message);
                    return result
                },
                unpackResult = function(result) {
                    var schema = result.schema,
                        data = result.items || result.value || result;
                    return fnDef.result.type === "DataSource" ? {
                            data: data, schema: schema
                        } : data
                };
            return function() {
                    for (var callArgs = [], i = 0, len = args.length; i < len; i++) {
                        var arg = args[i],
                            val = typeof arguments[i] == "undefined" ? arg.defaultValue : arguments[i];
                        if (typeof val == "undefined") {
                            if (!arg.optional)
                                throw new Error(util.formatString(AppMagic.Strings.FunctionArgumentRequired, arg.name));
                        }
                        else if (!validateType(val, arg.type))
                            throw new Error(util.formatString(AppMagic.Strings.FunctionArgumentMismatch, arg.type, arg.name));
                        callArgs.push(val)
                    }
                    typeof arguments[i] != "undefined" && callArgs.push(arguments[i]);
                    var payload = {
                            key: service.id, fn: id, args: callArgs
                        };
                    return service.post("callService", payload).then(throwIfError).then(unpackResult)
                }
        },
        createFunction = function(service, fnName) {
            var throwIfError = function(result) {
                    if (result.type === AppMagic.Services.Results.Type.error)
                        throw new Error(result.message);
                    return result
                };
            return function() {
                    for (var callArgs = [], i = 0, len = arguments.length; i < len; i++)
                        callArgs.push(arguments[i]);
                    var payload = {
                            key: service.id, fn: fnName, args: callArgs
                        };
                    return service.post("callService", payload).then(throwIfError)
                }
        },
        createDataSourcesDefinition = function(service, dataSourceDefs) {
            var dataSourceDefsObj = {},
                i,
                len,
                j,
                jlen;
            if (typeof dataSourceDefs == "object") {
                var dataSourceTypes = Object.keys(dataSourceDefs);
                for (i = 0, len = dataSourceTypes.length; i < len; i++) {
                    var dataSourceType = dataSourceTypes[i];
                    if (dataSourceType.indexOf(".") >= 0)
                        return;
                    var dataSourceDef = dataSourceDefs[dataSourceType];
                    if (typeof dataSourceDef != "object")
                        return;
                    var dataSourceDefObj = {};
                    util.createPrivateImmutable(dataSourceDefsObj, dataSourceType, dataSourceDefObj);
                    var dataSourceDisplayName = dataSourceDef.displayName;
                    if (typeof dataSourceDisplayName != "string" || dataSourceDisplayName.length === 0)
                        return;
                    util.createPrivateImmutable(dataSourceDefObj, "displayName", dataSourceDisplayName);
                    var queryFnName = dataSourceDef.query;
                    if (typeof queryFnName != "string" || queryFnName.length === 0)
                        return;
                    var queryFn = createFunction(service, queryFnName);
                    util.createPrivateImmutable(dataSourceDefObj, "query", queryFn);
                    var syncFnName = dataSourceDef.sync;
                    if (typeof syncFnName != "undefined") {
                        if (typeof syncFnName != "string" || syncFnName.length === 0)
                            return;
                        var syncFn = createFunction(service, syncFnName);
                        util.createPrivateImmutable(dataSourceDefObj, "sync", syncFn)
                    }
                }
                util.createPrivateImmutable(service, "dataSources", dataSourceDefsObj)
            }
        },
        ServiceStub = Core.Class.define(function ServiceStub_ctor(disp, id, svcDef) {
            var i,
                len,
                fnName,
                fnDef,
                fn,
                fns = svcDef.functions;
            if (typeof fns == "object") {
                var fnNames = Object.keys(fns);
                for (i = 0, len = fnNames.length; i < len; i++)
                    fnName = fnNames[i],
                    fnDef = fns[fnName],
                    fn = createServiceFunction(this, fnName, fnDef),
                    util.createPrivateImmutable(this, fnName, fn)
            }
            createDataSourcesDefinition(this, svcDef.dataSources);
            util.createPrivateImmutable(this, "_disp", disp);
            util.createPrivateImmutable(this, "_id", id);
            util.createPrivateImmutable(this, "_def", svcDef)
        }, {
            id: {get: function() {
                    return this._id
                }}, definition: {get: function() {
                        return this._def
                    }}, configure: function(config) {
                    var payload = {
                            key: this._id, config: config
                        };
                    return this._disp.post("configService", payload)
                }, post: function(op, payload) {
                    return this._disp.post(op, payload)
                }
        }, {}),
        constructService = function(disp, def, key) {
            return new ServiceStub(disp, key, def)
        },
        postLoad = function(disp, def, rootPath) {
            var payload = {
                    def: def, rootPath: rootPath
                };
            return disp.post("loadService", payload).then(constructService.bind(null, disp, def))
        },
        handleAuthentication = function(disp, message) {
            var completeAuth = function(token) {
                    var payload = {
                            id: message.id, succeeded: !0, token: token
                        };
                    disp.post("completeAuth", payload)
                },
                failAuth = function(err) {
                    var es = typeof err == "string" ? err : err.message,
                        payload = {
                            id: message.id, succeeded: !1, error: es || AppMagic.Strings.UnknownAuthError
                        };
                    disp.post("completeAuth", payload)
                },
                protocol = message.provider,
                config = message.config || {},
                authRes = AppMagic.Services.Authentication.manager.authenticate(protocol, config);
            Core.Promise.as(authRes).then(completeAuth, failAuth)
        },
        handleMessage = function(ev) {
            var message = ev.detail;
            message.type === AppMagic.Services.Results.Type.authRequest && handleAuthentication(ev.target, ev.detail)
        },
        SERVICE_SCRIPT = "/services/worker/worker.js",
        initPromise,
        loadedServices = {};
    Core.Namespace.define("AppMagic.Services", {
        initialize: function() {
            return initPromise || (initPromise = AppMagic.Workers.create(SERVICE_SCRIPT).then(function(disp) {
                    return disp.addEventListener("unknown", handleMessage), disp
                })), initPromise
        }, load: function(def, rootPath) {
                if (typeof loadedServices[def.id] != "undefined")
                    throw new Error(util.formatString(AppMagic.Strings.DuplicateService, def.id));
                return AppMagic.Services.initialize().then(function(disp) {
                        return postLoad(disp, def, rootPath).then(function(svc) {
                                return loadedServices[def.id] = svc, def.id
                            })
                    })
            }, unload: function(id) {
                typeof loadedServices[id] != "undefined" && delete loadedServices[id]
            }, byId: function(id) {
                return loadedServices[id]
            }
    })
})(WinJS);