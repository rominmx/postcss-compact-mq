var postcss = require('postcss'),
    parseMediaQuery = require('./lib/mediaqueries').parseMediaQuery;

module.exports = postcss.plugin('postcss-compact-mq', function(opts) {
    var defaultType = opts && opts.type || 'screen';

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

        // parse and clean media query at-rules
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
            var params = atRule.params;
            var mqComponents;

            // search and remove media query aliases
            // TODO: merge media queries
            mediaqueries.some(function(mq) {
                if (mq.prop == atRule.params) {
                    params = mq.value;
                }
            });
            
            // at-rule contains <, >, =
            if (params.search(/[<=>]/) != -1) {
                breakpoints.forEach(function(breakpoint) {
                    var pattern = new RegExp('([<=>])' + breakpoint.prop + '\\b');
                    params = params.replace(pattern, '$1' + breakpoint.value);
                });

                mqComponents = postcss.list.comma(params).map(function(component) {
                    return parseMediaQuery(component, defaultType).toString();
                });

                atRule.params = mqComponents.join(', ');
            }

        });
    }
});