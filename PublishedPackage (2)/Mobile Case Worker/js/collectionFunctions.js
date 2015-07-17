//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("AppMagic.Functions", {
        clear: function(collection) {
            if (collection === null || !(collection instanceof Array))
                return null;
            AppMagic.Utility.releaseBlobs(collection);
            collection.length = 0;
            var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
            if (typeof dependency == "string" && dependency !== "")
                AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency);
            return collection
        }, _removeItemsFromRuntimeCollection: function(collection, itemsToRemoveIndices) {
                if (itemsToRemoveIndices.length !== 0) {
                    for (var destIndex = 0, srcIndex = 0; srcIndex < collection.length; srcIndex++)
                        itemsToRemoveIndices[srcIndex] ? AppMagic.Utility.releaseBlobs(collection[srcIndex]) : collection[destIndex++] = collection[srcIndex];
                    collection.splice(destIndex, collection.length - destIndex);
                    var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
                    if (typeof dependency == "string" && dependency !== "")
                        AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency)
                }
            }, removeIf: function(collection, predicate) {
                if (collection === null || !(collection instanceof Array))
                    return null;
                for (var argsLen = arguments.length, i = 1; i < argsLen; i++)
                    if (typeof arguments[i] != "function")
                        return null;
                for (var collectionLen = collection.length, row, itemsToRemoveIndices = [], rowIndex = collectionLen - 1; rowIndex >= 0; rowIndex--)
                    if (row = collection[rowIndex], typeof row == "object") {
                        var satisfiesAll = !0;
                        for (i = 1; i < argsLen; i++)
                            if (predicate = arguments[i], predicate(row) !== !0) {
                                satisfiesAll = !1;
                                break
                            }
                        satisfiesAll && (itemsToRemoveIndices[rowIndex] = !0)
                    }
                return AppMagic.Functions._removeItemsFromRuntimeCollection(collection, itemsToRemoveIndices), collection
            }, removeIfAsync: function(collection, predicate) {
                if (collection === null || !(collection instanceof Array))
                    return Core.Promise.as(null);
                for (var argsLen = arguments.length, j = 1; j < argsLen; j++)
                    if (typeof arguments[j] != "function")
                        return Core.Promise.as(null);
                for (var collectionLen = collection.length, tablePromises = [], args = arguments, itemsToRemoveIndices = [], rowIndex = collectionLen - 1; rowIndex >= 0; rowIndex--)
                    var fnThatHandlesRow = function(index) {
                            var rowPromise = Core.Promise.wrap(),
                                row = collection[index];
                            if (typeof row == "object") {
                                for (var satisfiesAll = !0, i = 1; i < argsLen; i++) {
                                    var fnThatHandlesPredicateFailure = function(error) {
                                            satisfiesAll = !1
                                        },
                                        fnThatHandlesPredicate = function(pred) {
                                            if (!satisfiesAll)
                                                return Core.Promise.as(null);
                                            var fnThatHandlesPredicateSuccess = function(predResult) {
                                                    predResult !== !0 && (satisfiesAll = !1)
                                                };
                                            return Core.Promise.as(pred(row)).then(fnThatHandlesPredicateSuccess, fnThatHandlesPredicateFailure)
                                        }.bind(this, args[i]);
                                    rowPromise = rowPromise.then(fnThatHandlesPredicate, fnThatHandlesPredicateFailure)
                                }
                                var fnThatHandlesRemovalFailure = function(){},
                                    fnThatHandlesRemoval = function() {
                                        satisfiesAll && (itemsToRemoveIndices[index] = !0)
                                    };
                                tablePromises.push(rowPromise.then(fnThatHandlesRemoval, fnThatHandlesRemovalFailure))
                            }
                        }(rowIndex);
                var successFn = function() {
                        return AppMagic.Functions._removeItemsFromRuntimeCollection(collection, itemsToRemoveIndices), Core.Promise.as(collection)
                    },
                    errorFn = function() {
                        return Core.Promise.as(null)
                    };
                return Core.Promise.join(tablePromises).then(successFn, errorFn)
            }, remove: function(collection, item, all) {
                if (collection === null || !(collection instanceof Array))
                    return null;
                var argLen = arguments.length;
                all = arguments[argLen - 1];
                for (var source = [], i = 1; i < argLen - 1; i++)
                    source.push(arguments[i]);
                return AppMagic.Functions.removeAll(collection, source, all)
            }, removeAll: function(collection, source, all) {
                if (collection === null)
                    return null;
                if (source === null)
                    return collection;
                if (!(collection instanceof Array) || !(source instanceof Array))
                    return null;
                var sourceLen = source.length,
                    collectionLen;
                if (sourceLen === 0 || (collectionLen = collection.length) === 0)
                    return collection;
                var changed = !1,
                    i,
                    rowIndex,
                    row,
                    sourceRow;
                if (all.toLowerCase() === "all") {
                    for (rowIndex = collectionLen - 1; rowIndex >= 0; rowIndex--)
                        if (row = collection[rowIndex], typeof row == "object")
                            for (i = 0; i < sourceLen; i++)
                                if (sourceRow = source[i], AppMagic.Utility.deepCompare(row, sourceRow)) {
                                    AppMagic.Utility.releaseBlobs(row);
                                    collection.splice(rowIndex, 1);
                                    changed = !0;
                                    break
                                }
                }
                else
                    for (i = 0; i < sourceLen; i++)
                        for (sourceRow = source[i], rowIndex = 0; rowIndex < collectionLen; rowIndex++)
                            if ((row = collection[rowIndex], typeof row == "object") && AppMagic.Utility.deepCompare(row, sourceRow)) {
                                AppMagic.Utility.releaseBlobs(row);
                                collection.splice(rowIndex, 1);
                                changed = !0;
                                break
                            }
                if (changed) {
                    var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
                    if (typeof dependency == "string" && dependency !== "")
                        AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency)
                }
                return collection
            }, loadData: function(target, filename) {
                if (target === null || filename === null || !(target instanceof Array) || typeof filename != "string" || !AppMagic.Utility.isValidFileName(filename))
                    return Core.Promise.as(null);
                var runtime = AppMagic.AuthoringTool.Runtime,
                    id = runtime.getDocumentId();
                id !== "" && (filename = id + "." + filename);
                var store = Core.Application.local,
                    crypto = Windows.Security.Cryptography,
                    loadFile = function(exists) {
                        return exists ? store.readText(filename, "") : Core.Promise.wrapError()
                    },
                    decryptData = function(encData) {
                        if (!encData)
                            return Core.Promise.wrapError();
                        var encBuffer = crypto.CryptographicBuffer.decodeFromBase64String(encData);
                        return crypto.DataProtection.DataProtectionProvider().unprotectAsync(encBuffer)
                    },
                    validateLoadResult = function(result) {
                        return result.error ? Core.Promise.wrapError() : result
                    },
                    loadZip = function(buffer) {
                        return runtime.loadZip(buffer, filename)
                    },
                    collect = function(result) {
                        if (result === null)
                            return null;
                        var dataToCollect;
                        if (result instanceof Array)
                            dataToCollect = result;
                        else {
                            if (result.data === null)
                                return null;
                            dataToCollect = result.data
                        }
                        return AppMagic.Functions.collect(target, dataToCollect)
                    },
                    errorFn = function() {
                        return null
                    };
                return store.exists(filename).then(loadFile).then(decryptData).then(loadZip).then(validateLoadResult).then(collect, errorFn)
            }, saveData: function(source, filename) {
                if (source === null || filename === null || !(source instanceof Array) || typeof filename != "string" || !AppMagic.Utility.isValidFileName(filename))
                    return Core.Promise.as(null);
                var runtime = AppMagic.AuthoringTool.Runtime,
                    id = runtime.getDocumentId();
                id !== "" && (filename = id + "." + filename);
                var store = Core.Application.local,
                    crypto = Windows.Security.Cryptography,
                    encryptData = function(base64String) {
                        var buffer = crypto.CryptographicBuffer.decodeFromBase64String(base64String);
                        return crypto.DataProtection.DataProtectionProvider("LOCAL=user").protectAsync(buffer)
                    },
                    saveFile = function(encBuffer) {
                        var encData = crypto.CryptographicBuffer.encodeToBase64String(encBuffer);
                        return store.writeText(filename, encData)
                    },
                    validateZipResult = function(result) {
                        return result.error ? Core.Promise.wrapError() : result.base64String
                    },
                    saveComplete = function() {
                        return source
                    },
                    saveError = function() {
                        return null
                    };
                return runtime.createZip(source, "").then(validateZipResult).then(encryptData).then(saveFile).then(saveComplete, saveError)
            }, updateIf: function(collection, condition, itemFunc) {
                if (collection === null || !(collection instanceof Array) || typeof itemFunc != "function")
                    return null;
                for (var argLen = arguments.length, j = 1; j < argLen; j++)
                    if (typeof arguments[j] != "function")
                        return null;
                for (var collectionLen = collection.length, changed = !1, row, rowIndex = 0; rowIndex < collectionLen; rowIndex++)
                    if (row = collection[rowIndex], typeof row == "object") {
                        var replacement = null;
                        for (j = 1; j < argLen; j += 2) {
                            var condFunc = arguments[j];
                            if (condFunc(row) === !0) {
                                replacement = arguments[j + 1];
                                break
                            }
                        }
                        if (replacement !== null) {
                            var clonedOriginalRow = AppMagic.Utility.clone(row, !0),
                                newRow = replacement(clonedOriginalRow);
                            var mergedRow = AppMagic.Functions._mergeRecord(row, newRow);
                            AppMagic.Utility.addRefBlobs(mergedRow);
                            AppMagic.Utility.releaseBlobs(clonedOriginalRow);
                            changed = !0
                        }
                    }
                if (changed) {
                    var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
                    if (typeof dependency == "string" && dependency !== "")
                        AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency)
                }
                return collection
            }, updateIfAsync: function(collection, condition, itemFunc) {
                if (collection === null || !(collection instanceof Array))
                    return Core.Promise.as(null);
                for (var argLen = arguments.length, j = 1; j < argLen; j++)
                    if (typeof arguments[j] != "function")
                        return Core.Promise.as(null);
                for (var tablePromises = [], collectionLen = collection.length, changed = !1, args = arguments, rowIndex = 0; rowIndex < collectionLen; rowIndex++)
                    var fnThatHandlesRow = function() {
                            var row = collection[rowIndex];
                            if (typeof row == "object") {
                                var rowPromise = Core.Promise.wrap(),
                                    replacement = null;
                                for (j = 1; j < argLen; j += 2) {
                                    var fnThatHandlesConditionFnFailure = function(error){},
                                        fnThatHandlesConditionFn = function(condFunc, replacementFunc) {
                                            if (replacement !== null)
                                                return Core.Promise.as(null);
                                            var fnThatHandlesConditionFnSuccess = function(result) {
                                                    result === !0 && (replacement = replacementFunc)
                                                };
                                            return Core.Promise.as(condFunc(row)).then(fnThatHandlesConditionFnSuccess, fnThatHandlesConditionFnFailure)
                                        }.bind(this, args[j], args[j + 1]);
                                    rowPromise = rowPromise.then(fnThatHandlesConditionFn, fnThatHandlesConditionFnFailure)
                                }
                                var fnThatHandlesReplacementSuccess = function(clonedOriginalRow, newRow) {
                                        if (typeof newRow == "object" && typeof clonedOriginalRow == "object") {
                                            var mergedRow = AppMagic.Functions._mergeRecord(row, newRow);
                                            AppMagic.Utility.addRefBlobs(mergedRow);
                                            AppMagic.Utility.releaseBlobs(clonedOriginalRow);
                                            changed = !0
                                        }
                                    },
                                    fnThatHandlesReplacementFailure = function(){},
                                    fnThatHandlesReplacement = function() {
                                        if (replacement !== null) {
                                            var cloned = AppMagic.Utility.clone(row, !0);
                                            return Core.Promise.as(replacement(cloned)).then(fnThatHandlesReplacementSuccess.bind(this, cloned), fnThatHandlesReplacementFailure)
                                        }
                                        else
                                            return Core.Promise.as(null)
                                    };
                                rowPromise = rowPromise.then(fnThatHandlesReplacement, fnThatHandlesReplacementFailure);
                                tablePromises.push(rowPromise)
                            }
                        }();
                var successFn = function() {
                        if (changed) {
                            var dependency = collection[AppMagic.AuthoringTool.Runtime.collectionNameProperty];
                            if (typeof dependency == "string" && dependency !== "")
                                AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency)
                        }
                        return Core.Promise.as(collection)
                    },
                    errorFn = function() {
                        return Core.Promise.as(null)
                    };
                return Core.Promise.join(tablePromises).then(successFn, errorFn)
            }, collect: function(collection, item) {
                if (collection === null || !(collection instanceof Array))
                    return null;
                for (var row, arglen = arguments.length, result = collection, changed = !1, i = 1; i < arglen; i++) {
                    if (item = arguments[i], item === null)
                        continue;
                    else if (item instanceof Array)
                        for (var j = 0, srclen = item.length; j < srclen; j++)
                            (row = item[j], row !== null && typeof row == "object") && (row = AppMagic.Utility.clone(row, !0), AppMagic.Utility.addRefBlobs(row), AppMagic.AuthoringTool.Runtime.assignRowID(row), result.push(row));
                    else
                        typeof item == "object" && (row = AppMagic.Utility.clone(item, !0), AppMagic.Utility.addRefBlobs(row), AppMagic.AuthoringTool.Runtime.assignRowID(row), result.push(row));
                    changed = !0
                }
                if (!changed)
                    return result;
                var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
                if (typeof dependency == "string" && dependency !== "")
                    AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency);
                return result
            }, update: function(collection, oldItem, newItem, all) {
                if (collection === null || !(collection instanceof Array))
                    return null;
                for (var changed = !1, updateAll = (all || "").toLowerCase() === "all", collectionLen = collection.length, i = 0; i < collectionLen; i++) {
                    var row = collection[i];
                    if (AppMagic.Utility.deepCompare(row, oldItem)) {
                        var newRow = AppMagic.Utility.clone(newItem, !0);
                        if (newRow !== null && (AppMagic.Utility.addRefBlobs(newRow), AppMagic.AuthoringTool.Runtime.assignRowID(newRow)), collection[i] = newRow, AppMagic.Utility.releaseBlobs(row), changed = !0, !updateAll)
                            break
                    }
                }
                if (changed) {
                    var dependency = AppMagic.AuthoringTool.Runtime.getCollectionName(collection);
                    if (typeof dependency == "string" && dependency !== "")
                        AppMagic.AuthoringTool.Runtime.onDataSourceChanged(dependency)
                }
                return collection
            }, refresh: function(source) {
                if (source === null || !(source instanceof Array))
                    return Core.Promise.as(null);
                var dsName = AppMagic.AuthoringTool.Runtime.getDataSourceName(source);
                return dsName !== null ? AppMagic.AuthoringTool.Runtime.refreshDataSource(dsName) : Core.Promise.as(null)
            }
    })
})(WinJS);