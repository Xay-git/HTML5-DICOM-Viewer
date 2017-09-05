/**
 * @namespace shape
 */
ovm.shape = ovm.shape || {};

/**
 * Definition of shape Lines
*/
ovm.shape.ruler = function(xPixelSpacing,yPixelSpacing,measure_Unit) {		
	var handle = 5;	
	var lines = [];
	var curr_line=null;
	
	var xPxlSpcing = xPixelSpacing;
	var yPxlSpcing = yPixelSpacing;
	var measureUnit = measure_Unit;
	
	this.createNewLine = function(x1,y1,x2,y2) {
		if(curr_line!=undefined) {
			curr_line.setCoords(x1,y1,x2,y2,false);
			if(parseInt(curr_line.len)>0) {
				lines.push(curr_line);
				curr_line = undefined;
			}
		}
	};
	
	this.initNewLine = function() {
		curr_line = new ovm.line(xPxlSpcing, yPxlSpcing,measureUnit, 0, 0, 0, 0, 0);
	};	
	
	this.draw = function(graphic,ctx) {		
		ctx.strokeStyle=ctx.fillStyle='orange';
		ctx.beginPath();		
		ctx.moveTo(graphic.x1,graphic.y1);
		ctx.lineTo(graphic.x2,graphic.y2);			
		ctx.stroke();
		ctx.closePath();
		// Handles		
		ctx.strokeStyle = ctx.fillStyle = graphic.active? 'red' : 'white';			
		ctx.strokeRect(graphic.x1-handle,graphic.y1-handle,handle*2,handle*2);
		ctx.strokeRect(graphic.x2-handle,graphic.y2-handle,handle*2,handle*2);
		// Text
		ctx.fillStyle = graphic.txtActive? "blue" : "maroon";
		ctx.globalAlpha = 0.7;	
		ctx.font = "14px Arial";	
		var text = ctx.measureText(graphic.len + " " + measureUnit);	
		ctx.fillRect(graphic.textX,graphic.textY,Math.ceil(text.width)+5,20);
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = "white";		
		ctx.fillText(graphic.len+" " + measureUnit,graphic.textX+2,graphic.textY+14);
		// Reference lines
		if(graphic.x1!=graphic.textX) {
			ctx.save();
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.strokeStyle = "yellow";
			ctx.setLineDash([10,7]);						
			var closestPt = this.getClosestAnchor([{x:graphic.textX,y:graphic.textY},{x:graphic.textX+Math.ceil(text.width+5),y:graphic.textY},{x:graphic.textX,y:graphic.textY+20},{x:graphic.textX+Math.ceil(text.width+5),y:graphic.textY+20}],{x:graphic.refX,y:graphic.refY});			
			ctx.moveTo(closestPt.x, closestPt.y);
			ctx.lineTo(graphic.refX,graphic.refY);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};
	
	this.drawData = function(ctx) {		
		ctx.save();		
		ctx.lineWidth='2';	

		for(var i=0;i<lines.length;i++) {			
			this.draw(this.viewPortGraphic(lines[i]),ctx);
		}
		ctx.restore();
	};
	
	this.drawRuler = function(canvasCtx,x1,y1,x2,y2) {
		curr_line.setCoords(x1,y1,x2,y2,true);
		canvasCtx.save();	
		canvasCtx.lineWidth='2';
		this.draw(this.viewPortGraphic(curr_line),canvasCtx);
		canvasCtx.restore();
	};
	
	this.getActiveLine = function(canvasCtx,x,y) {
		for(var i=0;i<lines.length;i++) {
			var line = lines[i];
			if(line.isActiveShape(canvasCtx,x,y)) {				
				return line;
			}			
		}
		return null;
	};	
	
	this.viewPortGraphic = function(shape) {
		return {
				x1:shape.x1*state.scale+state.translationX,
				y1:shape.y1*state.scale+state.translationY,
				x2:shape.x2*state.scale+state.translationX,
				y2:shape.y2*state.scale+state.translationY,
				textX:shape.textX*state.scale+state.translationX,
				textY:shape.textY*state.scale+state.translationY,
				refX:shape.refX*state.scale+state.translationX,
				refY:shape.refY*state.scale+state.translationY,
				active:shape.active,
				len:shape.len,
				txtActive:shape.txtActive				
			};
	};
	
	this.canvasToImgCoordinates = function(point) {
		return {x:(point.x-state.translationX)/state.scale,y:(point.y-state.translationY)/state.scale};
	};
	
	this.removeShape = function(shape) {
		lines.splice(lines.indexOf(shape), 1);
	};	
	
	this.clearAll = function() {
		lines = [];
	};
	
	this.getClosestAnchor = function(points,refPt) {		
		var dist1 = Math.round(Math.sqrt(Math.pow(points[0].x-refPt.x,2) + Math.pow(points[0].y-refPt.y,2)));
		var dist2 = Math.round(Math.sqrt(Math.pow(points[1].x-refPt.x,2) + Math.pow(points[1].y-refPt.y,2)));
		var dist3 = Math.round(Math.sqrt(Math.pow(points[2].x-refPt.x,2) + Math.pow(points[2].y-refPt.y,2)));
		var dist4 = Math.round(Math.sqrt(Math.pow(points[3].x-refPt.x,2) + Math.pow(points[3].y-refPt.y,2)));
		var min = Math.min(dist1,dist2,dist3,dist4);
		
		switch(min) {
			case dist1:
				return points[0];
			case dist2:
				return points[1];
			case dist3:
				return points[2];
			case dist4:
				return points[3];
			default:
				return points[0];
		}
	};
};

/**
 * @namespace line
 */

ovm.line = function(xPixelSpacing,yPixelSpacing,measure_Unit,a,b,c,d,e) {
	// Variables
	var handle = 5;
	this.xPxlSpcing = xPixelSpacing;
	this.yPxlSpcing = yPixelSpacing;
	this.measureUnit = measure_Unit;
	this.x1=a;
	this.y1=b;
	this.x2=c;
	this.y2=d;	
	this.active = false;	
	this.len = e;
	
	// Text
	this.textX = a;
	this.textY = b-25;
	this.txtActive = false;
	this.refX = 0;
	this.refY = 0;
	
	// Functions
	this.setCoords = function(a,b,c,d,active) {
		this.x1=(a-state.translationX)/state.scale;
		this.y1=(b-state.translationY)/state.scale;
		this.x2=(c-state.translationX)/state.scale;
		this.y2=(d-state.translationY)/state.scale;
		this.active = active;
		this.len = this.calculateLength(this.x2-this.x1, this.y2-this.y1).toFixed(3); 
		this.textX = this.x1;
		this.textY = this.y1-(25/state.scale);
		this.findClosestPointOnLine();
	};
	
	this.getType = function() {
		return "ruler";
	};
	
	this.isActiveShape = function(canvasCtx,x,y) {		
		var start = this.ImgTocanvascoordinates({x:this.x1,y:this.y1});
		var end = this.ImgTocanvascoordinates({x:this.x2,y:this.y2});
		var a = Math.round(Math.sqrt(Math.pow((end.x+handle)-(start.x+handle),2) + Math.pow((end.y+handle)-(start.y+handle),2)));
		var b = Math.round(Math.sqrt(Math.pow(x-(start.x+handle),2) + Math.pow(y-(start.y+handle),2)));
		var c = Math.round(Math.sqrt(Math.pow((end.x+handle)-x,2) + Math.pow((end.y+handle)-y,2)));
		this.active = (a==b+c);
		return this.active || this.isTextSelection(canvasCtx,x,y);
	};
	
	this.detectHandle = function(x,y,target) {
		var start = this.ImgTocanvascoordinates({x:this.x1,y:this.y1});
		var end = this.ImgTocanvascoordinates({x:this.x2,y:this.y2});
		
		if(x>=start.x-handle && x<=start.x+handle && y>=start.y-handle && y<=start.y+handle) {
			target.style.cursor = "pointer";
			return 0;
		} else if(x>=end.x-handle && x<=end.x+handle && y>=end.y-handle && y<=end.y+handle) {
			target.style.cursor = "pointer";
			return 1;
		} else {
			return -1;
		}
	};
	
	this.moveShape = function(deltaX,deltaY) {
		if(this.active) {
			this.x1+=deltaX;
			this.y1+=deltaY;
			this.x2+=deltaX;
			this.y2+=deltaY;
		}	
		this.textX+=deltaX;
		this.textY+=deltaY;
		this.findClosestPointOnLine();
	};
	
	this.resizeShape = function(deltaX,deltaY,handle) {
		switch(handle) {
			case 0:
				this.x1+=deltaX;
				this.y1+=deltaY;
				this.len= this.calculateLength(this.x2-this.x1, this.y2-this.y1).toFixed(3);
				break;
			case 1:
				this.x2+=deltaX;
				this.y2+=deltaY;
				this.len = this.calculateLength(this.x2-this.x1, this.y2-this.y1).toFixed(3);
				break;
		}
		this.findClosestPointOnLine();
	};
	
	this.calculateLength = function(xDiff,yDiff) {
		var mult = Math.max(this.getFloatShift(this.xPxlSpcing),this.getFloatShift(this.yPxlSpcing));
		var xDist = mult * this.xPxlSpcing * xDiff;
		var yDist = mult * this.yPxlSpcing * yDiff;
		
		return ((Math.sqrt((Math.pow(xDist,2)+Math.pow(yDist,2))/Math.pow(mult,2))))/10;
	};
	
	this.getFloatShift = function(floatNum) {
		var decimalLen = 0;
		var floatElements = floatNum.toString().split('\.');
		if(floatElements.length==2) {
			decimalLen = floatElements[1].length;
		}
		mult = Math.pow(10,decimalLen);
		return mult;
	};
	
	this.canvasToImgcoordinates = function(point) {	
		return {x:((point.x-state.translationX)/state.scale),y:((point.y-state.translationY)/state.scale)};
	};
	
	this.ImgTocanvascoordinates = function(point) {
		return {x:point.x*state.scale+state.translationX,y:point.y*state.scale+state.translationY};
	};
	
	this.isTextSelection = function(canvasCtx,mouseX,mouseY) {
		var x = (mouseX-state.translationX)/state.scale;
		var y = (mouseY-state.translationY)/state.scale;
		
		var textWid = Math.ceil(canvasCtx.measureText(this.len + " " + this.measureUnit).width)+5;
		this.txtActive = (x>=this.textX && x<=this.textX+(textWid/state.scale) && y>=this.textY && y<=(this.textY+(20/state.scale)));
		return this.txtActive;		
	};
	
	this.findClosestPointOnLine = function() {	
		var ptWithinLine = true;			
		
		var dotproduct = (this.textX - this.x1) * (this.x2 - this.x1) + (this.textY - this.y1)*(this.y2 - this.y1);
		if(dotproduct<0) {
			ptWithinLine = false;
		}
		
		var squaredlengthBA = (this.x2 - this.x1)*(this.x2 - this.x1) + (this.y2 - this.y1)*(this.y2 - this.y1);
		
		if(dotproduct > squaredlengthBA) {
			ptWithinLine = false;
		}
	
		if(ptWithinLine) {
			var a_to_p = [this.textX - this.x1 , this.textY - this.y1]; // Vector A to P
			var a_to_b = [this.x2 - this.x1 , this.y2 - this.y1]; // Vector A to B

			// Find squared magnitude of a_to_b
			var atb2 = Math.pow(a_to_b[0],2) + Math.pow(a_to_b[1],2);

			// Find dot product of a_to_p and a_to_b
			var atp_dot_atb = a_to_p[0] * a_to_b[0] + a_to_p[1] * a_to_b[1];

			// Normalized distance from a to closest point
			var t = atp_dot_atb / atb2;

			// Add the distance to A, moving towards B
			this.refX = this.x1 + a_to_b[0] * t;
			this.refY = this.y1 + a_to_b[1] * t;
		} else {
			var p_to_a = Math.sqrt(Math.pow(this.textX-this.x1,2) + Math.pow(this.textY-this.y1,2));	// Distance from Point to A
			var p_to_b = Math.sqrt(Math.pow(this.textX-this.x2,2) + Math.pow(this.textY-this.y2,2));	// Distance from Point to B
			
			if(p_to_b>p_to_a) {
				this.refX = this.x1;
				this.refY = this.y1;
			} else {
				this.refX = this.x2;
				this.refY = this.y2;
			}
		}					
	};
};