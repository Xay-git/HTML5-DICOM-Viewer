/**
 * @namespace DICOM related.
 */
ovm.dicom = ovm.dicom || {};

/**
 * @class Big Endian reader
 * @param file
 */
ovm.dicom.BigEndianReader = function(file)
{
    this.readByteAt = function(i) {
        return file.charCodeAt(i) & 0xff;
    };
    this.readNumber = function(nBytes, startByte) {
        var result = 0;
        for(var i=startByte; i<startByte + nBytes; ++i){
            result = result * 256 + this.readByteAt(i);
        }
        return result;
    };
    this.readCouple = function(a,b) {
        return (b + a*256).toString(16);
    };
    this.readUint16Array = function(nBytes, startByte) {
        return new Uint16Array(file.buffer, startByte, nBytes/2);
    };
    this.readUint16Array = function(nBytes, startByte) {
        var data = [];
        for(var i=startByte; i<startByte+nBytes; i+=2) 
        {     
            data.push(this.readNumber(1,i+1) + this.readNumber(1,i)*256);
        }
        return data;
    };
    this.readString = function(nChars, startChar) {
        var result = "";
        for(var i=startChar; i<startChar + nChars; i++){
            result += String.fromCharCode(this.readNumber(1,i));
        }
        return result;
    };
};

/**
 * @class Litte Endian reader
 * @param file
 */
ovm.dicom.LittleEndianReader = function(file)
{
    this.readByteAt = function(i) {
        return file.charCodeAt(i) & 0xff;
    };
    this.readNumber = function(nBytes, startByte) {
        var result = 0;
        for(var i=startByte + nBytes; i>startByte; i--){
            result = result * 256 + this.readByteAt(i-1);
        }
        return result;
    };
    this.readCouple = function(a,b) {
        return (a + b*256).toString(16);
    };
    this.readUint16Array = function(nBytes, startByte) {
        var data = [];
        for(var i=startByte; i<startByte+nBytes; i+=2) 
        {     
            data.push(this.readNumber(2,i));
        }
        return data;
    };
    this.readString = function(nChars, startChar) {
        var result = "";
        for(var i=startChar; i<startChar + nChars; i++){
            result += String.fromCharCode(this.readNumber(1,i));
        }
        return result;
    };
    // beta...
    this.readRaw = function(nBytes, startByte) {
        var data = [];
        for(var i=startByte; i<startByte+nBytes; ++i) 
        {     
            data.push(file[i]);
        }
        return data;
    };
};

/**
 * @class DicomParser class.
 */
ovm.dicom.DicomParser = function(file)
{
    // the list of DICOM elements
    this.dicomElements = {};
    // the number of DICOM Items
    this.numberOfItems = 0;
    // the DICOM dictionary used to find tag names
    this.dict = new ovm.dicom.Dictionary();
    // the file
    this.file = file;
    // the pixel buffer
    this.pixelBuffer = [];
};

/**
 * Get the DICOM data pixel buffer.
 * @returns The pixel buffer (as an array).
 */
ovm.dicom.DicomParser.prototype.getPixelBuffer=function()
{
    return this.pixelBuffer;
};

/**
 * Append a DICOM element to the dicomElements member object.
 * Allows for easy retrieval of DICOM tag values from the tag name.
 * If tags have same name (for the 'unknown' and private tags cases), a number is appended
 * making the name unique.
 * @param element The element to add.
 */
ovm.dicom.DicomParser.prototype.appendDicomElement=function( element )
{
    // find a good tag name
    var name = element.name;
    // count the number of items
    if( name === "Item" ) {
        ++this.numberOfItems;
    }
    var count = 1;
    while( this.dicomElements[name] ) {
        name = element.name + (count++).toString();
    }
    // store it
    this.dicomElements[name] = { 
            "group": element.group, 
            "element": element.element,
            "vr": element.vr,
            "vl": element.vl,
            "value": element.value };
};

/**
 * Read a DICOM tag.
 * @param reader The raw data reader.
 * @param offset The offset where to start to read.
 * @returns An object containing the tags 'group', 'element' and 'name'.
 */
ovm.dicom.DicomParser.prototype.readTag=function(reader, offset)
{
    // group
    var g0 = reader.readNumber( 1, offset );
    var g1 = reader.readNumber( 1, offset+1 );
    var group_str = reader.readCouple(g0, g1);
    var group = "0x0000".substr(0, 6 - group_str.length) + group_str.toUpperCase();
    // element
    var e2 = reader.readNumber( 1, offset+2 );
    var e3 = reader.readNumber( 1, offset+3 );
    var element_str = reader.readCouple(e2, e3);
    var element = "0x0000".substr(0, 6 - element_str.length) + element_str.toUpperCase();
    // name
    var name = "ovm::unknown";
    if( this.dict.newDictionary[group] ) {
        if( this.dict.newDictionary[group][element] ) {
            name = this.dict.newDictionary[group][element][2];
        }
    }
    // return as hex
    return {'group': group, 'element': element, 'name': name};
};

/**
 * Read a DICOM data element.
 * @param reader The raw data reader.
 * @param offset The offset where to start to read.
 * @param implicit Is the DICOM VR implicit?
 * @returns An object containing the element 'tag', 'vl', 'vr', 'data' and 'offset'.
 */
ovm.dicom.DicomParser.prototype.readDataElement=function(reader, offset, implicit)
{
    // tag: group, element
    var tag = this.readTag(reader, offset);
    var tagOffset = 4;
    
    var vr; // Value Representation (VR)
    var vl; // Value Length (VL)
    var vrOffset = 0; // byte size of VR
    var vlOffset = 0; // byte size of VL
    
    // (private) Item group case
    if( tag.group === "0xFFFE" ) {
        vr = "N/A";
        vrOffset = 0;
        vl = reader.readNumber( 4, offset+tagOffset );
        vlOffset = 4;
    }
    // non Item case
    else {
        // implicit VR?
        if(implicit) {
            vr = "UN";
            if( this.dict.newDictionary[tag.group] ) {
                if( this.dict.newDictionary[tag.group][tag.element] ) {
                    vr = this.dict.newDictionary[tag.group][tag.element][0];
                }
            }
            vrOffset = 0;
            vl = reader.readNumber( 4, offset+tagOffset+vrOffset );
            vlOffset = 4;
        }
        else {
            vr = reader.readString( 2, offset+tagOffset );
            vrOffset = 2;
            // long representations
            if(vr === "OB" || vr === "OF" || vr === "SQ" || vr === "OW" || vr === "UN") {
                vl = reader.readNumber( 4, offset+tagOffset+vrOffset+2 );
                vlOffset = 6;
            }
            // short representation
            else {
                vl = reader.readNumber( 2, offset+tagOffset+vrOffset );
                vlOffset = 2;
            }
        }
    }
    
    // check the value of VL
    if( vl === 0xffffffff ) {
        vl = 0;
    }
    
    // data
    var data;
    if( vr === "US" || vr === "UL")
    {
        data = [reader.readNumber( vl, offset+tagOffset+vrOffset+vlOffset)];
    }
    else if( vr === "OX" || vr === "OW" )
    {
        data = reader.readUint16Array(vl, offset+tagOffset+vrOffset+vlOffset);
    }
    else if( vr === "OB" || vr === "N/A")
    {
        var begin = offset+tagOffset+vrOffset+vlOffset;
        var end = begin + vl;
        data = [];
        for(var i=begin; i<end; ++i) 
        {     
            data.push(reader.readNumber(1,i));
        }
        //data = reader.readRaw(vl, begin);
    }
    else
    {
        data = reader.readString( vl, offset+tagOffset+vrOffset+vlOffset);
        data = data.split("\\");                
    }    

    // total element offset
    var elementOffset = tagOffset + vrOffset + vlOffset + vl;
    
    // return
    return { 
        'tag': tag, 'vr': vr, 'vl': vl, 
        'data': data,
        'offset': elementOffset};    
};

/**
 * Parse the complete DICOM file (given as input to the class).
 * Fills in the member object 'dicomElements'.
 */
ovm.dicom.DicomParser.prototype.parseAll = function()
{
    var offset = 0;
    var i;
    var implicit = false;
    var jpeg = false;
    var jpeg2000 = false;
    // dictionary
    this.dict.init();
    // default readers
    var metaReader = new ovm.dicom.LittleEndianReader(this.file);
    var dataReader = new ovm.dicom.LittleEndianReader(this.file);

    // 128 -> 132: magic word
    offset = 128;
    var magicword = metaReader.readString(4, offset);
    if(magicword !== "DICM")
    {
        throw new Error("No magic DICM word found");
    }
    offset += 4;
    
    // 0x0002, 0x0000: MetaElementGroupLength
    var dataElement = this.readDataElement(metaReader, offset);
    var metaLength = parseInt(dataElement.data, 10);
    offset += dataElement.offset;
    
    // meta elements
    var metaStart = offset;
    var metaEnd = offset + metaLength;
    for( i=metaStart; i<metaEnd; i++ ) 
    {
        // get the data element
        dataElement = this.readDataElement(metaReader, i, false);
        // check the transfer syntax
        if( dataElement.tag.name === "TransferSyntaxUID" ) {
            var syntax = dataElement.data[0];
            // get rid of ending zero-width space (u200B)
            if( syntax[syntax.length-1] === String.fromCharCode("u200B") ) {
                syntax = syntax.substring(0, syntax.length-1); 
            }
            
            // Implicit VR - Little Endian
            if( syntax === "1.2.840.10008.1.2" ) {
                implicit = true;
            }
            // Explicit VR - Little Endian (default): 1.2.840.10008.1.2.1 
            // Deflated Explicit VR - Little Endian
            else if( syntax === "1.2.840.10008.1.2.1.99" ) {
                throw new Error("Unsupported DICOM transfer syntax (Deflated Explicit VR): "+syntax);
            }
            // Explicit VR - Big Endian
            else if( syntax === "1.2.840.10008.1.2.2" ) {
                dataReader = new ovm.dicom.BigEndianReader(this.file);
            }
            // JPEG
            else if( syntax.match(/1.2.840.10008.1.2.4.5/) 
                    || syntax.match(/1.2.840.10008.1.2.4.6/)
                    || syntax.match(/1.2.840.10008.1.2.4.7/) 
                    || syntax.match(/1.2.840.10008.1.2.4.8/) ) {
                jpeg = true;
                throw new Error("Unsupported DICOM transfer syntax (JPEG): "+syntax);
            }
            // JPEG 2000
            else if( syntax.match(/1.2.840.10008.1.2.4.9/) ) {
                jpeg2000 = true;
                throw new Error("Unsupported DICOM transfer syntax (JPEG 2000): "+syntax);
            }
            // MPEG2 Image Compression
            else if( syntax === "1.2.840.10008.1.2.4.100" ) {
                throw new Error("Unsupported DICOM transfer syntax (MPEG2): "+syntax);
            }
            // RLE (lossless)
            else if( syntax === "1.2.840.10008.1.2.4.5" ) {
                throw new Error("Unsupported DICOM transfer syntax (RLE): "+syntax);
            }
        }            
        // store the data element
        this.appendDicomElement( { 
            'name': dataElement.tag.name,
            'group': dataElement.tag.group, 
            'element': dataElement.tag.element,
            'value': dataElement.data } );
        // increment index
        i += dataElement.offset-1;
    }
    
    var startedPixelItems = false;
    
    // DICOM data elements
    for( i=metaEnd; i<this.file.length; i++) 
    {
        // get the data element
        dataElement = this.readDataElement(dataReader, i, implicit);
        // store pixel data from multiple items
        if( startedPixelItems ) {
            if( dataElement.tag.name === "Item" ) {
                if( dataElement.data.length !== 0 ) {
                    this.pixelBuffer = this.pixelBuffer.concat( dataElement.data );
                }
            }
            else if( dataElement.tag.name === "SequenceDelimitationItem" ) {
                startedPixelItems = false;
            }
            else {
                throw new Error("Unexpected tag in encapsulated pixel data: "+dataElement.tag.name);
            }
        }
        // check the pixel data tag
        if( dataElement.tag.name === "PixelData") {
            if( dataElement.data.length !== 0 ) {
                this.pixelBuffer = dataElement.data;
            }
            else {
                startedPixelItems = true;
            }
        }
        // store the data element
        this.appendDicomElement( {
            'name': dataElement.tag.name,
            'group' : dataElement.tag.group, 
            'vr' : dataElement.vr, 
            'vl' : dataElement.vl, 
            'element': dataElement.tag.element,
            'value': dataElement.data } );
        // increment index
        i += dataElement.offset-1;
    }
    
    // uncompress data
    if( jpeg ) {
        console.log("JPEG");
        // using jpgjs from https://github.com/notmasteryet/jpgjs
        // -> error with ffc3 and ffc1 jpeg jfif marker
        /*var j = new JpegImage();
        j.parse(this.pixelBuffer);
        var d = 0;
        j.copyToImageData(d);
        this.pixelBuffer = d.data;*/
    }
    else if( jpeg2000 ) {
        console.log("JPEG 2000");
        // using openjpeg.js from https://github.com/kripken/j2k.js
        // -> 2 layers results????
        /*var data = new Uint16Array(this.pixelBuffer);
        var result = openjpeg(data, "j2k");
        this.pixelBuffer = result.data;*/
        
        // using jpx.js from https://github.com/mozilla/pdf.js
        // -> ...
        /*var j = new JpxImage();
        j.parse(this.pixelBuffer);
        console.log("width: "+j.width);
        console.log("height: "+j.height);
        console.log("tiles: "+j.tiles.length);
        console.log("count: "+j.componentsCount);
        this.pixelBuffer = j.tiles[0].items;*/
    }
};

/**
 * Get an Image object from the read DICOM file.
 * @returns A new Image.
 */
ovm.dicom.DicomParser.prototype.getImage = function()
{
    // size
    if( !this.dicomElements.Columns ) {
        throw new Error("Missing DICOM image number of columns");
    }
    if( !this.dicomElements.Rows ) {
        throw new Error("Missing DICOM image number of rows");
    }
    var size = new ovm.image.ImageSize(
        this.dicomElements.Columns.value[0], 
        this.dicomElements.Rows.value[0]);
    // spacing
    var rowSpacing = 1;
    var columnSpacing = 1;
    if( this.dicomElements.PixelSpacing ) {
        rowSpacing = parseFloat(this.dicomElements.PixelSpacing.value[0]);
        columnSpacing = parseFloat(this.dicomElements.PixelSpacing.value[1]);
    }
    else if( this.dicomElements.ImagerPixelSpacing ) {
        rowSpacing = parseFloat(this.dicomElements.ImagerPixelSpacing.value[0]);
        columnSpacing = parseFloat(this.dicomElements.ImagerPixelSpacing.value[1]);
    }
    var spacing = new ovm.image.ImageSpacing(
        columnSpacing, rowSpacing);
    // image
    var image = new ovm.image.Image( size, spacing, this.pixelBuffer );
    // lookup
    var rescaleSlope = 1;
    if( this.dicomElements.RescaleSlope ) {
        rescaleSlope = parseFloat(this.dicomElements.RescaleSlope.value[0]);
    }
    var rescaleIntercept = 0;
    if( this.dicomElements.RescaleIntercept ) {
        rescaleIntercept = parseFloat(this.dicomElements.RescaleIntercept.value[0]);
    }
    var windowPresets = [];
    var name;
    if( this.dicomElements.WindowCenter &&  this.dicomElements.WindowWidth ) {
        for( var i = 0; i < this.dicomElements.WindowCenter.value.length; ++i) {
            if( this.dicomElements.WindowCenterWidthExplanation ) {
                name = this.dicomElements.WindowCenterWidthExplanation.value[i];
            }
            else {
                name = "Default"+i;
            }
            windowPresets.push({
                "center": parseInt( this.dicomElements.WindowCenter.value[i], 10 ),
                "width": parseInt( this.dicomElements.WindowWidth.value[i], 10 ), 
                "name": name
            });
        }
    }
    var lookup = new ovm.image.LookupTable( windowPresets, rescaleSlope, rescaleIntercept);
    image.setLookup( lookup );
    // return
    return image;
};
