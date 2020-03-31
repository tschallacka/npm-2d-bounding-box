let Vector2D = require('vector2d').Vector;

class Box 
{
	constructor(vector2d_point1, vector2d_point2, vector2d_point3, vector2d_point4) 
	{
	    /** Allow for quick cloning to save 
	     * on calculations
	     */
	    if(vector2d_point1 === Box.CLONE_MARKER) {
	        return;
	    }
		if(!(
			vector2d_point1 instanceof Vector2D &&
			vector2d_point2 instanceof Vector2D &&
			vector2d_point3 instanceof Vector2D &&
			vector2d_point4 instanceof Vector2D
			)
		) {
			throw new Error('Please provide npm vector2d.Vector instances to create a Box');
		}	
		/** be paranoid and don't trust the provider not to change the coordinates */
		this.point1 = vector2d_point1.clone();
		this.point2 = vector2d_point2.clone();
		this.point3 = vector2d_point3.clone();
		this.point4 = vector2d_point4.clone();	
		this.normal1 = vector2d_point2.clone().subtract(vector2d_point1).normalize();
		this.normal2 = vector2d_point3.clone().subtract(vector2d_point2).normalize();
		this.normal3 = vector2d_point4.clone().subtract(vector2d_point3).normalize();
		this.normal4 = vector2d_point1.clone().subtract(vector2d_point4).normalize();
	}
	
	clone() 
	{
	    let box = new Box(Box.CLONE_MARKER);
	    box.point1 = this.point1.clone();
	    box.point2 = this.point2.clone();
	    box.point3 = this.point3.clone();
	    box.point4 = this.point4.clone();  
        box.normal1 = this.normal1.clone();
        box.normal2 = this.normal2.clone();
        box.normal3 = this.normal3.clone();
        box.normal4 = this.normal4.clone();
	    return box;
	}
	
	/**
	 * returns a new Box based on this box, rotated around the given points.
	 */
	rotate(origin_vector, degrees) 
	{
	    if(!(origin_vector instanceof Vector2D)) {
	        throw new Error("Please provide an npm vector2d.Vector instance as the origin point");
	    }
	    degrees = degrees % 360;
	    if(degrees < 0) {
	        degrees = 360 - degrees;
	    }
	    let radians = (Math.PI / 180) * degrees;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let points = this.getPoints();
	    let rotated_points = [];
	    points.forEach((vector, index) => {
	       rotated_points.push(this.rotateVectorPoint(vector, radians, cos, sin, origin_vector)); 
	    });
	    return new Box(...rotated_points);
	}
	
	rotateVectorPoint(point, radians, cos, sin, origin) 
	{
	    let x = point.getX();
	    let y = point.getY();
	    let ox = origin.getX();
	    let oy = origin.getY();
	    
	    let nx = (cos * (x - ox)) + (sin * (y - oy)) + ox;
        let ny = (cos * (y - oy)) - (sin * (x - ox)) + oy;
        return new Vector2D(nx, ny);
	}
	/**
	 * @returns Vector2D[];
	 */
	getPoints() 
	{
		return [this.point1.clone(), this.point2.clone(), this.point3.clone(), this.point4.clone()];	
	}
	
	getNormals() 
	{
		return [this.normal1.clone(), this.normal2.clone(), this.normal3.clone(), this.normal4.clone()];
	}	
}
Box.CLONE_MARKER = 42;
module.exports = Box;