var postcss = require('postcss');

var MQValue = function(sign, value, units) {
    this.sign = sign;
    this.value = value;
    this.units = units || 'px';
}

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

module.exports = postcss.plugin('postcss-alias-list', opts => {
    var text = opts && opts.text || 'no text';

    return (css) => {
        var breakpoints, mediaqueries;

        // parse and clean breakpoints at-rules
        breakpoints = [];
        css.walkAtRules('breakpoints', atRule => {
            atRule.walkDecls(decl => {
                breakpoints.push({
                    prop: decl.prop,
                    value: decl.value
                });
            });

            atRule.remove();
        });

        // parse and clean mediaqueries at-rules
        mediaqueries = [];
        css.walkAtRules('media-queries', atRule => {
            atRule.walkDecls(decl => {
                mediaqueries.push({
                    prop: decl.prop,
                    value: decl.value
                });
            });

            atRule.remove();
        });

        console.log(mediaqueries);

        css.walkAtRules('media', atRule => {
            var parsedValues = [];
            var params = atRule.params;

            // search and remove mediaquery aliases
            mediaqueries.some(mq => {
                if (mq.prop == atRule.params) {
                    params = mq.value;
                }
            });
            
            // at-rule contains <, >, =
            if (params.search(/[<=>]/) != -1) {
                postcss.list.comma(params).forEach(param => {
                    var sign, value, units, breakpoint, mq, bpAliasIndex;

                    sign = parseMQ(param, 'sign');
                    breakpoint = parseMQ(param, 'breakpoint');
                    bpAliasIndex = -1;

                    // string contains property from breakpoints at-rule
                    breakpoints.some((element, i) => {
                        if (element.prop == breakpoint) {
                            bpAliasIndex = i;
                        }
                    });

                    if (bpAliasIndex != -1) {
                        value = parseMQ(breakpoints[bpAliasIndex].value, 'value');
                        units = parseMQ(breakpoints[bpAliasIndex].value, 'units');
                    } else {
                        // string contains 'clean' values
                        value = parseMQ(param, 'value');
                        units = parseMQ(param, 'units');
                    }

                    mq = new MQValue(sign, value, units);
                    parsedValues.push(mq.toString());
                });

                console.log(parsedValues.join(' and '));
                atRule.params = 'screen and ' + parsedValues.join(' and ');
            }

        });
    }
});