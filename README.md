# Web Components Detector

Chrome extension (browser action) to detect and highlight web components on a
website.

Thought as a proposal for the already existing [page action extension][crx].
Core functionality taken from this [gist][gist-source].

Clicking the browser action icon will initially inject code and styles to the
active tab and highlight all web components. Afterwards a click toggles the
highlighting. There is an option to automatically init and highlight, switched
off by default.

[crx]: https://github.com/webcomponents/chrome-webcomponents-extension
[gist-source]: https://gist.github.com/ebidel/4bdbe9db55d8a775d0a4
