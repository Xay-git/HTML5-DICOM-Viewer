/**
 * Definition of shape
*/
ovm.shape.angle = function() {	
	var handleSize = 5;
	var angles = [];	
	this.curr_angle = null;	
	
	this.initAngle = function() {		
		this.curr_angle = new ovm.angle();
	};
	
	this.angleStarted = function() {
		return this.curr_angle!=null;
	};
	
	this.drawAngle = function(canvasCtx) {
		canvasCtx.save();			
		this.draw(canvasCtx,this.curr_angle);	
		canvasCtx.restore();	
	};
	
	this.draw = function(canvasCtx,graphic) {
		canvasCtx.strokeStyle=canvasCtx.fillStyle='orange';	
		canvasCtx.lineWidth='2';				
		canvasCtx.beginPath();
		canvasCtx.moveTo(graphic.xA,graphic.yA);
		canvasCtx.lineTo(graphic.x0,graphic.y0);
		if(graphic.xB!=undefined && graphic.yB!=undefined) {
			canvasCtx.lineTo(graphic.xB,graphic.yB);
		}
		canvasCtx.stroke();
		canvasCtx.closePath();			

		if(graphic.arcAngle1!=undefined && graphic.arcAngle2!=undefined) {
			canvasCtx.save();
			canvasCtx.beginPath();
			canvasCtx.moveTo(graphic.x0,graphic.y0);
			canvasCtx.arc(graphic.x0,graphic.y0,graphic.arcRadius,graphic.arcAngle1,graphic.arcAngle2,graphic.counterClockwise);
			canvasCtx.closePath();
			canvasCtx.stroke();
			canvasCtx.restore();
		}
		
		// Handles
		canvasCtx.strokeStyle=canvasCtx.fillStyle=graphic.active ? 'red' : 'white';
		canvasCtx.beginPath();
		canvasCtx.fillRect(graphic.xA-handleSize,graphic.yA-handleSize,handleSize*2,handleSize*2);
		canvasCtx.fillRect(graphic.x0-handleSize,graphic.y0-handleSize,handleSize*2,handleSize*2);
		canvasCtx.fillRect(graphic.xB-handleSize,graphic.yB-handleSize,handleSize*2,handleSize*2);
		canvasCtx.closePath();
		
		// Text
		if(graphic.angle!=undefined) {
			canvasCtx.beginPath();
			canvasCtx.fillStyle = !graphic.txtActive ?  "maroon" : "blue";
			canvasCtx.globalAlpha = 0.7;
			canvasCtx.font = "14px Arial";
			var text = canvasCtx.measureText(graphic.angle);			
			canvasCtx.fillRect(graphic.textX,graphic.textY,Math.ceil(text.width)+5,20);
			canvasCtx.globalAlpha = 0.9;
			canvasCtx.fillStyle = "white";
			canvasCtx.fillText(graphic.angle,graphic.textX+2,graphic.textY+15);
			canvasCtx.closePath();
			
			// Reference Lines
			if(graphic.textX!=(graphic.xB+15)) {
				canvasCtx.save();
				canvasCtx.beginPath();
				canvasCtx.globalAlpha = 0.5;
				canvasCtx.strokeStyle = "yellow";
				canvasCtx.setLineDash([10,7]);
				var closestPt = this.getClosestAnchor([{x:graphic.textX,y:graphic.textY},{x:graphic.textX+Math.ceil(text.width+5),y:graphic.textY},{x:graphic.textX,y:graphic.textY+20},{x:graphic.textX+Math.ceil(text.width+5),y:graphic.textY+20}],{x:graphic.refX,y:graphic.refY});			
				canvasCtx.moveTo(closestPt.x, closestPt.y);
				canvasCtx.lineTo(graphic.refX,graphic.refY);
				canvasCtx.stroke();
				canvasCtx.closePath();
				canvasCtx.restore();
			}
		}	
	};
	
	this.createNewAngle = function() {
		this.curr_angle.generateTrueGraphic();
		angles.push(this.curr_angle);
		this.curr_angle = null;		
	};		
	
	this.drawData = function(ctx) {
		ctx.save();		
		for(var i=0;i<angles.length;i++) {
			var angle_i = angles[i];
			this.draw(ctx,this.viewPortGraphic(angle_i));
		}
		ctx.restore();
	};
	
	this.getActiveAngle = function(canvasCtx,mouseX,mouseY) {		
		for(var i=0;i<angles.length;i++) {
			var curr = angles[i];
			if(curr.isActiveShape(canvasCtx,mouseX,mouseY)) {
				return curr;
			}
		}
		return null;
	};
	
	this.setOAorOB = function(canvasCtx,x1,y1,x2,y2) {
		this.curr_angle.setLine(x1,y1,x2,y2);
		this.drawAngle(canvasCtx);
	};	
	
	this.getActiveAngleText = function(canvasCtx,mouseX,mouseY) {
		for(var i=0;i<angles.length;i++) {
			var curr = angles[i];
			if(curr.isTextSelection(canvasCtx,mouseX,mouseY)) {
				return curr;
			}
		}
		return null;
	};
	
	this.viewPortGraphic = function(shape) {
		return {
			xA: shape.xA*state.scale+state.translationX, 
			yA: shape.yA*state.scale+state.translationY,
			x0: shape.x0*state.scale+state.translationX, 
			y0: shape.y0*state.scale+state.translationY,
			xB: shape.xB*state.scale+state.translationX, 
			yB: shape.yB*state.scale+state.translationY,
			angle: shape.angle, 
			active: shape.active, 
			arcAngle1:shape.arcAngle1, 
			arcAngle2: shape.arcAngle2, 
			arcRadius: shape.arcRadius, 
			counterClockwise: shape.counterClockwise, 
			textX: shape.textX*state.scale+state.translationX, 
			textY: shape.textY*state.scale+state.translationY,
			txtActive: shape.txtActive,
			refX: shape.refX*state.scale+state.translationX, 
			refY: shape.refY*state.scale+state.translationY,
		};
	};
	
	this.removeShape = function(shape) {
		angles.splice(angles.indexOf(shape), 1);
	};
	
	this.clearAll = function() {
		angles = [];
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
 * @namespace angle
 */

ovm.angle = function() {
	// Variables
	var handleSize = 5;
	this.xA = undefined;
	this.yA = undefined;
	this.x0 = undefined;
	this.y0 = undefined;
	this.xB = undefined;
	this.yB = undefined;
	this.angle = undefined;
	this.OAvalid = false;
	this.OBvalid = false;
	this.active = false;
	this.arcAngle1 = undefined;
	this.arcAngle2 = undefined;
	this.arcRadius = 30;
	this.counterClockwise = true;
	this.lineColinear = false;
	this.textX = undefined;
	this.textY = undefined;	
	this.txtActive = false;
	this.refX = undefined;
	this.refY = undefined;
	
	// Functions	
	this.lineOAValid = function() {
		return this.OAvalid;
	};
	
	this.lineOBValid = function() {
		return this.OBvalid;
	};
	
	this.setLine = function(x1,y1,x2,y2) {
		if(!this.OAvalid) {
			this.setOA(x1,y1,x2,y2,false);
		} else {
			this.setEnd(x2,y2);
		}
	};
	
	this.setOA = function(xa,ya,x,y,oavalid) {
		this.xA = xa;
		this.yA = ya;
		this.x0 = x;
		this.y0 = y;
		this.OAvalid = oavalid;
	};
	
	this.setIntersectionPt = function(x,y) {
		if(this.OAvalid) {
			this.xB = x;
			this.yB = y;
			this.OBvalid = true;
			return true;
		} else if(this.xA!=undefined && this.yA!=undefined) {
			this.x0 = x;
			this.y0 = y;
			this.OAvalid = true;			
			return false;
		}
	};
	
	this.setEnd = function(x,y) {
		this.xB = x;
		this.yB = y;
		this.textX = x+15;
		this.textY = y+15;
		this.validate();
	};
	
	this.generateTrueGraphic = function() {
		this.xA = ((this.xA-state.translationX)/state.scale);
		this.yA = ((this.yA-state.translationY)/state.scale);
		this.x0 = ((this.x0-state.translationX)/state.scale);
		this.y0 = ((this.y0-state.translationY)/state.scale);
		this.xB = ((this.xB-state.translationX)/state.scale);
		this.yB = ((this.yB-state.translationY)/state.scale);
		this.textX = ((this.textX-state.translationX)/state.scale);
		this.textY = ((this.textY-state.translationY)/state.scale);
		this.fixReferencePoints();
	};
	
	this.calculateAngle = function() {		
		if(!this.lineColinear) {
			this.calculateArcAngles({x:this.xA,y:this.yA},{x:this.x0,y:this.y0},{x:this.xB,y:this.yB});
			this.counterClockwise = (this.arcAngle1>this.arcAngle2);
		}
        
		var tangent = this.getRadians({x:this.xA,y:this.yA},{x:this.x0,y:this.y0},{x:this.xB,y:this.yB});
		var deg = tangent * (180/Math.PI);
		this.angle = deg % 360.0;
        if (Math.abs(this.angle) > 180.0) {         
         	this.counterClockwise = (this.arcAngle2>this.arcAngle1);
        	this.angle -= Math.sign(this.angle) * 360.0;
        }
        this.angle = Math.abs(this.angle).toFixed(2) + " deg";       
	};
	
	this.validate = function() {
		this.OAvalid = (this.xA!=undefined && this.yA!=undefined && this.x0!=undefined && this.y0!=undefined && this.x0!=this.xA && this.y0!=this.yA);
		this.OBvalid = (this.x0!=undefined && this.y0!=undefined && this.xB!=undefined && this.yB!=undefined && this.x0!=this.xB && this.y0!=this.yB);
		this.arcAngle1 = this.arcAngle2 = undefined;
		this.lineColinear = false;
		this.counterClockwise = false;
		this.angle = 0.0;
		
		if(this.OAvalid && this.OBvalid) {
			this.lineColinear = this.isColinear({x:this.x0,y:this.yo}, {x:this.xA,y:this.yA}, {x:this.x0,y:this.y0}, {x:this.xB,y:this.yB});						
			this.calculateAngle();			
		}		
	};
	
	this.isColinear = function(ptA,ptB,ptC,ptD) {
		if(this.isParallel(ptA, ptB, ptC, ptD)) {
			if (((ptA.y - ptC.y) * (ptD.x - ptC.x) - (ptA.x - ptC.x)
	                * (ptD.y - ptC.y)) == 0) {
				return true;
			}
		}	
		return false;
	};
	
	this.isParallel = function(ptA,ptB,ptC,ptD) {
		if (((ptB.x - ptA.x) * (ptD.y - ptC.y) - (ptB.y - ptA.y)
	            * (ptD.x - ptC.x)) == 0) {
			return true;
		}
		return false;
	};
	
	this.calculateArcAngles = function(pt1,pt2,pt3) {
		this.arcAngle1 = Math.atan2(pt3.y - pt2.y, pt3.x - pt2.x);
  		this.arcAngle2 = Math.atan2(pt1.y - pt2.y, pt1.x - pt2.x);
	};
	
	this.getRadians2 = function(ptA,ptB) {
		return Math.atan2(ptA.y-ptB.y,ptB.x-ptA.x);
	};
	
	this.getRadians = function(ptA,ptB,ptC) {
		return this.getRadians2(ptB,ptC)-this.getRadians2(ptB,ptA);
	};	
	
	this.getType = function() {
		return "angle";
	};	
	
	this.detectHandle = function(mouseX,mouseY,target) {
		var x = (mouseX-state.translationX)/state.scale;
		var y = (mouseY-state.translationY)/state.scale;
		
		if(x>=this.xA-handleSize && x<=this.xA+handleSize && y>=this.yA-handleSize && y<=this.yA+handleSize) {
			target.style.cursor = "pointer";
			return 0;
		} else if(x>=this.x0-handleSize && x<=this.x0+handleSize && y>=this.y0-handleSize && y<=this.y0+handleSize) {
			target.style.cursor = "pointer";
			return 1;
		} else if(x>=this.xB-handleSize && x<=this.xB+handleSize && y>=this.yB-handleSize && y<=this.yB+handleSize) {
			target.style.cursor = "pointer";
			return 2;
		} else {
			return -1;
		}
	};
	
	this.detectLine = function(start,end,mouse) {	
		var a = Math.round(Math.sqrt(Math.pow((end.x+handleSize)-(start.x+handleSize),2) + Math.pow((end.y+handleSize)-(start.y+handleSize),2)));
		var b = Math.round(Math.sqrt(Math.pow(mouse.x-(start.x+handleSize),2) + Math.pow(mouse.y-(start.y+handleSize),2)));
		var c = Math.round(Math.sqrt(Math.pow((end.x+handleSize)-mouse.x,2) + Math.pow((end.y+handleSize)-mouse.y,2)));
		return (a==b+c);
	};
	
	this.isActiveShape = function(canvasCtx,mouseX,mouseY) {	
		var x = (mouseX-state.translationX)/state.scale;
		var y = (mouseY-state.translationY)/state.scale;
			
		if(this.detectLine({x:this.xA,y:this.yA},{x:this.x0,y:this.y0},{x:x,y:y}) || this.detectLine({x:this.x0,y:this.y0},{x:this.xB,y:this.yB},{x:x,y:y})) {				
				this.active = true;
		} else {
			this.active = false;
		}
		return this.active || this.isTextSelection(canvasCtx,mouseX,mouseY);
	};
	
	this.moveShape = function(deltaX,deltaY) {
		if(this.active) {
			this.x0+=deltaX;
			this.y0+=deltaY;
			this.xA+=deltaX;
			this.yA+=deltaY;
			this.xB+=deltaX;
			this.yB+=deltaY;
		} 		
		this.textX+=deltaX;
		this.textY+=deltaY;
		this.fixReferencePoints();
	};
	
	this.resizeShape = function(deltaX,deltaY,handleIndex) {		
		switch(handleIndex) {
			case 0:
				this.xA+=deltaX;
				this.yA+=deltaY;
				break;
			case 1:
				this.x0+=deltaX;
				this.y0+=deltaY;
				break;
			case 2:
				this.xB+=deltaX;
				this.yB+=deltaY;
				this.textX = this.xB+15;
				this.textY = this.yB+15;
				break;
		}
		this.validate();
		this.fixReferencePoints();
	};
	
	this.isTextSelection = function(canvasCtx,mouseX,mouseY) {
		var x = Math.ceil((mouseX-state.translationX)/state.scale);
		var y = Math.floor((mouseY-state.translationY)/state.scale);
		
		var textWid = Math.ceil(canvasCtx.measureText(this.angle).width)+5;
		this.txtActive = (x>=this.textX && x<=this.textX+(textWid/state.scale)+5 && y>=this.textY && y<=(this.textY+(15/state.scale)));
		return this.txtActive;		
	};
	
	this.distanceToLine = function(line,point) {		
		return Math.round(Math.sqrt(Math.pow(point.x-line.x1,2) + Math.pow(point.y-line.y1,2))) + Math.round(Math.sqrt(Math.pow(line.x2-point.x,2) + Math.pow(line.y2-point.y,2)));
	};
	
	this.distanceToPoint = function(point1,point2) {
		return Math.round(Math.sqrt(Math.pow(point2.x-point1.x,2) + Math.pow(point2.y-point1.y,2)));
	};
	
	this.fixReferencePoints = function() {	
		var dist1 = this.distanceToLine({x1:this.xA,y1:this.yA,x2:this.x0,y2:this.y0}, {x:this.textX,y:this.textY});
		var dist2 = this.distanceToLine({x1:this.xB,y1:this.yB,x2:this.x0,y2:this.y0}, {x:this.textX,y:this.textY});
		
		if(dist1<dist2) {						
			this.findClosestPointForLine({x:this.x0,y:this.y0},{x:this.xA,y:this.yA},{x:this.textX,y:this.textY});
			
			if(!this.isPtWithinAngle({x:this.x0,y:this.y0},{x:this.xA,y:this.yA},{x:this.refX,y:this.refY})) {
				this.selectNearestAnchor({x:this.x0,y:this.y0},{x:this.xA,y:this.yA},{x:this.textX,y:this.textY});
			}
			
		} else {
			this.findClosestPointForLine({x:this.x0,y:this.y0},{x:this.xB,y:this.yB},{x:this.textX,y:this.textY});
			
			if(!this.isPtWithinAngle({x:this.x0,y:this.y0},{x:this.xB,y:this.yB},{x:this.refX,y:this.refY})) {
				this.selectNearestAnchor({x:this.x0,y:this.y0},{x:this.xB,y:this.yB},{x:this.textX,y:this.textY});
			}
		}			
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
	
	this.isPtWithinAngle = function(A,B,P) {
		if(A.x<=P.x && B.x>=P.x || A.x>=P.x && B.x<=P.x) {
			if(A.y<=P.y && B.y>=P.y || A.y>=P.y && B.y<=P.y) {
				return true;
			}
		}
		return false;
	};
	
	this.selectNearestAnchor = function(ptA,ptB,ptC) {
		var d1 = this.distanceToPoint(ptA, ptC);
		var d2 = this.distanceToPoint(ptB, ptC);
		
		if(d1<d2) {
			this.refX = ptA.x;
			this.refY = ptA.y;
		} else {
			this.refX = ptB.x;
			this.refY = ptB.y;
		}
	}
};