# postcss-compact-mq
[![Build Status](https://travis-ci.org/rominmx/postcss-compact-mq.svg?branch=master)](https://travis-ci.org/rominmx/postcss-compact-mq)
## Description
This plugin provides compact, intuitive syntax for media queries based on maximum and minimum viewport width and height.

## Installation
```ssh
$ npm install postcss-compact-mq
```

## Usage
```javascript
postcss([ require('postcss-compact-mq')(options) ])
```
### Common case
```css
// input.css
@media <=1024px >768px {/*...*/}
```

```css
// output.css
@media screen and (max-width: 1024px) and (min-width: 769px) {/*...*/}
```
#### Units
You can omit units: the plugin automatically converts unitless values into pixels:
```css
@media <=1024 >768 {...}
```

#### Media types
If media type is omitted, it will be resolved as `screen`. You can change default media type value via options.

#### OR operator
**Important note**: unlike previous version of this plugin, commas now represent 'OR' operator, not 'AND', which is closer to the [standard](https://www.w3.org/TR/css3-mediaqueries/) and lets you write more flexible constructions.
```css
// input.css
@media print, >1024px, all <=768 {/*...*/}
```

```css
// output.css
@media print, screen and (min-width: 1025px), all and (max-width: 768px) {/*...*/}
```

#### Height media feature
In expressions like `h<=1024` or `h>768` height media feature will be resolved as `max-height` of `min-height` respectively:
```css
//input.css
@media all h>768 {/*...*/}
```

```css
//output.css
@media all and (min-height: 769px) {/*...*/}
```

Expressions like `<=1024` and `w<=1024` are identical.

### Breakpoints
You can create an at-rule containing aliases for any breakpoints, for example:

```css
@breakpoints {
	desktop: 1024px;
	tablet: 768;
}
```

```css
@media <=desktop h>tablet {...}
```

### Aliases
You can place the alias for a whole media query in a separate at-rule:
```css
@breakpoints {
	desktop: 1024;
	phone: 480px;
}

@media-queries {
	tablet: <=desktop >phone;
}
```

...and use it somewhere in your stylesheets:
```css
@media tablet {...}
```

You can combine aliases with any other legit expressions. E.g.:
```css
// input.css
@media tablet, print, all h<480 {/*...*/}
```

```css
// output.css
@media screen and (max-width: 1024px) and (min-width: 481px), print, all and (max-height: 479px) {/*...*/}
```

### Options
`type`: media type which is used when media type in expression is omitted. Default value: `screen`.

## Inspiration
This plugin was inspired by awesome Sass library [include-media](http://include-media.com) by Eduardo Bouças and Hugo Giraudel.

## License
MIT