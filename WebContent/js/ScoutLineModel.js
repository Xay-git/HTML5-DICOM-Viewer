function ScoutLineModel(seriesUid) {
    this.seriesUid = seriesUid;
    this.imgPosition = null;
    this.imgOrientation = null;
    this.pixelSpacing = null;
    this.rows = null;
    this.columns = null;
    this.instanceNo = null;

    this.getImgPosition = function() {
        return this.imgPosition;
    }

    this.getImgOrientation = function() {
        return this.imgOrientation;
    }

    this.getPixelSpacing = function() {
        return this.pixelSpacing;
    }

    this.getRows = function() {
        return this.rows;
    }

    this.getColumns = function() {
        return this.columns;
    }
}