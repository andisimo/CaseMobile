//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(global, Core) {"use strict";
    var ControlManager = Core.Class.derive(AppMagic.Utility.Disposable, function ControlManager_ctor(requirementsMgr) {
            AppMagic.Utility.Disposable.call(this);
            this._controlInstances = Object.create(null);
            this._controlCreationWaitingPromises = Object.create(null);
            this._requirementsManager = requirementsMgr;
            OpenAjax.widget.setControlManager(this)
        }, {
            _controlCreationWaitingPromises: null, _controlInstances: null, _requirementsManager: null, _getOrCreateWaitingPromise: function(promiseLookup, controlName) {
                    if (controlName in promiseLookup)
                        return promiseLookup[controlName].promise;
                    var completedFunc,
                        waitingPromise = new Core.Promise(function(comp) {
                            completedFunc = comp
                        });
                    return promiseLookup[controlName] = {
                            promise: waitingPromise, completed: completedFunc
                        }, waitingPromise
                }, _completeWaitingPromise: function(promiseLookup, controlName, returnValue) {
                    controlName in promiseLookup && (promiseLookup[controlName].completed(returnValue), delete promiseLookup[controlName])
                }, controlInstances: {get: function() {
                        return this._controlInstances
                    }}, waitForControlCreation: function(controlName) {
                    return controlName in this._controlInstances ? Core.Promise.wrap(this._controlInstances[controlName]) : this._getOrCreateWaitingPromise(this._controlCreationWaitingPromises, controlName)
                }, create: function(container, icontrol) {
                    var parentName = null;
                    icontrol.parent && (parentName = icontrol.parent.name);
                    var ctrlName = icontrol.name,
                        template = icontrol.template;
                    return this._requirementsManager.ensureRequirements(template.requirements).then(function() {
                            var controlClassName = this.getClassName(template),
                                ctrl = AppMagic.Controls.ControlFactory.build(controlClassName, ctrlName, icontrol, this);
                            return ctrl.OpenAjax.initializeControl(container), this._controlInstances[ctrlName] = ctrl, this._completeWaitingPromise(this._controlCreationWaitingPromises, ctrlName, ctrl), ctrl
                        }.bind(this))
                }, getClassName: function(template) {
                    return template.className
                }, createNestedCanvas: function(parentVisualName, id, element, width, height) {
                    element.id = parentVisualName + "nestedcanvas" + id.toString()
                }, changeOutputType: function(){}, getInputDataType: function(controlId, propertyName) {
                    return "e"
                }, onSuspend: function(suspendState) {
                    for (var controlName in this._controlInstances) {
                        for (var control = this._controlInstances[controlName], inputData = Object.create(null), inputs = control.OpenAjax._icontrol.template.inputProperties, i = 0, len = inputs.length; i < len; i++)
                            if (inputs[i].propertyCategory !== 2) {
                                var propName = inputs[i].propertyName,
                                    propValue = control.OpenAjax.getPropertyValue(propName);
                                propValue && (inputData[propName] = propValue)
                            }
                        if (suspendState[controlName] = inputData, typeof control.onSuspend == "function") {
                            suspendState[controlName] = Object.create(null);
                            control.onSuspend(suspendState[controlName])
                        }
                    }
                }, onResume: function(resumeState) {
                    for (var controlName in this._controlInstances) {
                        var control = this._controlInstances[controlName];
                        var inputData;
                        if (typeof(inputData = resumeState[controlName]) != "undefined")
                            for (var inputName in inputData)
                                control.OpenAjax.setPropertyValueInternal(inputName, inputData[inputName], null);
                        if (typeof control.onResume == "function")
                            control.onResume(resumeState[controlName])
                    }
                }
        });
    Core.Namespace.define("AppMagic.Controls", {ControlManager: ControlManager});
    Core.Namespace.define("AppMagic.Controls.Shapes", {});
    Core.Namespace.define("AppMagic.Controls.ControlFactory", {build: function(className, ctrlName, icontrol, ctrlMgr, onValueChangedFn, runOptimizedReplicatedDataFlowFn, onEventFn, entityPropertyChangedFn, updatePropertyRuleFn) {
            typeof onValueChangedFn == "undefined" && (onValueChangedFn = AppMagic.AuthoringTool.Runtime.onValueChanged.bind(AppMagic.AuthoringTool.Runtime));
            typeof runOptimizedReplicatedDataFlowFn == "undefined" && (runOptimizedReplicatedDataFlowFn = AppMagic.AuthoringTool.Runtime.runOptimizedReplicatedDataFlow.bind(AppMagic.AuthoringTool.Runtime));
            typeof onEventFn == "undefined" && (onEventFn = AppMagic.AuthoringTool.Runtime.onEvent.bind(AppMagic.AuthoringTool.Runtime));
            typeof entityPropertyChangedFn == "undefined" && (entityPropertyChangedFn = AppMagic.context && AppMagic.context.document ? AppMagic.context.documentViewModel.notifyEntityPropertyChanged.bind(AppMagic.context.documentViewModel) : null);
            typeof updatePropertyRuleFn == "undefined" && (updatePropertyRuleFn = AppMagic.context && AppMagic.context.document ? AppMagic.context.documentViewModel.updatePropertyRule.bind(AppMagic.context.documentViewModel) : null);
            for (var CtrlCtor = global, fragments = className.split("."), len = fragments.length, i = 0; CtrlCtor && i < len; i++)
                CtrlCtor = CtrlCtor[fragments[i]];
            var ctrl = new CtrlCtor;
            return ctrl.OpenAjax = new AppMagic.Controls.ControlWidget(ctrlName, ctrl, icontrol, ctrlMgr, onValueChangedFn, runOptimizedReplicatedDataFlowFn, onEventFn, entityPropertyChangedFn, updatePropertyRuleFn, AppMagic.AuthoringTool.Runtime.activeScreenIndex), ctrl
        }});
    Core.Namespace.define("OpenAjax.widget", {
        _controlManager: null, setControlManager: function(controlManager) {
                OpenAjax.widget._controlManager = controlManager
            }, byId: function(wid) {
                if (typeof wid != "string")
                    throw OpenAjax.widget.Error.BadParameters;
                var widget = OpenAjax.widget._controlManager.controlInstances[wid];
                return typeof widget != "undefined" ? widget : null
            }, Error: {
                Inactive: "OpenAjax.widget.Error.Inactive", BadParameters: "OpenAjax.widget.Error.BadParameters"
            }
    })
})(this, WinJS);