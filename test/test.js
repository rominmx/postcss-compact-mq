var expect = require('chai').expect,
	postcss = require('postcss'),
	fs = require('fs'),
	path = require('path'),
	plugin = require('../'),
	MediaFeature = require('../lib/mediaqueries').MediaFeature,
	parseMediaFeature = require('../lib/mediaqueries').parseMediaFeature,
	MediaQuery = require('../lib/mediaqueries').MediaQuery,
	parseMediaQuery = require('../lib/mediaqueries').parseMediaQuery;

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

		describe('media features processing', function() {
			var mediafeatures = [
				{
					input: '<=1920',
					parsed: { name: 'max-width', value: '1920px' },
					expected: '(max-width: 1920px)'
				},
				{
					input: 'h>768',
					parsed: { name: 'min-height', value: '769px' },
					expected: '(min-height: 769px)'
				},
				{
					input: 'w<1024',
					parsed: { name: 'max-width', value: '1023px' },
					expected: '(max-width: 1023px)'
				}
			];

			it('correctly processes uniless values', function() {
				mediafeatures.forEach(function(mediafeature) {
					var value = parseMediaFeature(mediafeature.input).value;
					expect(value).to.equal(mediafeature.parsed.value);
				});
			});

			it('processes height and width (also if omited)', function() {
				mediafeatures.forEach(function(mediafeature) {
					var name = parseMediaFeature(mediafeature.input).name;
					expect(name).to.equal(mediafeature.parsed.name);
				});
			});

			it('converts media features to strings', function() {
				mediafeatures.forEach(function(mediafeature) {
					var str = parseMediaFeature(mediafeature.input).toString();
					expect(str).to.equal(mediafeature.expected);
				});
			});
		});

		describe('media queries processing', function() {
			var defaultType = 'screen';
			var mediaqueries = [
				{
					input: '>480',
					parsed: { type: 'screen', features: [
						{
							name: 'min-width',
							value: '481px'
						}
					] },
					expected: 'screen and (min-width: 481px)'
				},
				{
					input: 'all h<=1024 >768',
					parsed: { type: 'all', features: [
						{
							name: 'max-height',
							value: '1024px'
						},
						{
							name: 'min-width',
							value: '769px'
						}
					] },
					expected: 'all and (max-height: 1024px) and (min-width: 769px)'
				},
				{
					input: 'print',
					parsed: { type: 'print', features: [] },
					expected: 'print'
				}
			];

			it('reads media type', function() {
				mediaqueries.forEach(function(mediaquery) {
					var type = parseMediaQuery(mediaquery.input, defaultType).type;
					expect(type).to.equal(mediaquery.parsed.type);
				});
			});

			it('correcty parses media query', function() {
				mediaqueries.forEach(function(mediaquery) {
					var str = parseMediaQuery(mediaquery.input, defaultType).toString();
					expect(str).to.equal(mediaquery.expected);
				});
			});
		});


	});

	describe('plugin', function() {
		it('common usage', function(done) {
			test('common', { type: 'all' }, done);
		});

		it('breakpoints at-rule', function(done) {
			test('breakpoints', {}, done);
		});

		it('alias at-rule', function(done) {
			test('alias', {}, done);
		})
	});
});