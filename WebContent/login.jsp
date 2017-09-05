<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>

        <script type="text/javascript" src="js/lib/jquery-latest.js"></script>
        <script type="text/javascript" src="js/lib/jquery-ui-latest.js"></script>
        <script type="text/javascript" src="js/lib/themeswitchertool.js"></script>
        <script type="text/javascript" src="js/lib/jquery.cookies.min.js"></script>
        
        <script type="text/javascript">
	        //if(navigator.platform.indexOf('iPad') != -1) {
    	    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    	    	$.get("do/IOviyamContext", function(data) {
	        		var loc = window.location.toString();
    	        	loc = loc.substring(0, loc.indexOf('/', loc.lastIndexOf(':')));
        	    	window.location = loc + data;
            		//window.stop();
	   	        });
        	}   	   
    	    
        	var lang = $.cookies.get( 'language' );
        	var bundleName = '';
			if (lang == null || lang.trim() == 'en_GB') {
    			bundleName = 'js/i18n/Bundle.js'; 
			} else {
    			bundleName = 'js/i18n/' + "Bundle_" + lang + ".js";
			}			
			document.write('<script type="text/javascript" src="' + bundleName + '"><\/script>');
        </script>

		<link rel="icon" type="image/png" href="images/favicon.png"/>
        <link rel="stylesheet" href="css/login.css" type="text/css" />
        <link rel="stylesheet" type="text/css" href="css/jquery.ui.all.css" />


        <script type="text/javascript">
        
        
        
            $(document).ready(function() {
                var theme = $.cookies.get( 'theme' );
                var admin = "admin";
                //$("#uname").val(admin);
                //$("#upass").val(admin);
               // document.getElementById("loginButton").click();
            	if(theme == null) {
                    theme = 'Dark Hive';
            	}
            	
            	var browserVersion= navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				var browserName = browserVersion[1].toUpperCase();
            	/*if( !(browserName != 'CHROME' && browserName != 'SAFARI') ) {
            		$('footer').remove();
            	}*/
            	if(!(browserName.indexOf('MSIE')>0)) {
            		$('footer').remove();
            	}            		
            	
				$('#switcher').themeswitcher({
		                    loadTheme: theme,
		                    cookieName:'',
		                    width: 160
                });
		
				$('#loginButton').button();
					$(document).attr('title', languages['PageTitle']);
					$("#loginButton").val("登录");
            	});  

            function setCookie(name, value, expires, path, domain, secure) {
		  		var curCookie = name + "=" + escape(value) +
			  	((expires) ? "; expires=" + expires.toUTCString() : "") +
			  	((path) ? "; path=" + path : "") +
			  	((domain) ? "; domain=" + domain : "") +
			  	((secure) ? "; secure" : "");
		  		document.cookie = curCookie;
			}
            
            function validateForm(form) {
            	if(form.remember_me.checked) {
        	  		var credentials = {
        	  			'username' : form.j_username.value,
        	  			'password' : form.j_password.value,
        	  			'remember': form.remember_me.checked
        	  		};
        	  		setCookie("credentials",JSON.stringify(credentials));
        	  } else {
        		  	setCookie("credentials","");
        	  }
        	  return true;	
            }
            
            function loadUser() {
        		var credentials = $.cookies.get("credentials");
        		if(credentials) {
        			document.login.j_username.value = credentials['username'];
        			document.login.j_password.value = credentials['password'];
        			document.login.remember_me.checked = credentials['remember'];
        			document.login.login_button.focus();
        		} else {
        			document.login.j_username.focus();
        		}
        	};
           
          
            
        </script>
        
    </head>
    <body class="ui-widget-content" style="border:none;" onload="loadUser();">
    <section>
        <form name="login" id="login" action="j_security_check" method="POST" onsubmit="return validateForm(this);">
            <fieldset>
                <legend><font></font></legend>
                <h1>浚县中医院</h1> <h4>影像查看系统</h4>
                
                <label><font>用户名 </font><span class="mandatory"><font>*</font></span><font> :</font></label>
                <input type="text" id="uname" name="j_username" class="textInput" required>

                <label><font>密码</script> </font><span class="mandatory"><font>*</font></span><font> :</font></label>
                <input type="password" id="upass" name="j_password" class="textInput" required>

				<!--  <table> <tr> <td> <input type="checkbox" name="remember_me" value="Remember Me"/> </td> 
                <td style="font-size: 10pt;"> 哈哈 </td> </tr> </table> </td>		-->	
                
                <input type="submit" name="submit" id="loginButton" value="" class="button disabled">
            </fieldset>
        </form>
    </section>
<!--     <footer align="center"><script>document.write(languages['Footer'])</script></footer> -->
<!-- 	<div style="text-align: center; margin-top: 10px; font-size: 10px;">This version of oviyam, being a free open-source software is not intended for diagnosis</div> -->
<div style="text-align: center; margin-top: 3%; font-size: 60%;"><script>document.write(languages['disclaimer'])</script> <br> <br> <script>document.write(languages['limitation'])</script></div>

<div style="width: 100%; position: absolute; bottom: 0px;">
<table style="width:100%">
<tr>
<td><a href="http://dcm4che.org" target="_blank"><img src="images/dcm4che.png" alt="dcm4che.org" style="width: 132px;" /></a></td> 
<td style="text-align: center"><img src="images/html5.png" alt="" style="width: 132px" /> </td>
<td style="text-align: right"><a href="http://oviyam.raster.in" target="_blank"><img src="images/raster.png" alt="Raster Images" style="width: 132px" /></a></td>
</tr>
</table>
</div>

</body>
</html>