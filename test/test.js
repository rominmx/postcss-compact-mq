var assert = require('chai').assert,
	MQValue = require('../lib/mediaqueries').MQValue,
	parseMQ = require('../lib/mediaqueries').parseMQ;

describe('mediaqueries lib', function() {
	var mediaqueries = [
		{
			input: '<=1920px',
			components: { sign: '<=', value: 1920, units: 'px' },
			expected: '(max-width: 1920px)'
		},
		{
			input: '>480',
			components: { sign: '>', value: 480, units: 'px' },
			expected: '(min-width: 481px)'
		}
	];

	it('parses string', function() {
		mediaqueries.forEach(function(mediaquery) {
			for (var c in mediaquery.components) {
				assert.equal(parseMQ(mediaquery.input, c), mediaquery.components[c]);
			}
		});
	});

	it('creates media query string', function() {
		mediaqueries.forEach(function(mediaquery) {
			var mq, sign, value, units;
			sign = parseMQ(mediaquery.input, 'sign');
			value = parseMQ(mediaquery.input, 'value');
			units = parseMQ(mediaquery.input, 'units');
			mq = new MQValue(sign, value, units);
			assert.equal(mq.toString(), mediaquery.expected);
		});
	});
});