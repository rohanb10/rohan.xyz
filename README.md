# Personal website

I redesigned the site earlier this year to have a much cleaner UI and be compatible with a greater number of browsers and devices.

In addition to this, I worked hard on improving the performance of my site. I converted some of the assets into svg images, and all the remaining png files were compressed using TinyPNG. By doing this, I circumvented the need to use something like a Lazy Load plugin to keep things simpler. Instead, I focused on optimising the functions I already have, and using external dependencies very selectively. I finally managed to get the initial page load size under 300kb.

-------------------

Dependencies
-----
- Bootstrap - **Grid and responsive utilities only**, no js
- jQuery <sup>sorry</sup>
- jQuery UI - **Slide and fade effects only** <sup>sorry again</sup>
- Google Fonts - Source Sans Pro
- Google Maps Web API

-------------------

Testing
-----

The website was tested on and optimized for Safari and Google Chrome on both desktop and mobile devices.

There are some minor compatibility issues for the hero svg on Firefox and am working to fix them. Unfortunately, I have not been able to test this website on IE or Edge

-------------------

[Click here to visit rohan.xyz](http://rohan.xyz)
----------

-------------------

### Update - July 6, 2016

1. I am working on removing jQuery and jQuery UI from my site entirely and using native JavaScript instead. 
2. In addition to this, I am considering replacing my dependency on bootstrap and try using ``flex`` instead.
