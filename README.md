# WindowedList

WindowedList is a new take on infinite scroll/lazy loading. It fixes the container's height to be tall enough to contain all rows, and positions the rendered rows absolutely inside the container. This approach completely eliminates scroll jank.

This project creates a component for Mithril.js, but I may add a React component in the future.

This component was created for another personal hobby project of mine. I ended up putting more time into it than planned, so I figured it was worth it's own repository.

## Demo

[Demo](https://a-p-f.github.io/windowed-list/) (note - the demo is just this exact repository on Github pages). This demo renders a list with 100,000 rows. It's initially scrolled to the middle of the list, to demonstrate bi-directional lazy loading.

I've only tested this in Chrome so far. I first tried the demo with row_count set to 1,000,000, but Chrome didn't render the entire div.

## Code Structure

Right now this component uses [Mithril.js](https://mithril.js.org/). A good portion of the code is abstracted into a separate file (WindowedListWatcher.js). It should be pretty easy to make a React version of MithrilWindowedList, utilizing WindowedListWatcher.   

## Usage

If you want to try using this in your own projects, just get the source (I recommend adding as a git submodule, if you're already using git in your project) and import MithrilWindowedList.js. See how I've done this in the demo (index.html).

## Limitations

- All rows must have the same height
- Length of list must be fixed (though I think a hybrid approach, where you dynamically change the range of your data source, should be pretty simple to achieve)

## Render Modes

MithrilWindowedList supports 3 different "render modes".

### Simple

### Shift

### Cycle

## TODO

- document render modes
- make more advanced demo, with controls for changing row count and render mode
- try using css background gradients on the list, instead of borders on rows
- support other scroll parents
- support horizontal scrolling

