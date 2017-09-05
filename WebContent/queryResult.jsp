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
	pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<%@taglib prefix="pat" uri="/WEB-INF/tlds/PatientInfo.tld"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>


<%
    String patName = request.getParameter("patientName");
    String tabName = request.getParameter("tabName");

    if(patName != null) {
        patName = new String(patName.getBytes("ISO-8859-1"), "UTF-8");
    }
%>

<fmt:setBundle basename="resources.i18n.Messages" var="lang" />

<html>
<head>
<style>
    .ptime{
    border:none;outline:medium;
    background:transparent;

    }
    
 	.dataTables_scrollBody {
 		height: 88% !important;
 	}
 	
 	.dataTables_wrapper {
 		border: 1px solid #2A2A2A;
 	}
 </style>
 

 
<script type="text/javascript">

	



            var dTable;
            $(document).ready(function() {
            
                var tableName = '#<%=tabName%>_table';                
                dTable = $(tableName).DataTable({
                    "bJQueryUI": true,
                    //"sPaginationType": "full_numbers",
                    "bPaginate": false,
                    //"bFilter": false,
                   "oLanguage": {
                        "sSearch": ""
                    },
                    "sScrollY": "87%",
                    "bScrollCollapse": true,
                    "bAutoWidth": false,
                    "sScrollX": "100%",
                    //"sScrollXInner": "100%",
                    "aaSorting": [[ 3, "desc" ]],
                    "aoColumnDefs": [ {
                            "aTargets": [0],
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                if ( sData.indexOf('img') >= 0) {
                                    $(nTd).css('padding', '0px');
                                    $(nTd).css('text-align', 'center');
                                }
                            }
                        }],
                    "aoColumns": [ null, null, null, null, null, null, null, {"bVisible": false}, {"bVisible": false}, {"bVisible": false}, {"bVisible": false}]
                });
				

				
                $.fn.dataTableInstances[<%=request.getParameter("tabIndex")%>] = dTable;               

                if(<%=request.getParameter("search")%>!=null && !<%=request.getParameter("search")%>) { //For Direct launch
                	$('#searchToggler').hide();
                	$('#Toggler').css('top','0.5%');
                }                 
            });
            
            function toggleDivider(divider) {
                var westPane = $('#<%=tabName%>_westPane');
            	
                if($(westPane).is(":visible")) {
                	$(westPane).html('');
                    $(westPane).hide();
                    $('#Toggler').next().css('width', '100%');
                    $('#Toggler').next().css('left', '0px');
                    $('#Toggler').css('left','0px');
                    $(divider).attr('title', 'Show Preview');                    
					if($('#<%=tabName%>_search').is(":visible")) {
						$(divider).css('background','url("images/showall.png")');
						$(divider).next().css('background','url("images/hideall.png")');
					} else {
						$(divider).css('background','url("images/hidesearch.png")');
						$(divider).next().css('background','url("images/hidewest.png")');
					}
                } else {
	                loadWest();
                    $(westPane).show();
                    $('#Toggler').next().css('left','250px');
                    $('#Toggler').next().css('width',$('body').width()-260+'px');
                    $(divider).attr('title', 'Hide Preview');
                    $('#Toggler').css('left','254px');
                    if($('#<%=tabName%>_search').is(":visible")) {
						$(divider).css('background','url("images/hidewest.png")');
						$(divider).next().css('background','url("images/hidesearch.png")');
					} else {
						$(divider).css('background','url("images/hideall.png")');
						$(divider).next().css('background','url("images/showall.png")');
					}                   
                }
                $('#<%=tabName%>_table').css('width','100%');
				dTable.columns.adjust().draw();
            };
            
            function toggleSearch(divider) {            	
            	var searchPane = $('#<%=tabName%>_search');
            	var tabContent = $('#<%=tabName%>_content');

            	
            	if($(searchPane).is(":visible")) {
            		$(searchPane).hide();
            		$(tabContent).css('height','100%');
            		$('#Toggler').css('top','1%');
            		$('#Toggler').next().css('top','0px');  
            		$('#Toggler').next().css('height','100%');          		
            		$(divider).attr('title','Show Search');

            		if($('#<%=tabName%>_westPane').is(":visible")) {
						$(divider).css('background','url("images/showall.png")');
						$(divider).prev().css('background','url("images/hideall.png")');
					} else {
						$(divider).css('background','url("images/hidewest.png")');
						$(divider).prev().css('background','url("images/hidesearch.png")');
					}
            	} else {
            		$(searchPane).show();
            		$(divider).attr('title','Hide Search');
            		$(tabContent).css('height','85%');
            		$('#Toggler').css('top','13.5%');
            		$('#Toggler').next().css('top','13%');
            		$('#Toggler').next().css('height','85%');

            		if($('#<%=tabName%>_westPane').is(":visible")) {
						$(divider).css('background','url("images/hidesearch.png")');
						$(divider).prev().css('background','url("images/hidewest.png")');
					} else {
						$(divider).css('background','url("images/hideall.png")');
						$(divider).prev().css('background','url("images/showall.png")');
					}
            	}               	         	            	
            };
            
            function loadWest() {                
            	var selected = dTable.$('tr.row_selected');
            	
            	if(selected.length>0) {
// 		        	var iPos = dTable.fnGetData($(dTable.find('.row_selected')).get(0));
					var iPos = dTable.row(this).data();
				    if( iPos == null ) {
						return;
				    }  
				    showWestPane(iPos);				        
		        }            
           	};
           	
           	
           	
          	function time(id){
              	var uid = id ;
                var i = $("#"+uid).val();
                var t3 = (i.substring(11));
                var t2 = (i.substring(0,5));
                var t1 = (i.substring(6,10));
                var time = t1+"/"+t2+" "+t3
                $("#"+uid).val(time);	
              	};
              	
              	
              	$(document).ready(function(){
              		//$(".ptime").click();
              		
              		//$(".ptime").each(function(){
              			//var id = $(this).attr("id");
              			//console.log(id);
              			//});
              	   $(".ptime").each(function(){
              		   var i = $(this).val();
              		  var t4 = (i.substring(11));
                      var t2 = (i.substring(0,2));
                      var t3 = (i.substring(3,5));
                      var t1 = (i.substring(6,10));
                      var time = t1+"年"+t3+"月"+t2+"日"+" "+t4;
              		   $(this).val(time);
              	   });
              		
              		
              	});
         	
          
            
        </script>
</head>
<body>
 

	<c:choose>
	<c:when test="${param.preview=='true'}">
		<div id="<%=tabName%>_westPane"
			style="width: 255px; visibility: visible; display: block; z-index: 0; float: left; height: 94%;"></div>	

		<div id="Toggler" style="position: absolute; top: 13.5%; left: 256px; z-index: 3;">

		<div id="westToggler" title="Hide Preview" class="ui-state-default"
			onmouseover="this.className='ui-state-hover'"
			onmouseout="this.className='ui-state-default'"
			style="width: 24px; height: 24px; cursor: pointer; float: left; z-index: 3; background: url('images/hidewest.png'); border: none;"
			onclick="this.className='ui-state-default';toggleDivider(this);"></div>

		<div id ="searchToggler" title="Hide Search" class="ui-state-default toggler"
			onmouseover="this.className='ui-state-hover'"
			onmouseout="this.className='ui-state-default'"
			style="width: 24px; height: 24px; cursor: pointer; float: left; z-index: 3; background: url('images/hidesearch.png'); border: none;"
			onclick="this.className='ui-state-default'; toggleSearch(this);"></div>
		</div>	

  
 
		<c:choose>
			<c:when test="${param.search=='true'}">
				<div style="float: left; height: 84%; position: absolute; top: 13%; left:257px; right: 0px; bottom: 0px; padding: 0px'">
			</c:when>
		
			<c:otherwise>
				<div style="float: left; height: 100%; position: absolute; top: 0px; left:257px; right: 0px; bottom: 0px; padding: 0px'">
			</c:otherwise>
		
		</c:choose>
		
	</c:when>
	
	<c:otherwise>
		<div style="float: left; width: 100%; padding: 0px'">
	</c:otherwise>
	</c:choose>

		<table class="display" id="<%=tabName%>_table" style="font-size: 12px;">
         
			<thead>
				<tr>
					<th></th>
					<th><fmt:message key='patientID' bundle="${lang}" />&nbsp(病人编号)</th>
					<th><fmt:message key='patientName' bundle="${lang}" />&nbsp(姓名)</th>
					<!--<th><fmt:message key='dateOfBirth' bundle="${lang}" /></th>
					<th><fmt:message key='accessionNumber' bundle="${lang}" /></th>-->
					<th><fmt:message key='studyDate' bundle="${lang}" />&nbsp(诊断日期)</th>
					<th><fmt:message key='studyDescription' bundle="${lang}" />&nbsp(说明)</th>
					<th>Modality&nbsp(类型)</th>
					<th><fmt:message key="instanceCount" bundle="${lang}" />&nbsp(图像个数)</th>					
					<th>Study Instance UID</th>
					<th>Refer Physician</th>
					<th>Series Count</th>
					<th>Gender</th>
				</tr>
			</thead>
			
			<tbody>
			
				<pat:Patient patientId="${param.patientId}"
					patientName="<%=patName%>" birthDate="${param.birthDate}"
					modality="${param.modality}" from="${param.from}" to="${param.to}"
					searchDays="${param.searchDays}"
					accessionNumber="${param.accessionNumber}"
					referPhysician="${param.referPhysician}"
					studyDescription="${param.studyDesc}" dcmURL="${param.dcmURL}"
					fromTime="${param.fromTime}" toTime="${param.toTime}">
					
					<tr>
						<td><img src="images/details_open.png" alt="" /> <img
							src="images/green.png" style="display: none;"
							id="${studyIUID}" alt="" /></td>
						<td>${patientId}</td>
						<td>${patientName}</td>
						<!--<td>${birthDate}</td>
						<td>${accessionNumber}</td>-->
						<td data-order="${dateOrder}"><input id="${dateOrder}" class="ptime" readonly value="${studyDate}" /></td>
						<td>${studyDescription}</td>
						<td>${modality}</td>
						<td>${totalInstances}</td>						
						<td>${studyIUID}</td>
						<td>${referPhysician}</td>
						<td>${totalSeries}</td>
						<td>${patientGender}</td>
					</tr>
				</pat:Patient>
			</tbody>
		</table>
		 
	</div>
</body>
</html>