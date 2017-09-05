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

<html>
	<head>
		<script type="text/javascript">
			var series = new Array();
			
			$(document).ready(function() {
				$($('.image').get(0)).load(function() {
					$($('.image').get(0)).click();
				});

				jQuery('.other').each(function() {
					$(this).attr('src',$(this).attr('link'));
				});
		      	
		      	jQuery('.other_multiframe').each(function() {
		      		$(this).attr('src',$(this).attr('link'));
		      	});	          
		
				var lastImg = $('.other').last();
				if(lastImg.length==0) { // All images are Multiframe 
					lastImg = $('.other_multiframe').last();
					if(lastImg.length==0) {
						lastImg = $('.image').last();
					}
				}
				
				lastImg.load(function() {						
					storeSer(series);		
					if($("#otherStudies").children().length==0) {
						fetchOtherStudies();	
					}
				});		
			}); //document.ready 
		
			$(document).mouseup(function(e) {
				createEvent("ToolSelection", {
					tool : "mouseup"
				});
			});
		
			function changeImgView(but) {		
				var imgBut = $(but).attr('src');
                var imgCount = 0;

                if(imgBut.indexOf("all.png") >=0 ) {
                    $(but).attr('src', 'images/one.png');
                	
                    $(but).parent().prev().children().each(function() {
                        if(imgCount == 0) {
                            $(this).css('background-color', '#00F');
                        } else {
                            $(this).css('background-color', !$(this).hasClass('waiting') ? '#a6a6a6' : '#464646');
                        }
                        imgCount++;
                    });

                    imgCount = 0;	                   
                   	var seriesId = $(but).attr("name");
                    seriesId = seriesId.substring(0,seriesId.indexOf("|")-1);
                    seriesId = seriesId.replace(/\./g,'_') + "_table";
                    
                    $("#" + seriesId + " tr:last").children().children().each(function() {
                        if(imgCount == 0) {
                            $(this).css('display', 'inline');
                        } else {
                            $(this).css('display', 'none');
                        }
                        imgCount++;
                    });
                } else if(imgBut.indexOf("one.png") >=0 ) {
                    $(but).attr('src', 'images/three.png');
                    var serDivs = $(but).parent().prev().children();
                    var totserDivs = serDivs.length;
                    serDivs.each(function() {
                        if(imgCount == 0 || imgCount == Math.round(totserDivs/2)-1 || imgCount == totserDivs-1) {
                            $(this).css('background-color', '#00F');
                        } else {
                            $(this).css('background-color', !$(this).hasClass('waiting') ? '#a6a6a6' : '#464646');
                        }
                        imgCount++;
                    });

                    imgCount = 0;
					var seriesId = $(but).attr("name");
                    seriesId = seriesId.substring(0,seriesId.indexOf("|")-1);
                    seriesId = seriesId.replace(/\./g,'_') + "_table";
                    
                    var serImgs = $("#" + seriesId + " tr:last").children().children();
                    var serInsCnt = serImgs.length;
                    
                    serImgs.each(function() {
                        if(imgCount == 0 || imgCount == Math.round(serInsCnt/2)-1 || imgCount == serInsCnt-1) {
                            $(this).css('display', 'inline');
                        } else {
                            $(this).css('display', 'none');
                        }
                        imgCount++;
                    });
                } else {
                    $(but).attr('src', 'images/all.png');

                    $(but).parent().prev().children().each(function() {
                    	$(this).css('background-color', !$(this).hasClass('waiting') ? '#00F' : '#464646');
                    });

                    var seriesId = $(but).attr("name");
                    seriesId = seriesId.substring(0,seriesId.indexOf("|")-1);
                    seriesId = seriesId.replace(/\./g,'_') + "_table";
                    
                    $("#" + seriesId + " tr:last").children().children().each(function() {
                        $(this).css('display', 'inline');
                    });
                }
			}
		
			function changeSeries(image) {
				var imgSrc = image.src;							
		
				if (imgSrc.indexOf('images/SR_Latest.png') > 0) {
					imgSrc = jQuery(image).attr('imgSrc');
				}
		
				if (imgSrc.indexOf('images/pdf.png') > 0) {
					imgSrc = jQuery(image).attr('imgSrc');
				}
		
				parent.selectedFrame = null;//For IE            
		
				var url = 'frameContent.html?';
				url += imgSrc.substring(imgSrc.indexOf('?') + 1);
				url += '&instanceNumber=' + parseInt(image.name - 1);
		
				var actFrame = getActiveFrame();				
				$(actFrame).css("visibility", "hidden");
				jQuery('#loadingView', window.parent.document).show();
				actFrame.src = url;
				$('.toggleOff').removeClass('toggleOff');
				$('.imgOn').addClass('imgOff').removeClass('imgOn');
			}

			function showRawDataAlert() {
				jAlert('Raw data storage cannot be shown in viewer!', 'ERROR');
			}

			function showProgress(ser_id,lbl_id) {
            	var lbl = jQuery('#'+ser_id.replace(/\./g,'-')+"_"+lbl_id);   
            	var imgToggleMode = jQuery(lbl).parent().next().find('img').attr('src');
            	if(imgToggleMode=="images/three.png" || imgToggleMode=="images/one.png") {
            		lbl.css('background','#a6a6a6');
            	} else {
            		lbl.css('background','#00F');
            	}		
				lbl.removeClass('waiting');			
            }
		</script>
	</head>
	<body>		
		<c:if test="${param.descDisplay=='true'}">
			<div id='${param.study}' class="accordion open" title="${tooltip}" onclick="acc(jQuery(this));">${param.studyDesc}</div>
		</c:if>
		<div>
			<ser:Series patientId="${param.patient}" study="${param.study}" dcmURL="${param.dcmURL}">
				<c:set var="middle" value="${(numberOfImages+0.5)/2}" />
        		<fmt:formatNumber var="middle" maxFractionDigits="0" value="${middle}" />
       			<fmt:parseNumber var="total" type="number" value="${numberOfImages}" />			
				
				<script type="text/javascript">					
		            series.push({
			            "seriesUID" : '${seriesId}',
						"totalInstances" : '${numberOfImages}',
						"seriesDesc" : '${seriesDesc}',
						"modality" : '${modality}',
						"seriesNumber" : '${seriesNumber}',
						"seriesDate" : '${seriesDate}',
						"bodyPart" : '${bodyPart}',
						"studyDesc" : '${param.studyDesc}',
						"studyDate" : '${param.studyDate}'	
		            });
	            </script>
	            
	            <table class="seriesTable" id="${fn:replace(seriesId, '.','_')}_table">
	            	<tbody>
	            		<img:Image patientId="${param.patient}" study="${studyId}" series="${seriesId}" dcmURL="${param.dcmURL}">
	            			<c:choose>
	            				<c:when test="${multiframe=='yes'}">
	            					<tr style="cursor: default; color: #FF8A00; font-size: 12px;">
	            						<td>Multiframe-${instanceNumber}</td>
					    				<td align="right"> <div id="totalImgs" style="width: 90px;">${numberOfFrames} Frames </div></td>
	            					</tr>
	            					
	            					<tr>
	            						<td colspan="2">
	            						<table style="table-layout: fixed; width: 100%;">
	            							<tr>
	            								<td id="${fn:replace(imageId, '.','_')}" class="seriesImgsIndex" style="width: 94%;" name="${imageId}">
	            									<div id="${fn:replace(imageId, '.','-')}_${i}" style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>		
	            								</td>
	            								
	            								<td align="right" style="vertical-align: top;">
														<img class="toggleImgView" src="images/all.png" name="Multiframe" title="点击展开" style="cursor:hand;"/>
												</td>
											</tr>
												
											<tr>
												<td colspan="2">
													<c:choose>
														<c:when test="${param.wadoUrl == 'C-GET' || param.wadoUrl == 'C-MOVE'}">
															<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" class="image" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}"  onclick="changeSeries(this)"/>
															
															<c:forEach var="i" begin="1" end="${numberOfFrames}"> 
																<img name="${i}" id="${fn:replace(imageId, '.','_')}_${i}" style="${thumbSize} display: none;" class="other_multiframe" link="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&frameNumber=${i}"/> 
															</c:forEach>
														</c:when>
														<c:otherwise>
															<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}"  src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}" class="image" onclick="changeSeries(this)" />
															<c:forEach var="i" begin="1" end="${numberOfFrames}"> 
																<img name="${i}" id="${fn:replace(imageId, '.','_')}_${i}" style="${thumbSize} display: none;" class="other_multiframe" link="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&frameNumber=${i}"/>
															</c:forEach>
														</c:otherwise>
													</c:choose>
												</td>																										
            								</tr>		            								
	            						</table>
	            					</tr>
	            				</c:when>
	            				
	            				<c:otherwise>
	            						<c:if test="${instanceNumber==1}">		            						
	            							<tr style="cursor: default; color: #FF8A00">
												<td>${seriesDesc}</td>
												<td align="right"> <div id="totalImgs">${numberOfImages} 张影像 </div></td>
											</tr>
										
											<tr>
												<td colspan="2">
													<table style="table-layout: fixed; width: 100%;">
														<tr>
															<td id="${fn:replace(seriesId, '.','_')}" class="seriesImgsIndex" style="width: 94%;">
																<c:forEach var="i" begin="1" end="${numberOfImages}">
																	<c:choose>
																		<c:when test="${(i == middle) || (i==1) || (i==numberOfImages)}">
																			<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
																		</c:when>
																		<c:otherwise>
																			<div id="${fn:replace(seriesId, '.','-')}_${i}" style="background: #464646; width: 5px; height: 5px; float: left;margin: 0 1px 1px;" class="waiting"></div>
																		</c:otherwise>
																	</c:choose>
																</c:forEach>
															</td>
															<td align="right" style="vertical-align: top;">
																<c:choose>
																	<c:when test="${numberOfImages > 3}">
																		<img class="toggleImgView" src="images/three.png" name="${seriesId} | ${numberOfImages}" onclick="changeImgView(this)" title="点击展开" style="cursor:hand;" />
																	</c:when>
																	<c:otherwise>
																		<img class="toggleImgView" src="images/all.png" name="${seriesId} | ${numberOfImages}" title="点击展开" style="cursor:hand;" />
																	</c:otherwise>
																</c:choose>
															</td>
														</tr>	
													</table>
												</td>
											</tr>											
											
											<tr>	
												<td colspan="2">											
	            						</c:if>
	            						
										<c:choose>
											<c:when test="${modality == 'SR'}"> <!-- Structured Report -->
												<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="height: 75px;" src="images/SR_Latest.png" class="image" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${studyId}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}"  onclick="changeSeries(this);"/>
											</c:when>
											
											<c:when test="${sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1'}"> <!-- Enacpsulated PDF -->
												<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/pdf.png" class="image" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${studyId}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}"  onclick="changeSeries(this)"/>
											</c:when>
													
											<c:when test="${fn:contains(sopClassUID,'1.2.840.10008.5.1.4.1.1.9')}"> <!-- Wave Forms -->
												<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/pdf.png" class="image" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${studyId}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}&rid=true"  onclick="changeSeries(this)" />
											</c:when>
											
											<c:when test="${sopClassUID == '1.2.840.10008.5.1.4.1.1.66'}"> <!-- Raw Data Storage -->
												<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/rawdata.png" onclick="showRawDataAlert();"/>
											</c:when>
													
											<c:otherwise>
												<c:choose>	
													<c:when test="${param.wadoUrl == 'C-GET' || param.wadoUrl == 'C-MOVE'}">
														<c:choose>
															<c:when test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
																<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" class="image" style="${thumbSize};" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}" onclick="changeSeries(this)" />
															</c:when>
															<c:otherwise>
																<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" class="other" class="image" style="${thumbSize}; display: none;" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}" onclick="changeSeries(this)" onload='showProgress("${seriesId}","${instanceNumber}");'/>
															</c:otherwise>
														</c:choose>
													</c:when>
													<c:otherwise>
														<c:choose>
															<c:when test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
																<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" class="image" src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}&contentType=${param.contentType}"  onclick="changeSeries(this)"/>
															</c:when>
															<c:otherwise>
																<img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" class="other image" style="${thumbSize} display: none;" link="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&sopClassUID=${sopClassUID}&seriesDesc=${seriesDesc}&images=${numberOfImages}&modality=${modality}&contentType=${param.contentType}"  onclick="changeSeries(this)" onload='showProgress("${seriesId}","${instanceNumber}");'/>
															</c:otherwise>
														</c:choose>
													</c:otherwise>
												</c:choose>
											</c:otherwise>										
										</c:choose>									

		            					<c:if test="${instanceNumber==numberOfImages}">
			            					</td>
			            					</tr> 	
		            					</c:if>
          							</c:otherwise>
           					</c:choose>		
            			</img:Image>		            			 
           			</tbody>
				</table>      				 
			</ser:Series>
		</div>
		<script type="text/javascript">	
			var studyId = '${param.study}';
			if(sessionStorage[studyId]==undefined) {
				var study = {"studyUID":studyId,"studyDesc":"${param.studyDesc}","studyDate":"${param.studyDate}"};
				var studyData = sessionStorage["${param.patient}"];

				if(studyData == undefined) {
					studyData = new Array();
				} else {
					studyData = JSON.parse(studyData);
				}

				studyData.push(study);
				sessionStorage["${param.patient}"] = JSON.stringify(studyData);				
			}		
			sessionStorage[studyId] = JSON.stringify(series);							
		</script>
	</body>
</html>