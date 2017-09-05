var pat = null;
var directLaunch = false;

function loadViewerPage() {	
	initPage();
	$("#toolbarContainer").load("viewer_tools.html");
}

function getStudyDetails() {
	pat = $.cookies.get('patient');	
	var queryString = document.location.search.substring(1);
	var patId = getParameter(queryString, "patientID");
	var studyId = getParameter(queryString, "studyUID");
	var serverName = getParameter(queryString, "serverName");
	if (serverName == 'null') {
		serverName = '';
	}
	if (patId == 'null') {
		patId = '';
	}
	if (studyId == 'null') {
		studyId = '';
	}

	if (patId != null && studyId != null && serverName != null) {
		$.post("StudyInfo.do", {
			"patientID" : patId,
			"studyUID" : studyId,
			"serverName" : serverName
		}, function(data) {
			if (data['error'] != null) {
				if (data['error'].trim() == 'Server not found') {
					alert("Server not found!!!");
					return;
				}
			}
			directLaunch = true;
			pat = data;			
			loadStudy();
		}, "json");
	} else {
		loadStudy();
	}
}

function isCompatible() {
	return !!(window.requestFileSystem || window.webkitRequestFileSystem);
}

function saveJpgImages() {
	if(isCompatible()) {
		window.requestFileSystem = window.requestFileSystem
			|| window.webkitRequestFileSystem;
		var secondTR = $('.seriesTable');
		secondTR.find('img').each(function() {
			if (this.complete) {
				saveLocally(this);
			} else {
				this.onload = function() {
					saveLocally(this);
				};
			}

		});
	}
}

function saveLocally(image) {
	var cvs = document.createElement('canvas');
	var ctx = cvs.getContext("2d");

	var fn = '';
	if (image.src.indexOf('images/pdf.png') >= 0) {
		fn = getParameter($(image).attr('imgSrc'), 'object') + '.pdf';
	} else {
		fn = getParameter(image.src, 'object') + '.jpg';
	}
	cvs.width = image.naturalWidth;
	cvs.height = image.naturalHeight;
	ctx.drawImage(image, 0, 0);

	if (image.src.indexOf('images/pdf.png') >= 0) {
		var imd = cvs.toDataURL('image/pdf');
		var ui8a = convertDataURIToBinary(imd);
		var bb = new Blob([ ui8a ], {
			type : 'image/pdf'
		});
	} else {
		var imd = cvs.toDataURL('image/jpeg');
		var ui8a = convertDataURIToBinary(imd);
		var bb = new Blob([ ui8a ], {
			type : 'image/jpeg'
		});
	}

	window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
		fs.root.getFile(fn, {
			create : true
		}, function(fileEntry) {
			// Create a FileWriter object for our FileEntry.
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.onwriteend = function(e) {
					//console.log(fileEntry.fullPath + ' Write completed.');
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};

				fileWriter.write(bb); //.getBlob(contentType[extname]));
			}, fileErrorHandler);
		}, fileErrorHandler);
	}, fileErrorHandler);
}

function convertDataURIToBinary(dataURI) {
	var BASE64_MARKER = ';base64,';
	var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	var base64 = dataURI.substring(base64Index);
	var raw = window.atob(base64);
	var rawLength = raw.length;
	var array = new Uint8Array(new ArrayBuffer(rawLength));

	for (i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

function loadStudy() {	
	// load WestPane content
	var tmpUrl = "westContainer.jsp?patient=" + pat.pat_ID + "&study="
			+ pat.studyUID + "&patientName=" + pat.pat_Name;
	tmpUrl += "&studyDesc=" + pat.studyDesc + "&studyDate=" + pat.studyDate
			+ "&totalSeries=" + pat.totalSeries + "&dcmURL=" + pat.dicomURL;
	tmpUrl += "&wadoUrl=" + pat.serverURL;
	tmpUrl += "&contentType=image/" + pat.imgType;
	$('#westPane').load(encodeURI(tmpUrl));

	document.title = pat.pat_Name;
}

/*function getSeries(patId, studyUID) {
	$.post("Series.do", {
		"patientID" : patId,
		"studyUID" : studyUID,
		"dcmURL" : pat.dicomURL
	}, function(data) {
		sessionStorage[studyUID] = JSON.stringify(data);
		firstSeries = data[0]['seriesUID'];
		if(pat.serverURL != 'C-MOVE' && pat.serverURL != 'C-GET') {
			$.each(data, function(i, series) {
				getInstances(patId, studyUID, series['seriesUID']);
			});
		}
	}, "json");
}*/

function getSeries(patId, studyUID) {	
	
	$.post("Series.do", {
		"patientID" : patId,
		"studyUID" : studyUID,
		"dcmURL" : pat.dicomURL,
		"retrieve" : pat.serverURL
	}, function(data) {
		sessionStorage[studyUID] = JSON.stringify(data);
			if(pat.serverURL!="C-MOVE" && pat.serverURL!="C-GET") {
				$.each(data, function(i, series) {
					getInstances(patId, studyUID, series['seriesUID']);
				});
			}
	}, "json");	
}

function getInstances(patId, studyUID, seriesUID) {
	$.post("Instance.do", {
		"patientId" : patId,
		"studyUID" : studyUID,
		"seriesUID" : seriesUID,
		"dcmURL" : pat.dicomURL,
		"serverURL" : pat.serverURL
	}, function(data) {
		sessionStorage[seriesUID] = JSON.stringify(data);		
	}, "json");
}

function storeSer(data) {	
	$.each(data, function(i, series) {
		getInstances(pat.pat_ID, pat.studyUID, series['seriesUID']);
	});	
}

function getIns(seriesUID) {
	jQuery.ajax({
		url: "Instance.do?patientId=" + pat.pat_ID + "&studyUID=" + pat.studyUID + "&seriesUID=" + seriesUID + "&dcmURL=" + pat.dicomURL + "&serverURL=" + pat.serverURL,
		dataType: 'json',
		cache: false,
		success: function(data) {
			sessionStorage[seriesUID] = JSON.stringify(data);
		}, 
		error: function(request) {
			console.log('error');
		}
	});
}

function fetchOtherStudies() {	
	$.get("UserConfig.do", {'settings': 'prefetch', 'todo': 'READ'}, function(data) {
		var doFetch = false;
		if(directLaunch) {
			if(data.trim()=='Yes' && getParameter(document.location.search.substring(1), "patientID")!='null') {
				doFetch = true;
			}
		} else {
			if(data.trim()=='Yes' && pat.pat_ID.length>0) {
				doFetch = true;
			}
		}
		
		if(doFetch) {
			$.post("otherStudies.do", {
				"patientID" : pat.pat_ID,
				"studyUID" : pat.studyUID,
				"dcmURL" : pat.dicomURL	
			}, function(data) {
				if(data.length>0) {
					$("#otherStudiesInfo").text((data.length + " archived") + (data.length>1 ? " studies" : " study") + " found.");
				} else {
					$("#otherStudiesInfo").text("No archived studies found.");
				}
				$.each(data, function(i, study) {
					var link = encodeURI("Study.jsp?patient=" + pat.pat_ID + "&study=" + study["studyUID"] + "&dcmURL=" + pat.dicomURL	+ "&wadoUrl=" + pat.serverURL + "&studyDesc=" + study["studyDesc"] + "&studyDate=" + study["studyDate"] + "&descDisplay=false" + "&contentType=image/" + pat.imgType);
//					var div = "<div id=" + study['studyUID'] + " class='accordion close' link=" + link + " onclick='loadOther(this);'>" + study['dateDesc'] + "</div>";
					var div = "<div id=" + study['studyUID'] + " class='accordion' link=" + link + " onclick='loadOther(this,false);'" + " >" + study['dateDesc'] + " <img src='images/download.png' style='padding-right: 5px; float: right;' title='Load this study' onclick='loadOther(this,true);' /> </div>";
					$('#otherStudies').append(div);
					$('#otherStudies').append(document.createElement("div"));
				});
				$("#otherStudies").show();
				$("#otherStudiesInfo").show();
			}, "json");
		} 
	},"text");
}

function loadOther(div1,isRet) {	
	var div = isRet ? $(div1).parent() : div1;	
	var childDiv = $(div).next();	
	
	if($(childDiv).children().length>0) {				
		acc($(div));
	} else if(isRet) {
		$(div).addClass("loading");
		$(div1).remove();
		$(childDiv).load($(div).attr('link'));
		acc($(div));
	}
	
}