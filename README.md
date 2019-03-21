# WindowedList

WindowedList is a new take on infinite scroll/lazy loading. It works a lot like UITableView in iOS. WindowedList sets the height of the list element so that it is tall enough to contain all of your rows, but only renders the rows which are within the viewport. This method eliminates scoll jank entirely, unlike other infinite scrolling libraries I've seen.

