let Vector2D = require('vector2d');

module.exports = class Box 
{
	constructor(vector2d_point1, vector2d_point2, vector2d_point3, vector2d_point4) 
	{
		if(!(
			vector2d_point1 instanceof Vector2D &&
			vector2d_point2 instanceof Vector2D &&
			vector2d_point3 instanceof Vector2D &&
			vector2d_point4 instanceof Vector2D
			)
		) {
			throw new Error('Please provide npm vector2d instances to create a Box');
		}	
		/** be paranoid and don't trust the provider not to change the coordinates */
		this.point1 = point1.clone();
		this.point2 = point2.clone();
		this.point3 = point3.clone();
		this.point4 = point4.clone();	
		this.normal1 = point2.clone().subtract(point1).normalize();
		this.normal2 = point3.clone().subtract(point2).normalize();
		this.normal3 = point4.clone().subtract(point3).normalize();
		this.normal4 = point1.clone().subtract(point4).normalize();
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