//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core, Platform) {"use strict";
    var runtimeConstants = AppMagic.Constants.Runtime,
        RuntimeBase = Core.Class.define(function RuntimeBase_ctor(authBrokerManager, authCache, cookieManager, dispatcherFactory) {
            this._data = Object.create(null);
            this._workspaceData = Object.create(null);
            this._rules = Object.create(null);
            this._behaviorPromises = Object.create(null);
            this._fireCount = Object.create(null);
            this._dataTemplates = {};
            this._aliases = Object.create(null);
            this._resources = Object.create(null);
            this._documentId = "";
            this._nextId = 0;
            this._importedServices = {};
            this._notificationViewModel = new AppMagic.AuthoringTool.ViewModels.NotificationViewModel;
            this._progressIndicatorViewModel = new AppMagic.AuthoringTool.ViewModels.ProgressIndicatorViewModel;
            this._notificationViewModel.pageViewModel = this._progressIndicatorViewModel;
            this._brokerManager = authBrokerManager;
            this._authCache = authCache;
            this._cookieManager = cookieManager;
            this._dispatcherFactory = dispatcherFactory;
            this._createDispatcherAndControllers();
            this._dynamicallyGeneratedFns = {
                SignIn: this._signInFnDef, SignOut: this._signOutFnDef
            }
        }, {
            activeScreenIndex: {get: function() {
                    return this._activeScreenIndex
                }}, oauth1Cache: {get: function() {
                        return this._oauth1Cache === null && (this._oauth1Cache = new AppMagic.Utility.RootNamespaceCache(AppMagic.Settings.instance.getValue(AppMagic.Utility.RootNamespaceCache.SettingsKey) || {}, AppMagic.Settings.instance, AppMagic.Utility.RootNamespaceCache.SettingsKey)), this._oauth1Cache
                    }}, _oauth1Cache: null, _authCache: null, _cookieManager: null, _brokerManager: null, _importedServices: null, _dispatcher: null, _dispatcherFactory: null, _sharePointSyncController: null, _impexWorkerController: null, _resources: null, _data: null, _rules: null, _behaviorPromises: null, _fireCount: null, _dataTemplates: null, _aliases: null, _documentId: null, collectionNameProperty: runtimeConstants.collectionNameProperty, dynamicDataSourceNameProperty: "_dynamicDataSource", _maxChainedPromisesPerBehavior: 100, getCollectionName: function(collection) {
                    return collection[this.collectionNameProperty]
                }, getdynamicDataSourceName: function(ds) {
                    return ds[this.dynamicDataSourceNameProperty]
                }, configurationProperty: runtimeConstants.configurationProperty, metaProperty: runtimeConstants.metaProperty, errorProperty: "_error", syncVersionProperty: runtimeConstants.syncVersionProperty, idProperty: runtimeConstants.idProperty, spIdProperty: AppMagic.Constants.Services.SpIdProperty, _reachabilitySuffix: ".'ReachabilityNode", _nextId: null, _valueColumnName: "Value", _dynamicallyGeneratedFns: null, signInFnName: "SignIn", signOutFnName: "SignOut", _buildRuleID: function(controlName, propertyName) {
                    return controlName + "." + propertyName
                }, _notificationViewModel: null, _progressIndicatorViewModel: null, notificationViewModel: {get: function() {
                        return this._notificationViewModel
                    }}, _activeScreenIndex: null, hasError: function(dsName) {
                    return typeof this._data[dsName][this.metaProperty][this.errorProperty] != "undefined"
                }, runOptimizedReplicatedDataFlow: function(replicatingControlId, bindingContext, inputTable, outputTable) {
                    var lookupName = replicatingControlId + this._reachabilitySuffix;
                    return typeof this._rules[lookupName] == "function" ? this._rules[lookupName](inputTable, outputTable, bindingContext) : !1
                }, onValueChanged: function(controlName, propertyName, value, bindingContext) {
                    var dependency = controlName + "." + propertyName;
                    typeof this._rules[dependency] == "function" && (this._behaviorPromises[dependency] ? this._behaviorPromises[dependency] = this._behaviorPromises[dependency].then(function(result) {
                        return this._fireCount[dependency]++, this._rules[dependency](bindingContext || null)
                    }.bind(this), function(err){}) : this._rules[dependency](bindingContext || null))
                }, onAliasesChanged: function(screenName, keys) {
                    for (var i = 0, len = keys.length; i < len; i++)
                        this.onDataSourceChanged(screenName + "." + keys[i])
                }, onDataSourceChanged: function(dsName) {
                    var ruleFn = this._rules[dsName];
                    typeof ruleFn == "function" && ruleFn(null)
                }, onEvent: function(controlName, eventName, bindingContext) {
                    this.onValueChanged(controlName, eventName, null, bindingContext)
                }, createErrorContext: function(entityName, propertyName){}, setBehavior: function(dependency, code, isAsync) {
                    if (code === null) {
                        delete this._rules[dependency];
                        this._behaviorPromises[dependency] && delete this._behaviorPromises[dependency];
                        this._fireCount[dependency] && delete this._fireCount[dependency];
                        return
                    }
                    this._behaviorPromises[dependency] && this._fireCount[dependency] > this._maxChainedPromisesPerBehavior && (this._behaviorPromises[dependency].cancel(), delete this._behaviorPromises[dependency], delete this._fireCount[dependency]);
                    isAsync ? this._behaviorPromises[dependency] || (this._behaviorPromises[dependency] = Core.Promise.wrap(), this._fireCount[dependency] = 0) : this._behaviorPromises[dependency] && (this._behaviorPromises[dependency].cancel(), delete this._behaviorPromises[dependency], delete this._fireCount[dependency]);
                    this._rules[dependency] = code
                }, reportRuntimeError: function(errorContext, errorMessage){}, getNamedObject: function(objName, bindingContext) {
                    var ds = this._data[objName];
                    if (typeof ds != "undefined")
                        return ds;
                    var ctrl = OpenAjax.widget.byId(objName);
                    if (ctrl !== null)
                        return ctrl;
                    throw AppMagic.AuthoringTool.Runtime.Error.NamedObjectNotFound;
                }, getResourcePath: function(resourceName) {
                    var resource = this._resources[resourceName];
                    return typeof resource != "undefined" ? resource : null
                }, Error: {NamedObjectNotFound: "AppMagic.AuthoringTool.Runtime.Error.NamedObjectNotFound"}, setAliasValue: function(aliasPath, value) {
                    this._aliases[aliasPath] = value
                }, _setAliasValues: function(screenName, values) {
                    for (var newVars = Object.create(null), keys = Object.keys(values), i = 0, len = keys.length; i < len; i++) {
                        var key = keys[i],
                            dotPos = key.indexOf("."),
                            varName = key.substr(dotPos, key.length - dotPos),
                            newKey = screenName + varName;
                        this.setAliasValue(newKey, values[key]);
                        newVars[newKey] = !0
                    }
                    for (keys = Object.keys(newVars), i = 0, len = keys.length; i < len; i++)
                        this.onDataSourceChanged(keys[i])
                }, getAliasValue: function(aliasPath) {
                    var value = this._aliases[aliasPath];
                    return typeof value != "undefined" ? value : null
                }, _getAliasValues: function(screenName) {
                    for (var result = Object.create(null), keys = Object.keys(this._aliases), i = 0, len = keys.length; i < len; i++) {
                        var key = keys[i];
                        key.indexOf(screenName + ".") === 0 && (result[key] = this._aliases[key])
                    }
                    return result
                }, resetAliasValues: function(screenName) {
                    for (var keys = Object.keys(this._aliases), i = 0, len = keys.length; i < len; i++) {
                        var key = keys[i];
                        key.indexOf(screenName + ".") === 0 && (this._aliases[key] = null)
                    }
                }, _addCollection: function(dsName) {
                    var collection = [];
                    AppMagic.Utility.createPrivateImmutable(collection, this.collectionNameProperty, dsName);
                    this.assignTableID(collection);
                    this._data[dsName] = collection
                }, _resetCollection: function(dsName) {
                    var collection = this._data[dsName];
                    typeof collection != "undefined" && (AppMagic.Utility.releaseBlobs(collection), collection.length = 0, typeof collection[this.idProperty] != "undefined" && delete collection[this.idProperty], this.assignTableID(collection))
                }, _clearCollection: function(dsName) {
                    var collection = this._data[dsName];
                    typeof collection != "undefined" && (AppMagic.Utility.releaseBlobs(collection), collection.length = 0)
                }, _dynamicDataSourceErrorFunc: function(args){}, _addDynamicDataSource: function(dsName) {
                    var data = {};
                    AppMagic.Utility.createPrivateImmutable(data, this.dynamicDataSourceNameProperty, dsName);
                    this._data[dsName] = data
                }, enableDynamicDatasource: function(signalName) {
                    var data = this._data[signalName];
                    return data === null || typeof data == "undefined" ? !1 : this.subscribeDynamicDataSource(signalName, !0)
                }, disableDynamicDatasource: function(signalName) {
                    var data = this._data[signalName];
                    return data === null || typeof data == "undefined" ? !1 : this.unsubscribeDynamicDataSource(signalName)
                }, unsubscribeDynamicDataSource: function(signalName) {
                    var ds = AppMagic.DynamicDataSource.instance.getDynamicDataSource(signalName);
                    return ds === null || typeof ds == "undefined" ? !1 : ds.isEnabled ? (ds.unSubscribe(), !0) : !0
                }, subscribeDynamicDataSource: function(signalName, mustPopulate) {
                    var ds = AppMagic.DynamicDataSource.instance.getDynamicDataSource(signalName);
                    return ds === null || typeof ds == "undefined" ? !1 : ds.isEnabled ? !0 : (mustPopulate && ds.getData(this._dynamicDataSourceErrorFunc.bind(this)), ds.subscribe(), !0)
                }, _removeDynamicDataSource: function(dsName) {
                    var ds = AppMagic.DynamicDataSource.instance.getDynamicDataSource(dsName);
                    ds !== null && typeof ds != "undefined" && ds.isEnabled && ds.unSubscribe();
                    delete this._data[dsName]
                }, updateDynamicDatasource: function(signalName, newData) {
                    var oldData = this._data[signalName];
                    if (!AppMagic.Utility.deepCompare(oldData, newData)) {
                        AppMagic.Utility.createPrivateImmutable(newData, this.dynamicDataSourceNameProperty, signalName);
                        this._data[signalName] = newData;
                        this.onDataSourceChanged(signalName)
                    }
                }, _addStaticDataSource: function(data, dsName) {
                    this.assignTableID(data);
                    var meta = {};
                    AppMagic.Utility.createOrSetPrivate(data, this.metaProperty, meta);
                    AppMagic.Utility.createOrSetPrivate(meta, "name", dsName);
                    AppMagic.Utility.createOrSetPrivate(meta, "pluginType", "excel");
                    this._data[dsName] = data
                }, refreshDataSource: function(dsName) {
                    var data = this._data[dsName];
                    if (data === null || typeof data == "undefined")
                        return Core.Promise.as(!1);
                    var meta = data[this.metaProperty];
                    return typeof meta == "undefined" || meta.pluginType === AppMagic.Constants.DataConnections.Types.Excel ? Core.Promise.as(!1) : this._refreshServiceDataSource(meta.name)
                }, getDataSourceName: function(source) {
                    if (typeof source != "object")
                        return null;
                    var meta = source[this.metaProperty];
                    if (meta !== null && typeof meta != "undefined")
                        return meta.name;
                    var dsName = source[this.collectionNameProperty];
                    return typeof dsName == "string" ? dsName : (dsName = source[this.dynamicDataSourceNameProperty], typeof dsName == "string") ? dsName : null
                }, syncDataSource: function(dsName) {
                    var localData = this._data[dsName],
                        workspaceData = this._workspaceData[dsName];
                    var meta = localData[this.metaProperty],
                        pluginType = meta.pluginType,
                        dataSourceType = meta.dataSourceType,
                        configuration = meta.configuration;
                    var service = AppMagic.Services.byId(pluginType);
                    var dataSourcesObj = service.dataSources,
                        dataSourceTypeObj = dataSourcesObj[dataSourceType];
                    var idProperty = this.idProperty,
                        spIdProperty = this.spIdProperty,
                        copiedData = localData.map(function(x) {
                            var copiedRow = {};
                            for (var objKey in x)
                                copiedRow[objKey] = x[objKey];
                            return copiedRow[idProperty] = x[idProperty], copiedRow
                        });
                    return this._sharePointSyncController.synchronize(configuration, copiedData, workspaceData).then(function(response) {
                            if (!response.success)
                                return response;
                            for (var workspaceIndex = 0, newData = response.result, i = 0, len = newData.length; i < len; i++) {
                                var row = newData[i],
                                    rowId = row[idProperty];
                                typeof rowId == "undefined" && (rowId = this.generateId(), row[idProperty] = rowId);
                                var spId = row[spIdProperty];
                                typeof spId != "undefined" && (workspaceData[workspaceIndex] = AppMagic.Utility.jsonClone(row), workspaceIndex++);
                                AppMagic.Utility.createPrivate(row, idProperty, rowId)
                            }
                            workspaceData.splice(workspaceIndex, workspaceData.length - workspaceIndex);
                            var table = this._data[dsName];
                            for (i = 0, len = newData.length; i < len; i++)
                                table[i] = newData[i];
                            table.splice(len, table.length - len);
                            this.onDataSourceChanged(dsName);
                            return {success: !0}
                        }.bind(this))
                }, resolveDataSource: function(dsName, result) {
                    this._resolveDataSource(dsName, result);
                    typeof result.dataChanges == "object" && this._resolveDataSourceChanges(dsName, result.dataChanges)
                }, _resolveDataSource: function(dsName, syncResult) {
                    syncResult.configuration && this._resolveDataSourceConfiguration(dsName, syncResult.configuration)
                }, _resolveDataSourceConfiguration: function(dsName, configuration) {
                    var localData = this._data[dsName];
                    var meta = localData[this.metaProperty];
                    meta.configuration = configuration
                }, _resolveDataSourceChanges: function(dsName, dataChanges) {
                    for (var localData = this._data[dsName], addData = dataChanges.addData || [], editData = dataChanges.editData || {}, deleteData = dataChanges.deleteData || {}, versionUpdateData = dataChanges.versionUpdateData || {}, newSchema = dataChanges.schema, len, rowKey, i = localData.length - 1; i >= 0; i--) {
                        var datum = localData[i],
                            rowId = datum[AppMagic.AuthoringTool.Runtime.idProperty];
                        if (deleteData[rowId]) {
                            localData.splice(i, 1);
                            continue
                        }
                        var newRowData = editData[rowId];
                        if (newRowData) {
                            var unusedKeys = {};
                            Object.keys(datum).forEach(function(x) {
                                unusedKeys[x] = !0
                            });
                            for (rowKey in newRowData)
                                datum[rowKey] = newRowData[rowKey],
                                delete unusedKeys[rowKey];
                            for (var unusedKey in unusedKeys)
                                delete datum[unusedKey];
                            AppMagic.AuthoringTool.Runtime.assignRowID(datum);
                            continue
                        }
                        var newVersion = versionUpdateData[rowId];
                        if (typeof newVersion != "undefined") {
                            datum[this.syncVersionProperty] = newVersion;
                            continue
                        }
                    }
                    if (addData)
                        for (i = 0, len = addData.length; i < len; i++) {
                            var newDatum = addData[i];
                            AppMagic.AuthoringTool.Runtime.assignRowID(newDatum);
                            localData.push(newDatum)
                        }
                    var idProperty = this.idProperty;
                    this._workspaceData[dsName] = localData.map(function(x) {
                        var copiedRow = {};
                        for (rowKey in x)
                            copiedRow[rowKey] = x[rowKey];
                        return copiedRow[idProperty] = x[idProperty], copiedRow
                    });
                    this.onDataSourceChanged(dsName)
                }, _registerServiceDataTemplates: function(serviceName, serviceInfo) {
                    if (serviceInfo.hasConfig)
                        return;
                    else {
                        var svc = AppMagic.Services.byId(serviceName);
                        var dataSourceDefs = svc.definition.dataSources;
                        if (svc.dataSources && typeof dataSourceDefs == "object")
                            for (var types = Object.keys(dataSourceDefs), i = 0, len = types.length; i < len; i++) {
                                var type = types[i],
                                    typeDef = svc.dataSources[type];
                                this._dataTemplates[serviceName + "." + type] = {
                                    type: type, displayName: typeDef.displayName, serviceName: serviceName
                                }
                            }
                    }
                }, getDataTemplates: function() {
                    return AppMagic.Utility.clone(this._dataTemplates)
                }, getPropertyValue: function(obj, propertyName, bindingContext) {
                    return obj === null || typeof obj == "undefined" ? null : this.isOpenAjaxControl(obj) ? obj.OpenAjax.getPropertyValue(propertyName, bindingContext) : obj.hasOwnProperty(propertyName) ? obj[propertyName] : null
                }, getFieldValue: function(obj, key) {
                    if (typeof obj == "undefined" || this.isOpenAjaxControl(obj))
                        return null;
                    var result = obj[key];
                    return typeof result == "undefined" ? null : result
                }, _copyRowWithExpando: function(row, createExpando) {
                    if (row === null)
                        return null;
                    var result = {};
                    createExpando && (result._src = {});
                    for (var key in row) {
                        var value = row[key];
                        if (value instanceof Array) {
                            for (var tableCopy = [], i = 0; i < value.length; i++)
                                tableCopy.push(this._copyRowWithExpando(value[i], !1));
                            value = tableCopy
                        }
                        else
                            value === null || typeof value != "object" || this.isOpenAjaxControl(value) || (value = this._copyRowWithExpando(value, !1));
                        result[key] = value;
                        createExpando && (result._src[key] = value)
                    }
                    return this.copyId(row, result), result
                }, isOpenAjaxControl: function(obj) {
                    return obj !== null && typeof obj.OpenAjax != "undefined"
                }, applyNameMap: function(data, nameMap, supportsExpando) {
                    if (data === null)
                        return null;
                    var result = null;
                    if (data instanceof Array) {
                        result = [];
                        for (var rowCount = data.length, i = 0; i < rowCount; i++) {
                            var row = data[i];
                            var newRow = this._copyRowWithExpando(row, supportsExpando);
                            this._doNameMapping(newRow, row, nameMap);
                            result.push(newRow)
                        }
                        this.copyId(data, result)
                    }
                    else
                        result = this._copyRowWithExpando(data, supportsExpando),
                        this._doNameMapping(result, data, nameMap);
                    return result
                }, _doNameMapping: function(mappedRow, origRow, nameMap) {
                    for (var sinkName in nameMap) {
                        var sourceName = nameMap[sinkName];
                        mappedRow[sinkName] = origRow[sourceName]
                    }
                }, makeExpando: function(data) {
                    if (data === null || typeof data == "undefined")
                        return null;
                    if (data instanceof Array) {
                        for (var result = [], rowCount = data.length, i = 0; i < rowCount; i++) {
                            var row = data[i];
                            var newRow = this._copyRowWithExpando(row, !0);
                            result.push(newRow)
                        }
                        return typeof data[this.idProperty] != "undefined" ? this.copyId(data, result) : this.assignTableID(result), result
                    }
                    else
                        return this.isOpenAjaxControl(data) ? data : this._copyRowWithExpando(row, !0)
                }, mergeExpando: function(data) {
                    if (data === null || typeof data == "undefined")
                        return null;
                    if (data instanceof Array) {
                        for (var result = [], i = 0, len = data.length; i < len; i++)
                            result.push(this.mergeExpandoRecord(data[i]));
                        return result
                    }
                    else if (typeof data == "object")
                        return this.mergeExpandoRecord(data);
                    return null
                }, mergeExpandoRecord: function(data) {
                    if (data === null || typeof data == "undefined")
                        return null;
                    var result = AppMagic.Utility.clone(data);
                    if (typeof data._src == "object")
                        for (var colName in data._src)
                            (typeof result[colName] == "undefined" || typeof result[colName] == "function") && (result[colName] = data._src[colName]);
                    for (var column in result) {
                        var rowEntry = result[column];
                        typeof rowEntry == "object" && (result[column] = this.mergeExpandoRecord(rowEntry));
                        rowEntry instanceof Array && (result[column] = this.mergeExpando(rowEntry))
                    }
                    return delete result._src, result
                }, getThisItem: function(bindingContext, nestLevel) {
                    return nestLevel > 0 && (bindingContext = this.getAncestorBindingContext(bindingContext, nestLevel)), this.mergeExpandoRecord({_src: bindingContext.thisItem})
                }, getAncestorBindingContext: function(bindingContext, nestLevel) {
                    for (; bindingContext && typeof bindingContext == "object" && nestLevel > 0; nestLevel--)
                        bindingContext = bindingContext.parent;
                    return bindingContext
                }, onSuspend: function(contextObj) {
                    contextObj.nextId = this._nextId;
                    contextObj.data = this._data;
                    contextObj.aliases = this._aliases;
                    contextObj.documentId = this._documentId
                }, onResumeFromTerminate: function(contextObj) {
                    this._nextId = contextObj.nextId;
                    this._data = contextObj.data;
                    this._aliases = contextObj.aliases;
                    this._documentId = contextObj.documentId
                }, assignTableID: function(table) {
                    if (table !== null && typeof table[this.idProperty] == "undefined") {
                        AppMagic.Utility.createOrSetPrivate(table, this.idProperty, this.generateId());
                        for (var i = 0, len = table.length; i < len; i++)
                            this.assignRowID(table[i])
                    }
                }, assignRowID: function(row, id) {
                    typeof id == "undefined" && (id = this.generateId());
                    AppMagic.Utility.createOrSetPrivate(row, this.idProperty, id)
                }, copyId: function(source, target) {
                    var srcId = source[AppMagic.AuthoringTool.Runtime.idProperty];
                    typeof srcId != "undefined" && AppMagic.Utility.createOrSetPrivate(target, this.idProperty, srcId)
                }, generateId: function() {
                    return this._nextId++
                }, makeColumn: function(args, tableId) {
                    var result = [],
                        argLen = args.length;
                    if (argLen < 1)
                        return result;
                    for (var rowIds = {}, i = 0; i < argLen; i++) {
                        for (var row = {}, arg = args[i], rowId = this._hashValue(arg); rowIds[rowId]; )
                            rowId = this.generateId();
                        rowIds[rowId] = !0;
                        row[this._valueColumnName] = arg;
                        this.assignRowID(row, rowId);
                        result.push(row)
                    }
                    return tableId === 0 && (tableId = this.generateId()), AppMagic.Utility.createOrSetPrivate(result, this.idProperty, tableId), result
                }, _hashValue: function(arg) {
                    if (arg === null)
                        return 0;
                    switch (typeof arg) {
                        case"number":
                            return 1 + arg * 2;
                        case"string":
                            return 1 | this._hashStr(arg) << 1;
                        case"boolean":
                            return arg ? 3 : 1
                    }
                    return this.generateId() << 1
                }, _hashStr: function(arg) {
                    var argLen = arg.length,
                        hash = argLen;
                    if (argLen === 0)
                        return hash;
                    for (var i = 0; i < argLen; i++)
                        hash = (hash << 5 | hash >>> 27) ^ arg.charCodeAt(i);
                    return hash
                }, coerceTable: function(arg, coercer) {
                    if (arg === null)
                        return null;
                    for (var result = [], i = 0, argLen = arg.length; i < argLen; i++)
                        result.push(this.coerceRecord(arg[i], coercer));
                    return this.copyId(arg, result), result
                }, coerceRecord: function(arg, coercer) {
                    if (arg === null)
                        return arg;
                    for (var result = AppMagic.Utility.clone(arg, !0), keys = Object.keys(coercer), keyLen = keys.length, i = 0; i < keyLen; i++) {
                        var key = keys[i],
                            value = result[key];
                        typeof value != "undefined" && (result[key] = coercer[key](value))
                    }
                    return this.copyId(arg, result), result
                }, _updateRuntimeAndJumpstartDataFlow: function(dsName, data) {
                    if (this._data[dsName] = data, data[this.metaProperty].pluginType === "sharepoint") {
                        var idProperty = this.idProperty,
                            copiedData = data.map(function(x) {
                                var copiedRow = {};
                                for (var objKey in x)
                                    copiedRow[objKey] = x[objKey];
                                return copiedRow[idProperty] = x[idProperty], copiedRow
                            });
                        this._workspaceData[dsName] = copiedData
                    }
                    this.onDataSourceChanged(dsName)
                }, _createDispatcherAndControllers: function() {
                    this._dispatcher = this._dispatcherFactory.createDispatcher();
                    this._sharePointSyncController = new AppMagic.Services.SharePointSyncWorkerController(this._dispatcher);
                    this._impexWorkerController = new AppMagic.Common.ImpexWorkerController(this._dispatcher)
                }, createZip: function(data, schema) {
                    return AppMagic.Utility.getBlobsInCollection(data).then(function(blobs) {
                            var root = {
                                    data: data, schema: schema, blobs: blobs
                                };
                            return this._impexWorkerController.createZip(root)
                        }.bind(this))
                }, loadZip: function(buffer, impexID) {
                    return this._impexWorkerController.loadZip(buffer, impexID)
                }, _buildOAuth1Store: function(authId, nsCache, authDesc, svc, authBrokerManager) {
                    var authCache = nsCache.getNamespaceCache(authId);
                    authCache === null && (authCache = nsCache.createNamespaceCache(authId));
                    return new AppMagic.Services.OAuth1Store(authDesc[authId].signaturemethod, authDesc[authId].temporarycredentialrequesturl, authDesc[authId].temporarycredentialrequestmethod, authDesc[authId].resourceownerauthorizationurl, authDesc[authId].callbackurl, authDesc[authId].tokenrequesturl, authDesc[authId].tokenrequestmethod, authDesc[authId].clientid, authDesc[authId].clientsharedsecret, svc, authBrokerManager, authCache)
                }, _buildFunctionFlow: function(authDesc, fnDef, restWorkerController) {
                    var authTypeNames = AppMagic.Constants.Services.AuthTypeNames,
                        constants = AppMagic.Constants.Services.Rest,
                        requestDef = fnDef[constants.FunctionKey_Request],
                        bodyDef = requestDef[constants.RequestKey_Body],
                        BodilessType = "bodiless",
                        bodyType = BodilessType;
                    typeof bodyDef != "undefined" && (bodyType = bodyDef[constants.ResponseBodyKey_MediaType]);
                    var authType = authDesc.type;
                    var ServiceConfigDeserialization = AppMagic.Services.ServiceConfigDeserialization,
                        fnDefDeserializer;
                    switch (authType + "~" + bodyType) {
                        case authTypeNames.OAuth1 + "~" + BodilessType:
                            fnDefDeserializer = new ServiceConfigDeserialization.OAuth1BasicFlowFunctionDefinitionDeserializer(authDesc.authStore, restWorkerController, new ServiceConfigDeserialization.BodilessRequestDefinitionDeserializer);
                            break;
                        case authTypeNames.OAuth1 + "~" + constants.MediaType.FormUrlEncoded:
                            fnDefDeserializer = new ServiceConfigDeserialization.OAuth1FormUrlEncodedFlowFunctionDefinitionDeserializer(authDesc.authStore, restWorkerController, new ServiceConfigDeserialization.FormUrlEncodedRequestDefinitionDeserializer);
                            break;
                        case authTypeNames.OAuth1 + "~" + constants.MediaType.Json:
                            fnDefDeserializer = new ServiceConfigDeserialization.OAuth1BasicFlowFunctionDefinitionDeserializer(authDesc.authStore, restWorkerController, new ServiceConfigDeserialization.JsonRequestDefinitionDeserializer);
                            break;
                        default:
                            break
                    }
                    return fnDefDeserializer.getFlowInfo(fnDef)
                }, _addMetaServiceToRuntime: function(serviceNamespace, def) {
                    var svc = new AppMagic.Services.Meta.RESTWorkerController(this._dispatcher, def, new AppMagic.Utility.MultipartFormDataHelper);
                    svc.initialize();
                    var nsCache = this.oauth1Cache.getNamespaceCache(serviceNamespace);
                    nsCache === null && (nsCache = this.oauth1Cache.createNamespaceCache(serviceNamespace));
                    var authBrokerManager = this._brokerManager,
                        defaultAuth,
                        authStore = {};
                    def.auths.forEach(function(auth) {
                        authStore[auth.id] = AppMagic.Utility.clone(auth);
                        typeof defaultAuth == "undefined" && (defaultAuth = authStore[auth.id]);
                        auth.type === AppMagic.Constants.Services.AuthTypeNames.OAuth1 ? authStore[auth.id].authStore = this._buildOAuth1Store(auth.id, nsCache, authStore, svc, authBrokerManager) : (authStore[auth.id].promiseQueue = new AppMagic.Services.PromiseQueue, authStore[auth.id].isQueueDirtied = !1)
                    }.bind(this));
                    var functionFlows = {},
                        authRequirementMap = {};
                    def.functions.forEach(function(fnDef) {
                        authRequirementMap[fnDef.name] = fnDef.request.auth;
                        fnDef.request.auth !== null && authStore[fnDef.request.auth].type === AppMagic.Constants.Services.AuthTypeNames.OAuth1 && (functionFlows[fnDef.name] = this._buildFunctionFlow(authStore[fnDef.request.auth], fnDef, svc))
                    }.bind(this));
                    var promiseCollection = new AppMagic.Common.PromiseCollection;
                    this._importedServices[serviceNamespace] = {
                        workerController: svc, authStore: authStore, authRequirementMap: authRequirementMap, defaultAuth: defaultAuth, functionFlows: functionFlows, promiseCollection: promiseCollection
                    }
                }, saveSessionAuthData: function() {
                    var sessionAuthData = AppMagic.Settings.instance.getValue(AppMagic.Constants.Services.AUTH_DOMAINS_KEY) || {};
                    var serviceNames = Object.keys(this._importedServices);
                    serviceNames.forEach(function(serviceName) {
                        var service = this._importedServices[serviceName];
                        var svcAuthData = sessionAuthData[serviceName];
                        typeof svcAuthData == "undefined" && (svcAuthData = {
                            hasUserAuthenticatedState: !1, domains: []
                        }, sessionAuthData[serviceName] = svcAuthData);
                        var serviceDomains = this._getAuthDomainsForService(service);
                        serviceDomains.forEach(function(svcDomain) {
                            svcAuthData.domains.indexOf(svcDomain) < 0 && svcAuthData.domains.push(svcDomain)
                        });
                        var hasUserAuthenticatedState = this._doesServiceHaveUserAuthenticatedState(service);
                        svcAuthData.hasUserAuthenticatedState = svcAuthData.hasUserAuthenticatedState || hasUserAuthenticatedState
                    }, this);
                    AppMagic.Settings.instance.setValue(AppMagic.Constants.Services.AUTH_DOMAINS_KEY, sessionAuthData)
                }, disposeSessionAuthData: function() {
                    var sessionAuthData = AppMagic.Settings.instance.getValue(AppMagic.Constants.Services.AUTH_DOMAINS_KEY) || {};
                    var serviceNames = Object.keys(sessionAuthData);
                    serviceNames.forEach(function(serviceName) {
                        var service = sessionAuthData[serviceName];
                        service.domains.forEach(function(domain) {
                            this._cookieManager.deleteCookies(domain)
                        }, this)
                    }, this);
                    AppMagic.Settings.instance.setValue(AppMagic.Constants.Services.AUTH_DOMAINS_KEY, {});
                    this._authCache.clearTokens();
                    this.oauth1Cache.clear()
                }, _doesServiceHaveUserAuthenticatedState: function(service) {
                    var authStore = service.authStore;
                    var authIds = Object.keys(authStore);
                    return authIds.map(function(authId) {
                            return this._doesAuthHaveUserAuthenticatedState(authStore[authId])
                        }, this).reduce(function(a, b) {
                            return a || b
                        }, !1)
                }, _doesAuthHaveUserAuthenticatedState: function(authDesc) {
                    switch (authDesc.type) {
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth1:
                            return this._doesOAuth1HaveUserAuthenticatedState(authDesc);
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth2:
                            return this._doesOAuth2HaveUserAuthenticatedState(authDesc);
                        default:
                            return !1
                    }
                }, _doesOAuth1HaveUserAuthenticatedState: function(authDesc) {
                    var oauth1Store = authDesc.authStore;
                    return oauth1Store.isAcquired
                }, _doesOAuth2HaveUserAuthenticatedState: function(authDesc) {
                    switch (authDesc.granttype) {
                        case AppMagic.Constants.Services.OAuth2GrantType.Implicit:
                            return typeof authDesc.accessToken != "undefined";
                        case AppMagic.Constants.Services.OAuth2GrantType.ClientCredentials:
                            return !1;
                        default:
                            return !1
                    }
                }, _getAuthDomainsForService: function(service) {
                    var authStore = service.authStore;
                    var authIds = Object.keys(authStore);
                    return authIds.map(function(authId) {
                            return this._getAuthDomains(authStore[authId])
                        }, this).reduce(function(a, b) {
                            return a.concat(b)
                        }, [])
                }, _getAuthDomains: function(authDesc) {
                    switch (authDesc.type) {
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth1:
                            return this._getOAuth1Domains(authDesc);
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth2:
                            return this._getOAuth2Domains(authDesc);
                        default:
                            return []
                    }
                }, _getOAuth1Domains: function(authDesc) {
                    return [authDesc.callbackurl, authDesc.tokenrequesturl, authDesc.temporarycredentialrequesturl, authDesc.resourceownerauthorizationurl]
                }, _getOAuth2Domains: function(authDesc) {
                    return authDesc.domains || []
                }, _disposeAuthForService: function(serviceNamespace) {
                    var authStore = this._importedServices[serviceNamespace].authStore;
                    var authIds = Object.keys(authStore);
                    authIds.forEach(function(authId) {
                        var authDesc = this._getAuthDescription(serviceNamespace, authId);
                        this._disposeAuthState(serviceNamespace, authDesc)
                    }.bind(this))
                }, _disposeAuthState: function(serviceNamespace, authDesc) {
                    switch (authDesc.type) {
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth1:
                            this._disposeOAuth1State(authDesc);
                            break;
                        case AppMagic.Constants.Services.AuthTypeNames.OAuth2:
                            this._disposeOAuth2State(serviceNamespace, authDesc);
                            break;
                        default:
                            break
                    }
                }, _disposeOAuth1State: function(authDesc) {
                    authDesc.authStore.clear();
                    this._cookieManager && (this._cookieManager.deleteCookies(authDesc.callbackurl), this._cookieManager.deleteCookies(authDesc.tokenrequesturl), this._cookieManager.deleteCookies(authDesc.temporarycredentialrequesturl), this._cookieManager.deleteCookies(authDesc.resourceownerauthorizationurl))
                }, _disposeOAuth2State: function(serviceNamespace, authDesc) {
                    delete authDesc.accessToken;
                    delete authDesc.expiresInMilliseconds;
                    delete authDesc.tokenStartTimeStamp;
                    authDesc.domains && this._cookieManager && authDesc.domains.forEach(function(domain) {
                        this._cookieManager.deleteCookies(domain)
                    }, this);
                    this._authCache.removeToken(serviceNamespace, authDesc.id)
                }, _saveOAuth2State: function(serviceName, authId, response) {
                    var authDesc = this._getAuthDescription(serviceName, authId),
                        restConstants = AppMagic.Constants.Services.Rest;
                    if (authDesc.accessToken = response.result[restConstants.ResponseParamName_AccessToken], authDesc.expiresInMilliseconds = response.result[restConstants.ResponseParamName_ExpiresIn], typeof authDesc.expiresInMilliseconds == "string")
                        try {
                            authDesc.expiresInMilliseconds = parseInt(authDesc.expiresInMilliseconds, 10)
                        }
                        catch(e) {
                            authDesc.expiresInMilliseconds = restConstants.DefaultAccessTokenExpiration
                        }
                    typeof authDesc.expiresInMilliseconds != "number" && (authDesc.expiresInMilliseconds = restConstants.DefaultAccessTokenExpiration);
                    authDesc.expiresInMilliseconds *= 1e3;
                    authDesc.tokenStartTimeStamp = Date.now();
                    this._authCache.setToken(serviceName, authId, {
                        token: authDesc.accessToken, expiresIn: authDesc.expiresInMilliseconds, tokenStartTimeStamp: authDesc.tokenStartTimeStamp, domains: authDesc.domains
                    })
                }, requestOAuth2Token: function(authDesc, serviceName) {
                    if (authDesc.granttype === AppMagic.Constants.Services.OAuth2GrantType.ClientCredentials) {
                        var clientMethodFnInfo = this._importedServices[serviceName].workerController.getHiddenFunctionInfo(authDesc.clientmethodref);
                        return clientMethodFnInfo.fn([], null)
                    }
                    else if (authDesc.granttype === AppMagic.Constants.Services.OAuth2GrantType.Implicit) {
                        var cachedToken = this._tryGetCachedToken(serviceName, authDesc.id);
                        if (cachedToken) {
                            authDesc.domains = cachedToken.domains;
                            var result = {};
                            return result[AppMagic.Constants.Services.Rest.ResponseParamName_AccessToken] = cachedToken.token, result[AppMagic.Constants.Services.Rest.ResponseParamName_ExpiresIn] = cachedToken.expiresIn, Core.Promise.wrap({
                                        success: !0, result: result
                                    })
                        }
                        var queryParameters = {};
                        return queryParameters.client_id = authDesc.clientid, queryParameters.redirect_uri = authDesc.callbackurl, queryParameters.response_type = "token", queryParameters.scope = authDesc.scope, this._brokerManager.requestAccessToken(authDesc.authurl, authDesc.callbackurl, queryParameters).then(function(response) {
                                    if (authDesc.domains = response.domains, !response.success)
                                        return response;
                                    var responseData = response.result;
                                    return RuntimeBase.parseOAuth2ResponseData(responseData)
                                })
                    }
                    else
                        return Core.Promise.wrap({
                                success: !1, message: AppMagic.Strings.Unimplemented
                            })
                }, _tryGetCachedToken: function(serviceName, authId) {
                    var cachedToken = this._authCache.getToken(serviceName, authId);
                    return cachedToken ? !cachedToken.expiresIn || cachedToken.expiresIn + cachedToken.tokenStartTimeStamp > Date.now() ? cachedToken : (this._authCache.removeToken(serviceName, authId), null) : null
                }, _getPromiseCollectionForService: function(serviceName) {
                    var importedService = this._importedServices[serviceName];
                    return importedService.promiseCollection
                }, getAuthDescriptionForFunction: function(serviceName, functionName) {
                    var importedService = this._importedServices[serviceName],
                        fn = this._dynamicallyGeneratedFns[functionName];
                    if (typeof fn == "function") {
                        var auth = importedService.defaultAuth;
                        return auth ? auth : null
                    }
                    var reqMap = importedService.authRequirementMap,
                        authRequirement = reqMap[functionName];
                    if (authRequirement === null)
                        return null;
                    var authStore = importedService.authStore,
                        authDesc = authStore[authRequirement];
                    return authDesc
                }, _getAuthDescription: function(serviceName, authName) {
                    var importedService = this._importedServices[serviceName],
                        authStore = importedService.authStore,
                        authDesc = authStore[authName];
                    return authDesc
                }, isAuthExpired: function(serviceName, authName) {
                    var authDesc = this._getAuthDescription(serviceName, authName);
                    return Date.now() - authDesc.tokenStartTimeStamp >= authDesc.expiresInMilliseconds
                }, hasStub: function(serviceName) {
                    return typeof this._importedServices[serviceName] != "undefined"
                }, completeRestFunctionCallCore: function(result, progressIndicatorVm, actionId, errorContext, qualifiedFunctionName) {
                    return progressIndicatorVm.completeProgressAction(actionId), result.success ? result.result : null
                }, errorRestFunctionCallCore: function(error, progressIndicatorVm, actionId, promiseTimedOut, docId, errorContext, qualifiedFunctionName) {
                    if (AppMagic.Utility.isCanceledError(error)) {
                        if (this._documentId !== docId)
                            throw new Error;
                        progressIndicatorVm.completeProgressAction(actionId)
                    }
                    return null
                }, getStubFunction: function(serviceName, functionName) {
                    var that = this,
                        authDesc = this.getAuthDescriptionForFunction(serviceName, functionName),
                        promiseCollection = this._getPromiseCollectionForService(serviceName),
                        dynamicallyGeneratedFn = this._dynamicallyGeneratedFns[functionName];
                    if (typeof dynamicallyGeneratedFn == "function")
                        return function() {
                                return dynamicallyGeneratedFn.apply(that, [authDesc, serviceName])
                            };
                    var promiseTimedOut = !1,
                        promise,
                        pivm = that._progressIndicatorViewModel,
                        promseCancelTimeout,
                        promiseCancelerRegisterer = function() {
                            promseCancelTimeout = setTimeout(function() {
                                promiseTimedOut = !0;
                                promise.cancel()
                            }, AppMagic.RuntimeBase._timeoutMillisecondsServiceFunctionCall)
                        },
                        promiseCancelerUnRegisterer = function() {
                            clearTimeout(promseCancelTimeout);
                            promseCancelTimeout = null;
                            promiseTimedOut = !1
                        },
                        docId = that._documentId,
                        actionId,
                        qualifiedFunctionName = serviceName + "!" + functionName,
                        completeRestFunctionCall = function(errorContext, result) {
                            return that.completeRestFunctionCallCore(result, pivm, actionId, errorContext, qualifiedFunctionName)
                        },
                        errorRestFunctionCall = function(errorContext, error) {
                            return that.errorRestFunctionCallCore(error, pivm, actionId, promiseTimedOut, docId, errorContext, qualifiedFunctionName)
                        },
                        functionInner = this.getStubFunctionInner(serviceName, functionName, promiseCancelerRegisterer, promiseCancelerUnRegisterer);
                    return function() {
                            var functionArguments = that.shallowCopyArray(arguments, 1),
                                errorContext = arguments[0],
                                fnThatReturnsPromise = function() {
                                    actionId = pivm.addProgressAction();
                                    for (var nullArgumentIndex = -1, functionInfo = that._importedServices[serviceName].workerController.getFunctionInfo(functionName), i = 0, len = functionInfo.requiredParameters.length; i < len; i++)
                                        if (functionArguments[i] === null) {
                                            nullArgumentIndex = i;
                                            break
                                        }
                                    return nullArgumentIndex >= 0 && (functionInner = function() {
                                            return Core.Promise.wrap({
                                                    success: !1, message: AppMagic.Utility.formatString(AppMagic.Strings.RestErrorNullParam, functionInfo.name, functionInfo.requiredParameters[nullArgumentIndex].name)
                                                })
                                        }.bind(that)), promise = functionInner.apply(null, functionArguments).then(completeRestFunctionCall.bind(this, errorContext), errorRestFunctionCall.bind(this, errorContext))
                                };
                            return promiseCollection.addJob(fnThatReturnsPromise)
                        }
                }, shallowCopyArray: function(array, startIndex) {
                    typeof startIndex == "undefined" && (startIndex = 0);
                    for (var len = array.length - startIndex, copy = new Array(len), i = 0; i < len; i++)
                        copy[i] = array[startIndex + i];
                    return copy
                }, getStubFunctionInner: function(serviceName, functionName, onBeforeCall, onAfterCall) {
                    var authDesc = this.getAuthDescriptionForFunction(serviceName, functionName),
                        that = this;
                    return function() {
                            var functionArguments = that.shallowCopyArray(arguments, 0),
                                auth = null,
                                savedTokenWasUsed = !1,
                                fnThatReturnsPromiseToCallTheRestFn = function() {
                                    return Core.Promise.wrap().then(function() {
                                            onBeforeCall();
                                            authDesc !== null && (auth = {
                                                type: authDesc.type, accessToken: authDesc.accessToken, accessTokenStyle: authDesc.accesstokenstyle, tokenFormat: authDesc.tokenformat, tokenKey: authDesc.tokenkey
                                            });
                                            var fn = that._importedServices[serviceName].workerController.getFunctionInfo(functionName).fn;
                                            return fn(functionArguments, auth)
                                        })
                                },
                                requestAndSaveAccessTokenThenTryRestCall = function() {
                                    return that.requestOAuth2Token(authDesc, serviceName).then(function(response) {
                                            if (response.success)
                                                return that._saveOAuth2State(serviceName, authDesc.id, response), fnThatReturnsPromiseToCallTheRestFn().then(function(result) {
                                                        return !result.success && that.isAuthExpired(serviceName, authDesc.id) && that._disposeOAuth2State(serviceName, authDesc), result
                                                    });
                                            else {
                                                var curePill = function() {
                                                        authDesc.isQueueDirtied = !1
                                                    };
                                                return authDesc.isQueueDirtied = !0, authDesc.promiseQueue.pushJob(curePill), response
                                            }
                                        })
                                },
                                promise = Core.Promise.wrap();
                            var functionFlow = that._importedServices[serviceName].functionFlows[functionName];
                            if (functionFlow)
                                promise = promise.then(function() {
                                    var fnInfo = that._importedServices[serviceName].workerController.getFunctionInfo(functionName),
                                        requiredParams = fnInfo.requiredParameters,
                                        optionalParams = fnInfo.optionalParameters,
                                        argMap = AppMagic.Services.generateArgMap(requiredParams, optionalParams, functionArguments),
                                        flowCreator = functionFlow.flowCreator,
                                        dynamicRequestParamCreatorsByParameterName = functionFlow.dynamicRequestParamsByParameterName,
                                        dynamicRequestParams = [];
                                    return argMap.keys.forEach(function(parameterName) {
                                            var createRequestParamFunction = dynamicRequestParamCreatorsByParameterName[parameterName],
                                                dArg = argMap.getValue(parameterName);
                                            var dynamicRequestParam = createRequestParamFunction(dArg.value);
                                            dynamicRequestParams.push(dynamicRequestParam)
                                        }), flowCreator.constructFlow(dynamicRequestParams).then(function(createResult) {
                                            var flow = createResult.result;
                                            return flow.callFlow(onBeforeCall, onAfterCall)
                                        })
                                });
                            else if (authDesc === null)
                                promise = promise.then(fnThatReturnsPromiseToCallTheRestFn);
                            else {
                                var enqueuedRestCallback;
                                switch (authDesc.type) {
                                    case AppMagic.Constants.Services.AuthTypeNames.OAuth2:
                                        var tryCallWithSavedToken = function() {
                                                return savedTokenWasUsed = !0, fnThatReturnsPromiseToCallTheRestFn().then(function(result) {
                                                        return !result.success && savedTokenWasUsed && that.isAuthExpired(serviceName, authDesc.id) ? (that._disposeOAuth2State(serviceName, authDesc), savedTokenWasUsed = !1, requestAndSaveAccessTokenThenTryRestCall()) : result
                                                    })
                                            };
                                        enqueuedRestCallback = function() {
                                            return authDesc.isQueueDirtied ? {
                                                    success: !1, message: AppMagic.Strings.RestErrorAuthenticationFailed
                                                } : typeof authDesc.accessToken != "undefined" ? tryCallWithSavedToken() : requestAndSaveAccessTokenThenTryRestCall()
                                        };
                                        promise = promise.then(function() {
                                            return authDesc.promiseQueue.pushJob(enqueuedRestCallback)
                                        });
                                        break;
                                    default:
                                        promise = promise.then(function() {
                                            return {
                                                    success: !1, message: AppMagicStrings.RestErrorUnknownAuthType
                                                }
                                        });
                                        break
                                }
                            }
                            return promise
                        }
                }, _signInFnDef: function(authDesc, serviceNamespace) {
                    if (authDesc.type === AppMagic.Constants.Services.AuthTypeNames.OAuth1)
                        return authDesc.authStore.acquire(function(){}, function(){}).then(function(response) {
                                return response.success ? Core.Promise.wrap(!0) : Core.Promise.wrap(null)
                            });
                    else {
                        if (typeof authDesc.accessToken != "undefined")
                            return Core.Promise.wrap(!0);
                        var that = this;
                        return this.requestOAuth2Token(authDesc, serviceNamespace).then(function(response) {
                                return response.success ? (that._saveOAuth2State(serviceNamespace, authDesc.id, response), Core.Promise.wrap(!0)) : Core.Promise.wrap(null)
                            })
                    }
                }, _signOutFnDef: function(authDesc, serviceNamespace) {
                    var promiseCollection = this._getPromiseCollectionForService(serviceNamespace);
                    return promiseCollection.cancelAll(), this._disposeAuthState(serviceNamespace, authDesc), Core.Promise.wrap(!0)
                }, isDataSourceCollection: function(dsName) {
                    var ds = this._data[dsName];
                    var dsCollectionName = ds[this.collectionNameProperty];
                    return typeof dsCollectionName == "string" && typeof ds[this.metaProperty] == "undefined"
                }, dataSourceExists: function(dsName) {
                    return typeof this._data[dsName] != "undefined"
                }
        }, {
            ensureSharePointAuthentication: function(sharePointSiteUrl) {
                return Core.xhr({url: sharePointSiteUrl}).then(function(){}, function(error) {
                        if (error.message === "Canceled")
                            throw error;
                    })
            }, parseOAuth2ResponseData: function(responseData) {
                    var RegexQueryStringParameter_AccessToken = /#([^=]*=[^&]*&)*?(access_token=(.*?))(&|$)/,
                        RegexQueryStringParameter_ExpiresIn = /#([^=]*=[^&]*&)*?(expires_in=(.*?))(&|$)/,
                        matches = responseData.match(RegexQueryStringParameter_AccessToken);
                    if (matches !== null) {
                        var accessToken = matches[3];
                        var decodedToken = decodeURIComponent(accessToken);
                        var constants = AppMagic.Constants.Services.Rest,
                            parsedResult = {};
                        return parsedResult[constants.ResponseParamName_AccessToken] = decodedToken, matches = responseData.match(RegexQueryStringParameter_ExpiresIn), matches !== null && (parsedResult[constants.ResponseParamName_ExpiresIn] = matches[3]), {
                                    success: !0, result: parsedResult
                                }
                    }
                    else
                        return {
                                success: !1, message: AppMagic.Strings.OAuth2ErrorInvalidResponseDataReturnedFromServer
                            }
                }, _timeoutMillisecondsServiceFunctionCall: 45e3
        });
    Core.Namespace.define("AppMagic", {RuntimeBase: RuntimeBase})
})(WinJS, Windows);