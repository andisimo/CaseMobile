//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var SchemaKeyName = AppMagic.Schema.KeyName,
        SchemaKeyType = AppMagic.Schema.KeyType,
        SchemaKeyPtr = AppMagic.Schema.KeyPtr,
        SchemaTypeArray = AppMagic.Schema.TypeArray,
        SchemaTypeObject = AppMagic.Schema.TypeObject,
        SchemaSimpleTypes = [AppMagic.Schema.TypeBoolean, AppMagic.Schema.TypeNumber, AppMagic.Schema.TypeString, AppMagic.Schema.TypeHyperlink, AppMagic.Schema.TypeImage, AppMagic.Schema.TypeMedia, ],
        SchemaComplexTypes = [SchemaTypeArray, SchemaTypeObject],
        SchemaTypes = SchemaComplexTypes.concat(SchemaSimpleTypes);
    function createSchemaForSimple(type, schemaItemName) {
        var result = {};
        return result[SchemaKeyType] = type, typeof schemaItemName == "string" && (result[SchemaKeyName] = schemaItemName), result
    }
    function _createSchemaFromPointer(type, schemaPointer) {
        var result = {};
        return result[SchemaKeyType] = type, result[SchemaKeyPtr] = schemaPointer, result
    }
    function createSchemaForArrayFromPointer(schemaPointer) {
        return _createSchemaFromPointer(SchemaTypeArray, schemaPointer)
    }
    function createSchemaForObjectFromPointer(schemaPointer) {
        return _createSchemaFromPointer(SchemaTypeObject, schemaPointer)
    }
    function getSchemaOfProperty(parentSchema, propertyName) {
        var i,
            arr,
            len,
            schema;
        for (i = 0, arr = parentSchema[SchemaKeyPtr], len = arr.length; i < len; i++)
            if (arr[i][SchemaKeyName] === propertyName) {
                schema = arr[i];
                break
            }
        return schema
    }
    function isSchemaOfTypeArray(schema) {
        return schema[SchemaKeyType] === SchemaTypeArray
    }
    function isSchemaOfType(schema, type) {
        return schema[SchemaKeyType] === type
    }
    function getSchemaString(schema) {
        var type = schema[SchemaKeyType];
        if (SchemaSimpleTypes.indexOf(type) >= 0)
            return type;
        var isTable = isSchemaOfTypeArray(schema);
        return AppMagic.Utility.stringizeSchema(schema[SchemaKeyPtr], isTable)
    }
    Core.Namespace.define("AppMagic.Schema", {
        createSchemaForSimple: createSchemaForSimple, createSchemaForObjectFromPointer: createSchemaForObjectFromPointer, createSchemaForArrayFromPointer: createSchemaForArrayFromPointer, getSchemaOfProperty: getSchemaOfProperty, isSchemaOfTypeArray: isSchemaOfTypeArray, isSchemaOfType: isSchemaOfType, getSchemaString: getSchemaString
    })
})(WinJS);