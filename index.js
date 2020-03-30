let Vector2D = require('vector2d').Vector;
let Box = require('./shape/box');
let minmax = require('./math/minmax');

class BoundingBox 
{
    constructor(min_x, min_y, max_x, max_y, origin, degrees) 
    {
        this.min_x = min_x < max_x ? min_x : max_x;
        this.max_x = min_x > max_x ? min_x : max_x;
        this.min_y = min_y < max_y ? min_y : max_y;
        this.max_y = min_y > max_y ? min_y : max_y;
        this.degrees = degrees ? degrees % 360 : 0;
       
        if(origin instanceof Vector2D) {
            this.setOriginVector(origin);
            this.origin = BoundingBox.ORIGIN_MANUAL;
        }
        else {
            this.origin = origin ? origin : BoundingBox.ORIGIN_CENTER;
    		switch(origin) {
                case BoundingBox.ORIGIN_CENTER:
                    this.setOriginVector(new Vector2D(this.min_x + ((this.max_x - this.min_x) / 2),this.min_y + ((this.max_y - this.min_y) / 2)));
                    break;
                case BoundingBox.ORIGIN_LEFT_BOTTOM:
                    this.setOriginVector(new Vector2D(this.min_x, this.min_y));
                    break;
                case BoundingBox.ORIGIN_CENTER_BOTTOM:
                    this.setOriginVector(new Vector2D(this.min_x + ((this.max_x - this.min_x) / 2), this.min_y));
                    break;
                case BoundingBox.ORIGIN_RIGHT_BOTTOM:
                    this.setOriginVector(new Vector2D(this.max_x, this.min_y + ((this.max_y - this.min_y) / 2)));
                    break;
                case BoundingBox.ORIGIN_LEFT_CENTER:
                    this.setOriginVector(new Vector2D(this.min_x, this.min_y + ((this.max_y - this.min_y) / 2)));
                    break;
                case BoundingBox.ORIGIN_LEFT_TOP:
                    this.setOriginVector(new Vector2D(this.min_x, this.max_y));
                    break;                
                case BoundingBox.ORIGIN_CENTER_TOP:
                    this.setOriginVector(new Vector2D(this.min_x + ((this.max_x - this.min_x) / 2), this.max_y));
                    break;                
                case BoundingBox.ORIGIN_RIGHT_TOP:
                    this.setOriginVector(new Vector2D(this.max_x, this.max_y));
                    break;
                case BoundingBox.ORIGIN_RIGHT_CENTER:
                    this.setOriginVector(new Vector2D(this.max_x, this.min_y + ((this.max_y - this.min_y) / 2)));
                    break;
            }
        }
		
    }

    static create(origin_location, pos_x, pos_y, width, height, rotation_in_degrees) 
    {
        if(origin_location instanceof Vector2D) {
            let x_difference = pos_x - origin_location.getX();
            let y_difference = pos_y - origin_location.getY();
            let new_width = width - x_difference;
            let new_height = height - y_difference;
            
            return new BoundingBox(pos_x - x_difference, pos_y - y_difference,
                                   pos_x + new_width, pos_y + new_height,
                                   BoundingBox.ORIGIN_MANUAL, rotation)
            
        }
        if(isNaN(origin_location) || origin_location > 9 || origin_location < 1) {
            throw new Error("Invalid location of origin specified. " +
            		        "use BoundingBox.ORIGIN_CENTER or one of the other 8 options");
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

	getDegrees() {
		return this.degrees;
	}    

    check(bounding_box) 
    {
        if(!(bounding_box instanceof BoundingBox)) {
            throw new Error('Please provide a BoundingBox instance as argument to BoundingBox.intersects().');
        }
    }

	intersects_basic(bounding_box) {
		return ! ( 
	                bounding_box.min_x > this.max_x 
	             || bounding_box.max_x < this.min_x 
	             || bounding_box.max_y < this.min_y 
	             || bounding_box.min_y > this.max_y
	         );
	}    

    intersects(bounding_box) 
    {
        this.check(bounding_box);
		if((!this.getDegrees() && !bounding_box.getDegrees()) || (this.getDegrees() === 180 && bounding_box.getDegrees() === 180)) {
	        return this.intersects_basic(bounding_box);
		}
    }

	intersects_rotated(bounding_box) 
	{
		let box = this.getBox();
		let other_box = bounding_box.getBox();
		let normals = box.getNormals();
		let other_normals = other_box.getNormals();
		
		let result_P1 = minmax(box, normals[1]);
		let result_P2 = minmax(other_box, normals[1]);
		let result_Q1 = minmax(box, normals[0]);
		let result_Q2 = minmax(other_box, normals[0]);
		 
		//results of R, S
		let result_R1 = minmax(box, other_normals[1]);
		let result_R2 = minmax(other_box, other_normals[1]);
		let result_S1 = minmax(box, other_normals[0]);
		let result_S2 = minmax(other_box, other_normals[0]);
		 
		let separate_P = result_P1.max_proj < result_P2.min_proj || 
		                         result_P2.max_proj < result_P1.min_proj
		let separate_Q = result_Q1.max_proj < result_Q2.min_proj || 
		                         result_Q2.max_proj < result_Q1.min_proj
		let separate_R = result_R1.max_proj < result_R2.min_proj || 
		                         result_R2.max_proj < result_R1.min_proj
		let separate_S = result_S1.max_proj < result_S2.min_proj || 
		                         result_S2.max_proj < result_S1.min_proj
		return !(separate_P || separate_Q || separate_R || separate_S)
	}
	
	getBox() 
	{
		let box = new Box(...this.getPoints());
		if(this.degrees && this.degrees > 0 || this.degrees < 0) {
		    box = box.rotate(this.getOriginVector(), this.degrees)
		}
		return box;
	}
	
	/**
	 * @returns Vector2D location of origin point
	 */
	getOriginVector() 
	{
	    return this.origin_location;
	}
	
	/**
	 * @param origin_vector Vector2D
	 */
	setOriginVector(origin_vector) 
	{
	    if(!(origin_vector instanceof Vector2D)) {
	        throw new Error("Please provide npm vector2d.Vector")
	    }
	    this.origin_location = origin_vector;
	}
	
	getNormals() 
	{
		return this.getBox().getNormals();
	}
	getRotatedPoints() 
	{
	    return this.getBox().rotate(this.getOriginVector(), this.degrees).getPoints();
	}
	
	drawOnCanvas(ctx, multiplier_width, multiplier_height, boolean_fill, line_width, line_color, fill_color) 
	{
	    let points = this.getRotatedPoints();
	    
	    ctx.beginPath();
	    ctx.lineWidth = line_width ? line_width : 1;
        ctx.strokeStyle = line_color ? line_color : 'red';
	    let start = points.shift();
	    
	    ctx.moveTo(start.getX() * multiplier_width, start.getY() * multiplier_height);
	    points.forEach((vector, i) => {
	        ctx.lineTo(vector.getX() * multiplier_width, vector.getY() * multiplier_height);
	    });
	    ctx.lineTo(start.getX() * multiplier_width, start.getY() * multiplier_height);
	    if(boolean_fill) {
	        ctx.fillStyle = fill_color ? fill_color : 'goldenrod';
	        ctx.fill();
	    }        
        ctx.stroke();
	}
	
	getPoints() 
	{
		let points = [
			new Vector2D(this.getMaxX(), this.getMaxY()),
			new Vector2D(this.getMaxX(), this.getMinY()),
			new Vector2D(this.getMinX(), this.getMinY()),
			new Vector2D(this.getMinX(), this.getMaxY()),
		];
		return points;
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
BoundingBox.ORIGIN_MANUAL = 10;

module.exports = BoundingBox;
