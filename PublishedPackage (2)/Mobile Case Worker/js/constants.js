//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("AppMagic.AuthoringTool.Keys", {
        backspace: "Backspace", del: "Del", down: "Down", end: "End", enter: "Enter", esc: "Esc", f5: "F5", home: "Home", l: "l", left: "Left", openParen: "(", pageDown: "PageDown", pageUp: "PageUp", right: "Right", tab: "Tab", up: "Up", z: "z"
    });
    Core.Namespace.define("AppMagic.Constants.KeyCodes", {
        down: 40, up: 38, pageDown: 34, pageUp: 33, space: 32, enter: 13
    });
    Core.Namespace.define("AppMagic.Constants", {
        DataImportTimeout: 3e3, DocumentImportFormat: ".xlsx", DocumentFileFormat: ".siena", DocumentFileFormatServiceConfiguration: ".xml", ControlInitialBounds: {
                x: 40, y: 40, width: 100, height: 100
            }, ControlMinimumWidth: 20, ControlMinimumHeight: 20, CanvasGridSize: 5, CanvasAdornerMinimumZoom: 40, CanvasAdornerFillSize: 15, CanvasAdornerMargin: 15, CanvasAdornerInnerMargin: 5, CanvasAdornerBorderWidth: 10, CanvasAdornerOuterDimension: 15, CanvasAdornerSize: 6, CanvasErrorIconOffset: -8, CanvasErrorIconSize: 16, ImageFormats: [".jpg", ".jpeg", ".gif", ".png", ".bmp", ".tif", ".tiff", ".svg"], MediaFormats: [".wav", ".mp3", ".mp4", ".wma", ".wmv"], AudioFormats: [".wav", ".mp3", ".wma"], VideoFormats: [".mp4", ".wmv"], PasteOffset: 20, PunctuatorBang: "!", ScreenClass: "AppMagic.Controls.Screen", ScreenId: "http://microsoft.com/appmagic/screen", ScreenVersion: "1.0", ScreenName: "screen", MinimumTemplateWidth: 1, MinimumTemplateHeight: 1, ScreenWidth: 1366, ScreenHeight: 768, ScreenCanvasMargin: 35, SmallLayoutSize: {
                width: 1024, height: 768
            }, LabelName: "label", LabelTextPropertyName: "Text", SampleDataCount: 10, Zoom: {
                SliderMin: 0, Step: 10, SliderMax: 100, ValueMax: 400, ValueMin: 10, Source: {
                        automatic: "automatic", userInvoked: "userInvoked", verify: function(value){}
                    }
            }, PublishDefaultImageFile: "publish\\images\\default_icon.png", PublishDefaultLogoFile: "publish\\images\\logo.png", PublishDefaultWideLogoFile: "publish\\images\\widelogo.png", PublishDefaultStoreLogoFile: "publish\\images\\storelogo.png", PublishDefaultSmallLogoFile: "publish\\images\\smalllogo.png", PublishDefaultNotificationLogoFile: "publish\\images\\notificationlogo.png", PublishDefaultSplashscreenFile: "publish\\images\\splashscreen.png", PublishDefaultCertFile: "publish\\AuthoringTool_StoreKey.pfx", PublishDefaultPublisherIdentity: "CN=SienaPublisherBeta", PublishLogoMaxHeight: 300, PublishLogoMaxWidth: 300, PublishLogoMaxSizeInKilobytes: 128, PublishImageMaxSize: 200, Audio: {
                timerVisibilityThreshold: 300, volumeVisibilityThreshold: 215, seekbarVisibilityThreshold: 90, audioMinPlayerWidth: 65, verticalVolumeThreshold: 165
            }, Video: {
                videoMinPlayerWidth: 300, videoMinPlayerHeight: 168, defaultScaleFactor: 3
            }, BackstagePanelItems: ["Data Sources", "Embedded Media", "Collections"]
    });
    Core.Namespace.define("AppMagic.AuthoringTool.OpenAjaxPropertyNames", {
        X: "X", Y: "Y", Width: "Width", Height: "Height", ZIndex: "ZIndex", Visible: "Visible", OnHidden: "OnHidden", OnVisible: "OnVisible", Data: "Data", Items: "Items", Image: "Image", Text: "Text"
    });
    Core.Namespace.define("AppMagic.AuthoringTool.SegoeGlyphs", {
        back: "", forward: "", closepane: "", document: "", edit: "", find: "", "delete": "", more: "", open: "", openpane: "", placeholder: "", remote: "", rightTriangle: "▶", save: "", left: "&#57570;", right: "&#57571;", up: "&#57572;", down: "&#57573;"
    });
    Core.Namespace.define("AppMagic.Constants.Controls", {
        million: 1e6, negativeMillion: -1e6, RatingMaxValue: 200, onChangeMediaThrottle: 1e3, controlsFadeDelay: 3e3, volumeSliderHideDelay: 1500, toggleSwitchHandleSize: 10, ImportedRestConfigControl: {GridMinColWidthPixels: 75}, ObjectViewerControl: {
                CollapsedInitialOffsetXPixels: 200, CollapsedInitialOffsetYPixels: 100, GridMinColWidthPixels: 75, GridMinRowHeightPixels: 40, GridInitialMaxColWidthPixels: 250, GridWidthResizerThicknessPixels: 5, GridHeightResizerThicknessPixels: 6, GridHeaderDownCaretWidthPixels: 9, GridHeaderDownCaretMarginLeftPixels: 10, GridCellRowHeightPixels: 110, GridCellHeaderPaddingLeftRightPixels: 15, GridCellPaddingTopBottomPixels: 10, GridCellImageMaxWidthPixels: 135, GridCellImageMaxHeightPixels: 90
            }
    });
    Core.Namespace.define("AppMagic.Constants.zIndex", {
        visualMaximum: 1e3, topmost: 1001
    });
    Core.Namespace.define("AppMagic.Constants.DKind", {
        Image: "Image", Media: "Media"
    });
    Core.Namespace.define("AppMagic.Constants.Runtime", {
        collectionNameProperty: "_collectionName", configurationProperty: "_configuration", metaProperty: "_meta", syncVersionProperty: "_syncVersion", idProperty: "_ID", controlLocMapProperty: "__controlPropertyLocMap__3D13E637B4D84302B5089D4897017A3F"
    });
    Core.Namespace.define("AppMagic.Constants.Services", {
        ZUMO_APP_URI: "https://appmagic.azure-mobile.net/", ZUMO_APP_ID: "appmagic", ZUMO_AUTH_TABLE: "zz_auth", ZUMO_AUTH_TOKENS_SETTINGS_KEY: "AmsAuthTokens", DEFAULT_VERSION: "1.0.0", DEFAULT_MSAUTH_SCOPE: "wl.basic", AMS_TOKEN_ANCHOR: "#token=", AMS_ERROR_ANCHOR: "#error=", AUTH_DOMAINS_KEY: "AuthDomains", OAUTH_SETTINGS_KEY: "OAuthTokens", OAUTH_TOKEN_PARAM: "access_token", OAUTH_EXPIRES_PARAM: "expires_in", OAUTH_ERROR_PARAM: "error", ID_PROPERTY: "_ID", SpIdProperty: "_spID_02cdb7bf-3fde-4b35-a7b3-fa04c3bab96c", VERSION_PROPERTY: "_syncVersion", AuthTypeNames: {
                OAuth2: "oauth2", OAuth1: "oauth1"
            }, OAuth2AccessTokenStyle: {
                Query: "query", Header: "header"
            }, OAuth2GrantType: {
                Implicit: "implicit", ClientCredentials: "clientcredentials"
            }, Rest: {
                TypeDefinitionKey_DefType: "deftype", DefinitionType_JsonArray: "JsonArray", DefinitionType_JsonMapObject: "JsonMapObject", DefinitionType_JsonObject: "JsonObject", DefinitionType_JsonPrimitive: "JsonPrimitive", DefinitionType_SampleXmlElement: "SampleXmlElement", DefinitionType_XmlSimpleType: "XmlSimpleType", DefinitionType_LanguageVariable: "LanguageVariable", DefinitionPropertyKey_Type: "type", DefinitionPropertyKey_TypeRef: "typeref", DefinitionPropertyTypeRefKey_Prefix: "prefix", DefinitionPropertyTypeRefKey_Name: "name", JsonPrimitiveDefinitionKey_Primitive: "primitive", JsonPrimitiveDefinitionKey_DType: "dtype", JsonArrayDefinitionKey_Items: "items", JsonMapObjectDefinitionKey_Keys: "keys", JsonMapObjectDefinitionKey_Values: "values", JsonMapObjectDefinitionKeysKey_FieldName: "fieldname", JsonMapObjectDefinitionValuesKey_FieldName: "fieldname", JsonObjectDefinitionKey_Properties: "properties", JsonObjectPropertyKey_DisplayIdx: "displayidx", SampleXmlElementDefinitionKey_SampleXml: "samplexml", XmlParamKey_SelectAllNodes: "selectallnodes", XmlSimpleTypeDefinitionKey_DType: "dtype", SingleBodyKey_Param: "param", JsonBodyParamKey_JsonPointer: "jsonpointer", XmlBodyParamKey_XPath: "xpath", AggregateBodyKey_Params: "params", AggregateBodyParamKey_DisplayIdx: "displayidx", ConfigFileKey_TypesByPrefix: "typesbyprefix", ContentTypeTextHTML: "text/html", FunctionKeyIsAuth: "isauth", FunctionKey_Response: "response", FunctionKey_Request: "request", FunctionParameterKeySampleDefault: "sampledefault", FunctionParameterKeyDType: "dtype", FunctionParameterKeyName: "name", FunctionParameterKeyOptions: "options", FunctionParameterKeyRequired: "required", ParamKey_CharsToEscape: "charstoescape", ParamKey_EscapeChar: "escapechar", ParamKey_Format: "format", ParamKey_Name: "name", ParamKey_Key: "key", ParamKey_Type: "type", ParamKey_Value: "value", ParamValueKey_Type: "type", ParamValueType_Fixed: "fixed", ParamValueType_Parameter: "parameter", ParamValueKey_Definition: "definition", RequestKey_Body: "body", RequestKey_Method: "method", RequestKey_Url: "url", RequestKey_Headers: "headers", RequestKey_QueryStringParameters: "querystringparameters", RequestBodyXWwwFormUrlEncodedKey_Params: "params", RequestBodyJsonKey_Params: "params", RequestBodyMultipartFormDataKey_Params: "params", ResponseHeaderContentType: "content-type", ResponseKeyParams: "params", ResponseKeyTypes: "types", ResponseKey_Body: "body", ResponseKey_ResultForm: "resultform", ResponseBodyKey_MediaType: "mediatype", ResultForm: {
                        Void: "void", Self: "self", Single: "single", Aggregate: "aggregate"
                    }, MediaTypeKey: "mediatype", MediaType: {
                        FormUrlEncoded: "application/x-www-form-urlencoded", Json: "application/json", Xml: "application/xml", Image: "image", Audio: "audio"
                    }, UrlKey_Base: "base", UrlKey_Paths: "paths", UrlPathsKey_Path: "path", UrlPathsKey_Templates: "templates", UrlPathsTemplatesKey_Name: "name", ResponseParamKeyName: "name", ResponseParamKeyPath: "path", ResponseParamKeyTypeRef: "typeref", ResponseParamKeyXsdType: "xsdtype", ResponseParamKeyBaseXsdType: "basexsdtype", ResponseParamKeyDType: "dtype", ResponseParamKeySampleXml: "samplexml", ResponseParamKey_SelectAll: "selectall", ResponseParamName_AccessToken: "access_token", ResponseParamName_ExpiresIn: "expires_in", XsdType: {
                        Boolean: "boolean", Int: "int", Long: "long", UnsignedInt: "unsignedInt", UnsignedLong: "unsignedLong", Decimal: "decimal", Float: "float", Double: "double", String: "string", Base64Binary: "base64Binary", HexBinary: "hexBinary"
                    }, ResponseTypeDefKeyName: "name", ResponseTypeDefKeyType: "type", ResponseTypeDefKeyItemType: "itemtype", ResponseTypeDefKeyFields: "fields", ResponseTypeDefKeyFieldName: "name", ResponseTypeDefKeyFieldType: "type", DefaultAccessTokenExpiration: 3600, DocKey: "doc", DocTitleKey: "title", DocIdKey: "docid", DocDefaultLangKey: "", DocDisplayNameKey: "displayname", DisplayIdx: "displayidx"
            }, Config: {events: {
                    add: "add", complete: "complete", hideadd: "hideadd", navigateadd: "navigateadd", showcolumnmenu: "showcolumnmenu"
                }}
    });
    Core.Namespace.define("AppMagic.Constants.Dispatch", {status: {
            error: 0, success: 1
        }});
    Core.Namespace.define("AppMagic.Constants.DataConnections", {
        Types: {
            AzureMobileServices: "azuremobile", Excel: "excel", SharePoint: "sharepoint", RSS: "rss", REST: "rest"
        }, Icons: {
                azuremobile: "/images/Azure_icon.png", excel: "/images/Excel_icon.png", sharepoint: "/images/SharePoint_icon.png", rss: "/images/rss_icon.png", rest: "/images/RESTconnector_icon.png"
            }, Icons_monochrome: {
                azuremobile: "/images/Azure_icon_white.png", excel: "/images/Excel_icon_white.png", sharepoint: "/images/SharePoint_icon_white.png", rss: "/images/RSS_trans_white.png", rest: "/images/RESTconnector_white.png", BingSearch: "/images/Bing_white.png", BingTranslator: "/images/Bing_white.png", Coursera: "/images/Coursera_white.png", Facebook: "/images/Facebook_white.png", Instagram: "/images/Instagram_white.png", Khan: "/images/Khan_white.png", Twitter: "/images/Twitter_white.png", Yammer: "/images/Yammer_white.png", YouTube: "/images/YouTube_white.png"
            }, Pages: {
                azuremobile: "/backStages/data/configPages/azure/azureConfig.html", excel: "/backStages/data/configPages/excel/excelConfig.html", sharepoint: "/backStages/data/configPages/sharepoint/sharepointConfig.html", rss: "/backStages/data/configPages/rss/rssConfig.html", rest: "/backStages/data/configPages/rest/restConfig.html"
            }, Timeout: 1e3
    });
    Core.Namespace.define("AppMagic.Constants.SettingsKey", {
        AMS: "Ams", SHAREPOINT: "SharePoint", REST: "Rest", RSS: "RSS"
    });
    Core.Namespace.define("AppMagic.Constants.PropertyRuleCategory", {
        data: 0, design: 1, behavior: 2
    });
    Core.Namespace.define("AppMagic.Constants.PenType", {
        mouse: 1, touch: 2, pen: 4
    });
    Core.Namespace.define("AppMagic.Constants.DocDataSources", {
        none: "none", aggregate: "aggregate", all: "all", verify: function(value){}
    });
    Core.Namespace.define("AppMagic.Constants.MediaTypes", {
        image: "i", audioVideo: "m", verify: function(type){}
    });
    Core.Namespace.define("AppMagic.Constants.DialogState", {
        opened: "opened", rendered: "rendered", closed: "closed"
    });
    Core.Namespace.define("AppMagic.Constants.Publish", {
        WindowsPublishKey: "win", WebPublishKey: "web"
    });
    Core.Namespace.define("AppMagic.Constants.ImportExportErrors", {
        ImportCorruptedZipError: "ImportCorruptedZipError", ImportInvalidXMLError: "ImportInvalidXMLError", ImportInvalidJSONError: "ImportInvalidJSONError", ImportXMLNotFoundError: "ImportXMLNotFoundError", ImportUnkownError: "ImportUnkownError", ExportUpdateError: "ExportUpdateError", ExportNullDataError: "ExportNullDataError", ExportUnknownError: "ExportUnknownError"
    });
    Core.Namespace.define("AppMagic.Constants", {
        MaxInteger: 9007199254740992, MinInteger: -9007199254740992
    })
})(WinJS);