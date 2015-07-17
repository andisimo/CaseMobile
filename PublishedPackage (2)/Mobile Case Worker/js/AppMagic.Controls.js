//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var nextMgrId = 0,
            INITIAL_ASYNC_RENDER_DELAY = 10,
            ASYNC_RENDER_DELAY = 4,
            AsyncRenderingManager = function() {
                function AsyncRenderingManager() {
                    this._requestedWindowMinIndex = null;
                    this._requestedWindowMaxIndex = null;
                    this._realizeBeforeFn = null;
                    this._realizeAfterFn = null;
                    this._unrealizeFn = null;
                    this._updateWindowFn = null;
                    this._nextChunkFn = this._doNextChunkOfWork.bind(this);
                    this._currentWindowMinIndex = 0;
                    this._currentWindowMaxIndex = -1;
                    this._mgrId = "_asyncRenderingMgr" + nextMgrId++;
                    this._isLoaded = !0;
                    this._workingPromise = WinJS.Promise.wrap()
                }
                return AsyncRenderingManager.prototype.renderAsync = function(minIndex, maxIndex, realizeBeforeFn, realizeAfterFn, unrealizeFn, updateWindowFn) {
                        (this._requestedWindowMaxIndex !== maxIndex || this._requestedWindowMinIndex !== minIndex) && this._workingPromise.then(function() {
                            this._requestedWindowMinIndex = minIndex;
                            this._requestedWindowMaxIndex = maxIndex;
                            this._realizeBeforeFn = realizeBeforeFn;
                            this._realizeAfterFn = realizeAfterFn;
                            this._unrealizeFn = unrealizeFn;
                            var lastUpdatedMinIndex = null;
                            this._updateWindowFn = function() {
                                this._currentWindowMinIndex !== lastUpdatedMinIndex && (updateWindowFn(this._currentWindowMinIndex), lastUpdatedMinIndex = this._currentWindowMinIndex)
                            }.bind(this);
                            this._pendingWork ? this._pendingWork.updateDelay(INITIAL_ASYNC_RENDER_DELAY) : (AsyncRenderingManager._renderingStarted(this._mgrId), this._pendingWork = AsyncRenderingManager._initiateAsyncCallback(this._nextChunkFn, INITIAL_ASYNC_RENDER_DELAY))
                        }.bind(this))
                    }, AsyncRenderingManager.prototype._doNextChunkOfWork = function() {
                        this._pendingWork = null;
                        this._currentWindowMinIndex > this._currentWindowMaxIndex && (this._requestedWindowMaxIndex > this._currentWindowMinIndex ? (this._currentWindowMinIndex = this._requestedWindowMinIndex, this._currentWindowMaxIndex = this._requestedWindowMinIndex - 1) : (this._currentWindowMaxIndex = this._requestedWindowMaxIndex, this._currentWindowMinIndex = this._requestedWindowMaxIndex + 1));
                        var doneWorking;
                        this._workingPromise = new WinJS.Promise(function(comp) {
                            doneWorking = comp
                        });
                        var scheduleAdditionalWork = !0;
                        try {
                            this._requestedWindowMinIndex > this._currentWindowMinIndex ? this._unrealizeFn(this._currentWindowMinIndex++) : this._requestedWindowMaxIndex < this._currentWindowMaxIndex ? this._unrealizeFn(this._currentWindowMaxIndex--) : this._requestedWindowMaxIndex > this._currentWindowMaxIndex ? this._realizeAfterFn(++this._currentWindowMaxIndex) : this._requestedWindowMinIndex < this._currentWindowMinIndex ? this._realizeBeforeFn(--this._currentWindowMinIndex) : scheduleAdditionalWork = !1;
                            this._updateWindowFn()
                        }
                        finally {
                            scheduleAdditionalWork ? this._pendingWork = AsyncRenderingManager._initiateAsyncCallback(this._nextChunkFn, ASYNC_RENDER_DELAY) : AsyncRenderingManager._renderingCompleted(this._mgrId);
                            doneWorking()
                        }
                    }, AsyncRenderingManager.prototype._resetInternal = function() {
                            this._pendingWork && (this._pendingWork.cancel(), this._pendingWork = null, AsyncRenderingManager._renderingCompleted(this._mgrId));
                            this._requestedWindowMinIndex = null;
                            this._requestedWindowMaxIndex = null;
                            this._realizeBeforeFn = null;
                            this._realizeAfterFn = null;
                            this._unrealizeFn = null;
                            this._updateWindowFn = null
                        }, AsyncRenderingManager.prototype.reset = function(startingMinIndex, startingMaxIndex) {
                            this._resetInternal();
                            this._currentWindowMinIndex = startingMinIndex;
                            this._currentWindowMaxIndex = startingMaxIndex
                        }, AsyncRenderingManager.prototype.dispose = function() {
                            this._resetInternal();
                            this._nextChunkFn = null;
                            this._currentWindowMinIndex = null;
                            this._currentWindowMaxIndex = null;
                            this._isLoaded = !1
                        }, AsyncRenderingManager.waitForAsyncRendering = function() {
                            return AsyncRenderingManager._asyncRenderingWaitingPromise.then(function() {
                                    return new WinJS.Promise(function(comp) {
                                            setImmediate(comp)
                                        })
                                })
                        }, AsyncRenderingManager._renderingStarted = function(id) {
                            AsyncRenderingManager._asyncRenderingCompletedFn || (AsyncRenderingManager._asyncRenderingWaitingPromise = new WinJS.Promise(function(comp) {
                                AsyncRenderingManager._asyncRenderingCompletedFn = comp
                            }));
                            AsyncRenderingManager._renderingInstances[id] = !0;
                            AsyncRenderingManager._renderingCount++
                        }, AsyncRenderingManager._renderingCompleted = function(id) {
                            if (delete AsyncRenderingManager._renderingInstances[id], AsyncRenderingManager._renderingCount--, AsyncRenderingManager._renderingCount === 0) {
                                var completedFn = AsyncRenderingManager._asyncRenderingCompletedFn;
                                AsyncRenderingManager._asyncRenderingCompletedFn = null;
                                completedFn()
                            }
                        }, AsyncRenderingManager._initiateAsyncCallback = function(fn, delay) {
                            var cancelled = !1,
                                completed = !1,
                                timeoutId = null,
                                isImmediate = !1,
                                callFn = function() {
                                    cancelled || completed || (completed = !0, fn())
                                },
                                setTimeoutInternal = function(internalDelay) {
                                    internalDelay === 0 ? (isImmediate = !0, timeoutId = setImmediate(callFn)) : (isImmediate = !1, timeoutId = setTimeout(callFn, internalDelay))
                                };
                            setTimeoutInternal(delay);
                            var clearCallbackInternal = function() {
                                    isImmediate ? clearImmediate(timeoutId) : clearTimeout(timeoutId);
                                    timeoutId = null
                                };
                            return {
                                    cancel: function() {
                                        clearCallbackInternal();
                                        timeoutId = null;
                                        fn = null;
                                        cancelled = !0
                                    }, updateDelay: function(newDelay) {
                                            clearCallbackInternal();
                                            setTimeoutInternal(newDelay)
                                        }
                                }
                        }, AsyncRenderingManager._renderingCount = 0, AsyncRenderingManager._renderingInstances = {}, AsyncRenderingManager._asyncRenderingWaitingPromise = WinJS.Promise.wrap(), AsyncRenderingManager._asyncRenderingCompletedFn = null, AsyncRenderingManager
            }();
        Controls.AsyncRenderingManager = AsyncRenderingManager
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var consts = AppMagic.Constants,
            ContextManager = function() {
                function ContextManager() {
                    this.controls = [];
                    this.nestedManagers = [];
                    this._bindingContextRecycleBin = [];
                    this.isLoaded = !0
                }
                return ContextManager.prototype.getControlWidget = function() {
                        return null
                    }, ContextManager.prototype.forEachManagedDescendingBindingContext = function(bindingContext, fn){}, ContextManager.prototype.notifyBindingContextSelectionInteraction = function(bindingContext, toggleAndPersist){}, ContextManager.prototype.addSelectionChangedListener = function(bindingContext, listener){}, ContextManager.prototype.dispose = function() {
                            this.isLoaded = !1;
                            this.emptyRecycleBin();
                            this.controls = null;
                            this.authoringAreaBindingContext = null
                        }, ContextManager.prototype.addControl = function(control){}, ContextManager.prototype.updateControlId = function(oldControlId, newControlId){}, ContextManager.prototype.removeControl = function(control){}, ContextManager.prototype.newBindingContext = function(parentBindingContext, thisItem, id, isTemplate) {
                            var inputRow = {},
                                outputRow = {_src: thisItem};
                            if (outputRow[consts.Runtime.controlLocMapProperty] = {}, this._bindingContextRecycleBin.length > 0)
                                return this._newRecycledBindingContext(parentBindingContext, thisItem, inputRow, outputRow, id, isTemplate);
                            for (var bindingContext = {
                                    replicatedContexts: {}, controlContexts: {}, thisItem: thisItem || {}, inputRow: inputRow, outputRow: outputRow, realized: !1, container: null, parent: parentBindingContext, id: id, rcManager: this, isTemplate: !!isTemplate
                                }, i = 0, len = this.nestedManagers.length; i < len; i++)
                                new Controls.ReplicatedContext(this.nestedManagers[i], bindingContext);
                            var controlWidget,
                                controlId;
                            for (i = 0, len = this.controls.length; i < len; i++)
                                controlWidget = this.controls[i].OpenAjax,
                                controlId = controlWidget.getId(),
                                inputRow[controlId] = {},
                                outputRow[controlId] = {},
                                outputRow[consts.Runtime.controlLocMapProperty][controlId] = {},
                                bindingContext.controlContexts[controlWidget.getId()] = controlWidget.replicatedContextInterface.newControlContext(bindingContext);
                            return this._initializeControlContexts(bindingContext), bindingContext
                        }, ContextManager.prototype.placeInRecycleBin = function(bindingContext) {
                            for (var nestedManagerId in bindingContext.replicatedContexts) {
                                var nestedReplicatedContext = bindingContext.replicatedContexts[nestedManagerId];
                                nestedReplicatedContext.dispose()
                            }
                            this._bindingContextRecycleBin.push(bindingContext)
                        }, ContextManager.prototype.emptyRecycleBin = function() {
                            this._bindingContextRecycleBin = []
                        }, ContextManager.prototype.disposeBindingContext = function(bindingContext) {
                            for (var i = 0, controlCount = this.controls.length; i < controlCount; i++) {
                                var controlWidget = this.controls[i].OpenAjax;
                                var controlContext = bindingContext.controlContexts[controlWidget.getId()];
                                controlContext.realized && ContextManager.unrealizeControlView(controlContext);
                                controlWidget.replicatedContextInterface.disposeControlContext(controlContext);
                                controlContext.disposed = !0
                            }
                            bindingContext.container = null;
                            bindingContext.realized = !1;
                            bindingContext.disposed = !0;
                            this.placeInRecycleBin(bindingContext)
                        }, ContextManager.prototype.allocateControlContext = function(bindingContext, control) {
                            var controlId = control.OpenAjax.getId();
                            var rcInterface = control.OpenAjax.replicatedContextInterface;
                            bindingContext.inputRow[controlId] = {};
                            bindingContext.outputRow[controlId] = {};
                            bindingContext.outputRow[consts.Runtime.controlLocMapProperty][controlId] = {};
                            bindingContext.controlContexts[controlId] = rcInterface.newControlContext(bindingContext)
                        }, ContextManager.prototype.initializeControlContext = function(bindingContext, control) {
                            var controlId = control.OpenAjax.getId();
                            var rcInterface = control.OpenAjax.replicatedContextInterface;
                            var controlContext = bindingContext.controlContexts[controlId];
                            rcInterface.initControlContext(controlContext);
                            bindingContext.realized && ContextManager.realizeControlView(controlContext, bindingContext)
                        }, ContextManager.prototype.renameControlInBindingContext = function(bindingContext, oldControlId, newControlId) {
                            var controlContext = bindingContext.controlContexts[oldControlId];
                            delete bindingContext.controlContexts[oldControlId];
                            bindingContext.controlContexts[newControlId] = controlContext;
                            bindingContext.inputRow[newControlId] = bindingContext.inputRow[oldControlId];
                            delete bindingContext.inputRow[oldControlId];
                            bindingContext.outputRow[newControlId] = bindingContext.outputRow[oldControlId];
                            bindingContext.outputRow[consts.Runtime.controlLocMapProperty][newControlId] = bindingContext.outputRow[consts.Runtime.controlLocMapProperty][oldControlId];
                            typeof bindingContext.thisItem[oldControlId] != "undefined" ? bindingContext.outputRow[oldControlId] = bindingContext.thisItem[oldControlId] : (delete bindingContext.outputRow[oldControlId], delete bindingContext.outputRow[consts.Runtime.controlLocMapProperty][oldControlId])
                        }, ContextManager.prototype.removeControlFromBindingContext = function(bindingContext, control) {
                            var controlId = control.OpenAjax.getId();
                            var rcInterface = control.OpenAjax.replicatedContextInterface;
                            var controlContext = bindingContext.controlContexts[controlId];
                            controlContext.realized && ContextManager.unrealizeControlView(controlContext);
                            rcInterface.disposeControlContext(controlContext);
                            delete bindingContext.controlContexts[controlId];
                            delete bindingContext.inputRow[controlId];
                            typeof bindingContext.thisItem[controlId] != "undefined" ? bindingContext.outputRow[controlId] = bindingContext.thisItem[controlId] : (delete bindingContext.outputRow[controlId], delete bindingContext.outputRow[consts.Runtime.controlLocMapProperty][controlId])
                        }, ContextManager.prototype._newRecycledBindingContext = function(parentBindingContext, thisItem, inputRow, outputRow, id, isTemplate) {
                            var bindingContext = this._bindingContextRecycleBin.shift();
                            bindingContext.parent = parentBindingContext;
                            bindingContext.thisItem = thisItem || {};
                            bindingContext.inputRow = inputRow;
                            bindingContext.outputRow = outputRow;
                            bindingContext.id = id;
                            delete bindingContext.disposed;
                            bindingContext.recycleCount = (bindingContext.recycleCount || 0) + 1;
                            for (var nestedManagerId in bindingContext.replicatedContexts) {
                                var nestedReplicatedContext = bindingContext.replicatedContexts[nestedManagerId];
                                nestedReplicatedContext.restore(bindingContext)
                            }
                            for (var i = 0, len = this.controls.length; i < len; i++) {
                                var controlWidget = this.controls[i].OpenAjax;
                                var controlId = controlWidget.getId();
                                inputRow[controlId] = {};
                                outputRow[controlId] = {};
                                var controlContext = bindingContext.controlContexts[controlId];
                                controlWidget.replicatedContextInterface.recycleControlContext(controlContext, !!isTemplate)
                            }
                            return this._initializeControlContexts(bindingContext), bindingContext
                        }, ContextManager.prototype._initializeControlContexts = function(bindingContext) {
                            for (var i = 0, len = this.controls.length; i < len; i++) {
                                var controlWidget = this.controls[i].OpenAjax;
                                var controlContext = bindingContext.controlContexts[controlWidget.getId()];
                                controlWidget.replicatedContextInterface.initControlContext(controlContext)
                            }
                        }, ContextManager.getParentManager = function(icontrol) {
                            if (!icontrol.isReplicable)
                                return Controls.GlobalContextManager.instance;
                            if (icontrol.parent) {
                                var parentControl = OpenAjax.widget.byId(icontrol.parent.name);
                                return parentControl.OpenAjax.contextManager
                            }
                            return Controls.GlobalContextManager.instance
                        }, ContextManager.realizeControlView = function(controlContext, bindingContext) {
                            controlContext.controlWidget.replicatedContextInterface.createView(controlContext)
                        }, ContextManager.unrealizeControlView = function(controlContext) {
                            controlContext.controlWidget.replicatedContextInterface.destroyView(controlContext);
                            controlContext.container = null;
                            controlContext.realized = !1
                        }, ContextManager
            }();
        Controls.ContextManager = ContextManager
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var consts = AppMagic.Constants,
            typeCoercers = {},
            typeEnforcers = {},
            ControlProperty = function() {
                function ControlProperty(controlId, property, isOutput, beforeMutateFn, afterMutateFn) {
                    this._property = property;
                    this._isOutput = isOutput;
                    this._propertyName = property.propertyName;
                    this._propertyInvariantName = property.propertyInvariantName;
                    this._controlId = controlId;
                    this._beforeMutateFn = beforeMutateFn;
                    this._afterMutateFn = afterMutateFn;
                    this._defaultInitialValue = ControlProperty._getDefaultInitialValue(property);
                    this._initAutoManipulation(property);
                    this._isLoaded = !0
                }
                return ControlProperty.prototype._viewConverterFn = function(value) {
                        return value
                    }, ControlProperty.prototype._modelConverterFn = function(value) {
                        return value
                    }, ControlProperty.prototype._modelValueConstrainerFn = function(value) {
                            return value
                        }, ControlProperty.prototype.updateControlId = function(controlId) {
                            this._controlId = controlId
                        }, ControlProperty.prototype.initProperty = function(controlContext, initialValue) {
                            initialValue = this._getInitialValue(initialValue);
                            typeof controlContext.modelProperties == "undefined" && (controlContext.modelProperties = {});
                            controlContext.modelProperties[this._propertyInvariantName] = {
                                getValue: this.getValue.bind(this, controlContext), setValue: this.setValue.bind(this, controlContext), modelObservable: null
                            };
                            var propertyStore = this._getPropertyStore(controlContext);
                            propertyStore[this._controlId][this._propertyName] = initialValue;
                            this._setControlPropertyLocMap(propertyStore);
                            this._mergeLocMap(propertyStore)
                        }, ControlProperty.prototype.recycleProperty = function(controlContext, initialValue) {
                            initialValue = this._getInitialValue(initialValue);
                            var propertyStore = this._getPropertyStore(controlContext);
                            propertyStore[this._controlId][this._propertyName] = initialValue;
                            this._setControlPropertyLocMap(propertyStore);
                            this._mergeLocMap(propertyStore)
                        }, ControlProperty.prototype.promotePropertyForView = function(controlContext) {
                            var value = this._getPropertyStore(controlContext)[this._controlId][this._propertyName];
                            var modelProperty = controlContext.modelProperties[this._propertyInvariantName];
                            var modelObservable = modelProperty.modelObservable = ko.observable(value);
                            typeof controlContext.properties == "undefined" && (controlContext.properties = {});
                            var propValueFunc = controlContext.properties[this._propertyInvariantName] = ko.computed({
                                    read: function() {
                                        try {
                                            return this._viewConverterFn(modelObservable())
                                        }
                                        catch(ex) {
                                            return null
                                        }
                                    }.bind(this), write: function(newValue) {
                                            this.setValue(controlContext, this._typeCoercerFn(this._modelConverterFn(newValue)), !1)
                                        }.bind(this)
                                });
                            propValueFunc.propertyName = this._propertyInvariantName
                        }, ControlProperty.prototype.demotePropertyForView = function(controlContext) {
                            var modelProperty = controlContext.modelProperties[this._propertyInvariantName];
                            modelProperty.modelObservable = null;
                            controlContext.properties[this._propertyInvariantName].dispose();
                            delete controlContext.properties[this._propertyInvariantName]
                        }, ControlProperty.prototype.getValue = function(controlContext) {
                            var propertyStore = this._getPropertyStore(controlContext);
                            return propertyStore[this._controlId][this._propertyName]
                        }, ControlProperty.prototype.setValue = function(controlContext, value, setValueOnly) {
                            if (setValueOnly = !!setValueOnly, this._property.isAggregate && value !== null && !(value instanceof Array) && !value[consts.Runtime.controlLocMapProperty]) {
                                var jsonMap = this._property.getControlPropertyLocJsonMap();
                                typeof jsonMap == "string" && (jsonMap = JSON.parse(jsonMap));
                                value[consts.Runtime.controlLocMapProperty] = jsonMap
                            }
                            this._typeEnforcerFn(value);
                            var oldModelValue = this._getPropertyStore(controlContext)[this._controlId][this._propertyName];
                            if (value = this._modelValueConstrainerFn(value), value === null && this._nullDefault !== null && (value = this._nullDefault), this._isLoaded && value !== oldModelValue && (setValueOnly || this._beforeMutateFn(controlContext, this._propertyInvariantName, oldModelValue, value), this._setModelValueInternal(controlContext, value), setValueOnly || this._afterMutateFn(controlContext, this._propertyInvariantName, oldModelValue, value), this._attachedControlContext === controlContext)) {
                                var latestTemplatePropertyValue = this.getValue(this._templateControlContext);
                                value === latestTemplatePropertyValue || typeof value == "number" && isNaN(value) && typeof latestTemplatePropertyValue == "number" && isNaN(latestTemplatePropertyValue) || this.setValue(this._templateControlContext, value)
                            }
                            return value
                        }, ControlProperty.prototype.attachTemplateControlContext = function(controlContext, templateControlContext) {
                            this._templateControlContext = templateControlContext;
                            this._attachedControlContext = controlContext;
                            var latestTemplatePropertyValue = this.getValue(templateControlContext),
                                propValue = this.getValue(controlContext);
                            AppMagic.Utility.deepCompare(propValue, latestTemplatePropertyValue) || this.setValue(templateControlContext, propValue)
                        }, ControlProperty.prototype.detachTemplateControlContext = function() {
                            this._templateControlContext = null;
                            this._attachedControlContext = null
                        }, ControlProperty.prototype._setControlPropertyLocMap = function(propertyStore) {
                            if (propertyStore[consts.Runtime.controlLocMapProperty] && (propertyStore[consts.Runtime.controlLocMapProperty][this._controlId] = propertyStore[consts.Runtime.controlLocMapProperty][this._controlId] || {}, propertyStore[consts.Runtime.controlLocMapProperty][this._controlId][this._propertyName] = {invariantName: this._propertyInvariantName}, this._property.isAggregate)) {
                                var jsonMap = this._property.getControlPropertyLocJsonMap();
                                typeof jsonMap == "string" && (jsonMap = JSON.parse(jsonMap));
                                propertyStore[consts.Runtime.controlLocMapProperty][this._controlId][this._propertyName][consts.Runtime.controlLocMapProperty] = jsonMap
                            }
                        }, ControlProperty.prototype._mergeLocMap = function(propertyStore) {
                            propertyStore[consts.Runtime.controlLocMapProperty] && propertyStore._src && propertyStore._src[consts.Runtime.controlLocMapProperty] && Object.keys(propertyStore._src[consts.Runtime.controlLocMapProperty]).forEach(function(key) {
                                if (!propertyStore[consts.Runtime.controlLocMapProperty][key]) {
                                    var data = AppMagic.Utility.clone(propertyStore._src[consts.Runtime.controlLocMapProperty][key], !0);
                                    propertyStore[consts.Runtime.controlLocMapProperty][key] = data
                                }
                            })
                        }, ControlProperty.prototype._getPropertyStore = function(controlContext) {
                            return this._isOutput ? controlContext.bindingContext.outputRow : controlContext.bindingContext.inputRow
                        }, ControlProperty.prototype._getInitialValue = function(initialValue) {
                            return typeof initialValue == "undefined" && (initialValue = this._defaultInitialValue), initialValue = this._modelValueConstrainerFn(initialValue), initialValue === null && this._nullDefault !== null && (initialValue = this._nullDefault), initialValue
                        }, ControlProperty.prototype._setModelValueInternal = function(controlContext, value) {
                            var _this = this;
                            AppMagic.Utility.execUnsafeLocalFunction(function() {
                                _this._getPropertyStore(controlContext)[_this._controlId][_this._propertyName] = value;
                                var modelProperty = controlContext.modelProperties[_this._propertyInvariantName];
                                modelProperty.modelObservable && modelProperty.modelObservable(value)
                            })
                        }, ControlProperty.prototype._initAutoManipulation = function(property) {
                            var type = property.isEnum ? property.enumSuperType : property.propertyType;
                            if (this._typeCoercerFn = ControlProperty._getTypeCoercer(type), this._typeEnforcerFn = ControlProperty._getTypeEnforcer(type), property.converterName !== "") {
                                var converter = AppMagic.Controls.converters[property.converterName];
                                typeof converter.view == "function" && (this._viewConverterFn = converter.view);
                                typeof converter.model == "function" && (this._modelConverterFn = converter.model)
                            }
                            property.modelValueConstrainerName !== "" ? this._modelValueConstrainerFn = AppMagic.Controls.modelValueConstrainers[property.modelValueConstrainerName] : (property.minimum !== null || property.maximum !== null) && (this._modelValueConstrainerFn = function(value) {
                                return AppMagic.Controls.modelValueConstrainers.valueRangeConstrainer(value, property.minimum, property.maximum)
                            });
                            this._nullDefault = property.nullDefault === "" ? null : this._typeCoercerFn(property.nullDefault)
                        }, ControlProperty._getDefaultInitialValue = function(property) {
                            var initialValue = null,
                                propDefaultValue = property.defaultValue;
                            if (property.isExpr)
                                initialValue = null;
                            else {
                                var type = property.isEnum ? property.enumSuperType : property.propertyType;
                                switch (type) {
                                    case"s":
                                    case"i":
                                    case"m":
                                        initialValue = typeof propDefaultValue == "string" && propDefaultValue.length >= 2 && propDefaultValue[0] === '"' && propDefaultValue[propDefaultValue.length - 1] === '"' ? propDefaultValue.substring(1, propDefaultValue.length - 1) : propDefaultValue;
                                        break;
                                    case"n":
                                        initialValue = propDefaultValue === "" ? 0 : parseFloat(propDefaultValue);
                                        break;
                                    case"c":
                                        initialValue = propDefaultValue === "" ? 0 : parseFloat(propDefaultValue);
                                        break;
                                    case"b":
                                        initialValue = propDefaultValue === "" ? !1 : propDefaultValue.toLowerCase() === "true";
                                        break;
                                    default:
                                        initialValue = null;
                                        break
                                }
                            }
                            return initialValue
                        }, ControlProperty._getTypeCoercer = function(propertyType) {
                            return propertyType in typeCoercers || (typeCoercers[propertyType] = ControlProperty._createTypeCoercer(propertyType)), typeCoercers[propertyType]
                        }, ControlProperty._getTypeEnforcer = function(propertyType) {
                            return propertyType in typeEnforcers || (typeEnforcers[propertyType] = ControlProperty._createTypeEnforcer(propertyType)), typeEnforcers[propertyType]
                        }, ControlProperty._createTypeCoercer = function(propertyType) {
                            var typeCoercer;
                            switch (propertyType) {
                                case"s":
                                case"i":
                                    typeCoercer = function(newValue) {
                                        return newValue === null ? "" : typeof newValue == "string" ? newValue : newValue.toString()
                                    };
                                    break;
                                case"n":
                                case"c":
                                    typeCoercer = function(newValue) {
                                        if (newValue === null)
                                            return 0;
                                        switch (typeof newValue) {
                                            case"number":
                                                return newValue;
                                            case"string":
                                                return parseFloat(newValue);
                                            case"boolean":
                                                return newValue ? 1 : 0
                                        }
                                        return null
                                    };
                                    break;
                                case"b":
                                    typeCoercer = function(newValue) {
                                        if (newValue === null)
                                            return !1;
                                        switch (typeof newValue) {
                                            case"boolean":
                                                return newValue;
                                            case"number":
                                                return !!newValue;
                                            case"string":
                                                return newValue.toLowerCase() === "true"
                                        }
                                        return null
                                    };
                                    break;
                                default:
                                    typeCoercer = function(newValue) {
                                        return newValue
                                    };
                                    break
                            }
                            return typeCoercer
                        }, ControlProperty._createTypeEnforcer = function(propertyType) {
                            var typeEnforcer;
                            switch (propertyType) {
                                case"s":
                                case"i":
                                    typeEnforcer = function(value){};
                                    break;
                                case"c":
                                case"n":
                                    typeEnforcer = function(value){};
                                    break;
                                case"b":
                                    typeEnforcer = function(value){};
                                    break;
                                default:
                                    typeEnforcer = function(value){};
                                    break
                            }
                            return typeEnforcer
                        }, ControlProperty
            }();
        Controls.ControlProperty = ControlProperty
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var util = AppMagic.Utility,
            generics = Collections.Generic,
            ReplicatedContext = function() {
                function ReplicatedContext(manager, parentBindingContext) {
                    parentBindingContext.replicatedContexts[manager.managerId] = this;
                    this._parentBindingContext = parentBindingContext;
                    this._nestedReachabilityChanged = !1;
                    this._manager = manager;
                    this._initTablesAndLookups();
                    this._isLoaded = !0
                }
                return ReplicatedContext.prototype.getBindingContextCount = function() {
                        return this._rowView.length
                    }, ReplicatedContext.prototype.setNestedReachabilityChanged = function() {
                        this._nestedReachabilityChanged = !0
                    }, ReplicatedContext.prototype.getRealizedBindingContexts = function() {
                            for (var realizedBindingContexts = {}, i = 0, len = this._rowView.length; i < len; i++) {
                                var bindingContextId = this._rowView[i],
                                    bindingContext = bindingContextId && this._bindingContextLookup[bindingContextId];
                                bindingContext && bindingContext.realized && (realizedBindingContexts[bindingContext.id] = bindingContext)
                            }
                            return realizedBindingContexts
                        }, ReplicatedContext.prototype.bindingContextRealizedAt = function(index) {
                            var bindingContextId = this._rowView[index],
                                bindingContext = bindingContextId && this._bindingContextLookup[bindingContextId];
                            return bindingContext && bindingContext.realized
                        }, ReplicatedContext.prototype.getRecordIndex = function(record) {
                            var rowId = ReplicatedContext._getInternalRowId([record], 0);
                            return this._comprehensiveRowView.indexOf(rowId)
                        }, ReplicatedContext.prototype.bindingContextAt = function(index) {
                            var bindingContext,
                                rowId = this._rowView[index];
                            return rowId === null ? (bindingContext = this._buildRowBindingContext(this._inputTable, index), this._manager.runBindingContextDataFlow(bindingContext)) : bindingContext = this._bindingContextLookup[rowId], bindingContext
                        }, ReplicatedContext.prototype.clearBindingContextSelection = function() {
                            this._selectedBindingContexts.clear();
                            this.notifySelectedItemsChanged()
                        }, ReplicatedContext.prototype.notifyBindingContextSelectionInteraction = function(bindingContext, toggleAndPersist) {
                            if (toggleAndPersist ? this._selectedBindingContexts.toggle(bindingContext) : (this._selectedBindingContexts.clear(), this._selectedBindingContexts.add(bindingContext)), this.notifySelectedItemsChanged(), this._parentBindingContext.observedBindingContext) {
                                var observedReplicatedContext = this._manager.replicatedContextFor(this._parentBindingContext.observedBindingContext);
                                var bindingContextIndex = this._comprehensiveRowView.indexOf(bindingContext.id);
                                var correspondingBindingContext = observedReplicatedContext.bindingContextAt(bindingContextIndex);
                                observedReplicatedContext.notifyBindingContextSelectionInteraction(correspondingBindingContext, toggleAndPersist)
                            }
                        }, ReplicatedContext.prototype.addSelectionChangedListener = function(bindingContext, listener) {
                            this._selectedBindingContexts.subscribe(bindingContext, listener)
                        }, ReplicatedContext.prototype.removeSelectionChangedListener = function(bindingContext, listener) {
                            this._selectedBindingContexts.unsubscribe(bindingContext, listener)
                        }, ReplicatedContext.prototype.getOutputTable = function() {
                            return this._ensureOutputTable(), this._outputTable
                        }, ReplicatedContext.prototype.getSelectedItemsTable = function() {
                            return this._ensureSelectedItemsTable(), this._selectedItemsTable
                        }, ReplicatedContext.prototype.getSelectedItem = function() {
                            return this._ensureSelectedItem(), this._selectedItem
                        }, ReplicatedContext.prototype.clearCache = function() {
                            this._bindingContextCache = {}
                        }, ReplicatedContext.prototype.clearInputTable = function() {
                            this._disposePreviousBindingContexts();
                            this._manager.authoringAreaBindingContext.parent === this._parentBindingContext && (this._manager.authoringAreaBindingContext.thisItem = {})
                        }, ReplicatedContext.prototype.applyInputTable = function(data) {
                            var isDeltaCompatibleOperation = this._inputTable !== null && typeof this._inputTable._ID != "undefined" && this._inputTable._ID === data._ID;
                            isDeltaCompatibleOperation ? this._applyInputTableWithDeltaInternal(data) : this._applyInputTableInternal(data);
                            this._inputTable = data;
                            this.notifyOutputTableChanged();
                            this.notifySelectedItemsChanged()
                        }, ReplicatedContext.prototype.forEachBindingContext = function(fn) {
                            for (var i = 0, len = this._rowView.length; i < len; i++)
                                this._rowView[i] !== null && fn(this._bindingContextLookup[this._rowView[i]]);
                            for (var cachedId in this._bindingContextCache)
                                fn(this._bindingContextCache[cachedId])
                        }, ReplicatedContext.prototype.notifyOutputRowChanged = function(rowId) {
                            var _this = this;
                            if (this._blockRowChangedNotification !== rowId && typeof this._bindingContextCache[rowId] == "undefined") {
                                var rowBindingContext = this._bindingContextLookup[rowId];
                                typeof this._manager.notifyOutputRowChangedFn == "function" && util.executeOnceAsync(function() {
                                    return _this._manager.notifyOutputRowChangedFn(_this._parentBindingContext, rowId, rowBindingContext.outputRow)
                                }, this._manager.controlWidget.getId() + "__reUpdateOutputRow__" + this._parentBindingContext.id + "_row" + rowId, 1, function() {
                                    return _this._isLoaded && !!_this._bindingContextLookup[rowId]
                                })
                            }
                        }, ReplicatedContext.prototype.notifyOutputTableChanged = function() {
                            var _this = this;
                            typeof this._manager.notifyOutputTableChangedFn == "function" && util.executeOnceAsync(function() {
                                return _this._manager.notifyOutputTableChangedFn(_this._parentBindingContext)
                            }, this._manager.controlWidget.getId() + "__rcUpdateOutputTable__" + this._parentBindingContext.id, 1, function() {
                                return _this._isLoaded
                            })
                        }, ReplicatedContext.prototype.notifySelectedItemsChanged = function() {
                            var _this = this;
                            typeof this._manager.notifySelectedItemsChangedFn == "function" && util.executeOnceAsync(function() {
                                return _this._manager.notifySelectedItemsChangedFn(_this._parentBindingContext)
                            }, this._manager.controlWidget.getId() + "__rcUpdateSelectedItems__" + this._parentBindingContext.id, 1, function() {
                                return _this._isLoaded
                            })
                        }, ReplicatedContext.prototype.dispose = function() {
                            this._disposePreviousBindingContexts();
                            this._isLoaded = !1;
                            this._parentBindingContext = null;
                            this._inputTable = null;
                            this._selectedBindingContexts = null;
                            this._bindingContextLookup = null;
                            this._bindingContextCache = null;
                            this._selectedItemsTable = null;
                            this._selectedItem = null;
                            this._outputTable = null;
                            this._comprehensiveRowView = null;
                            this._rowView = null
                        }, ReplicatedContext.prototype.restore = function(parentBindingContext) {
                            this._parentBindingContext = parentBindingContext;
                            this._initTablesAndLookups();
                            this._isLoaded = !0
                        }, ReplicatedContext.prototype._initTablesAndLookups = function() {
                            this._inputTable = [];
                            this._bindingContextCache = {};
                            this._bindingContextLookup = {};
                            this._selectedBindingContexts = new generics.ObservableSet;
                            this._outputTable = [];
                            this._comprehensiveRowView = [];
                            this._rowView = []
                        }, ReplicatedContext.prototype._ensureOutputTable = function() {
                            var partialInputTable = [],
                                partialOutputTable = [];
                            this._populatePartialTables(partialInputTable, partialOutputTable);
                            this._manager.runOptimizedReplicatedDataFlow(this._parentBindingContext, partialInputTable, partialOutputTable) ? this._nestedReachabilityChanged = !1 : this._runDataFlowForOutputTable()
                        }, ReplicatedContext.prototype._ensureSelectedItemsTable = function() {
                            var _this = this,
                                selectedIds = this._rowView.filter(function(id, i) {
                                    return i === 0 ? _this._selectedBindingContexts.contains(_this._manager.authoringAreaBindingContext) : _this._selectedBindingContexts.contains(_this._bindingContextLookup[id])
                                });
                            this._selectedItemsTable = selectedIds.map(function(id) {
                                return _this._bindingContextLookup[id].outputRow
                            })
                        }, ReplicatedContext.prototype._ensureSelectedItem = function() {
                            var selectedBindingContext = this._selectedBindingContexts.items()[0];
                            this._selectedItem = selectedBindingContext ? selectedBindingContext.outputRow : null
                        }, ReplicatedContext.prototype._runDataFlowForOutputTable = function() {
                            for (var i = 0, len = this._rowView.length; i < len; i++)
                                if (this._rowView[i] === null) {
                                    var bindingContext = this._buildRowBindingContext(this._inputTable, i);
                                    this._manager.runBindingContextDataFlow(bindingContext)
                                }
                        }, ReplicatedContext.prototype._populatePartialTables = function(partialInputTable, partialOutputTable) {
                            for (var i = 0, len = this._rowView.length; i < len; i++)
                                this._rowView[i] === null && (this._outputTable[i] === null || this._nestedReachabilityChanged) && (partialInputTable.push(this._inputTable[i]), partialOutputTable.push(this._outputTable[i] = {}))
                        }, ReplicatedContext.prototype._buildRowBindingContext = function(data, i) {
                            var rowId = ReplicatedContext._getInternalRowId(data, i);
                            this._blockRowChangedNotification = rowId;
                            var bindingContext = this._bindingContextLookup[rowId] = this._manager.newBindingContext(this._parentBindingContext, data[i], rowId);
                            return this._outputTable[i] = bindingContext.outputRow, this._rowView[i] = rowId, this._blockRowChangedNotification = null, bindingContext
                        }, ReplicatedContext.prototype._applyInputTableInternal = function(data) {
                            this.clearCache();
                            this._disposePreviousBindingContexts();
                            var newBindingContexts = [];
                            this._manager.authoringAreaBindingContext && this._manager.authoringAreaBindingContext.parent === this._parentBindingContext && this._manager.detachAuthoringAreaContext();
                            for (var i = 0, len = data.length; i < len; i++) {
                                var id = ReplicatedContext._getInternalRowId(data, i);
                                this._comprehensiveRowView.push(id);
                                this._outputTable.push(null);
                                this._rowView.push(null);
                                i === 0 && newBindingContexts.push(this._buildRowBindingContext(data, i))
                            }
                            this._manager.runBindingContextDataFlow(newBindingContexts);
                            this._manager.authoringAreaBindingContext && this._manager.authoringAreaBindingContext.parent === this._parentBindingContext && this._setAuthoringAreaBindingContext()
                        }, ReplicatedContext.prototype._applyInputTableWithDeltaInternal = function(data) {
                            this._applyDelta(data);
                            var newBindingContexts = [];
                            this._comprehensiveRowView = [];
                            this._rowView = [];
                            this._outputTable = [];
                            for (var i = 0, len = data.length; i < len; i++) {
                                this._rowView.push(null);
                                this._outputTable.push(null);
                                var id = ReplicatedContext._getInternalRowId(data, i);
                                this._comprehensiveRowView.push(id);
                                var bindingContext = this._bindingContextLookup[id];
                                (i === 0 || bindingContext) && (bindingContext ? this._rowView[i] = id : (bindingContext = this._buildRowBindingContext(data, i), newBindingContexts.push(bindingContext)), this._outputTable[i] = bindingContext.outputRow)
                            }
                            this._manager.authoringAreaBindingContext && this._manager.authoringAreaBindingContext.parent === this._parentBindingContext && this._manager.detachAuthoringAreaContext();
                            this._manager.runBindingContextDataFlow(newBindingContexts);
                            this._manager.authoringAreaBindingContext && this._manager.authoringAreaBindingContext.parent === this._parentBindingContext && this._setAuthoringAreaBindingContext()
                        }, ReplicatedContext.prototype._setAuthoringAreaBindingContext = function() {
                            this._rowView.length > 0 ? this._manager.attachAuthoringAreaContext(this._bindingContextLookup[this._rowView[0]]) : this._manager.attachAuthoringAreaContext(null)
                        }, ReplicatedContext.prototype._applyDelta = function(data) {
                            for (var rowId, dataRowLookup = {}, i = 0, len = data.length; i < len; i++)
                                dataRowLookup[ReplicatedContext._getInternalRowId(data, i)] = data[i];
                            var removes = [];
                            for (rowId in this._bindingContextLookup)
                                dataRowLookup[rowId] ? delete dataRowLookup[rowId] : removes.push(rowId);
                            for (i = 0, len = removes.length; i < len; i++)
                                this._removeRow(removes[i]);
                            for (rowId in dataRowLookup)
                                this._addRow(rowId)
                        }, ReplicatedContext.prototype._addRow = function(rowId) {
                            if (this._bindingContextCache[rowId]) {
                                var bindingContext = this._bindingContextCache[rowId];
                                delete this._bindingContextCache[rowId];
                                this._bindingContextLookup[rowId] = bindingContext
                            }
                        }, ReplicatedContext.prototype._removeRow = function(rowId) {
                            var bindingContext = this._bindingContextLookup[rowId];
                            bindingContext.cachedCount = (bindingContext.cachedCount || 0) + 1;
                            this._bindingContextCache[rowId] = bindingContext;
                            delete this._bindingContextLookup[rowId];
                            bindingContext.realized && Controls.ReplicatedContextManager.unrealizeRowView(bindingContext)
                        }, ReplicatedContext.prototype._disposePreviousBindingContexts = function() {
                            for (var rowId in this._bindingContextLookup)
                                this._manager.disposeBindingContext(this._bindingContextLookup[rowId]);
                            this._bindingContextLookup = {};
                            this._comprehensiveRowView = [];
                            this._rowView = [];
                            this._outputTable = []
                        }, ReplicatedContext._getInternalRowId = function(dataTable, index) {
                            return "_" + dataTable[index]._ID
                        }, ReplicatedContext
            }();
        Controls.ReplicatedContext = ReplicatedContext
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
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
    (function(Controls) {
        var nextManagerId = 1,
            ReplicatedContextManager = function(_super) {
                __extends(ReplicatedContextManager, _super);
                function ReplicatedContextManager(parentManager, controlWidget, notifyOutputTableChangedFn, notifySelectedItemsChangedFn, notifyOutputRowChangedFn, runBindingContextDataFlowFn, runOptimizedReplicatedDataFlowFn) {
                    _super.call(this);
                    this._parentManager = parentManager;
                    this._controlWidget = controlWidget;
                    this._notifyOutputTableChangedFn = notifyOutputTableChangedFn;
                    this._notifySelectedItemsChangedFn = notifySelectedItemsChangedFn;
                    this._notifyOutputRowChangedFn = notifyOutputRowChangedFn;
                    this._runBindingContextDataFlowFn = runBindingContextDataFlowFn;
                    this._runOptimizedReplicatedDataFlowFn = runOptimizedReplicatedDataFlowFn;
                    this._parentManager.nestedManagers.push(this);
                    this.managerId = "rcManager" + nextManagerId++;
                    this.authoringAreaBindingContext = this.newBindingContext(parentManager.authoringAreaBindingContext, null, "authoringArea", !0);
                    this._initializeReplicatedContexts()
                }
                return Object.defineProperty(ReplicatedContextManager.prototype, "controlWidget", {
                        get: function() {
                            return this._controlWidget
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ReplicatedContextManager.prototype, "notifyOutputTableChangedFn", {
                        get: function() {
                            return this._notifyOutputTableChangedFn
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ReplicatedContextManager.prototype, "notifySelectedItemsChangedFn", {
                            get: function() {
                                return this._notifySelectedItemsChangedFn
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ReplicatedContextManager.prototype, "notifyOutputRowChangedFn", {
                            get: function() {
                                return this._notifyOutputRowChangedFn
                            }, enumerable: !0, configurable: !0
                        }), ReplicatedContextManager.prototype.setNestedReachabilityChanged = function() {
                            var _this = this;
                            this._parentManager.forEachManagedDescendingBindingContext(Controls.GlobalContextManager.bindingContext, function(bindingContext) {
                                return _this._getReplicatedContext(bindingContext).setNestedReachabilityChanged()
                            })
                        }, ReplicatedContextManager.prototype.runOptimizedReplicatedDataFlow = function(bindingContext, inputTable, outputTable) {
                            return this._runOptimizedReplicatedDataFlowFn ? this._runOptimizedReplicatedDataFlowFn(this._controlWidget.getId(), bindingContext, inputTable, outputTable) : !1
                        }, ReplicatedContextManager.prototype.replicatedContextFor = function(parentBindingContext) {
                            return this._getReplicatedContext(parentBindingContext)
                        }, ReplicatedContextManager.prototype.getControlWidget = function() {
                            return this._controlWidget
                        }, ReplicatedContextManager.prototype.applyInputTable = function(parentBindingContext, data) {
                            this._getReplicatedContext(parentBindingContext).applyInputTable(data)
                        }, ReplicatedContextManager.prototype.notifyOutputRowChanged = function(bindingContext, rowId) {
                            this._getReplicatedContext(bindingContext).notifyOutputRowChanged(rowId)
                        }, ReplicatedContextManager.prototype.notifyOutputTableChanged = function(bindingContext) {
                            this._getReplicatedContext(bindingContext).notifyOutputTableChanged()
                        }, ReplicatedContextManager.prototype.notifyBindingContextSelectionInteraction = function(bindingContext, toggleAndPersist) {
                            this._getReplicatedContext(bindingContext.parent).notifyBindingContextSelectionInteraction(bindingContext, toggleAndPersist)
                        }, ReplicatedContextManager.prototype.addSelectionChangedListener = function(bindingContext, listener) {
                            this._getReplicatedContext(bindingContext.parent).addSelectionChangedListener(bindingContext, listener)
                        }, ReplicatedContextManager.prototype.runBindingContextDataFlow = function(bindingContexts) {
                            !this._runBindingContextDataFlowFn || bindingContexts instanceof Array && bindingContexts.length === 0 || this._runBindingContextDataFlowFn(bindingContexts instanceof Array ? bindingContexts : [bindingContexts])
                        }, ReplicatedContextManager.prototype.forEachManagedDescendingBindingContext = function(bindingContext, fn) {
                            var _this = this;
                            bindingContext.rcManager === this ? fn(bindingContext) : bindingContext.rcManager === this._parentManager ? this.forEachChildBindingContext(bindingContext, fn) : this._parentManager.forEachManagedDescendingBindingContext(bindingContext, function(parentBindingContext) {
                                return _this.forEachManagedDescendingBindingContext(parentBindingContext, fn)
                            })
                        }, ReplicatedContextManager.prototype.forEachChildBindingContext = function(parentBindingContext, fn) {
                            this.authoringAreaBindingContext !== null && (this.authoringAreaBindingContext.parent === parentBindingContext && fn(this.authoringAreaBindingContext), this._getReplicatedContext(parentBindingContext).forEachBindingContext(fn))
                        }, ReplicatedContextManager.prototype.forEachParentBindingContext = function(fn) {
                            this._parentManager.forEachManagedDescendingBindingContext(Controls.GlobalContextManager.bindingContext, fn)
                        }, ReplicatedContextManager.prototype.forEachManagedBindingContext = function(fn) {
                            this.forEachManagedDescendingBindingContext(Controls.GlobalContextManager.bindingContext, fn)
                        }, ReplicatedContextManager.prototype.dispose = function() {
                            var _this = this;
                            if (this._parentManager.isLoaded && this.forEachParentBindingContext(function(parentBindingContext) {
                                _this._getReplicatedContext(parentBindingContext).dispose();
                                delete parentBindingContext.replicatedContexts[_this.managerId]
                            }), _super.prototype.dispose.call(this), this._controlWidget = null, this._notifyOutputTableChangedFn = null, this._parentManager) {
                                var nested = this._parentManager.nestedManagers,
                                    idx = nested.indexOf(this);
                                nested.splice(idx, 1)
                            }
                        }, ReplicatedContextManager.prototype.addControl = function(control) {
                            var _this = this;
                            this.emptyRecycleBin();
                            this.controls.push(control);
                            this.forEachParentBindingContext(function(parentBindingContext) {
                                _this._addControlToParentBindingContext(parentBindingContext, control);
                                _this.authoringAreaBindingContext.observedBindingContext !== null && control.OpenAjax.attachToObservedContext(_this.authoringAreaBindingContext)
                            })
                        }, ReplicatedContextManager.prototype.updateControlId = function(oldControlId, newControlId) {
                            var _this = this;
                            this.emptyRecycleBin();
                            this.forEachParentBindingContext(function(parentBindingContext) {
                                return _this._renameControlInParentBindingContext(parentBindingContext, oldControlId, newControlId)
                            })
                        }, ReplicatedContextManager.prototype.removeControl = function(control) {
                            var _this = this;
                            if (this.isLoaded) {
                                this.emptyRecycleBin();
                                var i = this.controls.indexOf(control);
                                this.controls.splice(i, 1);
                                this.forEachParentBindingContext(function(parentBindingContext) {
                                    return _this._removeControlFromParentBindingContext(parentBindingContext, control)
                                })
                            }
                        }, ReplicatedContextManager.prototype.detachAuthoringAreaContext = function() {
                            if (this.authoringAreaBindingContext.observedBindingContext !== null) {
                                for (var i = 0, len = this.controls.length; i < len; i++) {
                                    var controlWidget = this.controls[i].OpenAjax;
                                    controlWidget.detachFromObservedContext()
                                }
                                this.authoringAreaBindingContext.observedBindingContext = null
                            }
                        }, ReplicatedContextManager.prototype.attachAuthoringAreaContext = function(observedBindingContext) {
                            if (this.authoringAreaBindingContext.observedBindingContext = observedBindingContext, observedBindingContext !== null)
                                for (var i = 0, len = this.controls.length; i < len; i++) {
                                    var controlWidget = this.controls[i].OpenAjax;
                                    controlWidget.attachToObservedContext(this.authoringAreaBindingContext)
                                }
                            else
                                this.runBindingContextDataFlow(this.authoringAreaBindingContext)
                        }, ReplicatedContextManager.prototype._addControlToParentBindingContext = function(parentBindingContext, control) {
                            var _this = this;
                            this.forEachChildBindingContext(parentBindingContext, function(bindingContext) {
                                return _this.allocateControlContext(bindingContext, control)
                            });
                            this.forEachChildBindingContext(parentBindingContext, function(bindingContext) {
                                return _this.initializeControlContext(bindingContext, control)
                            });
                            parentBindingContext.isTemplate || this._notifyOutputTableChanged(parentBindingContext)
                        }, ReplicatedContextManager.prototype._renameControlInParentBindingContext = function(parentBindingContext, oldControlId, newControlId) {
                            var _this = this;
                            this.forEachChildBindingContext(parentBindingContext, function(bindingContext) {
                                return _this.renameControlInBindingContext(bindingContext, oldControlId, newControlId)
                            })
                        }, ReplicatedContextManager.prototype._removeControlFromParentBindingContext = function(parentBindingContext, control) {
                            var _this = this;
                            this.forEachChildBindingContext(parentBindingContext, function(bindingContext) {
                                return _this.removeControlFromBindingContext(bindingContext, control)
                            });
                            this._notifyOutputTableChanged(parentBindingContext)
                        }, ReplicatedContextManager.prototype._notifyOutputTableChanged = function(parentBindingContext) {
                            this._getReplicatedContext(parentBindingContext).notifyOutputTableChanged()
                        }, ReplicatedContextManager.prototype._getReplicatedContext = function(parentBindingContext) {
                            return parentBindingContext.replicatedContexts[this.managerId]
                        }, ReplicatedContextManager.prototype._initializeReplicatedContexts = function() {
                            var _this = this;
                            this.forEachParentBindingContext(function(parentBindingContext) {
                                return new Controls.ReplicatedContext(_this, parentBindingContext)
                            })
                        }, ReplicatedContextManager.create = function(controlWidget, notifyOutputTableChangedFn, notifySelectedItemsChangedFn, notifyOutputRowChangedFn, runBindingContextDataFlowFn, runOptimizedReplicatedDataFlowFn) {
                            var parentManager = Controls.ContextManager.getParentManager(controlWidget.getControlInfo());
                            return new ReplicatedContextManager(parentManager || Controls.GlobalContextManager.instance, controlWidget, notifyOutputTableChangedFn, notifySelectedItemsChangedFn, notifyOutputRowChangedFn, runBindingContextDataFlowFn, runOptimizedReplicatedDataFlowFn)
                        }, ReplicatedContextManager.realizeRowView = function(container, bindingContext) {
                            bindingContext.container = container;
                            for (var controlId in bindingContext.controlContexts)
                                Controls.ContextManager.realizeControlView(bindingContext.controlContexts[controlId], bindingContext);
                            bindingContext.realized = !0
                        }, ReplicatedContextManager.unrealizeRowView = function(bindingContext) {
                            for (var controlId in bindingContext.controlContexts)
                                Controls.ContextManager.unrealizeControlView(bindingContext.controlContexts[controlId]);
                            bindingContext.container = null;
                            bindingContext.realized = !1
                        }, ReplicatedContextManager
            }(Controls.ContextManager);
        Controls.ReplicatedContextManager = ReplicatedContextManager
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var Core = WinJS,
            MaximumZindex = AppMagic.Constants.zIndex.visualMaximum,
            util = AppMagic.Utility,
            converters = AppMagic.Controls.converters,
            ControlWidget = function() {
                function ControlWidget(controlId, control, icontrol, ctrlMgr, onValueChangedFn, runOptimizedReplicatedDataFlowFn, onEventFn, entityPropertyChangedFn, updatePropertyRuleFn, activeScreenIndex) {
                    this._control = control;
                    this._icontrol = icontrol;
                    this._id = controlId;
                    this._mode = ko.observable("view");
                    this._ctrlMgr = ctrlMgr;
                    this._thisItemInputInvariantName = this._icontrol.template.thisItemInputInvariantName;
                    this._autoBorders = icontrol.template.autoBorders;
                    this._autoFill = icontrol.template.autoFill;
                    this._autoViewState = icontrol.template.autoViewState;
                    this._screenActiveAware = icontrol.template.screenActiveAware;
                    this._onValueChangedFn = onValueChangedFn;
                    this._runOptimizedReplicatedDataFlowFn = runOptimizedReplicatedDataFlowFn;
                    this._onEventFn = onEventFn;
                    this._entityPropertyChangedFn = entityPropertyChangedFn;
                    this._updatePropertyRuleFn = updatePropertyRuleFn;
                    this._activeScreenIndex = activeScreenIndex;
                    this._nestedViewContainerWidget = null;
                    this._isLoaded = !0;
                    this._isReplicable = icontrol.isReplicable;
                    this._isAuthorable = AppMagic.AuthoringTool.Runtime.isAuthoring && icontrol.template.authorableVisual;
                    this._initReplicatedContextInterface();
                    this._initControlProperties()
                }
                return Object.defineProperty(ControlWidget.prototype, "controlProperties", {
                        get: function() {
                            return this._controlPropertyMap
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ControlWidget.prototype, "controlManager", {
                        get: function() {
                            return this._ctrlMgr
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ControlWidget.prototype, "contextManager", {
                            get: function() {
                                return this._contextManager
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ControlWidget.prototype, "replicatedContextManager", {
                            get: function() {
                                return this._contextManager
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ControlWidget.prototype, "parentReplicatedContextManager", {
                            get: function() {
                                return this._parentContextManager
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ControlWidget.prototype, "isReplicable", {
                            get: function() {
                                return this._isReplicable
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ControlWidget.prototype, "replicatedContextInterface", {
                            get: function() {
                                return this._replicatedContextInterface
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ControlWidget.prototype, "globalControlContext", {
                            get: function() {
                                return this._getControlContext(Controls.GlobalContextManager.bindingContext)
                            }, enumerable: !0, configurable: !0
                        }), ControlWidget.prototype.isEditable = function(controlContext) {
                            return !this._isReplicable || this._authoringAreaControlContext === controlContext
                        }, ControlWidget.prototype.getControlInfo = function() {
                            return this._icontrol
                        }, ControlWidget.prototype.getId = function() {
                            return this._id
                        }, ControlWidget.prototype.getAvailableSize = function(){}, ControlWidget.prototype.getSize = function(){}, ControlWidget.prototype.requestSizeChange = function(size){}, ControlWidget.prototype.getMode = function() {
                            var mode = this._mode();
                            return mode
                        }, Object.defineProperty(ControlWidget.prototype, "mode", {
                            get: function() {
                                return this._mode
                            }, enumerable: !0, configurable: !0
                        }), ControlWidget.prototype.updateId = function(newControlId) {
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.updateControlId(newControlId)
                            });
                            var oldControlId = this._id;
                            this._id = newControlId;
                            this._parentContextManager.updateControlId(oldControlId, newControlId)
                        }, ControlWidget.prototype.requestModeChange = function(mode) {
                            if (mode !== "help" && mode !== "edit" && mode !== "view")
                                throw OpenAjax.widget.Error.BadParameters;
                            var evt = {
                                    oldMode: this._mode(), newMode: mode, renderedBy: "host"
                                };
                            if (this._mode(mode), typeof this._control.onModeChanged == "function")
                                this._control.onModeChanged(evt, this._authoringAreaControlContext)
                        }, ControlWidget.prototype.isParentDisabled = function(controlContext) {
                            var parentControlWidget = controlContext.bindingContext.rcManager.getControlWidget();
                            if (!parentControlWidget)
                                return !1;
                            var parentControlContext = parentControlWidget._getControlContext(controlContext.bindingContext.parent);
                            return typeof parentControlContext.properties.Disabled != "function" ? !1 : parentControlContext.properties.Disabled() || parentControlWidget.isParentDisabled(parentControlContext)
                        }, ControlWidget.prototype.notifyNestedReachabilityChangedInternal = function() {
                            this.replicatedContextManager.setNestedReachabilityChanged()
                        }, ControlWidget.prototype.initReplicatedContextManager = function(notifyOutputTableChangedFn, notifySelectedItemsChangedFn, notifyOutputRowChangedFn) {
                            var _this = this;
                            this._contextManager = Controls.ReplicatedContextManager.create(this, notifyOutputTableChangedFn, notifySelectedItemsChangedFn, function(bindingContext, rowId, outputRow) {
                                notifyOutputRowChangedFn(_this._getControlContext(bindingContext), rowId, outputRow)
                            }, this._runBindingContextDataFlow.bind(this), this._runOptimizedReplicatedDataFlowFn)
                        }, ControlWidget.prototype.disposeReplicatedContextManager = function() {
                            this._contextManager.dispose();
                            this._contextManager = null
                        }, ControlWidget.prototype.initializeControl = function(container) {
                            if (this._parentContextManager = Controls.ContextManager.getParentManager(this.getControlInfo()), this._icontrol.template.viewContainer) {
                                var parentWidget = this._parentContextManager.getControlWidget();
                                parentWidget._nestedViewContainerWidget = this
                            }
                            var bindingContext = this._parentContextManager.authoringAreaBindingContext;
                            this._initControlProperties();
                            this._initializeControlInternal(container, bindingContext);
                            AppMagic.AuthoringTool.Runtime.isAuthoring && this._initBoundsProperties(bindingContext)
                        }, ControlWidget.prototype.removeControl = function() {
                            this._parentContextManager.removeControl(this._control);
                            this._isLoaded = !1
                        }, ControlWidget.prototype.getPropertyValue = function(propertyName, bindingContext) {
                            bindingContext || (bindingContext = Controls.GlobalContextManager.bindingContext);
                            var controlProperty = this._controlPropertyMap[propertyName];
                            var controlContext;
                            if (bindingContext === Controls.GlobalContextManager.bindingContext && this._isReplicable)
                                controlContext = this._authoringAreaControlContext;
                            else
                                for (controlContext = this._getControlContext(bindingContext); !controlContext; )
                                    bindingContext = bindingContext.parent,
                                    controlContext = this._getControlContext(bindingContext);
                            var beforeGetEventName = "onBeforeGet" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                            if (typeof this._control[beforeGetEventName] == "function") {
                                var evt = {
                                        property: propertyName, self: !0
                                    };
                                this._control[beforeGetEventName](evt, controlContext)
                            }
                            return controlProperty.getValue(controlContext)
                        }, ControlWidget.prototype.attachToObservedContext = function(bindingContext) {
                            var controlContext = this._getControlContext(bindingContext);
                            var observedControlContext = this._getControlContext(bindingContext.observedBindingContext);
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.attachTemplateControlContext(observedControlContext, controlContext)
                            })
                        }, ControlWidget.prototype.detachFromObservedContext = function() {
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.detachTemplateControlContext()
                            })
                        }, ControlWidget.prototype.setPropertyLambdaInternal = function(propertyName, valueFn, context) {
                            var _this = this;
                            this._forEachBindingContext(context, function(bindingContext) {
                                bindingContext.observedBindingContext || _this.setPropertyValueInternal(propertyName, valueFn(bindingContext), bindingContext)
                            })
                        }, ControlWidget.prototype.applyLambdaInternal = function(fn, context) {
                            this._forEachBindingContext(context, function(bindingContext) {
                                bindingContext.observedBindingContext || fn(bindingContext)
                            })
                        }, ControlWidget.prototype.notifyOutputPropertyValueChanged = function(propertyName, bindingContext) {
                            (typeof bindingContext == "undefined" || bindingContext === null) && (bindingContext = Controls.GlobalContextManager.bindingContext);
                            this._notifyOutputPropertyValueChangedInternal(propertyName, bindingContext)
                        }, ControlWidget.prototype.setPropertyValue = function(propertyName, value, bindingContext, skipCompare) {
                            var controlProperty = this._controlPropertyMap[propertyName];
                            if (this._icontrol.template.hasInputInvariant(propertyName))
                                throw"Controls can not set their own input properties.";
                            this.setPropertyValueInternal(propertyName, value, bindingContext, skipCompare)
                        }, ControlWidget.prototype.setPropertyValueInternal = function(propertyName, value, bindingContext, skipCompare) {
                            if ((!bindingContext || !bindingContext.disposed) && this._isLoaded) {
                                typeof value == "undefined" && (value = null);
                                (typeof bindingContext == "undefined" || bindingContext === null) && (bindingContext = Controls.GlobalContextManager.bindingContext);
                                skipCompare = !!skipCompare;
                                var controlContext = this._getControlContext(bindingContext);
                                var controlProperty = this._controlPropertyMap[propertyName];
                                var oldValue = controlProperty.getValue(controlContext);
                                (skipCompare || !AppMagic.Utility.deepCompare(oldValue, value)) && controlProperty.setValue(controlContext, value)
                            }
                        }, ControlWidget.prototype.updatePropertyValue = function(propertyName, propertyValue) {
                            AppMagic.AuthoringTool.Runtime.isAuthoring && this._updatePropertyRuleFn && this._updatePropertyRuleFn(this._id, propertyName, propertyValue)
                        }, ControlWidget.prototype.fireEvent = function(evtName, controlContext) {
                            var _this = this;
                            typeof controlContext == "undefined" && (controlContext = this._getControlContext(Controls.GlobalContextManager.bindingContext));
                            setImmediate(function() {
                                _this._isLoaded && (_this._isReplicable && controlContext.isTemplate ? _this._runInAssociated0thContext(controlContext, function(row0ControlContext) {
                                    _this._onEventFn(_this._id, evtName, row0ControlContext.bindingContext)
                                }) : _this._onEventFn(_this._id, evtName, controlContext.bindingContext))
                            })
                        }, ControlWidget.prototype.getPropertyNames = function(){}, ControlWidget.prototype.getMsg = function(key){}, ControlWidget.prototype.rewriteURI = function(uri){}, ControlWidget.prototype._forEachProperty = function(fn) {
                            for (var propertyName in this._controlPropertyMap) {
                                var controlProperty = this._controlPropertyMap[propertyName];
                                fn(controlProperty)
                            }
                        }, ControlWidget.prototype._initReplicatedContextInterface = function() {
                            var _this = this;
                            this._authoringAreaControlContext = null;
                            this._replicatedContextInterface = {
                                newControlContext: function(bindingContext) {
                                    var controlContext = _this._createNewControlContextInternal(bindingContext);
                                    return controlContext.isTemplate = bindingContext.isTemplate, _this._initializeProperties(controlContext), controlContext.isTemplate && (_this._authoringAreaControlContext = controlContext), controlContext
                                }, recycleControlContext: function(controlContext, isTemplate) {
                                        _this._recycleProperties(controlContext);
                                        controlContext.isTemplate = isTemplate;
                                        controlContext.isTemplate && (_this._authoringAreaControlContext = controlContext)
                                    }, initControlContext: function(controlContext) {
                                        typeof _this._control.initControlContext == "function" && _this._control.initControlContext(controlContext)
                                    }, disposeControlContext: function(controlContext) {
                                        typeof _this._control.disposeControlContext == "function" && _this._control.disposeControlContext(controlContext)
                                    }, createView: function(controlContext) {
                                        var container = controlContext._outerContainer = document.createElement("div");
                                        controlContext.bindingContext.container.appendChild(controlContext._outerContainer);
                                        _this._promotePropertiesForView(controlContext);
                                        _this._createView(container, controlContext);
                                        var props = controlContext.modelProperties;
                                        if (typeof props.X != "undefined") {
                                            var containerStyle = container.style;
                                            container.className = "appmagic-control-view";
                                            containerStyle.position = "absolute";
                                            var updateX = function() {
                                                    containerStyle.left = (props.X.getValue() || 0) + "px"
                                                },
                                                updateY = function() {
                                                    containerStyle.top = (props.Y.getValue() || 0) + "px"
                                                },
                                                updateWidth = function() {
                                                    containerStyle.width = (props.Width.getValue() || 0) + "px"
                                                },
                                                updateHeight = function() {
                                                    containerStyle.height = (props.Height.getValue() || 0) + "px"
                                                },
                                                updateZindex = function() {
                                                    containerStyle.zIndex = (MaximumZindex - props.ZIndex.getValue() - 1).toString()
                                                },
                                                updateVisible = function() {
                                                    containerStyle.display = props.Visible.getValue() ? "" : "none"
                                                };
                                            updateX();
                                            updateY();
                                            updateWidth();
                                            updateHeight();
                                            updateZindex();
                                            updateVisible();
                                            _this._subscribe(controlContext, props.X.modelObservable, updateX);
                                            _this._subscribe(controlContext, props.Y.modelObservable, updateY);
                                            _this._subscribe(controlContext, props.Width.modelObservable, updateWidth);
                                            _this._subscribe(controlContext, props.Height.modelObservable, updateHeight);
                                            _this._subscribe(controlContext, props.ZIndex.modelObservable, updateZindex);
                                            _this._subscribe(controlContext, props.Visible.modelObservable, updateVisible)
                                        }
                                    }, destroyView: function(controlContext) {
                                        var bindingContext = controlContext.bindingContext;
                                        controlContext.isTemplate || (bindingContext.container.removeChild(controlContext._outerContainer), controlContext._outerContainer = null);
                                        _this._disposeViewSubscriptions(controlContext);
                                        _this._destroyView(controlContext);
                                        _this._demotePropertiesForView(controlContext)
                                    }
                            }
                        }, ControlWidget.prototype._subscribe = function(controlContext, observable, onPropertyUpdateFunction) {
                            controlContext._subscriptions.push(observable.subscribe(onPropertyUpdateFunction))
                        }, ControlWidget.prototype._disposeViewSubscriptions = function(controlContext) {
                            if (!controlContext.isTemplate) {
                                for (var i = 0, l = controlContext._subscriptions.length; i < l; i++) {
                                    var subscription = controlContext._subscriptions[i];
                                    subscription.dispose()
                                }
                                controlContext._subscriptions = []
                            }
                        }, ControlWidget.prototype._initializeBehavior = function(behavior, controlContext) {
                            var _this = this;
                            util.createPrivateImmutable(controlContext.behaviors, behavior.propertyInvariantName, function() {
                                var disabled = controlContext.modelProperties.Disabled;
                                return typeof disabled != "undefined" && disabled.getValue() || _this.fireEvent(behavior.propertyInvariantName, controlContext), !0
                            })
                        }, ControlWidget.prototype._initializeProperty = function(property, controlContext) {
                            var controlProperty = this._controlPropertyMap[property.propertyInvariantName];
                            controlProperty.initProperty(controlContext);
                            controlContext.isTemplate && this._entityPropertyChangedFn && this._entityPropertyChangedFn(this._id, property.propertyInvariantName, controlProperty.getValue(controlContext))
                        }, ControlWidget.prototype._recycleProperties = function(controlContext) {
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.recycleProperty(controlContext)
                            })
                        }, ControlWidget.prototype._initializeProperties = function(controlContext) {
                            var _this = this;
                            util.createPrivateImmutable(controlContext, "properties", {});
                            util.createPrivateImmutable(controlContext, "behaviors", {});
                            this._icontrol.template.dataProperties.map(function(property) {
                                return _this._initializeProperty(property, controlContext)
                            });
                            this._icontrol.template.designProperties.map(function(property) {
                                return _this._initializeProperty(property, controlContext)
                            });
                            for (var behaviors = this._icontrol.template.behaviorProperties, i = 0, len = behaviors.length; i < len; i++)
                                this._initializeBehavior(behaviors[i], controlContext)
                        }, ControlWidget.prototype._handleBeforePropertyValueChanged = function(controlContext, propertyName, oldValue, value) {
                            var evt = {
                                    property: propertyName, oldValue: oldValue, newValue: value, self: !0
                                },
                                beforeChangeEventName = "onBeforeChange" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                            typeof this._control[beforeChangeEventName] == "function" && this._control[beforeChangeEventName](evt, controlContext)
                        }, ControlWidget.prototype._handlePropertyValueChanged = function(controlContext, propertyName, oldValue, value) {
                            var _this = this;
                            var evt = {
                                    property: propertyName, oldValue: oldValue, newValue: value, self: !0
                                };
                            if (typeof this._control.onChange == "function")
                                this._control.onChange(evt, controlContext);
                            var changeEventName = "onChange" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                            typeof this._control[changeEventName] == "function" && this._control[changeEventName](evt, controlContext);
                            this._notifyOutputPropertyValueChangedInternal(propertyName, controlContext.bindingContext || Controls.GlobalContextManager.bindingContext, value);
                            this._isReplicable && (controlContext.bindingContext.isTemplate || this._parentContextManager.notifyOutputRowChanged(controlContext.bindingContext.parent, controlContext.bindingContext.id), this._parentContextManager.notifyOutputTableChanged(controlContext.bindingContext.parent));
                            this._isReplicable && controlContext.isTemplate && this._runInAssociated0thContext(controlContext, function(row0ControlContext) {
                                var controlProperty = _this._controlPropertyMap[propertyName];
                                controlProperty.setValue(row0ControlContext, value)
                            });
                            controlContext.isTemplate && this._entityPropertyChangedFn && this._entityPropertyChangedFn(this._id, propertyName, value)
                        }, ControlWidget.prototype._notifyOutputPropertyValueChangedInternal = function(propertyName, bindingContext, value) {
                            typeof value == "undefined" && (value = null);
                            this._icontrol.template.hasOutputInvariant(propertyName) && this._onValueChangedFn(this._id, propertyName, value, bindingContext)
                        }, ControlWidget.prototype._runInAssociated0thContext = function(controlContext, fn) {
                            var parentBindingContext = controlContext.bindingContext.parent;
                            var parentReplicatedContext = this.parentReplicatedContextManager.replicatedContextFor(parentBindingContext);
                            if (this.parentReplicatedContextManager.isLoaded && parentReplicatedContext.getBindingContextCount() > 0) {
                                var row0ControlContext = this._getControlContext(parentReplicatedContext.bindingContextAt(0));
                                fn(row0ControlContext)
                            }
                        }, ControlWidget.prototype._injectTemplateContent = function(container) {
                            var content = this._icontrol.template.content;
                            content = content.replace(/__WID__/g, this._id);
                            Core.Utilities.setInnerHTMLUnsafe(container, content)
                        }, ControlWidget.prototype._getControlContext = function(bindingContext) {
                            return bindingContext.controlContexts[this._id] || null
                        }, ControlWidget.prototype._promotePropertiesForView = function(controlContext) {
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.promotePropertyForView(controlContext)
                            })
                        }, ControlWidget.prototype._createView = function(container, controlContext) {
                            if ((this._autoBorders || this._autoFill) && (container = this._injectAutoBorderFill(container)), this._autoViewState && (this._initializeViewState(container, controlContext), this._initializeAutoProperties(controlContext)), this._autoBorders && this._initializeBorders(container, controlContext), this._autoFill && this._initializeFill(container, controlContext), this._injectTemplateContent(container), controlContext.container = container, controlContext.realized = !0, this._parentContextManager !== Controls.GlobalContextManager.instance) {
                                var parentReplicatedContext = this.parentReplicatedContextManager.replicatedContextFor(controlContext.bindingContext.parent);
                                controlContext._containerClickListener = function() {
                                    if (parentReplicatedContext.getBindingContextCount() > 0) {
                                        var rowBindingContext = controlContext.isTemplate ? parentReplicatedContext.bindingContextAt(0) : controlContext.bindingContext;
                                        parentReplicatedContext.notifyBindingContextSelectionInteraction(rowBindingContext, !1)
                                    }
                                };
                                container.addEventListener("click", controlContext._containerClickListener)
                            }
                            typeof this._control.initView == "function" && this._control.initView(container, controlContext)
                        }, ControlWidget.prototype._initializeViewState = function(container, controlContext) {
                            var _this = this;
                            var viewState = controlContext.viewState = {
                                    hovering: ko.observable(!1), pressed: ko.observable(!1), disabled: ko.computed(function() {
                                            return controlContext.properties.Disabled() || _this.isParentDisabled(controlContext)
                                        }), _container: container, _onPointerDown: function() {
                                            return viewState.pressed(!0)
                                        }, _onPointerUp: function() {
                                            return viewState.pressed(!1)
                                        }, _onPointerOver: function(evt) {
                                            evt.pointerType !== "touch" && viewState.hovering(!0)
                                        }, _onPointerOut: function(evt) {
                                            evt.pointerType !== "touch" && viewState.hovering(!1);
                                            viewState.pressed(!1)
                                        }
                                };
                            container.addEventListener("pointerdown", viewState._onPointerDown, !1);
                            container.addEventListener("pointerup", viewState._onPointerUp, !1);
                            container.addEventListener("pointerover", viewState._onPointerOver, !1);
                            container.addEventListener("pointerout", viewState._onPointerOut, !1)
                        }, ControlWidget.prototype._disposeViewState = function(container, controlContext) {
                            var viewState = controlContext.viewState;
                            viewState.hovering = null;
                            viewState.pressed = null;
                            viewState.disabled.dispose();
                            viewState.disabled = null;
                            container.removeEventListener("pointerdown", viewState._onPointerDown);
                            container.removeEventListener("pointerup", viewState._onPointerUp);
                            container.removeEventListener("pointerover", viewState._onPointerOver);
                            container.removeEventListener("pointerout", viewState._onPointerOut);
                            viewState._onPointerDown = null;
                            viewState._onPointerUp = null;
                            viewState._onPointerOver = null;
                            viewState._onPointerOut = null;
                            controlContext.viewState = null
                        }, ControlWidget.prototype._initializeAutoProperties = function(controlContext) {
                            controlContext.autoProperties = {};
                            ko.isObservable(controlContext.properties.Fill) && (ko.isObservable(controlContext.properties.DisabledFill) || ko.isObservable(controlContext.properties.PressedFill) || ko.isObservable(controlContext.properties.HoverFill)) && (controlContext.autoProperties.Fill = ko.computed(function() {
                                var fill = null;
                                return (controlContext.viewState.disabled() ? ko.isObservable(controlContext.properties.DisabledFill) && (fill = controlContext.properties.DisabledFill()) : controlContext.viewState.pressed() ? ko.isObservable(controlContext.properties.PressedFill) && (fill = controlContext.properties.PressedFill()) : controlContext.viewState.hovering() && ko.isObservable(controlContext.properties.HoverFill) && (fill = controlContext.properties.HoverFill()), fill === null) ? controlContext.properties.Fill() : fill
                            }));
                            ko.isObservable(controlContext.properties.Color) && (ko.isObservable(controlContext.properties.DisabledColor) || ko.isObservable(controlContext.properties.PressedColor) || ko.isObservable(controlContext.properties.HoverColor)) && (controlContext.autoProperties.Color = ko.computed(function() {
                                var color = null;
                                return (controlContext.viewState.disabled() ? ko.isObservable(controlContext.properties.DisabledColor) && (color = controlContext.properties.DisabledColor()) : controlContext.viewState.pressed() ? ko.isObservable(controlContext.properties.PressedColor) && (color = controlContext.properties.PressedColor()) : controlContext.viewState.hovering() && ko.isObservable(controlContext.properties.HoverColor) && (color = controlContext.properties.HoverColor()), color === null) ? controlContext.properties.Color() : color
                            }))
                        }, ControlWidget.prototype._disposeAutoProperties = function(controlContext) {
                            ko.isComputed(controlContext.autoProperties.Fill) && (controlContext.autoProperties.Fill.dispose(), controlContext.autoProperties.Fill = null);
                            ko.isComputed(controlContext.autoProperties.Color) && (controlContext.autoProperties.Color.dispose(), controlContext.autoProperties.Color = null)
                        }, ControlWidget.prototype._injectAutoBorderFill = function(container) {
                            var borderFillContainer = document.createElement("div");
                            borderFillContainer.className = ControlWidget._borderFillClassName;
                            container.appendChild(borderFillContainer);
                            var hideOverflowContainer = document.createElement("div");
                            return hideOverflowContainer.className = "appmagic-hideoverflow", borderFillContainer.appendChild(hideOverflowContainer), hideOverflowContainer
                        }, ControlWidget.prototype._initializeBorders = function(container, controlContext) {
                            var borderContainer = container.parentElement;
                            var props = controlContext.modelProperties;
                            var updateBorderStyleAndThickness = function() {
                                    var borderWidth = props.BorderThickness.getValue(),
                                        borderStyle = converters.borderStyleConverter.view(props.BorderStyle.getValue());
                                    if (borderContainer.style.borderStyle = borderStyle, borderStyle === "none" || borderWidth === null) {
                                        borderContainer.style.borderWidth = converters.pxConverter.view(0);
                                        borderContainer.style.margin = converters.pxConverter.view(0);
                                        return
                                    }
                                    borderContainer.style.borderWidth = converters.pxConverter.view(borderWidth);
                                    borderContainer.style.margin = "-" + converters.pxConverter.view(borderWidth)
                                },
                                updateBorderColor;
                            if (this._autoViewState) {
                                var viewState = controlContext.viewState;
                                updateBorderColor = function() {
                                    var borderColor;
                                    borderColor = controlContext.viewState.disabled() ? converters.argbConverter.view(props.DisabledBorderColor.getValue()) : controlContext.viewState.pressed() ? converters.argbConverter.view(props.PressedBorderColor.getValue()) : controlContext.viewState.hovering() ? converters.argbConverter.view(props.HoverBorderColor.getValue()) : converters.argbConverter.view(props.BorderColor.getValue());
                                    borderContainer.style.borderColor = borderColor || "rgba(0, 0, 0, 1)"
                                };
                                this._subscribe(controlContext, props.HoverBorderColor.modelObservable, updateBorderColor);
                                this._subscribe(controlContext, props.PressedBorderColor.modelObservable, updateBorderColor);
                                this._subscribe(controlContext, props.DisabledBorderColor.modelObservable, updateBorderColor);
                                this._subscribe(controlContext, viewState.hovering, updateBorderColor);
                                this._subscribe(controlContext, viewState.pressed, updateBorderColor);
                                this._subscribe(controlContext, viewState.disabled, updateBorderColor)
                            }
                            else
                                updateBorderColor = function() {
                                    return borderContainer.style.borderColor = converters.argbConverter.view(props.BorderColor.getValue()) || "rgba(0, 0, 0, 1)"
                                };
                            this._subscribe(controlContext, props.BorderStyle.modelObservable, updateBorderStyleAndThickness);
                            this._subscribe(controlContext, props.BorderThickness.modelObservable, updateBorderStyleAndThickness);
                            this._subscribe(controlContext, props.BorderColor.modelObservable, updateBorderColor);
                            updateBorderStyleAndThickness();
                            updateBorderColor()
                        }, ControlWidget.prototype._initializeFill = function(container, controlContext) {
                            var fillContainer = container.parentElement;
                            var props = controlContext.modelProperties;
                            var updateFillColor;
                            if (this._autoViewState) {
                                var viewState = controlContext.viewState;
                                updateFillColor = function() {
                                    var fillColor;
                                    fillColor = controlContext.viewState.disabled() ? converters.argbConverter.view(props.DisabledFill.getValue()) : controlContext.viewState.pressed() ? converters.argbConverter.view(props.PressedFill.getValue()) : controlContext.viewState.hovering() ? converters.argbConverter.view(props.HoverFill.getValue()) : converters.argbConverter.view(props.Fill.getValue());
                                    fillContainer.style.backgroundColor = fillColor || "rgba(0, 0, 0, 1)"
                                };
                                this._subscribe(controlContext, props.HoverFill.modelObservable, updateFillColor);
                                this._subscribe(controlContext, props.PressedFill.modelObservable, updateFillColor);
                                this._subscribe(controlContext, props.DisabledFill.modelObservable, updateFillColor);
                                this._subscribe(controlContext, viewState.hovering, updateFillColor);
                                this._subscribe(controlContext, viewState.pressed, updateFillColor);
                                this._subscribe(controlContext, viewState.disabled, updateFillColor)
                            }
                            else
                                updateFillColor = function() {
                                    fillContainer.style.backgroundColor = converters.argbConverter.view(controlContext.modelProperties.Fill.getValue()) || "rgba(0, 0, 0, 1)"
                                };
                            this._subscribe(controlContext, props.Fill.modelObservable, updateFillColor);
                            updateFillColor()
                        }, ControlWidget.prototype._demotePropertiesForView = function(controlContext) {
                            this._forEachProperty(function(controlProperty) {
                                return controlProperty.demotePropertyForView(controlContext)
                            })
                        }, ControlWidget.prototype._destroyView = function(controlContext) {
                            typeof this._control.disposeView == "function" && this._control.disposeView(controlContext.container, controlContext);
                            this._autoViewState && (this._disposeViewState(controlContext.container, controlContext), this._disposeAutoProperties(controlContext));
                            controlContext._containerClickListener && (controlContext.container.removeEventListener("click", controlContext._containerClickListener), controlContext._containerClickListener = null);
                            var container = controlContext.container;
                            if (this._autoBorders) {
                                var borderContainer = container.parentElement;
                                container = borderContainer.parentElement
                            }
                            ko.cleanNode(container);
                            Core.Utilities.setInnerHTMLUnsafe(container, "")
                        }, ControlWidget.prototype._initializeControlInternal = function(container, bindingContext) {
                            typeof this._control.onLoad == "function" && this._control.onLoad();
                            this._parentContextManager.addControl(this._control);
                            var controlContext = this._getControlContext(bindingContext);
                            if (this._promotePropertiesForView(controlContext), this._icontrol.template.viewContainer) {
                                var parentWidget = this._parentContextManager.getControlWidget();
                                if (parentWidget._control.getTemplateContainer) {
                                    var parentTemplateControlContext = parentWidget._getControlContext(bindingContext.parent);
                                    var templateContainer = parentWidget._control.getTemplateContainer(parentTemplateControlContext);
                                    container = document.createElement("div");
                                    templateContainer.appendChild(container)
                                }
                            }
                            container && this._createView(container, controlContext)
                        }, ControlWidget.prototype._createNewControlContextInternal = function(bindingContext) {
                            var isParentScreenActive = null;
                            return this._screenActiveAware && (isParentScreenActive = ko.computed(function() {
                                    return this._activeScreenIndex() === this._icontrol.topParentOrSelf.index
                                }.bind(this))), {
                                    isViewContainer: this._icontrol.template.viewContainer, isParentScreenActive: isParentScreenActive, viewState: null, autoProperties: null, controlWidget: this, bindingContext: bindingContext, container: null, realized: !1, _outerContainer: null, _subscriptions: [], _containerClickListener: null
                                }
                        }, ControlWidget.prototype._initBoundsProperties = function(bindingContext) {
                            for (var _this = this, controlContext = this._getControlContext(bindingContext), boundsProperties = this._icontrol.template.defaultProperties, i = 0, len = boundsProperties.length; i < len; i++) {
                                var boundsPropertyName = boundsProperties[i];
                                boundsPropertyName in controlContext.properties && function(propertyName) {
                                    controlContext.properties[propertyName].subscribe(function(value) {
                                        return AppMagic.context.documentViewModel.getVisualByName(_this._id).updateBounds(propertyName, value)
                                    })
                                }(boundsPropertyName)
                            }
                        }, ControlWidget.prototype._runBindingContextDataFlow = function(bindingContextArray) {
                            this._thisItemInputInvariantName && this._thisItemInputInvariantName !== "" && this._onValueChangedFn(this._id, this._thisItemInputInvariantName, null, bindingContextArray)
                        }, ControlWidget.prototype._initControlProperties = function() {
                            var _this = this;
                            this._controlPropertyMap = {};
                            var template = this._icontrol.template,
                                setupProperty = function(property) {
                                    _this._controlPropertyMap[property.propertyInvariantName] = new Controls.ControlProperty(_this._id, property, template.hasOutputInvariant(property.propertyInvariantName), _this._handleBeforePropertyValueChanged.bind(_this), _this._handlePropertyValueChanged.bind(_this))
                                };
                            template.dataProperties.map(setupProperty);
                            template.designProperties.map(setupProperty)
                        }, ControlWidget.prototype._forEachBindingContext = function(context, fn) {
                            if (context instanceof Array)
                                for (var i = 0, len = context.length; i < len; i++)
                                    this._parentContextManager.forEachManagedDescendingBindingContext(context[i], fn);
                            else
                                context === null && (context = Controls.GlobalContextManager.bindingContext),
                                this._parentContextManager.forEachManagedDescendingBindingContext(context, fn)
                        }, ControlWidget._borderFillClassName = "appmagic-borderfill-container", ControlWidget
            }();
        Controls.ControlWidget = ControlWidget
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
var AppMagic;
(function(AppMagic) {
    (function(Controls) {
        var globalInstance = null,
            globalBindingContext = null,
            GlobalContextManager = function(_super) {
                __extends(GlobalContextManager, _super);
                function GlobalContextManager() {
                    this.managerId = "globalContextManager";
                    this.authoringAreaBindingContext = globalBindingContext;
                    _super.call(this)
                }
                return GlobalContextManager.prototype.getControlWidget = function() {
                        return null
                    }, GlobalContextManager.prototype.forEachManagedDescendingBindingContext = function(bindingContext, fn) {
                        fn(bindingContext)
                    }, GlobalContextManager.prototype.notifyBindingContextSelectionInteraction = function(bindingContext, toggleAndPersist) {
                            return !1
                        }, GlobalContextManager.prototype.addSelectionChangedListener = function(bindingContext, listener){}, GlobalContextManager.prototype.addControl = function(control) {
                            this.emptyRecycleBin();
                            this.controls.push(control);
                            this.allocateControlContext(globalBindingContext, control);
                            this.initializeControlContext(globalBindingContext, control)
                        }, GlobalContextManager.prototype.updateControlId = function(oldControlId, newControlId) {
                            this.emptyRecycleBin();
                            this.renameControlInBindingContext(globalBindingContext, oldControlId, newControlId)
                        }, GlobalContextManager.prototype.removeControl = function(control) {
                            if (this.isLoaded) {
                                this.emptyRecycleBin();
                                var i = this.controls.indexOf(control);
                                this.controls.splice(i, 1);
                                this.removeControlFromBindingContext(globalBindingContext, control)
                            }
                        }, Object.defineProperty(GlobalContextManager, "bindingContext", {
                            get: function() {
                                return globalBindingContext
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(GlobalContextManager, "instance", {
                            get: function() {
                                return globalInstance
                            }, enumerable: !0, configurable: !0
                        }), GlobalContextManager
            }(Controls.ContextManager);
        Controls.GlobalContextManager = GlobalContextManager;
        globalBindingContext = {
            id: "root", parent: null, replicatedContexts: {}, controlContexts: {}, rcManager: null, thisItem: {}, inputRow: {}, outputRow: {}, container: null, realized: !1, isTemplate: !0
        };
        globalBindingContext.outputRow[AppMagic.Constants.Runtime.controlLocMapProperty] = {};
        globalInstance = globalBindingContext.rcManager = new GlobalContextManager
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
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
    (function(Controls) {
        var ObservableRectangle = function() {
                function ObservableRectangle(left, top, width, height) {
                    this._left = ko.observable(left);
                    this._top = ko.observable(top);
                    this._width = ko.observable(width);
                    this._height = ko.observable(height)
                }
                return Object.defineProperty(ObservableRectangle.prototype, "left", {
                        get: function() {
                            return this._left
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ObservableRectangle.prototype, "top", {
                        get: function() {
                            return this._top
                        }, enumerable: !0, configurable: !0
                    }), Object.defineProperty(ObservableRectangle.prototype, "width", {
                            get: function() {
                                return this._width
                            }, enumerable: !0, configurable: !0
                        }), Object.defineProperty(ObservableRectangle.prototype, "height", {
                            get: function() {
                                return this._height
                            }, enumerable: !0, configurable: !0
                        }), ObservableRectangle.prototype.set = function(left, top, width, height) {
                            this._left(left);
                            this._top(top);
                            this._width(width);
                            this._height(height)
                        }, ObservableRectangle
            }();
        Controls.ObservableRectangle = ObservableRectangle
    })(AppMagic.Controls || (AppMagic.Controls = {}));
    var Controls = AppMagic.Controls
})(AppMagic || (AppMagic = {}));
//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
