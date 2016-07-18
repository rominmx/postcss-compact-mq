var postcss = require('postcss'),
    MQValue = require('./lib/mediaqueries').MQValue,
    parseMQ = require('./lib/mediaqueries').parseMQ;

module.exports = postcss.plugin('postcss-compact-mq', function(opts) {
    var text = opts && opts.text || 'no text';

    return function(css) {
        var breakpoints, mediaqueries;

        // parse and clean breakpoints at-rules
        breakpoints = [];
        css.walkAtRules('breakpoints', function(atRule) {
            atRule.walkDecls(function(decl) {
                breakpoints.push({
                    prop: decl.prop,
                    value: decl.value
                });
            });

            atRule.remove();
        });

        // parse and clean mediaqueries at-rules
        mediaqueries = [];
        css.walkAtRules('media-queries', function(atRule) {
            atRule.walkDecls(function(decl) {
                mediaqueries.push({
                    prop: decl.prop,
                    value: decl.value
                });
            });

            atRule.remove();
        });

        css.walkAtRules('media', function(atRule) {
            var parsedValues = [];
            var params = atRule.params;

            // search and remove mediaquery aliases
            mediaqueries.some(function(mq) {
                if (mq.prop == atRule.params) {
                    params = mq.value;
                }
            });
            
            // at-rule contains <, >, =
            if (params.search(/[<=>]/) != -1) {
                postcss.list.comma(params).forEach(function(param) {
                    var sign, 
                        value, 
                        units, 
                        breakpoint, 
                        mq, 
                        bpAliasIndex,
                        str;

                    str = param;
                    sign = parseMQ(param, 'sign');
                    breakpoint = parseMQ(param, 'breakpoint');
                    bpAliasIndex = -1;

                    // string contains property from breakpoints at-rule
                    breakpoints.some(function(element, i) {
                        if (element.prop == breakpoint) {
                            bpAliasIndex = i;
                        }
                    });

                    if (bpAliasIndex != -1) {
                        str = breakpoints[bpAliasIndex].value;
                    }

                    value = parseMQ(str, 'value');
                    units = parseMQ(str, 'units');

                    mq = new MQValue(sign, value, units);
                    parsedValues.push(mq.toString());
                });

                atRule.params = 'screen and ' + parsedValues.join(' and ');
            }

        });
    }
});