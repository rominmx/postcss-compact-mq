# postcss-compact-mq
## Description
This plugin provides compact, intuitive syntax for the most common mediaqueries based on maximum and minimum viewport width.

## Usage
```
postcss([ require('postcss-compact-mq') ])
```
### Common case
```css
// input.css
@media <=1024px, >768px {
	.header {
		color: rebeccapurple;
	}
}
```

```css
// output.css
@media screen and (max-width: 1024px) and (min-width: 769px) {
	.header {
		color: rebeccapurple;
	}
}
```

You can omit units: the plugin automatically converts unitless values into pixels:

```css
@media <=1024, >768 {...}
```
### Breakpoints
You can create an at-rule with aliases for breakpoints, for example:

```css
@breakpoints {
	desktop: 1024px;
	tablet: 768;
}
```

```css
@media <=desktop, >tablet {...}
```

### Aliases
Just place aliases for your mediaqueries in a separate at-rule and use them later:

```css
@breakpoints {
	desktop: 1024;
	phone: 480px;
}

@media-queries {
	tablet: <=desktop, >phone;
}

@media tablet {...}
```

## Inspiration
The plugin was inspired by awesome Sass mixin [include-media](http://include-media.com) by Eduardo Bouças and Hugo Giraudel.

## License
MIT