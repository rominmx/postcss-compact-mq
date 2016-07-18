/**
 * Media queries module
 * @module lib/mediaqueries
 */

/**
 * Represents a parameter in a media query 
 * @constructor
 * @param {string} sign, e.g. '>='
 * @param {number} value, e.g. 1024
 * @param {string} units, e.g. 'px'
 */

var MQValue = function(sign, value, units) {
    this.sign = sign;
    this.value = value;
    this.units = units || 'px';
}

/**
 * String representation of a media query object
 * @function MQValue.prototype.toString
 */

MQValue.prototype.toString = function() {
    var sign;
    var value = this.value;

    switch (this.sign) {
        case '<':
            value--;
        case '<=':
            sign = 'max-width';
            break;  
        case '>':
            value++;
        case '>=':
            sign = 'min-width';
            break;
        default:
            break;  
    }

    return '(' + sign + ': ' + value + this.units + ')';
}

/**
 * @function parseMQ
 * @param {string} str Input string
 * @param {string} param Part of a string needs to be parsed
 */

var parseMQ = function(str, param) {
    var result;

    switch (param) {
        case 'sign':
            result = str.match(/^[<=>]+/)[0];
            break;
        case 'value':
            result = +str.match(/[\d]+/)[0];
            break;
        case 'units':
            result = str.match(/[\D]*$/)[0] || 'px';
            break;
        case 'breakpoint':
            result = str.replace(/^[<=>]+/, '');
            break;
        default:
            break;  
    }

    return result;
}

module.exports = {
    MQValue: MQValue,
    parseMQ: parseMQ
}