**Planted bug:** `helpers.js` defines `formatTime` but doesn't export it, so `playlist.js` gets `undefined` and fails with `formatTime is not a function`.
**Lesson:** a module only shares what it exports; `require` gives you exactly that object.
**Accepted fixes:** add `formatTime` to `module.exports` in `helpers.js`. (Copying the function into `playlist.js` passes the tests but misses the point; worth discussing.)
**Good hint (rung 3):** "Add `console.log(require("./helpers"))` at the top of `playlist.js`. What's in it?"
