var postcss = require('postcss'),
    parseMediaQueries = require('./lib/mediaqueries').parseMediaQueries;

module.exports = postcss.plugin('postcss-compact-mq', function(opts) {
    var defaultType = opts && opts.type || 'screen';

    return function(css) {
        var breakpoints,   // breakpoints aliases
            mediaqueries;  // media query aliases

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

            // search and remove media query aliases
            // TODO: merge media queries
            mediaqueries.forEach(function(mediaquery) {
                var pattern = new RegExp('\\b' + mediaquery.prop + '\\b');
                params = params.replace(pattern, mediaquery.value);
            });
            
            // at-rule contains <, >, =
            if (params.search(/[<=>]/) != -1) {
                breakpoints.forEach(function(breakpoint) {
                    var pattern = new RegExp('([<=>])' + breakpoint.prop + '\\b', 'g');
                    params = params.replace(pattern, '$1' + breakpoint.value);
                });
                atRule.params = parseMediaQueries(params, defaultType);
            }
        });
    }
});