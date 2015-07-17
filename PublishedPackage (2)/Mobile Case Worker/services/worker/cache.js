//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var DEFAULT_OBJECT_LIFETIME = 15 * 60 * 1e3,
        DEFAULT_PURGE_INTERVAL = 10 * 60 * 1e3,
        cache = {},
        defaultObjectLifetime = DEFAULT_OBJECT_LIFETIME,
        purgeInterval = DEFAULT_PURGE_INTERVAL,
        purgePendingId,
        expired = function(obj, now) {
            return (typeof now == "undefined" || now === null) && (now = Date.now()), !obj || typeof obj.expires == "undefined" || obj.expires < now
        },
        purgeCache = function() {
            for (var now = Date.now(), skeys = Object.keys(cache), active = !1, i = 0, slen = skeys.length; i < slen; i++) {
                for (var svcCache = cache[skeys[i]], okeys = Object.keys(svcCache), olen = okeys.length, j = 0; j < olen; j++) {
                    var key = okeys[j];
                    expired(svcCache[key], now) && (delete svcCache[key], olen--)
                }
                active = active || olen > 0
            }
            active && (purgePendingId = setTimeout(purgeCache, purgeInterval))
        },
        configureCache = function(config) {
            config.defaultLifetime && (defaultObjectLifetime = config.defaultLifetime);
            config.purgeInterval && (purgeInterval = config.purgeInterval, purgePendingId && (clearTimeout(purgePendingId), purgePendingId = setTimeout(purgeCache, purgeInterval)))
        },
        clearCache = function(serviceId) {
            cache[serviceId] && delete cache[serviceId]
        },
        getCacheObject = function(serviceId, key) {
            var returnExpired = !1;
            arguments.length === 3 && (returnExpired = !0);
            var svcCache = cache[serviceId];
            if (!svcCache)
                return null;
            var obj = svcCache[key];
            return !returnExpired && expired(obj, Date.now()) ? null : obj ? obj.value : null
        },
        setCacheObject = function(serviceId, key, obj, lifetime) {
            var svcCache = cache[serviceId];
            if (svcCache || typeof obj == "undefined" || obj === null || (svcCache = cache[serviceId] = {}), typeof obj == "undefined" || obj === null)
                !svcCache || typeof svcCache[key] == "undefined" || delete svcCache[key];
            else {
                var item = {value: obj};
                typeof lifetime != "number" && (lifetime = defaultObjectLifetime);
                lifetime > 0 && (item.expires = Date.now() + lifetime);
                svcCache[key] = item;
                purgePendingId || (purgePendingId = setTimeout(purgeCache, purgeInterval))
            }
        };
    Core.Namespace.define("AppMagic.Services.Cache", {
        configure: configureCache, clear: clearCache, purge: purgeCache, get: getCacheObject, set: setCacheObject
    })
})(WinJS);