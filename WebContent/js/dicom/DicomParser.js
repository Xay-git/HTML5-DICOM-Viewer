/**
 *  DicomParser.js
 *  Version 0.5
 *  Author: BabuHussain<babuhussain.a@raster.in>
 */
function DicomParser(inputBuffer,reader)
{
    this.inputBuffer=inputBuffer;
    this.reader=reader;
    this.parseAll=parseAll;
    this.index = 0;
    this.pixelBuffer;
    this.bitsStored;
    this.pixelRepresentation;
    this.minPix;
    this.maxPix;
    this.imgData = null;
}

function getPixelBuffer()
{
    return this.pixelBuffer;
}

function parseAll()
{			
//	var imgPixelSpacing = this.readTag(24,0,17,100,"ImagerPixelSpacing");	
	var monochrome1 = this.readTag(40,0,4,0,"PhotometricInterpretation");
	var rows = this.readTagAsNumber(40,0,16,0,"Rows");
	var columns = this.readTagAsNumber(40,0,17,0,"Columns");
	var pxlSpacing = this.readTag(40,0,48,0,"PixelSpacing");
	this.bitsStored = this.readTagAsNumber(40,0,1,1,"BitsStored");
	this.pixelRepresentation = this.readTagAsNumber(40,0,3,1,"PixelRepresentation");
	var wc = this.readTag(40,0,80,16,"windowCenter");	
	var ww = this.readTag(40,0,81,16,"windowWidth");	
	var rescale_Intercept = this.readTag(40,0,82,16,"rescaleIntercept");
	var rescale_slope = this.readTag(40,0,83,16,"rescaleSlope");	
//	this.imgData={"monochrome1":monochrome1=="MONOCHROME1","BitsStored":this.bitsStored,"PixelRepresentation":this.pixelRepresentation,"windowCenter":wc!=undefined? wc[0] : wc,"windowWidth":ww!=undefined ? ww[0] : ww,"rescaleIntercept":rescale_Intercept!=undefined?rescale_Intercept:0.0 ,"rescaleSlope":rescale_slope!=undefined ?rescale_slope:1.0,"nativeRows":rows,"nativeColumns":columns,"pixelSpacing":pxlSpacing,"imagerPixelSpacing":imgPixelSpacing};
	this.imgData={"monochrome1":monochrome1=="MONOCHROME1","BitsStored":this.bitsStored,"PixelRepresentation":this.pixelRepresentation,"windowCenter":wc!=undefined? wc[0] : wc,"windowWidth":ww!=undefined ? ww[0] : ww,"rescaleIntercept":rescale_Intercept!=undefined?rescale_Intercept:0.0 ,"rescaleSlope":rescale_slope!=undefined ?rescale_slope:1.0,"nativeRows":rows,"nativeColumns":columns,"pixelSpacing":pxlSpacing};
	
    this.moveToPixelDataTag();
    this.readImage();    
}

DicomParser.prototype.readTag=function(firstContent,secondContent,thirdContent,fourthContent,tagName)
{
    var i=this.index;

    for(; i<this.inputBuffer.length; i++)
    {
        if(this.reader.readNumber(1,i)==firstContent && this.reader.readNumber(1,i+1)==secondContent&&this.reader.readNumber(1,i+2)==thirdContent&&this.reader.readNumber(1,i+3)==fourthContent)
        {
            i=i+4;
            var vr= this.reader.readString(2,i);
            var vl=this.reader.readNumber(2,i+2);
            var val=this.reader.readString(vl,i+4);
            var tagValue=val.split("\\");
            i=i+4+vl;
			this.index = i;
            return tagValue;
        }    
    }  
}

DicomParser.prototype.readTagAsNumber=function(firstContent,secondContent,thirdContent,fourthContent,tagName)
{
    var i=this.index;
    for(; i<this.inputBuffer.length; i++)
    {
        if(this.reader.readNumber(1,i)==firstContent && this.reader.readNumber(1,i+1)==secondContent&&this.reader.readNumber(1,i+2)==thirdContent&&this.reader.readNumber(1,i+3)==fourthContent)
        {
            i=i+4;
            var vr= this.reader.readString(2,i);
            var vl=this.reader.readNumber(2,i+2);
            var val=this.reader.readNumber(vl,i+4);
            i=i+4+vl;
            this.index = i;
            return val;
        }    
    }
}

DicomParser.prototype.moveToPixelDataTag=function()
{	
    var i=this.index;    
    for(; i<this.inputBuffer.length; i++)
    {
        if(this.reader.readNumber(1,i)==224 &&this.reader.readNumber(1,i+1)==127&&this.reader.readNumber(1,i+2)==16&&this.reader.readNumber(1,i+3)==0)
	{			
        	i+=4;
	        var vr= this.reader.readString(2,i);		        
	        i+=4;
	        
	        if(vr=="OB") { 
	        	i+=2;		
	        } else if(vr=="OW") { 
	        	i+=4;
	        } else if(vr=="OF") { 
	        	i+=8;
	        } else {
	        	i+=4;
	        }
	        this.index = i;	  
	}    
    }
}

DicomParser.prototype.readImage=function()
{
	 this.minPix = 65535;
     this.maxPix = -32768; 
          
	if(this.pixelRepresentation === 0 && this.bitsStored ===8) {
		this.pixelBuffer = new Uint8Array(this.reader.getBytes(this.index).buffer);
	} else if(this.pixelRepresentation === 0 && this.bitsStored>8) {
		this.pixelBuffer = new Uint16Array(this.reader.getBytes(this.index).buffer);
	} else if(this.pixelRepresentation === 1 && this.bitsStored>8) {
		this.pixelBuffer = new Int16Array(this.reader.getBytes(this.index).buffer);    
	} else {
		this.pixelBuffer = new Array();
	}	
	
    for(var j=0;j<this.pixelBuffer.length;j++) {
    	var pix = this.pixelBuffer[j];
		this.minPix = Math.min(this.minPix,pix);
		this.maxPix = Math.max(this.maxPix,pix);
	}  
}