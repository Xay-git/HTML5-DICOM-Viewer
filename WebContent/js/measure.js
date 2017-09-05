var mouseLocX, mouseLocY,curr_Img = -1,nativeColumns;
var drawCanvas = null, context = null;
var tool = '';

var ruler = null,rect = null, oval = null, angle = null;
var selectedShape = null, selectedHandle = -1;
var startCoords = [];

var xPxl = null, yPxl = null,measure_Unit="cm";

function init(iNo) {
	if(xPxl==null) {
		/*var tagPxlSpacing = jQuery('#pixelSpacing').html();
		if(tagPxlSpacing==='') {
			loadInstanceText();
			tagPxlSpacing = jQuery('#pixelSpacing').html();
		}*/
		
		var tagPxlSpacing = '1\\1';
		
		if(jQuery("#imgPixelSpacing").html().length>0) {
			tagPxlSpacing = jQuery("#imgPixelSpacing").html();
		} else if(jQuery("#pixelSpacing").html().length>0) {
			tagPxlSpacing = jQuery('#pixelSpacing').html();
		} else {
			measure_Unit = "pix";
		}
			
		
		var pxlSpacing = tagPxlSpacing.split('\\');
		
		xPxl = pxlSpacing.length>0?pxlSpacing[1]:1;
		yPxl = pxlSpacing.length>1?pxlSpacing[0]:1;
	}	
	
	if(curr_Img==-1 || curr_Img!=iNo) {
		clearMeasurements();
		curr_Img = iNo;
	}
}

function initializeMeasureCanvas() {
	drawCanvas = document.getElementById("canvasLayer2");
	this.context = drawCanvas.getContext('2d');				
	jQuery('#loadingView',window.parent.document).hide();
	addMouseEvents(drawCanvas);
}

function activateRuler(iNo,columns) {
	init(iNo);
	var data = jQuery(drawCanvas).data('events');
	if(data==undefined || (data!=undefined && data.mousedown==undefined)) {
		initializeMeasureCanvas();
	}
	jQuery('#huDisplayPanel').hide();
	tool = "ruler";
	nativeColumns = columns;
	if(ruler==null) {
		ruler = new ovm.shape.ruler(xPxl,yPxl,measure_Unit);
	}
}

function activateRect(iNo,columns) {
	init(iNo);
	var data = jQuery(drawCanvas).data('events');
	if(data==undefined || (data!=undefined && data.mousedown==undefined)) {
		initializeMeasureCanvas();		
	}
	jQuery('#huDisplayPanel').show();		
	tool = "rectangle";
	nativeColumns = columns;
	if(rect==null) {
		rect = new ovm.shape.rect(xPxl,yPxl,measure_Unit);
	}
}

function activateOval(iNo,columns) {
	init(iNo);
	var data = jQuery(drawCanvas).data('events');
	if(data==undefined || (data!=undefined && data.mousedown==undefined)) {
		initializeMeasureCanvas();	
	}
	jQuery('#huDisplayPanel').show();		
	tool = "oval";
	nativeColumns = columns;
	if(oval==null) {
		oval = new ovm.shape.oval(xPxl,yPxl,measure_Unit);
	}
}

function activateAngle(iNo,columns) {
	init(iNo);
	var data = jQuery(drawCanvas).data('events');
	if(data==undefined || (data!=undefined && data.mousedown==undefined)) {
		initializeMeasureCanvas();	
	}
	jQuery('#huDisplayPanel').hide();		
	tool = "angle";
	nativeColumns = columns;
	if(angle==null) {
		angle = new ovm.shape.angle(xPxl,yPxl);
	}
}

function addMouseEvents(canvas) {
	jQuery(canvas).mousedown(function(e){
		mouseDownHandler(e);
	}).mousemove(function(e1){
		mouseMoveHandler(e1);
	}).mouseup(function (e2){
		mouseUpHandler(e2);
	});
}

function mouseDownHandler(evt) {
	if(evt.which==1) {
		jQuery('.contextMenu',window.parent.dcoument).hide();
		state.drag = true;
		
		mouseLocX = evt.pageX - drawCanvas.offsetLeft;
		mouseLocY = evt.pageY - drawCanvas.offsetTop;
		
		this.startCoords = [
	        (evt.pageX - state.translationX)/state.scale,
    	    (evt.pageY - state.translationY)/state.scale
        ];
		
		if(selectedShape!=null) {			
			detectHandle(evt);
	
			if(selectedHandle==-1 && !selectedShape.isActiveShape(context,mouseLocX,mouseLocY)) {
				if(selectedShape.getType()!="ruler" && selectedShape.getType()!="angle") {
					selectedShape.measure(selectedShape);
				}
				selectedShape.active = false;				
				selectedShape = null;
				drawAllShapes();
			}
		} 
		else {
			detectSelectedShape();			
			
			if(selectedShape==null) {
				if(tool=="ruler") {
					ruler.initNewLine();
				} else if(tool=="rectangle") {
					rect.initNewRect();
				} else if(tool=="oval") {
					oval.initNewOval();
				} else if(tool=="angle") {
					if(angle.angleStarted()) {
						if(angle.curr_angle.setIntersectionPt(mouseLocX, mouseLocY)) {
							state.drag = false;				
						}			
					} else {
						angle.initAngle();
						state.drag = true;
					}
				}
			}
		}
		
		evt.stopPropagation();
		evt.preventDefault();
		evt.target.style.cursor = selectedShape!=null? 'move' : 'crosshair';
	}
}

function mouseMoveHandler(evt) {
	var x = evt.pageX-drawCanvas.offsetLeft;
	var y = evt.pageY-drawCanvas.offsetTop;
	
	var imgX = parseInt((x-state.translationX)/state.scale);
	var imgY = parseInt((y-state.translationY)/state.scale);
	
	if(tool=="rectangle" || tool=="oval") {
		jQuery('#huDisplayPanel').html("X :"+imgX+" Y :"+imgY+" HU :"+getPixelValAt(imgX,imgY));
	}
	
	if(state.drag) {
		drawAllShapes();
		
		if(selectedShape==null ) { // New Shape
			switch(tool) { 
				case 'ruler':					
					ruler.drawRuler(context,mouseLocX,mouseLocY,x,y);
					break;
				case 'rectangle':									
					rect.drawRect(context,mouseLocX,mouseLocY,x,y);
					break;
				case 'oval':								
					oval.drawOval(context,mouseLocX,mouseLocY,x,y);
					break;
				case 'angle':
					if(angle.angleStarted()) {
						angle.setOAorOB(context, mouseLocX, mouseLocY, x, y);
					}
					break;
			}
		} else if(selectedHandle==-1) { // Move a shape							
			selectedShape.moveShape(Math.round(imgX-this.startCoords[0]),Math.round(imgY-this.startCoords[1]));
			this.startCoords = [imgX,imgY];
			evt.target.style.cursor = 'move';			
		} else if(selectedShape.active) { // Resizing a shape			
			selectedShape.resizeShape(Math.round(imgX-this.startCoords[0]),Math.round(imgY-this.startCoords[1]),selectedHandle);
			this.startCoords = [imgX,imgY];
		}
	} else if(selectedShape!=null && selectedShape.active) {		
			detectHandle(evt);			
	}
}

function mouseUpHandler(evt) {
	if(selectedShape==null) { // New Shape
		switch(tool) {
			case 'ruler':
				ruler.createNewLine(mouseLocX, mouseLocY, (evt.pageX-drawCanvas.offsetLeft), (evt.pageY-drawCanvas.offsetTop));
				break;
			case 'rectangle':
				rect.createNewRect(mouseLocX, mouseLocY, (evt.pageX-drawCanvas.offsetLeft), (evt.pageY-drawCanvas.offsetTop));
				break;
			case 'oval':
				oval.createNewOval(mouseLocX, mouseLocY, (evt.pageX-drawCanvas.offsetLeft), (evt.pageY-drawCanvas.offsetTop));
				break;
			case 'angle':
				if(angle.angleStarted() && angle.curr_angle.lineOAValid() && angle.curr_angle.lineOBValid()) {
					angle.createNewAngle();
				}
				break;
		}
		drawAllShapes();
		if(tool!="angle") {
			state.drag = false;					
		}					
	} else {
		state.drag = false;
	}
}

function setShape(shape) {
	tool = shape;
	jQuery('.selectedshape',window.parent.document).removeClass('selectedshape');
}	

function detectSelectedShape() {
	if(ruler!=null && (selectedShape = ruler.getActiveLine(context,mouseLocX,mouseLocY))!=null || rect!=null && (selectedShape = rect.getActiveRect(context,mouseLocX,mouseLocY))!=null || oval!=null && (selectedShape = oval.getActiveOval(context,mouseLocX,mouseLocY))!=null || angle!=null && (selectedShape = angle.getActiveAngle(context,mouseLocX,mouseLocY))!=null) {
		drawAllShapes();
		return;
	}
}

function detectHandle(e) {	
	selectedHandle = selectedShape.detectHandle(e.pageX-drawCanvas.offsetLeft,e.pageY-drawCanvas.offsetTop,e.target);	
}

function clearMeasurements() {
	curr_Img = -1;
	if(ruler!=null) {
		ruler.clearAll();
	}
	if(rect!=null) {
		rect.clearAll();
	}
	if(oval!=null) {
		oval.clearAll();
	}
	if(angle!=null) {
		angle.clearAll();
	}
	if(context!=null) {
		context.clearRect(0,0,drawCanvas.width,drawCanvas.height);
	}
}

function resetAnnotation() {
	clearMeasurements();
	tool = "";
	jQuery('.selectedshape',window.parent.document).removeClass('selectedshape');
	jQuery('#line',window.parent.document).addClass('selectedshape');
	this.context = null;
}

function deleteSelectedMeasurement() {
	if(selectedShape!=null) {
		if(selectedShape.getType()=="ruler") {
			ruler.removeShape(selectedShape);
		} else if(selectedShape.getType()=="rect") {
			rect.removeShape(selectedShape);
		} else if(selectedShape.getType()=="oval") {
			oval.removeShape(selectedShape);
		} else if(selectedShape.getType()=="angle") {
			angle.removeShape(selectedShape);
		}
		selectedShape = null;
		drawAllShapes();
	}
}

function drawAllShapes() {
	if(this.context!=null) {
		this.context.save();
		this.context.setTransform(1,0,0,1,0,0);		
		this.context.clearRect(0,0,drawCanvas.width,drawCanvas.height);	
		if(state.vflip) {
			this.context.translate(0,drawCanvas.height);
			this.context.scale(1,-1);
		}
	
		if(state.hflip) {
			this.context.translate(drawCanvas.width,0);
			this.context.scale(-1,1);
		}
	
		if(state.rotate!=0) {
			this.context.translate(drawCanvas.width/2,drawCanvas.height/2);
			this.context.rotate(state.rotate===90 ? Math.PI/2 : state.rotate===180? Math.PI : (Math.PI*3)/2);
			this.context.translate(-drawCanvas.width/2,-drawCanvas.height/2);	   
		}		
		if(ruler!=null) ruler.drawData(context);
		if(rect!=null) rect.drawData(context);
		if(oval!=null) oval.drawData(context);
		if(angle!=null) angle.drawData(context);
		this.context.restore();
	}
}