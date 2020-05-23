

# rohan.xyz

Vanilla javascript and CSS with no 3rd party libraries.

The site is designed to be as small as possible so it will load quickly and smoothly on even the shittiest internet connections. You only download **45kb** of data on page load (yes, including fonts).

A maximum of 200kb of image files are lazyloaded as you cycle through all the sections.
Photos (and thumbnails) and maps are also loaded on demand only.

After testing several different online mapping solutions, I settled on [Mapbox](https://www.mapbox.com/) and their vector tiles for the best performance on slow networks and mobile devices.

Because Google Analytics [can't even track](https://support.google.com/analytics/answer/2731565?hl=en) the simple task of session duration, I use [Clicky](https://clicky.com/) to monitor and analyse traffic

---


**Resources**

 - [smoothscroll](https://github.com/iamdustan/smoothscroll) - polyfill for [`scrollIntoView`](https://caniuse.com/#search=scrollintoview) on Safari
 - [svgo-cli](https://github.com/svg/svgo)
 - [sqip](https://github.com/axe312ger/sqip#CLI) - svg based polygonal placeholders for photos
 - [Clippy](https://bennettfeely.com/clippy/) - CSS `clip-path` playground
 - Rides scraped from the [Strava API](https://developers.strava.com) using Python.
 - Encoded polyline [algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) by Google - reduced file size of all rides by 95%
 - [Sqoosh](https://squoosh.app/) - Incredible PNG compressor
 - [Easings](https://easings.net/en)
  - [Website obesity](https://idlewords.com/talks/website_obesity.htm)


SASS source files in the `scss` directory. All JS files in the `js` directory, then combined and minified for production.

All colour related files are named  `bucket.*`

Feel free to reach out for any questions or general feedback:
rohanb10 [at] gmail 