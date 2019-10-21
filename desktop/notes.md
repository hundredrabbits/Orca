
OK! So much has to happen with this cursor in order for it to work with negative
scaling. Here are my proposals:

1) Initially, the cursor has a width and height of zero, not one. This represent
a point (or a single character in the grid). If you scale it to the right, left,
or up, down, etc. what you are doing it increasing that scale *BEYOND* zero
(positive or negative).

2) We don't just store an x, y, width, and height. We store:
   X, Y, Width, Height, and every time one of those things changes we recalculate
   minX, minY, maxY, maxY. This way we can always tell what is inside of the cursor
   very easily.

These two might look the same:

KX0
XX0
000

XX0
XK0
000

But they are not. It is important because having your cursor at 0, 0 with a
height of 1 and a width of one you can move down and you will have a 2 by 3 box:

KX0
XX0
XX0

But if you have your cursor at 1, 1 and you have your width -1 and your height
-1 then moving down actually shrinks your area! Resulting in:

000
XK0
000
