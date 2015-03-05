/* jshint esnext:true */

// TODO: Use `import React from "react";` when external modules are supported.
"use strict";
var src$react$$ = require("../react"), src$mixin$$ = require("../mixin");

var FormattedRelative = src$react$$["default"].createClass({
    displayName: 'FormattedRelative',
    mixins     : [src$mixin$$["default"]],

    statics: {
        formatOptions: [
            'style', 'units'
        ]
    },

    propTypes: {
        format: src$react$$["default"].PropTypes.string,
        value : src$react$$["default"].PropTypes.any.isRequired
    },

    render: function () {
        var props    = this.props;
        var value    = props.value;
        var format   = props.format;
        var defaults = format && this.getNamedFormat('relative', format);
        var options  = FormattedRelative.filterFormatOptions(props, defaults);

        return src$react$$["default"].DOM.span(null, this.formatRelative(value, options));
    }
});

exports["default"] = FormattedRelative;

//# sourceMappingURL=relative.js.map