### simple 2d bounding box library

Note, this is still in alpha and may contain lots and lots of bugs.
Please make an issue if you encounter a bug.

To use it:

```javascript
let BoundingBox = require('2d-bounding-box');

let bb_create = new BoundingBox( min_x, min_y, max_x, max_y, [origin_type], [rotation_in_degrees]);
```

Sometimes you already have an entity with a certain width and height, and you wish
to create a bounding box based on the dimensions of this creature without having to
calculate the correct positions yourself.

Important is for these calculations that you define where the origin of your 
entity is. Is it smack in the middle of the entity that decides the position 
or anywhere around the entity, bottom left for example. 

```javascript
let bb_from_entity = BoundingBox.create( origin_type, position_x, position_y, width, height, [rotation_in_degrees]);
```

To check if a BoundingBox intersects another bounding box, use the intersects method.

```javascript
let bb_from_entity = BoundingBox.create( origin_type, position_x, position_y, width, height, [rotation_in_degrees]);
let bb_other_entity = BoundingBox.create( origin_type, position_x, position_y, width, height, [rotation_in_degrees]);

if(bb_from_entity.intersects(bb_other_entity)) {
    // whatever to do on collsion.
}
```

For the origin type there are 9 possible options:

```javascript
BoundingBox.ORIGIN_CENTER;
BoundingBox.ORIGIN_LEFT_BOTTOM;
BoundingBox.ORIGIN_RIGHT_BOTTOM;
BoundingBox.ORIGIN_CENTER_BOTTOM;
BoundingBox.ORIGIN_LEFT_CENTER;
BoundingBox.ORIGIN_LEFT_TOP;
BoundingBox.ORIGIN_CENTER_TOP;
BoundingBox.ORIGIN_RIGHT_TOP;
BoundingBox.ORIGIN_RIGHT_CENTER;
```

If you need more options, you will have to calculate the offsets yourself and
instantiate the bounding box via the `new BoundingBox(...)` method.

**design choice**

This bounding box is intended to be newly generated on every gameloop iteration.
Do not store this in some fixed variable that survives many game loops as this may lead
to memory issues. Generate, compare, dispose. These are disposable objects.

Please see the [demo_basic_bb.html](demo/demo_basic_bb.html) file in the demo directory for examples.

If you wish to fiddle with the [demo_basic.js](demo/js/demo_basic.js) file recompile it with
`gulp less browserify` before refreshing the demo_basic_bb.html file. 
