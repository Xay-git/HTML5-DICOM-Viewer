/**
 * Definition of shape Rectangles
*/

ovm.shape.rect = function(xPixelSpacing,yPixelSpacing,measure_Unit) {
	var handle = 5;
	var rects = [];
	var curr_rect = null;
	var xPxlSpcing = xPixelSpacing;
	var yPxlSpcing = yPixelSpacing;
	var measureUnit = measure_Unit;
	
	this.createNewRect = function(x1,y1,x2,y2) {
		if(curr_rect!=undefined) {
			curr_rect.setCoords(x1,y1,x2,y2,false);
			if(parseFloat(curr_rect.area)>0.0) {
				curr_rect.meanOfRect();
				curr_rect.stdDevOfRect();
				rects.push(curr_rect);
				curr_rect = undefined;
			}
		}
	};
	
	this.initNewRect = function() {
		curr_rect = new ovm.rect(xPxlSpcing, yPxlSpcing, measureUnit, 0, 0, 0, 0, 0);
	};
	
	this.draw = function(graphic,canvasCtx) {
		canvasCtx.lineWidth='2';
		canvasCtx.strokeStyle=canvasCtx.fillStyle='orange';		
		var w = graphic.x2-graphic.x1;
		var h = graphic.y2-graphic.y1;
		canvasCtx.strokeRect(graphic.x1,graphic.y1,w,h);
		
		// Handles
		if(graphic.active) {
			canvasCtx.strokeStyle = canvasCtx.fillStyle = 'white';
			canvasCtx.strokeRect(graphic.x1-handle,graphic.y1-handle,handle*2,handle*2);
			canvasCtx.strokeRect(graphic.x1+(w/2)-handle,graphic.y1-handle,handle*2,handle*2);			
			canvasCtx.strokeRect((graphic.x1+w)-handle,graphic.y1-handle,handle*2,handle*2);		
			canvasCtx.strokeRect(graphic.x1-handle,graphic.y1+(h/2)-handle,handle*2,handle*2);
			canvasCtx.strokeRect((graphic.x1+w)-handle,graphic.y1+(h/2)-handle,handle*2,handle*2);
			canvasCtx.strokeRect(graphic.x1-handle,(graphic.y1+h)-handle,handle*2,handle*2);
			canvasCtx.strokeRect(graphic.x1+(w/2)-handle,(graphic.y1+h)-handle,handle*2,handle*2);
			canvasCtx.strokeRect((graphic.x1+w)-handle,(graphic.y1+h)-handle,handle*2,handle*2);
		}
		
		// Text
		canvasCtx.fillStyle = graphic.txtActive? "blue" : "maroon";
		canvasCtx.globalAlpha = 0.5;	
		canvasCtx.font = "14px Arial";	

		var text = canvasCtx.measureText(graphic.stdDev.length>graphic.area.length? graphic.stdDev : graphic.area);			
		canvasCtx.fillRect(graphic.textX,graphic.textY,Math.ceil(text.width)+10,60);
		canvasCtx.globalAlpha = 0.9;
		canvasCtx.fillStyle = "white";		
		canvasCtx.fillText(graphic.area,graphic.textX+2,graphic.textY+15);
		canvasCtx.fillText(graphic.mean,graphic.textX+2,graphic.textY+35);
		canvasCtx.fillText(graphic.stdDev,graphic.textX+2,graphic.textY+55);
		
		// Reference Lines
		if(graphic.x1!=graphic.textX) {
			canvasCtx.save();
			canvasCtx.beginPath();
			canvasCtx.strokeStyle = "yellow";
			canvasCtx.setLineDash([10,7]);
			var closestPt = this.getClosestAnchor([{x:graphic.textX,y:graphic.textY},{x:graphic.textX+Math.ceil(text.width+10),y:graphic.textY},{x:graphic.textX,y:graphic.textY+60},{x:graphic.textX+Math.ceil(text.width+10),y:graphic.textY+60}],{x:graphic.refX,y:graphic.refY});			
			canvasCtx.moveTo(closestPt.x, closestPt.y);
			canvasCtx.lineTo(graphic.refX,graphic.refY);						
			canvasCtx.stroke();
			canvasCtx.closePath();
			canvasCtx.restore();
		}
	};
	
	this.drawData = function(ctx) {
		ctx.save();
		
		for(var i=0;i<rects.length;i++) {
			this.draw(this.viewPortGraphic(rects[i]),ctx);
		}
		ctx.restore();
	};
	
	this.drawRect = function(canvasCtx,x1,y1,x2,y2) {
		curr_rect.setCoords(x1,y1,x2,y2,true);
		canvasCtx.save();	
		canvasCtx.strokeStyle=canvasCtx.fillStyle='orange';
		canvasCtx.lineWidth='2';
		this.draw(this.viewPortGraphic(curr_rect),canvasCtx);
		canvasCtx.restore();
	};
	
	this.getActiveRect = function(canvasCtx,x,y) {
		for(var i=0;i<rects.length;i++) {
			var rect = rects[i];
			if(rect.isShapeSelection(canvasCtx,x,y)) {				
				return rect;
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
					txtActive:shape.txtActive,
					area:shape.txtArea,					
					mean:shape.txtMean,
					stdDev:shape.txtStdDev
			};
	};
	
	this.canvasToImgCoordinates = function(point) {
		return {x:(point.x-state.translationX)/state.scale,y:(point.y-state.translationY)/state.scale};
	};
	
	this.removeShape = function(shape) {
		rects.splice(rects.indexOf(shape), 1);
	};
	
	this.clearAll = function() {
		rects = [];
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
 * @namespace rect
*/

ovm.rect = function(xPixelSpacing,yPixelSpacing,measure_Unit,a,b,c,d,e) {
	// Variables
	var handle = 5;
	this.xPxlSpcing = xPixelSpacing;
	this.yPxlSpcing = yPixelSpacing;
	this.measureUnit = measure_Unit;
	if(this.measureUnit=="cm") {
		this.measureUnit = this.measureUnit + String.fromCharCode(178);
	}
	this.x1=a;
	this.y1=b;
	this.x2=c;
	this.y2=d;
	this.width;
	this.height;
	this.active = false;
	this.area = e;
	this.mean = "";
	this.stdDev = "";
	
	// Text
	this.textX = a;
	this.textY = b-50;
	this.txtActive = false;
	this.txtArea = "Area     : " + this.area + " " + this.measureUnit;
	this.txtMean = "Mean    : ";
	this.txtStdDev = "StdDev : ";
	this.refX = 0;
	this.refY = 0;
	
	// Functions
	this.setCoords = function(a,b,c,d,active) {
		this.x1 = Math.round((a-state.translationX)/state.scale);
		this.y1 = Math.round((b-state.translationY)/state.scale);
		this.x2 = Math.round((c-state.translationX)/state.scale);
		this.y2 = Math.round((d-state.translationY)/state.scale);
		this.width = Math.round((this.x2-this.x1)*this.xPxlSpcing);
		this.height = Math.round((this.y2-this.y1)*this.yPxlSpcing);		
		this.active = active;		
		this.area = ((this.width*this.height)/100).toFixed(3);
		this.txtArea = "Area     : " + this.area + " " + this.measureUnit;
		this.textX = this.x1;
		this.textY = this.y1-(100/state.scale);
		this.fixReferenceLinePoints();
	};
	
	this.getType = function() {
		return "rect";
	};
	
	this.isShapeSelection = function(canvasCtx,x,y) {
		var point = this.canvasToImgcoordinates({x:x,y:y});		
		var w = this.x2-this.x1,h = this.y2-this.y1;
		point = {x:Math.round(point.x),y:Math.round(point.y)};
		
		this.active = this.isLineIntersects(this.x1,this.y1,this.x1+w,this.y1,point.x,point.y) || this.isLineIntersects(this.x1,this.y1+h,this.x1+w,this.y1+h,point.x,point.y) || this.isLineIntersects(this.x1,this.y1,this.x1,this.y1+h,point.x,point.y) || this.isLineIntersects(this.x1+w,this.y1,this.x1+w,this.y1+h,point.x,point.y);
		
		return this.active || this.isTextSelection(canvasCtx,x,y);
	};
	
	
	this.isActiveShape = function(canvasCtx,x,y) {		
		var point = this.canvasToImgcoordinates({x:x,y:y});		
		var w = this.x2-this.x1,h = this.y2-this.y1;
		this.active = (this.x1<=point.x && this.x1+w>=point.x && this.y1<=point.y && this.y1+h>=point.y) ? true : false;
		return this.active || this.isTextSelection(canvasCtx,x,y);
	};
		
	this.detectHandle = function(x,y,target) {
		var point = this.canvasToImgcoordinates({x:x,y:y});
		var w = this.x2-this.x1;
		var h = this.y2-this.y1;

		if(point.x>=this.x1-handle && point.x<=this.x1+handle && point.y>=this.y1-handle && point.y<=this.y1+handle) {
			target.style.cursor = 'nw-resize';
			return 0;			
		} else if(point.x>=((this.x1+(w/2))-handle) && point.x<=((this.x1+(w/2))+handle) && point.y>=this.y1-handle && point.y<=this.y1+handle) {
			target.style.cursor = 'n-resize';
			return 1;			
		} else if(point.x>=((this.x1+w)-handle) && point.x<=(this.x1+w+handle) && point.y>=this.y1-handle && point.y<=this.y1+handle) {
			target.style.cursor = 'ne-resize';
			return 2;			
		} else if(point.x>=this.x1-handle && point.x<=this.x1+handle && point.y>=((this.y1+(h/2))-handle) && point.y<=((this.y1+(h/2))+handle)) {
			target.style.cursor = 'w-resize';
			return 3;			
		} else if(point.x>=((this.x1+w)-handle) && point.x<=(this.x1+w+handle) && point.y>=((this.y1+(h/2))-handle) && point.y<=((this.y1+(h/2))+handle)) {
			target.style.cursor = 'e-resize';
			return 4;			
		} else if(point.x>=(this.x1-handle) && point.x<=(this.x1+handle) && point.y>=((this.y1+h)-handle) && point.y<=(this.y1+h+handle)) {
			target.style.cursor = 'sw-resize';
			return 5;			
		} else if(point.x>=((this.x1+(w/2))-handle) && point.x<=((this.x1+(w/2))+handle) && point.y>=((this.y1+h)-handle) && point.y<=(this.y1+h+handle)) {
			target.style.cursor = 's-resize';
			return 6;			
		} else if(point.x>=((this.x1+w)-handle) && point.x<=(this.x1+w+handle) && point.y>=((this.y1+h)-handle) && point.y<=(this.y1+h+handle)) {			
			target.style.cursor = 'se-resize';
			return 7;			
		} else {
			target.style.cursor = 'default';
			return -1;
		}	
		
	};
	
	this.moveShape = function(deltaX,deltaY) {
		if(this.active) {
			this.x1+=deltaX;
			this.y1+=deltaY;
			this.x2+=deltaX;
			this.y2+=deltaY;
			
			this.width = Math.round((this.x2-this.x1)*this.xPxlSpcing);
			this.height = Math.round((this.y2-this.y1)*this.yPxlSpcing);		
			this.txtMean = "Mean    : ";
			this.txtStdDev = "StdDev : ";
		}
		this.textX+=deltaX;
		this.textY+=deltaY;
		this.fixReferenceLinePoints();
	};
	
	this.resizeShape = function(deltaX,deltaY,handle) {		
		switch(handle) {
			case 0:				
				this.x1+=deltaX;
				this.y1+=deltaY;
				break;
			case 1:
				this.y1+=deltaY;
				break;
			case 2:
				this.x2+=deltaX;
				this.y1+=deltaY;
				break;
			case 3:
				this.x1+=deltaX;
				break;
			case 4:
				this.x2+=deltaX;
				break;
			case 5:		
				this.x1+=deltaX;
				this.y2+=deltaY;
				break;
			case 6:
				this.y2+=deltaY;
				break;				
			case 7:
				this.x2+=deltaX;
				this.y2+=deltaY;
				break;
		}
		this.textX+=deltaX;
		this.textY+=deltaY;
		
		this.width = Math.round((this.x2-this.x1)*this.xPxlSpcing);
		this.height = Math.round((this.y2-this.y1)*this.yPxlSpcing);
		this.area = ((this.width*this.height)/100).toFixed(3);
		this.txtArea = "Area     : " + this.area + " " + this.measureUnit;
		this.txtMean = "Mean    : ";
		this.txtStdDev = "StdDev : ";
		this.fixReferenceLinePoints();
	};
	
	this.meanOfRect = function() {
		var sum = 0, pixelCount = 0;
		
		for(var i = this.x1;i<this.x1+this.width;i++) {
			for(var j = this.y1;j<this.y1+this.height;j++) {
				++pixelCount;
				var pixel = getPixelValAt(i,j);				
				if(pixel!=undefined) {				
					sum+=pixel;
				}
			}
		}
		if(pixelCount==0) {
			return 0;
		}
		
		this.mean = (sum/pixelCount).toFixed(3);
		this.txtMean = "Mean    : " + this.mean;
	};
	
	this.stdDevOfRect = function() {
		var sum = 0,pixelCount = 0;
		for(var i = this.x1;i<this.x1+this.width;i++) {
			for(var j = this.y1;j<this.y1+this.height;j++) {
				++pixelCount;
				var value = getPixelValAt(i,j);
				if(value!="undefined") {
					var deviation = value - this.mean;
					sum+=deviation * deviation;
				}				
			}
		}
		if(pixelCount==0) {
			return 0;
		}
		this.stdDev = Math.sqrt(sum/pixelCount).toFixed(3);
		this.txtStdDev = "StdDev : " + this.stdDev;
	};
	
	this.measure = function() {
		this.meanOfRect();
		this.stdDevOfRect();
	};
	
	this.canvasToImgcoordinates = function(point) {	
		return {x:((point.x-state.translationX)/state.scale),y:((point.y-state.translationY)/state.scale)};
	};
	
	this.ImgTocanvascoordinates = function(point) {
		return {x:point.x*state.scale+state.translationX,y:point.y*state.scale+state.translationY};
	};
	
	this.isTextSelection = function(canvasCtx,mouseX,mouseY) {
		var point = this.canvasToImgcoordinates({x:mouseX,y:mouseY});
		
		var text = canvasCtx.measureText(this.txtStdDev.length>this.txtArea.length? this.txtStdDev : this.txtArea);			
		this.txtActive = (point.x>=this.textX && point.x<=this.textX+(Math.ceil((text.width+state.translationX)/state.scale)) && point.y>=this.textY && point.y<=(this.textY+(60/state.scale)));
		return this.txtActive;	
	};
	
	this.isLineIntersects = function(x1,y1,x2,y2,x,y) {
		var a = Math.round(Math.sqrt(Math.pow((x2+handle)-(x1+handle),2) + Math.pow((y2+handle)-(y1+handle),2)));
		var b = Math.round(Math.sqrt(Math.pow(x-(x1+handle),2) + Math.pow(y-(y1+handle),2)));
		var c = Math.round(Math.sqrt(Math.pow((x2+handle)-x,2) + Math.pow((y2+handle)-y,2)));		
		return (a==b+c);
	};
	
	this.fixReferenceLinePoints = function() {		
		if(this.textX>=this.x1 && this.textX<=this.x2 && this.textY<=this.y1 && this.textY<=this.y2  && this.isPtWithinLine({x:this.x1,y:this.y1}, {x:this.x2,y:this.y1}, {x:this.textX,y:this.textY})) {	
			this.findClosestPointForLine({x:this.x1,y:this.y1}, {x:this.x2,y:this.y1}, {x:this.textX,y:this.textY});
		} 
		else if(this.textY>=this.y1 && this.textY<=this.y2 && this.textX<=this.x1 && this.textX<=this.x2 && this.isPtWithinLine({x:this.x1,y:this.y1}, {x:this.x1,y:this.y2}, {x:this.textX,y:this.textY})) {
			this.findClosestPointForLine({x:this.x1,y:this.y1}, {x:this.x1,y:this.y2}, {x:this.textX,y:this.textY});
		}
		else if(this.textX>=this.x1 && this.textX<=this.x2 && this.textY>=this.y1 && this.textY>=this.y2 && this.isPtWithinLine({x:this.x1,y:this.y2},{x:this.x2,y:this.y2},{x:this.textX,y:this.textY})) {
			this.findClosestPointForLine({x:this.x1,y:this.y2},{x:this.x2,y:this.y2},{x:this.textX,y:this.textY});
		}
		else if(this.textY>=this.y1 && this.textY<=this.y2 && this.textX>=this.x1 && this.textX>=this.x2 && this.isPtWithinLine({x:this.x2,y:this.y1},{x:this.x2,y:this.y2},{x:this.textX,y:this.textY})) {	
			this.findClosestPointForLine({x:this.x2,y:this.y1},{x:this.x2,y:this.y2},{x:this.textX,y:this.textY});
		} else {
			var closestPt = this.getClosestAnchor([{x:this.x1,y:this.y1},{x:this.x2,y:this.y1},{x:this.x1,y:this.y2},{x:this.x2,y:this.y2}],{x:this.textX,y:this.textY});
			this.refX = closestPt.x;
			this.refY = closestPt.y;
		}
		
	};
	
	this.isPtWithinLine = function(A,B,P) {
		var dotproduct = (P.x - A.x) * (B.x - A.x) + (P.y - A.y)*(B.y - A.y);
		
		if(dotproduct<0) {
			return false;
		}
		
		var squaredlengthBA = (B.x - A.x)*(B.X - A.x) + (B.y - A.y)*(B.y - A.y);
		
		if(dotproduct > squaredlengthBA) {
			return false;
		}
		return true;
	};
	
	this.findClosestPointForLine = function(A,B,P) {
		var a_to_p = [P.x - A.x , P.y - A.y]; // Vector A to P
		var a_to_b = [B.x - A.x , B.y - A.y]; // Vector A to B

		// Find squared magnitude of a_to_b
		var atb2 = Math.pow(a_to_b[0],2) + Math.pow(a_to_b[1],2);

		// Find dot product of a_to_p and a_to_b
		var atp_dot_atb = a_to_p[0] * a_to_b[0] + a_to_p[1] * a_to_b[1];

		// Normalized distance from a to closest point
		var t = atp_dot_atb / atb2;

		// Add the distance to A, moving towards B
		this.refX = A.x + a_to_b[0] * t;
		this.refY = A.y + a_to_b[1] * t;
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
