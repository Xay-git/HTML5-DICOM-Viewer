function DicomInputStreamReader()
{	
    this.inputBuffer;
    this.inputStreamReader;
    this.readDicom=readDicom;
    this.getInputBuffer=getInputBuffer;
    this.getReader=getReader;
}

function readDicom(url)
{
    this.inputStreamReader=new BinFileReader(url);
    this.inputBuffer = new Array(this.inputStreamReader.getFileSize);
    this.inputBuffer=this.inputStreamReader.readBytes();
}

function getInputBuffer()
{
    return this.inputBuffer;
}

function getReader()
{
    return this.inputStreamReader;
}