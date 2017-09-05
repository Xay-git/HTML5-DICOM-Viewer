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

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@page errorPage="ErrorPage.jsp" %>
<%@taglib prefix="ser" uri="/WEB-INF/tlds/SeriesDetails.tld" %>
<%@taglib prefix="img" uri="/WEB-INF/tlds/ImageInfo.tld" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%
    String patName = new String(request.getParameter("patientName").getBytes("ISO-8859-1"), "UTF-8");
    String studyDesc = new String(request.getParameter("studyDesc").getBytes("ISO-8859-1"), "UTF-8");
%>

<html>
    <head>

        <style type="text/css">
            .heading
            {
                font-family: Arial;               
                font-weight: bold;
                font-size: 20px;  
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
            
            #toggleWest {
            	cursor: pointer;
            	float: right;        	
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
			   font-size:15px;
			   
			}  
			#dataz{
			border:none;outline:medium;
			}       
        </style>

        <script type="text/javascript">
          
            function changeImgView(but) {
                //var table = $(but).parent().parent().parent().parent();
                //console.log(table.children().find('tr:nth-child(2)').children());

                var imgBut = $(but).attr('src');
                var imgCount = 0;

                if(imgBut.indexOf("all.png") >=0 ) {
                    $(but).attr('src', 'images/one.png');

                    $(but).parent().prev().children().each(function() {
                        if(imgCount == 0) {
                            $(this).css('background-color', '#00F');
                        } else {
                            $(this).css('background-color', '#a6a6a6');
                        }
                        imgCount++;
                    });

                    imgCount = 0;

                    $(but).parent().parent().next().children().children().each(function() {
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
                            $(this).css('background-color', '#a6a6a6');
                        }
                        imgCount++;
                    });

                    imgCount = 0;

                    var serImgs = $(but).parent().parent().next().children().children();
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
                        $(this).css('background-color', '#00F');
                    });

                    $(but).parent().parent().next().children().children().each(function() {
                        $(this).css('display', 'inline');
                    });
                }

                /* var tmp = $(but).attr('name');
                var tmp = tmp.split("|");
                var tagUrl = "tableContainer.jsp?patient=${param.patient}&study=${param.study}&dcmURL=${param.dcmURL}";
                tagUrl += "&wadoUrl=${param.wadoUrl}";
                tagUrl += "&series=" + tmp[0].trim() + "&numberOfImages=" + tmp[1].trim()+"&toggleImageView=0";
                table.load(encodeURI(tagUrl));*/
            }

            function changeSeries(image) {
                var imgSrc = image.src;

                if(imgSrc.indexOf('images/SR_Latest.png') > 0) {
                	imgSrc = jQuery(image).attr('imgSrc');
                }
				
                parent.selectedFrame = null;//For IE 
                
//                 iframe.src= "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\""+document.domain+"\\\";<\\\\/script>\\');document.close();};<\/script>'";
                
                var url = 'frameContent.html?studyUID=' + getParameter(imgSrc, 'study');
                url += '&seriesUID=' + getParameter(imgSrc, 'series');
                url += '&instanceNumber=' + parseInt(image.name-1);
                url += '&serverURL=' + getParameter(imgSrc, 'serverURL');
                var actFrame = getActiveFrame();
                actFrame.src = url;
                doMouseWheel = true;
            }
            
            function openSeriesInViewer(clickImg) {
                var selTabText = $('.ui-tabs-selected').find('span').html();
                var patId = $('#patID').html().substring(3).trim();
                var sUrl = "viewer.html?patientID=" + patId + "&studyUID=" + getParameter(clickImg.src, "study");
                sUrl += "&serverName=" + selTabText;
                window.open(sUrl, "_blank");
            }

            function getParameter(queryString, parameterName) {
                //Add "=" to the parameter name (i.e. parameterName=value);
                var parameterName = parameterName + "=";
                if(queryString.length > 0) {
                    //Find the beginning of the string
                    var begin = queryString.indexOf(parameterName);
                    if(begin != -1) {
                        //Add the length (integer) to the beginning
                        begin += parameterName.length;
                        var end = queryString.indexOf("&", begin);
                        if(end == -1) {
                            end = queryString.length;
                        }
                        return unescape(queryString.substring(begin, end));
                    }

                    return null;
                }
            }
            
        
         </script>

    </head>
     <body>  
     	<div style="border: 2px solid #2A2A2A;">	 	
	        <div id="patName1" class="heading" style="padding-top: 2px;" title="<%=patName%>">姓名:<%=patName%></div>
	        <div id="patID" class="heading" style="font-size: 15px;!important;" >编号: ${param.patient}</div>
	        <table id="studyTable" class='ui-widget-content' style="font-family: Arial; font-size:12px; width: 100%; border: none;" >
	            <tbody>
	                <tr>
	                    <td colspan="2">说明:<%=studyDesc%></td>
	                </tr>
	                <tr>                    
	                    <td align="right">${param.totalSeries}种影像类型</td>
	                </tr>
	            </tbody>
	        </table>
        </div>
       <br>
   		<div id="previews" style="overflow: auto; height: 90%;">
   			 <ser:Series patientId="${param.patient}" study="${param.study}" dcmURL="${param.dcmURL}">
       			 <c:set var="middle" value="${numberOfImages/2}" />
        		<fmt:formatNumber var="middle" maxFractionDigits="0" value="${middle}" />
       			<table class="seriesTable" id="${fn:replace(seriesId, '.','_')}_table">
        		    <tbody>
        		        <tr onclick="jQuery(this).next().toggle()" style="cursor: pointer;" class='ui-widget-content'>
	    		            <td> ${seriesDesc}</td>
        		            <td align="right">${numberOfImages} 张影像</td>
        		            <!--<td colspan="2">${seriesDesc} - Images: ${numberOfImages}</td>-->
        		        </tr>
        		        <tr>
        		            <td colspan="2">
        		                <table style="table-layout:fixed; width:100%;">
                          			 <!--  <tr>
                               			 <td id="${fn:replace(seriesId, '.','_')}" class="seriesImgsIndex" style="width: 100%">
                          					  <c:forEach var="i" begin="1" end="${numberOfImages}">
                             					   <c:choose>
                                  					  <c:when test="${(i == middle) || (i==1) || (i==numberOfImages)}">
                                        					<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
                                    					</c:when>
					                                    <c:otherwise>
                    					                    <div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
                    					                </c:otherwise>
                    					            </c:choose>
                    					        </c:forEach>
                    							</td>
						            </tr> -->
           							 <tr>
						                <td colspan="2">
								            <img:Image patientId="${param.patient}" study="${param.study}" series="${seriesId}" dcmURL="${param.dcmURL}">
							            	<c:choose>
							                    <c:when test="${modality == 'SR'}">
							                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/SR_Latest.png" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}" ondblclick="openSeriesInViewer(this)" />
							                    </c:when>

                   								<c:when test="${sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1'}">
							                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/pdf.png" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}" ondblclick="openSeriesInViewer(this)" />
							                    </c:when>	
							                    
							                    <c:when test="${fn:contains(sopClassUID,'1.2.840.10008.5.1.4.1.1.9')}"> <!-- Wave Forms -->
							                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/pdf.png" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&rid=true" ondblclick="openSeriesInViewer(this)" />
							                    </c:when>
							                    
							                    <c:when test="${sopClassUID == '1.2.840.10008.5.1.4.1.1.66'}"> <!-- Raw Data Storage -->
							                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="images/rawdata.png"/>
							                    </c:when>
							                        			
                						    <c:otherwise>
                						    	<c:choose>
	                    					        <c:when test="${param.wadoUrl == 'C-GET'}">
	                    					            <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
	                    					                <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&sopClassUID=${sopClassUID}" ondblclick="openSeriesInViewer(this)" />
	                    					            </c:if>
	                    					        </c:when>
	                          						<c:when test="${param.wadoUrl == 'C-MOVE'}">
						                                <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
	                    					                <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}" ondblclick="openSeriesInViewer(this)" />
	                    					            </c:if>
	                    					        </c:when>	                    					        
	                    					        <c:otherwise>	                    					        
		                    				            <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
		                    				                <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" style="${thumbSize}" src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&contentType=${param.contentType}" ondblclick="openSeriesInViewer(this);" />
		                    				            </c:if>
	                    				            </c:otherwise>
                    				            </c:choose>
                    						</c:otherwise>
				                	</c:choose>
				              <!--   <c:if test="${multiframe == 'yes'}">
				                	<script type="text/javascript">							                		
        								$("#${fn:replace(seriesId, '.','_')}_table").find("#totalImgs").html("${numberOfFrames} Frames");	                								
							        </script>
				                </c:if>-->
				            </img:Image>
			            </td>
            		</tr>
	        </table>
    	</td>
	</tr>
</tbody>
</table>
<div style="height:3px"></div>
</ser:Series>

</div>

</body>
</html>