/**
 *  LookupTable.js
 *  Version 0.5
 *  Author: BabuHussain<babuhussain.a@raster.in>
 */
function LookupTable() {
	this.ylookup;
	this.rescaleSlope;
	this.rescaleIntercept;
	this.windowCenter;
	this.windowWidth;
	this.lutSize;
	this.minPixel;
	this.maxPixel;
	this.getPixelAt = getPixelAt;
	this.calculateLookup = calculateLookup;
	this.setWindowingdata = setWindowingdata;
	this.setPixelInfo = setPixelInfo;
}

LookupTable.prototype.setData = function(wc, ww, rs, ri,bitsStored, invert) {	
	this.rescaleSlope = rs;
	this.rescaleIntercept = ri;
	this.windowCenter = wc;
	this.windowWidth = ww;			
	this.lutSize = Math.pow(2, parseInt(bitsStored));	
	this.invert = invert;	
}

var setPixelInfo = function(minPix,maxPix,invert) {
	this.minPixel = minPix;
	this.maxPixel = maxPix;	
	this.invert = invert;
};

var setWindowingdata = function(wc, ww) {
	this.windowCenter = wc;
	this.windowWidth = ww;
}

function calculateLookup() {
	this.ylookup=new Array(this.lutSize);
	for(var inputValue=this.minPixel;inputValue<=this.maxPixel;inputValue++) {
		var lutVal = ((((inputValue * this.rescaleSlope + this.rescaleIntercept) - (this.windowCenter)) / (this.windowWidth) + 0.5) * 255.0);
         var newVal = Math.min(Math.max(lutVal, 0), 255);
         this.ylookup[inputValue] = this.invert===true ? Math.round(255 - newVal) : Math.round(newVal);
	}
}

function getPixelAt(i) {
	return i!=undefined ? (i * this.rescaleSlope + this.rescaleIntercept) : 0;	
}