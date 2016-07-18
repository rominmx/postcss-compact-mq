var assert = require('chai').assert,
	postcss = require('postcss'),
	fs = require('fs'),
	path = require('path'),
	plugin = require('../'),
	MQValue = require('../lib/mediaqueries').MQValue,
	parseMQ = require('../lib/mediaqueries').parseMQ;

var test = function(fixture, opts, done) {
	var input = fixture + '.css',
		expected = fixture + '.expected.css';

	input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
	expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');	

	postcss([ plugin(opts) ])
		.process(input)
		.then(function(result) {
			assert.equal(result.css, expected);
			done();
		}).catch(function(error) {
			done(error);
		});
}

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

describe('postcss-compact-mq', function() {
	it('common usage', function(done) {
		test('common', {}, done);
	});

	it('breakpoints at-rule', function(done) {
		test('breakpoints', {}, done);
	});

	it('alias at-rule', function(done) {
		test('alias', {}, done);
	})
});