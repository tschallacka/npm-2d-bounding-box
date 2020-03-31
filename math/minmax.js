let Box = require('../shape/box.js');
let Vector2D = require('vector2d').Vector;
module.exports = function(box, axis_vector) 
{
	if(!(box instanceof Box)) {
		throw new Error("Please provide 2d-bounding-box/shape/Box instance as the first argument");
	}	
	if(!(axis_vector instanceof Vector2D)) {
		throw new Error("Please provide npm vector2d instance as the axis on the second argument");
	}
	let vectors_box = box.getPoints();
	
	let min_projected_box = vectors_box[0].dot(axis_vector);
	let max_projected_box = min_projected_box;
	
	let min_dot_box = 0;
	let max_dot_box = 0;
	
	for( let i = 1; i < vectors_box.length; i++) {
		let current_projection = vectors_box[i].dot(axis_vector);
		
		if(min_projected_box > current_projection) {
			min_projected_box = current_projection;
			min_dot_box = i;
		}
		if (current_projection > max_projected_box) {
			max_projected_box = current_projection
			max_dot_box = i
		}
	}
	return { 
		minimum_projection: min_projected_box,
		maximum_projection: max_projected_box,
		min_index: min_dot_box,
		max_index: max_dot_box
	}
}