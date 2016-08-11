var expect = require('chai').expect,
	postcss = require('postcss'),
	fs = require('fs'),
	path = require('path'),
	plugin = require('../'),
	MQValue = require('../lib/mediaqueries').MQValue,
	parseMQ = require('../lib/mediaqueries').parseMQ,
	MediaFeature = require('../lib/mediaqueries').MediaFeature,
	parseMediaFeature = require('../lib/mediaqueries').parseMediaFeature;

var test = function(fixture, opts, done) {
	var input = fixture + '.css',
		expected = fixture + '.expected.css';

	input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
	expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');	

	postcss([ plugin(opts) ])
		.process(input)
		.then(function(result) {
			expect(result.css).to.equal(expected);
			done();
		}).catch(function(error) {
			done(error);
		});
}

describe('postcss-compact-mq', function() {
	
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

		describe('string parsing', function() {
			it('reads unitless values', function() {
				mediaqueries.forEach(function(mediaquery) {
					var units = parseMQ(mediaquery.input, 'units');
					expect(units).to.equal('px');
				});
			});

			it('creates predictable media query components', function() {
				mediaqueries.forEach(function(mediaquery) {
					var component;

					for (var c in mediaquery.components) {
						component = parseMQ(mediaquery.input, c);
						expect(component).to.equal(mediaquery.components[c]);
					}
				});
			});			
		});

		it('creates media query string', function() {
			mediaqueries.forEach(function(mediaquery) {
				var mq, sign, value, units;
				sign = parseMQ(mediaquery.input, 'sign');
				value = parseMQ(mediaquery.input, 'value');
				units = parseMQ(mediaquery.input, 'units');
				mq = new MQValue(sign, value, units);
				
				expect(mq.toString()).to.equal(mediaquery.expected);
			});
		});
	});

	describe('plugin', function() {
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
});