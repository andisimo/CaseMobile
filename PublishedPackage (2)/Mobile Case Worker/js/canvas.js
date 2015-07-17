//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var MaximumZindex = AppMagic.Constants.zIndex.visualMaximum;
    Core.Namespace.define("AppMagic.Publish.Canvas", {
        screens: [], _parentMap: {}, _requirementsManager: null, currentScreen: null, controlManager: null, addControl: function(createInfo) {
                AppMagic.Publish.Canvas.controlManager === null && (AppMagic.Publish.Canvas.controlManager = new AppMagic.Controls.ControlManager(new AppMagic.Controls.RequirementsManager));
                var container = document.createElement("div");
                container.id = this.buildContainerName(createInfo.name);
                container.className = "canvasContentDiv";
                container.style.position = "absolute";
                var initialScreenName = null,
                    template = createInfo.template;
                if (AppMagic.Utility.isScreen(template.className)) {
                    this.currentScreen === null && createInfo.index === 0 ? (this.currentScreen = initialScreenName = createInfo.name, AppMagic.AuthoringTool.Runtime.activeScreenIndex(this.currentScreen)) : container.style.display = "none";
                    var publishedCanvas = document.getElementById("publishedCanvas");
                    publishedCanvas.appendChild(container);
                    this.screens[createInfo.name] = createInfo.name;
                    container = null
                }
                else {
                    var controlParent = document.getElementById(this.buildNestedCanvasName(createInfo.parent.name, createInfo.index));
                    controlParent || (controlParent = document.getElementById(this.buildContainerName(createInfo.parent.name)));
                    controlParent.appendChild(container)
                }
                return this._parentMap[createInfo.name] = typeof createInfo.parent == "undefined" ? createInfo.parent : createInfo.parent.name, this._requirementsManager = this._requirementsManager || new AppMagic.Controls.RequirementsManager, this._requirementsManager.ensureRequirements(template.requirements).then(function() {
                            return AppMagic.Publish.Canvas.controlManager.create(container, createInfo, template)
                        }).then(function(control) {
                            if (AppMagic.Utility.isScreen(template.className)) {
                                if (initialScreenName) {
                                    var initialScreen = OpenAjax.widget.byId(initialScreenName);
                                    initialScreen.OpenAjax.fireEvent(AppMagic.AuthoringTool.OpenAjaxPropertyNames.OnVisible, initialScreen)
                                }
                            }
                            else if (template.positionable) {
                                var getPositioningProperty = control.OpenAjax._isReplicable ? function(propName) {
                                        return control.OpenAjax._authoringAreaControlContext.properties[propName]()
                                    } : function(propName) {
                                        return control.OpenAjax.globalControlContext.properties[propName]()
                                    },
                                    width = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.Width) + "px"
                                    }),
                                    updateWidth = function() {
                                        container.style.width = width()
                                    };
                                width.subscribe(updateWidth);
                                var height = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.Height) + "px"
                                    }),
                                    updateHeight = function() {
                                        container.style.height = height()
                                    };
                                height.subscribe(updateHeight);
                                var x = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.X) + "px"
                                    }),
                                    updateX = function() {
                                        container.style.left = x()
                                    };
                                x.subscribe(updateX);
                                var y = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.Y) + "px"
                                    }),
                                    updateY = function() {
                                        container.style.top = y()
                                    };
                                y.subscribe(updateY);
                                var zindex = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.ZIndex)
                                    }),
                                    updateZIndex = function() {
                                        container.style.zIndex = (MaximumZindex - zindex()).toString()
                                    };
                                zindex.subscribe(updateZIndex);
                                var visible = ko.computed(function() {
                                        return getPositioningProperty(AppMagic.AuthoringTool.OpenAjaxPropertyNames.Visible)
                                    }),
                                    updateVisible = function() {
                                        container.style.display = visible() ? "" : "none"
                                    };
                                visible.subscribe(updateVisible);
                                updateVisible()
                            }
                            return control
                        })
            }, getParentScreenName: function(controlName) {
                for (var screenName = controlName, parentName = this._parentMap[controlName]; parentName !== null && typeof parentName == "string"; )
                    screenName = parentName,
                    parentName = this._parentMap[parentName];
                return screenName
            }, buildContainerName: function(controlName) {
                return controlName + "container"
            }, buildNestedCanvasName: function(controlName, index) {
                return controlName + "nestedcanvas" + index.toString()
            }
    })
})(WinJS);