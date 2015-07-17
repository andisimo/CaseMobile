//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
this.require = function(str) {
    return {Stream: function(){}}
};
importScripts("/js/utility.js", "/services/utility.js", "/services/results.js", "/services/worker/auth.js", "/services/worker/cache.js", "/openSource/unmodified/sax/sax.js", "/js/xml.js", "/js/schema.js"),
function(global, Core) {"use strict";
    var loadRequirements = function(rootPath, requirements) {
            rootPath.charAt(rootPath.length - 1) !== "/" && (rootPath += "/");
            var imports = requirements.map(function(val) {
                    return val.substr(0, 5).toLowerCase() === "http:" || val.substr(0, 6).toLowerCase() === "https:" ? val : val.charAt(0) === "/" ? val : rootPath + val
                });
            importScripts.apply(null, imports)
        },
        lookupClass = function(serviceClass) {
            for (var current = global, fragments = serviceClass.split("."), len = fragments.length, i = 0; !!current && i < len; i++)
                current = current[fragments[i]];
            if (!current)
                throw new Error(AppMagic.Strings.InvalidServiceClass);
            return current
        },
        validateDefinition = function(def) {
            if (def === null || typeof def == "undefined")
                throw new Error(AppMagic.Strings.InvalidDefinition);
            if (typeof def.id != "string" || def.id === "")
                throw new Error(AppMagic.Strings.InvalidDefinitionID);
            if (!(def.required instanceof Array) || def.required.length <= 0)
                throw new Error(AppMagic.Strings.InvalidRequirements);
            if (typeof def.serviceClass != "string" || def.serviceClass === "")
                throw new Error(AppMagic.Strings.InvalidServiceClass);
        },
        _services = {},
        loadServiceCore = function(config) {
            validateDefinition(config.def);
            var def = config.def,
                id = def.id,
                ver = def.version || AppMagic.Constants.Services.DEFAULT_VERSION,
                key = id + ":" + ver;
            if (!_services[key]) {
                loadRequirements(config.rootPath, def.required);
                var Ctor = lookupClass(def.serviceClass);
                _services[key] = new Ctor
            }
            return key
        },
        callServiceCore = function(params) {
            var key = params.key,
                fnName = params.fn,
                args = params.args,
                service = _services[key],
                fn = service ? service[fnName] : null;
            if (!service)
                throw new Error(AppMagic.Strings.InvalidService);
            if (!fn || typeof fn != "function")
                throw new Error(AppMagic.Strings.InvalidServiceFunction);
            return fn.apply(service, args)
        },
        configureServiceCore = function(params) {
            var key = params.key,
                config = params.config,
                service = _services[key];
            if (!service)
                throw new Error(AppMagic.Strings.InvalidService);
            if (typeof service.configure != "function")
                throw new Error(AppMagic.Strings.AuthServiceContractViolation);
            return service.configure(config)
        },
        completeAuth = function(id, result) {
            Markers.mark(id, "auth_complete_start");
            var res = AppMagic.Services.Auth.complete(result);
            var complete = AppMagic.Dispatch.postResult.bind(null, id),
                error = AppMagic.Dispatch.postError.bind(null, id);
            Core.Promise.is(res) ? res.then(complete, error) : res ? complete(res) : error(AppMagic.Strings.AuthenticationFailed)
        },
        loadService = function(id, config) {
            Markers.mark(id, "load_service_start");
            var key = loadServiceCore(config);
            AppMagic.Dispatch.postResult(id, key)
        },
        callService = function(id, params) {
            Markers.mark(id, "call_service_start");
            var res = callServiceCore(params);
            var complete = AppMagic.Dispatch.postResult.bind(null, id),
                error = AppMagic.Dispatch.postError.bind(null, id);
            Core.Promise.as(res).then(complete, error)
        },
        configService = function(id, params) {
            Markers.mark(id, "config_service_start");
            var res = configureServiceCore(params);
            var complete = AppMagic.Dispatch.postResult.bind(null, id),
                error = AppMagic.Dispatch.postError.bind(null, id);
            Core.Promise.as(res).then(complete, error)
        };
    Core.Namespace.define("AppMagic.Dispatch", {table: {
            loadService: loadService, callService: callService, configService: configService, completeAuth: completeAuth
        }})
}(this, WinJS);