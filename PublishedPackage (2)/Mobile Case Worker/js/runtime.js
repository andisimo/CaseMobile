//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core, Platform) {"use strict";
    var PublishRuntime = Core.Class.derive(AppMagic.RuntimeBase, function PublishRuntime_ctor(authBrokerManager, authCache, cookieManager, dispatcherFactory) {
            AppMagic.RuntimeBase.call(this, authBrokerManager, authCache, cookieManager, dispatcherFactory);
            this._outstandingServiceCalls = [];
            this._activeScreenIndex = ko.observable(AppMagic.Publish.Canvas.currentScreen)
        }, {
            _outstandingServiceCalls: null, isAuthoring: {get: function() {
                        return !1
                    }}, getDocumentId: function() {
                    return ""
                }, _addOutstandingServiceCall: function(p) {
                    this._outstandingServiceCalls.push(p)
                }, _removeOutstandingServiceCall: function(p) {
                    for (var i = 0, len = this._outstandingServiceCalls.length; i < len; i++)
                        if (this._outstandingServiceCalls[i] === p) {
                            this._outstandingServiceCalls.splice(i, 1);
                            break
                        }
                }, getOutstandingServiceCallsPromises: function() {
                    return this._outstandingServiceCalls
                }, configureServiceDataSource: function(serviceInfo) {
                    var rt = this;
                    return this.configureService(serviceInfo).then(rt._addServiceDataSource.bind(rt))
                }, configureService: function(serviceInfo) {
                    var servicename = serviceInfo.serviceName;
                    return AppMagic.Services.Importer.instance.importService(servicename).then(function(svc) {
                            return this._registerServiceDataTemplates(servicename, serviceInfo), serviceInfo
                        }.bind(this))
                }, _serviceDataSourceInfos: {}, _refreshServiceDataSource: function(dsName) {
                    var info = this._serviceDataSourceInfos[dsName];
                    return info !== null && typeof info != "undefined" ? this._addServiceDataSource(info) : Core.Promise.as(!1)
                }, _addServiceDataSource: function(ds) {
                    var dsName = ds.name,
                        dsServiceName = ds.serviceName,
                        dsSourceName = ds.sourceName,
                        initialConfig = ds.configuration;
                    this._serviceDataSourceInfos[dsName] = ds;
                    var svc = AppMagic.Services.byId(dsServiceName);
                    var onError = function(err) {
                            return Core.Promise.as({
                                    success: !1, message: err
                                })
                        }.bind(this),
                        onSuccess = function(result) {
                            return result.success = !0, Core.Promise.as(result)
                        }.bind(this),
                        addMetadata = function(response) {
                            var meta = {};
                            AppMagic.Utility.createOrSetPrivate(meta, "name", dsName);
                            AppMagic.Utility.createOrSetPrivate(meta, "pluginType", dsServiceName);
                            AppMagic.Utility.createOrSetPrivate(meta, "dataSourceType", dsSourceName);
                            var data,
                                schema;
                            return response.success ? (data = response.result, schema = response.schema, AppMagic.Utility.createOrSetPrivate(meta, "configuration", response.configuration)) : (data = [], schema = AppMagic.Schema.createSchemaForArrayFromPointer([]), AppMagic.Utility.createOrSetPrivate(meta, this.errorProperty, "")), AppMagic.Utility.createOrSetPrivate(meta, "schema", schema), AppMagic.Utility.createOrSetPrivate(data, this.metaProperty, meta), AppMagic.Utility.createPrivateImmutable(data, this.collectionNameProperty, dsName), data instanceof Array && this.assignTableID(data), {
                                        success: response.success, data: data
                                    }
                        }.bind(this),
                        updateRuntime = function(response) {
                            return this._removeOutstandingServiceCall(dsCall), this._updateRuntimeAndJumpstartDataFlow(dsName, response.data), Core.Promise.as(response.success)
                        }.bind(this),
                        promiseToEnsureSharePointAuthentication = Core.Promise.timeout();
                    ds.serviceName === AppMagic.Constants.DataConnections.Types.SharePoint && (promiseToEnsureSharePointAuthentication = AppMagic.RuntimeBase.ensureSharePointAuthentication(initialConfig.siteUri));
                    var dsCall = promiseToEnsureSharePointAuthentication.then(function() {
                            return svc.dataSources[dsSourceName].query(initialConfig).then(onSuccess, onError).then(addMetadata).then(updateRuntime)
                        });
                    return this._addOutstandingServiceCall(dsCall), dsCall
                }, getParentScreenName: function(visualOrScreenName) {
                    return AppMagic.Publish.Canvas.getParentScreenName(visualOrScreenName)
                }, navigateTo: function(targetName, transition) {
                    var oldScreenName = AppMagic.Publish.Canvas.currentScreen,
                        oldScreenElement = document.getElementById(AppMagic.Publish.Canvas.buildContainerName(AppMagic.Publish.Canvas.screens[oldScreenName])),
                        oldScreenControl = OpenAjax.widget.byId(oldScreenName),
                        newScreenControl = OpenAjax.widget.byId(targetName);
                    AppMagic.Publish.Canvas.currentScreen = AppMagic.Publish.Canvas.getParentScreenName(targetName);
                    var newScreenElement = document.getElementById(AppMagic.Publish.Canvas.buildContainerName(AppMagic.Publish.Canvas.screens[AppMagic.Publish.Canvas.currentScreen]));
                    oldScreenControl.OpenAjax.fireEvent(AppMagic.AuthoringTool.OpenAjaxPropertyNames.OnHidden);
                    AppMagic.AuthoringTool.Animation.screenTransition(transition, newScreenElement, oldScreenElement).then(function() {
                        this._activeScreenIndex(AppMagic.Publish.Canvas.currentScreen);
                        newScreenControl.OpenAjax.fireEvent(AppMagic.AuthoringTool.OpenAjaxPropertyNames.OnVisible, newScreenControl)
                    }.bind(this))
                }, importMetaService: function(namespace, def) {
                    this._addMetaServiceToRuntime(namespace, def)
                }, _addMetaServiceToRuntime: function(serviceNamespace, def) {
                    AppMagic.RuntimeBase.prototype._addMetaServiceToRuntime.call(this, serviceNamespace, def)
                }
        }, {});
    Core.Namespace.define("AppMagic.AuthoringTool", {Runtime: new PublishRuntime(new AppMagic.Services.AuthenticationBrokerManager(new AppMagic.Services.WebViewAuthenticationBroker), new AppMagic.Services.AuthenticationCache(AppMagic.Settings.instance), AppMagic.Services.CookieManager.instance, new AppMagic.Workers.DispatcherFactory(new AppMagic.Workers.WebWorkerFactory))})
})(WinJS, Windows);