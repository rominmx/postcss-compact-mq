/**
 * Media queries module
 * @module lib/mediaqueries
 */
var postcss = require('postcss');

var MediaFeature = function(name, value) {
    this.name = name;
    this.value = value;
}

MediaFeature.prototype.toString = function() {
    return '(' + this.name + ': ' + this.value + ')';
}

var parseMediaFeature = function(str) {
    var name, prefix, feature, sign, value, units;

    feature = str.match(/^[\w]*/)[0];
    sign = str.match(/^(?:[\w]*)([<=>]+)/)[1];
    value = +str.match(/[\d]+/)[0];
    units = str.match(/[\D]*$/)[0] || 'px';

    switch (feature) {
        case 'h':
        case 'height':
            feature = 'height';
            break;
        case 'w':
        case 'width':
        default:
            feature = 'width';
            break;
    }

    switch (sign) {
        case '<':
            value--;
        case '<=':
            prefix = 'max';
            break;
        case '>':
            value++;
        case '>=':
            prefix = 'min';
            break;
        default:
            break;
    }

    name = prefix + '-' + feature;
    value += units;

    return new MediaFeature(name, value);
}

function MediaQuery(type, features) {
    this.type = type;
    this.features = features;
}

MediaQuery.prototype.toString = function() {
    if (this.features.length) {
        return this.type + ' and ' + this.features.join(' and ');
    } else {
        return this.type;
    }
}

function parseMediaQuery(str, defaultType) {
    var components,
        type,
        features;

    components = postcss.list.space(str);

    if (!components[0].match(/^[\w]*([<=>]+)/)) {
        type = components[0];
        features = components.slice(1);
    } else {
        type = defaultType;
        features = components.slice();
    }

    features = features.map(function(feature) {
        return parseMediaFeature(feature);
    });

    return new MediaQuery(type, features);
}

function parseMediaQueries(str, defaultType) {
    var mediaqueries = postcss.list.comma(str);
    var components = mediaqueries.map(function(mediaquery) {
        return parseMediaQuery(mediaquery, defaultType);
    });
    return components.join(', ');
}

module.exports = {
    parseMediaFeature: parseMediaFeature,
    parseMediaQuery: parseMediaQuery,
    parseMediaQueries: parseMediaQueries
}