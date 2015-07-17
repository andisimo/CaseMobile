//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var util = AppMagic.Utility,
        Listbox = Core.Class.define(function Listbox_ctor(){}, {
            initControlContext: function(controlContext) {
                var defaultValue = controlContext.modelProperties.Default.getValue();
                this._setDefaultValues(controlContext, defaultValue)
            }, initView: function(container, controlContext) {
                    var listboxViewModel = new AppMagic.Controls.ListboxViewModel(controlContext);
                    util.createOrSetPrivate(controlContext, "_listboxViewModel", listboxViewModel);
                    listboxViewModel._onChangeSelectedItems(controlContext);
                    var listbox = container.children[0];
                    listbox.id = listboxViewModel.id;
                    ko.applyBindings(listboxViewModel, container)
                }, onChangeItems: function(evt, controlContext) {
                    var defaultItem = controlContext.modelProperties.Default.getValue();
                    this._setDefaultValues(controlContext, defaultItem)
                }, onChangeDefault: function(evt, controlContext) {
                    var defaultItem = null;
                    evt.newValue ? defaultItem = evt.newValue : typeof controlContext.properties.Default == "function" && (defaultItem = controlContext.properties.Default());
                    this._setDefaultValues(controlContext, defaultItem)
                }, onChangeSelectedItems: function(evt, controlContext) {
                    controlContext.realized && controlContext._listboxViewModel._onChangeSelectedItems(controlContext)
                }, _setDefaultValues: function(controlContext, defaultItem) {
                    this._setSelectedByValue(controlContext, defaultItem)
                }, _setSelectedByValue: function(controlContext, value) {
                    var items = controlContext.modelProperties.Items.getValue();
                    if (items === null || value === null) {
                        controlContext.modelProperties.Selected.setValue(null);
                        return
                    }
                    for (var defaultFound = !1, selectedItems = [], i = 0; i < items.length; i++)
                        items[i].Value === value && (items[i]._ID = i + 1, selectedItems.push(this._cloneItem(items[i])), controlContext.modelProperties.Selected.setValue(this._cloneItem(items[i])), defaultFound = !0);
                    defaultFound || items.length > 0 && (items[0]._ID = 1, selectedItems.push(this._cloneItem(items[0])), controlContext.modelProperties.Selected.setValue(this._cloneItem(items[0])));
                    controlContext.modelProperties.SelectedItems.setValue(selectedItems)
                }, _cloneItem: function(item) {
                    return {
                            Value: item.Value, id: item._ID, _src: item._src
                        }
                }, disposeView: function(container, controlContext) {
                    controlContext._listboxViewModel.dispose()
                }
        });
    Core.Namespace.define("AppMagic.Controls", {Listbox: Listbox})
})(WinJS);