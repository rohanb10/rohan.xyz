# rohan.xyz

![Initial Page Load Size](https://img.shields.io/badge/page_load-59.2kb-blue) ![JS Minified File Size](https://img.shields.io/badge/js_minified_size-8.6kb-success) ![CSS Minified File Size](https://img.shields.io/badge/css_minified_size-6.5kb-success) ![Photos File Size](https://img.shields.io/badge/image_assets-36.2MB-yellow) [![HitCount](http://hits.dwyl.com/rohanb10/rohanxyz.svg)](http://hits.dwyl.com/rohanb10/rohanxyz)

Vanilla javascript and CSS with no 3rd party libraries (except Maps).

The site is designed to be as small as possible so it will load quickly and smoothly on even the shittiest internet connections. You only download **60kb** of data on page load (yes, including fonts).

Around of 250kb of img assets are lazyloaded as you cycle through all the sections.
Thumbnails (~ 800kb), photos(~ 35mb if you open every single one) and maps (850kb+) are loaded on demand only.

Using [Mapbox](https://www.mapbox.com/) JS built on top of [Leaflet](https://leafletjs.com/) for maps. I am doing some fun stuff with polylines which isnt easy to make performant on vector based libraries.

Using a smaller 3rd party package called [ga-lite](https://github.com/jehna/ga-lite), a subset of Google Analytics without any of the bloat I dont use or need.

---
**Color List**
<div align="center">
	<img src="https://raw.githubusercontent.com/rohanb10/rohan.xyz/gh-pages/assets/color-list.png" alt="color list">
</div>


**Resources**
Things I used during the development process.
 - [svgo-cli](https://github.com/svg/svgo) - svg optimisation
 - [sqip](https://github.com/axe312ger/sqip#CLI) - svg based polygonal placeholders for photos
 - [Clippy](https://bennettfeely.com/clippy/) - CSS `clip-path` playground
 - Rides scraped from the [Strava API](https://developers.strava.com) using Python.
 - Encoded polyline [algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) by Google - reduced file size of all GPS coordinates by 97%.
 - [Sqoosh](https://squoosh.app/) - A better png compressor to strip unused colours out of images
 - [Easings](https://easings.net/en)

SASS source files in the `scss` directory. All JS files in the `js` directory, then combined and minified for production.

All colour related files are named  `bucket.*`.

Feel free to reach out for any questions or general feedback: [rohanb10@gmail.com](mailto:rohanb10@gmail.com)