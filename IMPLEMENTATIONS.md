# Different type of implementations

If you for some reason is not able to use the recommended snippet, there are alternative ways of adding the script to your page.

## Requirejs

If you are using the default tracking snippet on a site that has requirejs installed, you may experience errors. The correct way to implement the script on such a page is as follows:

```
requirejs.config({
	paths: {
		pulse2: '//d1nf1ogr7o23z7.cloudfront.net/autoTracker.min',
	}
});

// pulse2opt could possibly go here.

var AutoTrack;

define(['pulse2'], function(a) {
	AutoTrack = a;
});

```

The pulse2opt object still needs to be present in your DOM like before, or you could put it before you define pulse2 with requirejs.