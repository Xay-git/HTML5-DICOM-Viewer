<!--
/* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1/GPL 2.0/LGPL 2.1
*
* The contents of this file are subject to the Mozilla Public License Version
* 1.1 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
*
* Software distributed under the License is distributed on an "AS IS" basis,
* WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
* for the specific language governing rights and limitations under the
* License.
*
* The Original Code is part of Oviyam, an web viewer for DICOM(TM) images
* hosted at http://skshospital.net/pacs/webviewer/oviyam_0.6-src.zip
*
* The Initial Developer of the Original Code is
* Raster Images
* Portions created by the Initial Developer are Copyright (C) 2014
* the Initial Developer. All Rights Reserved.
*
* Contributor(s):
* Babu Hussain A
* Devishree V
* Meer Asgar Hussain B
* Prakash J
* Suresh V
*
* Alternatively, the contents of this file may be used under the terms of
* either the GNU General Public License Version 2 or later (the "GPL"), or
* the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
* in which case the provisions of the GPL or the LGPL are applicable instead
* of those above. If you wish to allow use of your version of this file only
* under the terms of either the GPL or the LGPL, and not to allow others to
* use your version of this file under the terms of the MPL, indicate your
* decision by deleting the provisions above and replace them with the notice
* and other provisions required by the GPL or the LGPL. If you do not delete
* the provisions above, a recipient may use your version of this file under
* the terms of any one of the MPL, the GPL or the LGPL.
*
* ***** END LICENSE BLOCK ***** */
-->

<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@page errorPage="ErrorPage.jsp"%>
<%@taglib prefix="ser" uri="/WEB-INF/tlds/SeriesDetails.tld"%>
<%@taglib prefix="img" uri="/WEB-INF/tlds/ImageInfo.tld"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<%
	String patName = new String(request.getParameter("patientName")
			.getBytes("ISO-8859-1"), "UTF-8");
	String studyDesc = new String(request.getParameter("studyDesc")
			.getBytes("ISO-8859-1"), "UTF-8");
%>

<html>
	<head>
	
		<style type="text/css">
			.heading
            {
                font-family: Arial;
                font-size: 20px;
                font-weight: bold;
                padding-left: 3px;
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
			
			.seriesTable {
				table-layout: fixed;
				width: 100%;
				font-family: Arial;
				font-size: 12px;
				border-spacing: 0px;
				padding-left: 2px;
			}
			
			.scale-image {
				width: 30%;
				height: 30%;
			}
			
			.accordion {
				padding:5px;
				font-weight:bold;
				cursor:pointer;
				background-color:#666;				
				background-position:right center;
				background-repeat:no-repeat; color:#F90;
				border:1px solid #333;
				font-size: 14px;
				font-family: Arial;
			}	
			.accordion:hover {
				background-color:#555;
			}
			
			.loading {
				background-image:url(images/loading.gif);
			}
			
			#otherStudiesInfo {
				padding:5px;
				font-weight:bold;
				cursor:pointer;
				background-color:#222;	
				color: #fff;
				font-family: Arial;
				font-size: 14px; 
				text-align: center; 
				margin: 7px 0px 7px 0;			
			}
			
			.open {
				background-image:url(images/arrow_up.gif);
			}
			
			.close {
				background-image:url(images/arrow_down.gif);
			}
			
			#previews::-webkit-scrollbar {
				width: 14px;
				background: #464646;
			}

            #previews::-webkit-scrollbar-track {
			    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
			}   
			
			#previews::-webkit-scrollbar-thumb {
 			    -webkit-border-radius: 10px; 
 			    border-radius: 10px;
				background: #262626;
			    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
			}
			#patName1{
			   font-size: 12px;;
			  margin-top:23px;
			  
			}
		</style>

		<script type="text/javascript">		
			function toggle(divider) {
				var div = $(divider);
				if (div.attr('title') === 'Close') {
					div.attr('title', 'Open');
					div.parent().css('width', '1%');
					div.parent().next().css('width', '99%');
					div.css('background', 'url("images/showleft.png")');
					$('#previews').hide();
					$('.heading').hide();
					$('#studyTable').hide();
				} else {
					div.attr('title', 'Close');
					div.parent().css('width', '20%');
					div.parent().next().css('width', '80%');
					div.css('background', 'url("images/hideleft.png")');
					$('#previews').show();
					$('.heading').show();
					$('#studyTable').show();
				}
			}

			function showOtherStudies(patientID,selectedStudyId,dcmUrl,wadoUrl) {
				$.post("otherStudies.do", {
					"patientID" : patientID,
					"studyUID" : selectedStudyId,
					"dcmURL" : dcmUrl					
				}, function(data) {
					$.each(data, function(i, study) {
						var div = document.createElement("div");
						var url = "Study.jsp?patient=" + patientID + "&study=" + study["studyUID"] + "&dcmURL=" + dcmUrl + "&wadoUrl=" + wadoUrl + "&studyDesc=" + study["dateDesc"];
						jQuery("#otherStudies").show();
						jQuery("#otherStudies").load(url);
					});
				}, "json");
			}

			function acc(acc1) {
            	/*acc1.next().toggle();          	
            	if(acc1.hasClass('open')) {
            		acc1.removeClass('open').addClass('close');
            	} else {
            		acc1.removeClass('close').addClass('open');
            	} */
            	if(acc1.hasClass("open")) {
                	acc1.removeClass("open").addClass("close");
                	acc1.next().hide();
            	} else {
                	$(".accordion").next().hide();
                	$(".accordion").each(function() {
                    	if($(this).hasClass("open")) {
                        	$(this).removeClass("open").addClass("close");
                    	}
                	});
                	acc1.removeClass("close").addClass("open");
                	acc1.next().show();
            	}
                	     	
            }
		</script>
	</head>
	<body>
    	<div title="Close" style="width: 17px; height: 17px; cursor: pointer; float: right; background: url('images/hideleft.png');" onclick="toggle(this);"></div>
    
    	<div style="border: 2px solid #2A2A2A; height: 9%;">
	        <div id="patName1" class="heading" style="color: #FF8A00; padding: 2px 0 3px 3px; cursor: default;" title="<%=patName%>">姓名:<%=patName%></div>
	        <div id="patID" class="heading" style="color:#FF8A00; padding: 0 0 3px 3px; font-size: 12px !important;">编号: ${param.patient}</div>   
        </div>
        
        <div id="previews" style="overflow: auto; height: 90%; border-top: 2px solid black;">
        	<jsp:include page="Study.jsp?patient=${param.patient}&study=${param.study}&dcmURL=${param.dcmURL}&wadoUrl=${param.wadoUrl}&descDisplay=true&studyDesc=${param.studyDesc}&studyDate=${param.studyDate}&contentType=${param.contentType}"></jsp:include>
        	<div id="otherStudiesInfo" style="display: none;"> </div>
        	<div id="otherStudies" style="display:none;">
        	</div>
        </div>     
	</body>
</html>