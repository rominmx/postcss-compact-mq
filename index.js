var postcss = require('postcss'),
    MQValue = require('./lib/mediaqueries').MQValue,
    parseMQ = require('./lib/mediaqueries').parseMQ;

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
                    var sign, 
                        value, 
                        units, 
                        breakpoint, 
                        mq, 
                        bpAliasIndex,
                        tmp;

                    sign = parseMQ(param, 'sign');
                    breakpoint = parseMQ(param, 'breakpoint');
                    bpAliasIndex = -1;
                    tmp = param;

                    // string contains property from breakpoints at-rule
                    breakpoints.some((element, i) => {
                        if (element.prop == breakpoint) {
                            bpAliasIndex = i;
                        }
                    });

                    if (bpAliasIndex != -1) {
                        tmp = breakpoints[bpAliasIndex].value;
                    }

                    value = parseMQ(tmp, 'value');
                    units = parseMQ(tmp, 'units');

                    mq = new MQValue(sign, value, units);
                    parsedValues.push(mq.toString());
                });

                atRule.params = 'screen and ' + parsedValues.join(' and ');
            }

        });
    }
});