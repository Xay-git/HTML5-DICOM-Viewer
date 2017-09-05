var isLevelLine = false;
var locator = null;
var slope = null;

function Localizer() {
}

//Static method
Localizer.drawScout = function() {
	var frames = jQuery(window.parent.document).find('iframe');

	if (frames.length <= 1) {
		return;
	}

	for ( var i = 0; i < frames.length; i++) {
		var contents = jQuery(frames[i]).contents();
		
		if (contents.find('body').css('border') !== '1px solid rgb(255, 138, 0)') {			
		
			var modality = contents.find('#modalityDiv').text().indexOf('CT') >= 0 ? 'CT' : 'MR';

			if (modality === 'CT') {
				if (jQuery('#imgType').text() === 'AXIAL' && jQuery(frames[i]).contents().find('#imgType').text() === 'LOCALIZER') {
					var sopUid = contents.find('#frameSrc').html();
					sopUid = sopUid.substring(sopUid.indexOf('objectUID=') + 10);

					var refArr = jQuery('#refSOPInsUID').html().split(',');

					if ((jQuery('#forUIDPanel').text() === contents.find('#forUIDPanel').text()) || jQuery.inArray(sopUid, refArr) >= 0) {
						project(contents, modality);
					}

				} else if (jQuery(frames[i]).contents().find('#imgType').text() === 'AXIAL'	&& jQuery('#imgType').text() === "LOCALIZER") {
					project(contents, modality);
				} else {
					var tmpCanvas = contents.find('#canvasLayer1').get(0);
					clearCanvas(tmpCanvas.getContext('2d'), tmpCanvas.width,tmpCanvas.height);
					tmpCanvas = contents.find('#canvasLayer2').get(0);
					clearCanvas(tmpCanvas.getContext('2d'), tmpCanvas.width,tmpCanvas.height);
				}
			} else { //MR
				var sopUid = contents.find('#frameSrc').text();
				sopUid = sopUid.substring(sopUid.indexOf('objectUID=') + 10);
				var refArr = jQuery('#refSOPInsUID').html().split(',');

				if ((jQuery('#forUIDPanel').text() === contents.find('#forUIDPanel').text()) || jQuery.inArray(sopUid, refArr) >= 0) {
					project(contents, modality)
				}
			}
		}
	}
	isLevelLine = true;
}

function project(contents, modality) {
	//Current slice
	locator = new SliceLocator();
	var imgPlane = contents.find('#imgPlane').text();

	var scoutPos = contents.find('#imgPosition').html();
	var scoutOrientation = contents.find('#imgOrientation').html();
	var scoutPixelSpacing = contents.find('#pixelSpacing').html();
	var scoutImgSize = contents.find('#imageSize').html();

	if (scoutImgSize) {
		scoutImgSize = scoutImgSize.substring(11).split("x");
	} else {
		return;
	}

	var scoutRow = scoutImgSize[1];
	var scoutColumn = scoutImgSize[0];

	var zoomPer = contents.find('#zoomPercent').html();
	zoomPer = zoomPer.substring(zoomPer.indexOf(':') + 1,zoomPer.indexOf('%'))/100;

	var canvas = contents.find('#canvasLayer2').get(0);
	var context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.save();
	// reset the transformation matrix
	context.setTransform(1, 0, 0, 1, 0, 0);
	// move origin to center of canvas
	context.translate((canvas.width - zoomPer * scoutColumn) / 2,(canvas.height - zoomPer * scoutRow) / 2);
	context.scale(zoomPer, zoomPer);

	if (imgPlane === '') {
		var oImgOrient = new ImageOrientation();
		var imgOri = contents.find('#imgOrientation').html();
		imgPlane = oImgOrient.getImagePlane(imgOri);
		contents.find('#imgPlane').html(imgPlane);
	}

	if (!isLevelLine) {
		//First and last slice
		drawBorder(contents, zoomPer, imgPlane, modality);
	}

	// Current Slice
	var imgPos = jQuery('#imgPosition').html();
	var imgOrientation = jQuery('#imgOrientation').html();
	var imgPixelSpacing = jQuery('#pixelSpacing').html();
	var imgSize = jQuery('#imageSize').html();
	if (imgSize) {
		imgSize = imgSize.substring(11).split("x");
	} else {
		return;
	}

	var imgRow = imgSize[1];
	var imgColumn = imgSize[0];

	var ps = jQuery('#pixelSpacing').text();
	var cThickLoc = null;
	var cThick = null;

	var psArr = ps.split("\\");
	ps = parseFloat(psArr[0]) / parseFloat(psArr[1]);

	if (jQuery('#imgType').text() !== 'LOCALIZER') {
		cThickLoc = jQuery('#thickLocationPanel').html();
		cThick = parseFloat(cThickLoc.match("Thick:(.*)mm Loc")[1]);
	} else {
		cThickLoc = contents.find('#thickLocationPanel').html();
		cThick = parseFloat(cThickLoc.match("Thick:(.*)mm Loc")[1]);
	}

	var thick = cThick * ps * zoomPer;
	thick /= 2;

	if (imgPlane === "SAGITTAL") {
		locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing,
				scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing,
				imgRow, imgColumn);
		drawLine(parseInt(locator.getBoxUlx()), parseInt(locator.getBoxUly()),
				parseInt(locator.getBoxLlx()), parseInt(locator.getBoxLly()),
				context, "GREEN", null);

		drawLine(parseInt(locator.getBoxUlx()), parseInt(locator.getBoxUly())
				+ thick, parseInt(locator.getBoxLlx()), parseInt(locator
				.getBoxLly())
				+ thick, context, "GREEN", null);
		drawLine(parseInt(locator.getBoxUlx()), parseInt(locator.getBoxUly())
				- thick, parseInt(locator.getBoxLlx()), parseInt(locator
				.getBoxLly())
				- thick, context, "GREEN", null);
	} else if (imgPlane === "CORONAL" && modality === 'CT' || modality === 'MR') {
		locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing,
				scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing,
				imgRow, imgColumn);
		drawLine(parseInt(locator.getmAxisLeftx()), parseInt(locator
				.getmAxisLefty()), parseInt(locator.getmAxisRightx()),
				parseInt(locator.getmAxisRighty()), context, "GREEN", null);

		drawLine(parseInt(locator.getmAxisLeftx()), parseInt(locator
				.getmAxisLefty())
				+ thick, parseInt(locator.getmAxisRightx()), parseInt(locator
				.getmAxisRighty())
				+ thick, context, "GREEN", null);
		drawLine(parseInt(locator.getmAxisLeftx()), parseInt(locator
				.getmAxisLefty())
				- thick, parseInt(locator.getmAxisRightx()), parseInt(locator
				.getmAxisRighty())
				- thick, context, "GREEN", null);
	} else {
		locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing,
				scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing,
				imgRow, imgColumn);
		drawLine(parseInt(locator.getmAxisLeftx()), parseInt(locator
				.getmAxisLefty()), parseInt(locator.getmAxisRightx()),
				parseInt(locator.getmAxisRighty()), context, "GREEN",
				parseFloat(cThick * ps * zoomPer));
	}

	// translate the origin back to the corner of the image so the event handlers can draw in image coordinate system
	context.translate(-scoutColumn / 2 / zoomPer, -scoutRow / 2 / zoomPer);
	context.restore();
}

Localizer.hideScoutLine = function() {
	var frames = jQuery(window.parent.document).find('iframe');
	for ( var i = 0; i < frames.length; i++) {
		var localCanvas = jQuery(frames[i]).contents().find('#canvasLayer1').get(0);
		if (localCanvas != null && localCanvas !== undefined) {
			clearCanvas(localCanvas.getContext('2d'), localCanvas.width,localCanvas.height);
		}
		localCanvas = jQuery(frames[i]).contents().find('#canvasLayer2').get(0);
		if (localCanvas != null && localCanvas !== undefined) {
			clearCanvas(localCanvas.getContext('2d'), localCanvas.width,localCanvas.height);
		}
	}
	isLevelLine = false;
}

Localizer.toggleLevelLine = function(levelLine) {
	isLevelLine = levelLine;
}


/*Localizer.clearCanvasContent = function() {
	var localCanvas = jQuery(parent.jcanvas).siblings().get(0);
	clearCanvas(localCanvas);
	localCanvas = jQuery(parent.jcanvas).siblings().get(1);
	clearCanvas(localCanvas);
	isLevelLine = false;
}*/

function drawLine(x1, y1, x2, y2, oCtx, color, lineWidth) {
	if (lineWidth != null) {
		oCtx.lineWidth = lineWidth;
	}

	oCtx.beginPath();
	oCtx.moveTo(x1, y1);
	oCtx.lineTo(x2, y2);
	oCtx.closePath();
	oCtx.strokeStyle = color;
	oCtx.stroke();
}

function clearCanvas(oCtx, width, height) {
	// Store the current transformation matrix
	oCtx.save();

	// Use the identity matrix while clearing the canvas
	oCtx.setTransform(1, 0, 0, 1, 0, 0);
	oCtx.clearRect(0, 0, width, height);

	// Restore the transform
	oCtx.restore();
}

function drawBorder(contents, zoomPer, imgPlane, modality) {
	var imageType = jQuery('#imgType').html();
	var firstImage = null, lastImage = null;
	
	var instanceData = JSON.parse(sessionStorage[seriesUid]);
	

	for ( var i = 0; i < instanceData.length; i++) {
		if((instanceData[i])['imageType']==imageType) {
			firstImage = instanceData[i];
			break;
		}
	}

	for ( var i = instanceData.length - 1; i > 0; i--) {
		if((instanceData[i])['imageType']==imageType) {
			lastImage = instanceData[i];
			break;
		}
	}

	if (firstImage != null && lastImage != null) {
		var imgSize = contents.find('#imageSize').html().substring(11).split("x");
		var scoutRow = imgSize[1];
		var scoutColumn = imgSize[0];

		var canvas = contents.find('#canvasLayer1').get(0);
		var context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.save();
		// reset the transformation matrix
		context.setTransform(1, 0, 0, 1, 0, 0);
		// move origin to center of canvas
		context.translate((canvas.width - zoomPer * scoutColumn) / 2,
				(canvas.height - zoomPer * scoutRow) / 2);
		context.scale(zoomPer, zoomPer);

		slope = null;
		projectBorder(contents, firstImage, context, imgPlane, modality,
				zoomPer);
		projectBorder(contents, lastImage, context, imgPlane, modality, zoomPer);

		// translate the origin back to the corner of the image so the event handlers can draw in image coordinate system
		context.translate(-scoutColumn / 2 / zoomPer, -scoutRow / 2 / zoomPer);
		context.restore();
	}
}

function projectBorder(contents, dataset, context, imgPlane, modality, zoomPer) {
	var scoutPos = contents.find('#imgPosition').html();
	var scoutOrientation = contents.find('#imgOrientation').html();
	var scoutPixelSpacing = contents.find('#pixelSpacing').html();
	var imgSize = contents.find('#imageSize').html().substring(11).split("x");
	var scoutRow = imgSize[1];
	var scoutColumn = imgSize[0];

	var imgPos = dataset['imagePositionPatient'];
	var imgOrientation = dataset['imageOrientPatient']; 
	var imgPixelSpacing = dataset['pixelSpacing']; 
	var imgRow = dataset['nativeRows']; 
	var imgColumn = dataset['nativeColumns']; 

	locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing,
			scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing,
			imgRow, imgColumn);

	if (modality === "MR") {		
		var slp = findSlope(parseInt(locator.getBoxUlx() * zoomPer),
				parseInt(locator.getBoxUly() * zoomPer), parseInt(locator
						.getBoxLlx()
						* zoomPer), parseInt(locator.getBoxLly() * zoomPer));
		if (slope == null) {
			slope = slp;
		} else {
			if (slp != slope) {
				canvas = contents.find('#canvasLayer1').get(0);
				clearCanvas(canvas.getContext('2d'), canvas.width,canvas.height);
				return;
			}
		}
	}

	if (imgPlane == "SAGITTAL") {
		drawLine(parseInt(locator.getBoxUlx()), parseInt(locator.getBoxUly()),
				parseInt(locator.getBoxLlx()), parseInt(locator.getBoxLly()),
				context, "YELLOW", null);

	} else {
		drawLine(parseInt(locator.getmAxisLeftx()), parseInt(locator
				.getmAxisLefty()), parseInt(locator.getmAxisRightx()),
				parseInt(locator.getmAxisRighty()), context, "YELLOW", null);
	}
}

function findSlope(x1, y1, x2, y2) {
	var sl = (y2-y1)!=0 ?  (y2 - y1) / (x2 - x1) : 0;
	return sl;
}