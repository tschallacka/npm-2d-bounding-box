class BoundingBox 
{
    constructor(min_x, min_y, max_x, max_y, origin) 
    {
        this.min_x = min_x < max_x ? min_x : max_x;
        this.max_x = min_x > max_x ? min_x : max_x;
        this.min_y = min_y < max_y ? min_y : max_y;
        this.max_y = min_y > max_y ? min_y : max_y;
        this.origin = origin ? origin : BoundingBox.ORIGIN_CENTER;
    }
    static create(origin_location, pos_x, pos_y, width, height) 
    {
        if(isNaN(origin_location) || origin_location > 9 || origin_location < 1) {
            throw new Error("Invalid location of origin specific. use BoundingBox.ORIGIN_CENTER or one of the other 8 options");
        }
        
        let half_width = width / 2;
        let half_height = height / 2;
        
        switch(origin_location) {
            case BoundingBox.ORIGIN_CENTER:
                return new BoundingBox(pos_x - half_width, pos_y - half_height,
                                       pos_x + half_width, pos_y + half_height, 
                                       origin_location);
            case BoundingBox.ORIGIN_LEFT_BOTTOM:
                return new BoundingBox(pos_x, pos_y - height,
                        pos_x + width, pos_y, 
                        origin_location);
            case BoundingBox.ORIGIN_CENTER_BOTTOM:
                return new BoundingBox(pos_x - half_width, pos_y - height,
                        pos_x + half_width, pos_y, 
                        origin_location);
            case BoundingBox.ORIGIN_RIGHT_BOTTOM:
                return new BoundingBox(pos_x - width, pos_y - height,
                        pos_x, pos_y, 
                        origin_location);
            case BoundingBox.ORIGIN_LEFT_CENTER:
                return new BoundingBox(pos_x, pos_y - half_height,
                                       pos_x + width, pos_y + half_height, 
                                       origin_location);
            case BoundingBox.ORIGIN_LEFT_TOP:
                return new BoundingBox(pos_x, pos_y,
                        pos_x + width, pos_y + height, 
                        origin_location);
                
            case BoundingBox.ORIGIN_CENTER_TOP:
                return new BoundingBox(pos_x - half_width, pos_y,
                        pos_x + half_width, pos_y + height, 
                        origin_location);
                
            case BoundingBox.ORIGIN_RIGHT_TOP:
                return new BoundingBox(pos_x - width, pos_y,
                        pos_x, pos_y + height, 
                        origin_location); 
                
            case BoundingBox.ORIGIN_RIGHT_CENTER:
                return new BoundingBox(pos_x - width, pos_y - half_height,
                                       pos_x, pos_y + half_height, 
                                       origin_location);
        }
    }
    
    getMinX() {
        return this.min_x;
    }
    getMinY() {
        return this.min_y;
    }
    getMaxX() {
        return this.max_x;
    }
    getMaxY() {
        return this.max_y;
    }
    getOrigin() {
        return this.origin;
    }
    
    getHeight()
    {
        return this.max_y - this.min_y;
    }
    
    getWidth() 
    {
        return this.max_x - this.min_x;
    }
    
    check(bounding_box) 
    {
        if(!(bounding_box instanceof BoundingBox)) {
            throw new Error('Please provide a BoundingBox instance as argument to BoundingBox.intersects().');
        }
    }
    
    intersects(bounding_box) 
    {
        this.check(bounding_box);
        return ! ( 
                bounding_box.min_x > this.max_x 
             || bounding_box.max_x < this.min_x 
             || bounding_box.max_y < this.min_y 
             || bounding_box.min_y > this.max_y
         );
    }
    
    expand(bounding_box) 
    {
        this.check(bounding_box);
        
        if(bounding_box.min_x < this.min_x) {
            this.min_x = bounding_box.min_x;
        }
        if(bounding_box.min_y < this.min_y) {
            this.min_y = bounding_box.min_y;
        }
        if(bounding_box.max_x > this.max_x) {
            this.max_x = bounding_box.max_x;
        }
        if(bounding_box.max_y > this.max_y) {
            this.max_y = bounding_box.max_y;
        }
    }
    
    clone() 
    {
        return new BoundingBox(this.min_x, this.min_y, this.max_x, this.max_y, this.origin);
    }
}

BoundingBox.ORIGIN_CENTER = 1;
BoundingBox.ORIGIN_LEFT_BOTTOM = 2;
BoundingBox.ORIGIN_RIGHT_BOTTOM = 3;
BoundingBox.ORIGIN_CENTER_BOTTOM = 4;
BoundingBox.ORIGIN_LEFT_CENTER = 5;
BoundingBox.ORIGIN_LEFT_TOP = 6;
BoundingBox.ORIGIN_CENTER_TOP = 7;
BoundingBox.ORIGIN_RIGHT_TOP = 8;
BoundingBox.ORIGIN_RIGHT_CENTER = 9;

module.exports = BoundingBox;
