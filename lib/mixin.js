/* jshint esnext:true */

// TODO: Use `import React from "react";` when external modules are supported.
"use strict";
var src$react$$ = require("./react"), intl$messageformat$$ = require("intl-messageformat"), intl$relativeformat$$ = require("intl-relativeformat"), intl$format$cache$$ = require("intl-format-cache");

// -----------------------------------------------------------------------------

var typesSpec = {
    locales: src$react$$["default"].PropTypes.oneOfType([
        src$react$$["default"].PropTypes.string,
        src$react$$["default"].PropTypes.array
    ]),

    formats : src$react$$["default"].PropTypes.object,
    messages: src$react$$["default"].PropTypes.object
};

function assertIsDate(date, errMsg) {
    // Determine if the `date` is valid by checking if it is finite, which is
    // the same way that `Intl.DateTimeFormat#format()` checks.
    if (!isFinite(date)) {
        throw new TypeError(errMsg);
    }
}

exports["default"] = {
    statics: {
        filterFormatOptions: function (obj, defaults) {
            if (!defaults) { defaults = {}; }

            return (this.formatOptions || []).reduce(function (opts, name) {
                if (obj.hasOwnProperty(name)) {
                    opts[name] = obj[name];
                } else if (defaults.hasOwnProperty(name)) {
                    opts[name] = defaults[name];
                }

                return opts;
            }, {});
        }
    },

    propsTypes       : typesSpec,
    contextTypes     : typesSpec,
    childContextTypes: typesSpec,

    getNumberFormat  : intl$format$cache$$["default"](Intl.NumberFormat),
    getDateTimeFormat: intl$format$cache$$["default"](Intl.DateTimeFormat),
    getMessageFormat : intl$format$cache$$["default"](intl$messageformat$$["default"]),
    getRelativeFormat: intl$format$cache$$["default"](intl$relativeformat$$["default"]),

    getChildContext: function () {
        var context = this.context;
        var props   = this.props;

        return {
            locales:  props.locales  || context.locales,
            formats:  props.formats  || context.formats,
            messages: props.messages || context.messages
        };
    },

    formatDate: function (date, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to formatDate()');
        return this._format('date', date, options);
    },

    formatTime: function (date, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to formatTime()');
        return this._format('time', date, options);
    },

    formatRelative: function (date, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to formatRelative()');
        return this._format('relative', date, options);
    },

    formatNumber: function (num, options) {
        return this._format('number', num, options);
    },

    formatMessage: function (message, values) {
        var locales = this.props.locales || this.context.locales;
        var formats = this.props.formats || this.context.formats;

        // When `message` is a function, assume it's an IntlMessageFormat
        // instance's `format()` method passed by reference, and call it. This
        // is possible because its `this` will be pre-bound to the instance.
        if (typeof message === 'function') {
            return message(values);
        }

        if (typeof message === 'string') {
            message = this.getMessageFormat(message, locales, formats);
        }

        return message.format(values);
    },

    getIntlMessage: function (path) {
        var messages  = this.props.messages || this.context.messages;
        var pathParts = path.split('.');

        var message;

        try {
            message = pathParts.reduce(function (obj, pathPart) {
                return obj[pathPart];
            }, messages);
        } finally {
            if (message === undefined) {
                throw new ReferenceError('Could not find Intl message: ' + path);
            }
        }

        return message;
    },

    getNamedFormat: function (type, name) {
        var formats = this.props.formats || this.context.formats;
        var format  = null;

        try {
            format = formats[type][name];
        } finally {
            if (!format) {
                throw new ReferenceError(
                    'No ' + type + ' format named: ' + name
                );
            }
        }

        return format;
    },

    _format: function (type, value, options) {
        var locales = this.props.locales || this.context.locales;

        if (options && typeof options === 'string') {
            options = this.getNamedFormat(type, options);
        }

        switch(type) {
            case 'date':
            case 'time':
                return this.getDateTimeFormat(locales, options).format(value);
            case 'number':
                return this.getNumberFormat(locales, options).format(value);
            case 'relative':
                return this.getRelativeFormat(locales, options).format(value);
            default:
                throw new Error('Unrecognized format type: ' + type);
        }
    }
};

//# sourceMappingURL=mixin.js.map