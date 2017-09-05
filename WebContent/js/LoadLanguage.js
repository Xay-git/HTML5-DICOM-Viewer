
// getting selected language from cookies 
var lang = getCookie('language');
if (typeof lang == 'undefined' || lang.trim() == 'en_GB') {
    $.getScript('js/i18n/Bundle.js', function() {
        loadLabels();
    });
} else {
    var fileName = 'js/i18n/' + "Bundle_" + lang + ".js";
    $.getScript(fileName, function() {
        loadLabels();
    });
}


function loadLabels() {
    //index.html
	$(document).attr('title', languages['PageTitle']);	
    $('#productName').html(languages['PageTitle']);
    $('#lblPatientName').html(languages['PatientName']);
    $('#lblPatientID').html(languages['PatientId']);
    $('#lblDOB').html(languages['BirthDate']);
    $('#lblAccessionNumber').html(languages['AccessionNumber']);
    $('#lblStudyDate').html(languages['StudyDate']);
    $('#lblStudyDescription').html(languages['StudyDesc']);
    $('#lblModality').html(languages['Modality']);
    $('#lblInstanceCount').html(languages['InstanceCount']);

    //Tools.html
    $('#lblLayout').attr('title', languages['Layout']);
    $('#lblWindowing').attr('title', languages['Windowing']);
    $('#lblZoom').attr('title', languages['Zoom']);
    $('#lblMove').attr('title', languages['Move']);
    $('#lblScoutLine').attr('title', languages['ScoutLine']);
    $('#lblScrollImages').attr('title', languages['ScrollImage']);
    $('#lblSynchronize').attr('title', languages['Synchronize']);
    $('#lblVFlip').attr('title', languages['VFlip']);
    $('#lblHFlip').attr('title', languages['HFlip']);
    $('#lblLRotate').attr('title', languages['LRotate']);
    $('#lblRRotate').attr('title', languages['RRotate']);
    $('#lblReset').attr('title', languages['Reset']);
    $('#lblInvert').attr('title', languages['Invert']);
    $('#lblTextOverlay').attr('title', languages['TextOverlay']);
    $('#lblfullscreen').attr('title', languages['FullScreen']);
    $('#lblMetadata').attr('title', languages['MetaData']);
    $('#lblLines').attr('title', languages['Lines']);

    //config.html
    $('#lblServer').html(languages['Server']);
    $('#lblQueryParam').html(languages['QueryParam']);
    $('#lblPreferences').html(languages['Preferences']);

    //server.html
    $('#verifyBtn').html(languages['']);
    $('#addBtn').html(languages['']);
    $('#editBtn').html(languages['']);
    $('#deleteBtn').html(languages['']);
    $('#lblDescription').html(languages['Description']);
    $('#lblAETitle').html(languages['AETitle']);
    $('#lblHostName').html(languages['HostName']);
    $('#lblDicomPort').html(languages['Port']);
    $('#lblRetrieve').html(languages['']);
    $('#lblAET').html(languages['AETitle']);
    $('#lblport').html(languages['Port']);
    $('#updateListener').html(languages['Update']);
    $('#lblIoviyamCxt').html(languages['IOviyamCxt']);
    $('#updIoviyamCxt').html(languages['Update']);

    //query param.html
    $('#qpAddBtn').html(languages['Add']);
    $('#qpDeleteBtn').html(languages['Delete']);
    $('#lblFilterName').html(languages['FilterName']);
    $('#lblStudyDateFilter').html(languages['StudyDateFilter']);
    $('#lblStudytimeFilter').html(languages['StudytimeFilter']);
    $('#lblModalityFilter').html(languages['ModalityFilter']);
    $('#lblAutoRefresh').html(languages['AutoRefresh']);

    //preference.html
    $('#saveSlider').html(languages['Update']);
    $('#saveTimeout').html(languages['Update']);
    $('#saveTheme').html(languages['Update']);
    $('#saveLanguage').html(languages['Update']);

    //New Search.html
    $("label[for=patId]").text(languages['PatientId']);
    $("label[for=patName]").text(languages['PatientName']);
    $("label[for=accessionNo]").text(languages['AccessionNumber']);
    $("label[for=birthDate]").text(languages['BirthDate']);
    $("label[for=studyDesc]").text(languages['StudyDesc']);
    $("label[for=referPhysician]").text(languages['ReferPhysician']);
    $(".bdate").prev().text(languages['BirthDate']);
    $(".fsdate").prev().text(languages['FromStudyDate']);
    $(".tsdate").prev().text(languages['ToStudyDate']);
    $(".searchBtn").text(languages['Search']);
    $(".clearBtn").text(languages['Reset']);
}

function getCookie(c_name)
{
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
        {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}



function hash(_key,_value)
{
this.key = _key; // 拼音*/
this.value = _value; // ascii码*/
}
//javascript 的自定义对象，用于存放汉字拼音数据字典*/
function dictionary()
{
this.items = [];
this.add = function(_key,_value)
{
this.items[this.items.length] = new hash(_key,_value);
}
}
//汉字拼音的数据字典-共396个-通过组合声母和韵母*/
var d = new dictionary();
d.add("a",-20319);
d.add("ai",-20317);
d.add("an",-20304);
d.add("ang",-20295);
d.add("ao",-20292);
d.add("ba",-20283);
d.add("bai",-20265);
d.add("ban",-20257);
d.add("bang",-20242);
d.add("bao",-20230);
d.add("bei",-20051);
d.add("ben",-20036);
d.add("beng",-20032);
d.add("bi",-20026);
d.add("bian",-20002);
d.add("biao",-19990);
d.add("bie",-19986);
d.add("bin",-19982);
d.add("bing",-19976);
d.add("bo",-19805);
d.add("bu",-19784);
d.add("ca",-19775);
d.add("cai",-19774);
d.add("can",-19763);
d.add("cang",-19756);
d.add("cao",-19751);
d.add("ce",-19746);
d.add("ceng",-19741);
d.add("cha",-19739);
d.add("chai",-19728);
d.add("chan",-19725);
d.add("chang",-19715);
d.add("chao",-19540);
d.add("che",-19531);
d.add("chen",-19525);
d.add("cheng",-19515);
d.add("chi",-19500);
d.add("chong",-19484);
d.add("chou",-19479);
d.add("chu",-19467);
d.add("chuai",-19289);
d.add("chuan",-19288);
d.add("chuang",-19281);
d.add("chui",-19275);
d.add("chun",-19270);
d.add("chuo",-19263);
d.add("ci",-19261);
d.add("cong",-19249);
d.add("cou",-19243);
d.add("cu",-19242);
d.add("cuan",-19238);
d.add("cui",-19235);
d.add("cun",-19227);
d.add("cuo",-19224);
d.add("da",-19218);
d.add("dai",-19212);
d.add("dan",-19038);
d.add("dang",-19023);
d.add("dao",-19018);
d.add("de",-19006);
d.add("deng",-19003);
d.add("di",-18996);
d.add("dian",-18977);
d.add("diao",-18961);
d.add("die",-18952);
d.add("ding",-18783);
d.add("diu",-18774);
d.add("dong",-18773);
d.add("dou",-18763);
d.add("du",-18756);
d.add("duan",-18741);
d.add("dui",-18735);
d.add("dun",-18731);
d.add("duo",-18722);
d.add("e",-18710);
d.add("en",-18697);
d.add("er",-18696);
d.add("fa",-18526);
d.add("fan",-18518);
d.add("fang",-18501);
d.add("fei",-18490);
d.add("fen",-18478);
d.add("feng",-18463);
d.add("fo",-18448);
d.add("fou",-18447);
d.add("fu",-18446);
d.add("ga",-18239);
d.add("gai",-18237);
d.add("gan",-18231);
d.add("gang",-18220);
d.add("gao",-18211);
d.add("ge",-18201);
d.add("gei",-18184);
d.add("gen",-18183);
d.add("geng",-18181);
d.add("gong",-18012);
d.add("gou",-17997);
d.add("gu",-17988);
d.add("gua",-17970);
d.add("guai",-17964);
d.add("guan",-17961);
d.add("guang",-17950);
d.add("gui",-17947);
d.add("gun",-17931);
d.add("guo",-17928);
d.add("ha",-17922);
d.add("hai",-17759);
d.add("han",-17752);
d.add("hang",-17733);
d.add("hao",-17730);
d.add("he",-17721);
d.add("hei",-17703);
d.add("hen",-17701);
d.add("heng",-17697);
d.add("hong",-17692);
d.add("hou",-17683);
d.add("hu",-17676);
d.add("hua",-17496);
d.add("huai",-17487);
d.add("huan",-17482);
d.add("huang",-17468);
d.add("hui",-17454);
d.add("hun",-17433);
d.add("huo",-17427);
d.add("ji",-17417);
d.add("jia",-17202);
d.add("jian",-17185);
d.add("jiang",-16983);
d.add("jiao",-16970);
d.add("jie",-16942);
d.add("jin",-16915);
d.add("jing",-16733);
d.add("jiong",-16708);
d.add("jiu",-16706);
d.add("ju",-16689);
d.add("juan",-16664);
d.add("jue",-16657);
d.add("jun",-16647);
d.add("ka",-16474);
d.add("kai",-16470);
d.add("kan",-16465);
d.add("kang",-16459);
d.add("kao",-16452);
d.add("ke",-16448);
d.add("ken",-16433);
d.add("keng",-16429);
d.add("kong",-16427);
d.add("kou",-16423);
d.add("ku",-16419);
d.add("kua",-16412);
d.add("kuai",-16407);
d.add("kuan",-16403);
d.add("kuang",-16401);
d.add("kui",-16393);
d.add("kun",-16220);
d.add("kuo",-16216);
d.add("la",-16212);
d.add("lai",-16205);
d.add("lan",-16202);
d.add("lang",-16187);
d.add("lao",-16180);
d.add("le",-16171);
d.add("lei",-16169);
d.add("leng",-16158);
d.add("li",-16155);
d.add("lia",-15959);
d.add("lian",-15958);
d.add("liang",-15944);
d.add("liao",-15933);
d.add("lie",-15920);
d.add("lin",-15915);
d.add("ling",-15903);
d.add("liu",-15889);
d.add("long",-15878);
d.add("lou",-15707);
d.add("lu",-15701);
d.add("lv",-15681);
d.add("luan",-15667);
d.add("lue",-15661);
d.add("lun",-15659);
d.add("luo",-15652);
d.add("ma",-15640);
d.add("mai",-15631);
d.add("man",-15625);
d.add("mang",-15454);
d.add("mao",-15448);
d.add("me",-15436);
d.add("mei",-15435);
d.add("men",-15419);
d.add("meng",-15416);
d.add("mi",-15408);
d.add("mian",-15394);
d.add("miao",-15385);
d.add("mie",-15377);
d.add("min",-15375);
d.add("ming",-15369);
d.add("miu",-15363);
d.add("mo",-15362);
d.add("mou",-15183);
d.add("mu",-15180);
d.add("na",-15165);
d.add("nai",-15158);
d.add("nan",-15153);
d.add("nang",-15150);
d.add("nao",-15149);
d.add("ne",-15144);
d.add("nei",-15143);
d.add("nen",-15141);
d.add("neng",-15140);
d.add("ni",-15139);
d.add("nian",-15128);
d.add("niang",-15121);
d.add("niao",-15119);
d.add("nie",-15117);
d.add("nin",-15110);
d.add("ning",-15109);
d.add("niu",-14941);
d.add("nong",-14937);
d.add("nu",-14933);
d.add("nv",-14930);
d.add("nuan",-14929);
d.add("nue",-14928);
d.add("nuo",-14926);
d.add("o",-14922);
d.add("ou",-14921);
d.add("pa",-14914);
d.add("pai",-14908);
d.add("pan",-14902);
d.add("pang",-14894);
d.add("pao",-14889);
d.add("pei",-14882);
d.add("pen",-14873);
d.add("peng",-14871);
d.add("pi",-14857);
d.add("pian",-14678);
d.add("piao",-14674);
d.add("pie",-14670);
d.add("pin",-14668);
d.add("ping",-14663);
d.add("po",-14654);
d.add("pu",-14645);
d.add("qi",-14630);
d.add("qia",-14594);
d.add("qian",-14429);
d.add("qiang",-14407);
d.add("qiao",-14399);
d.add("qie",-14384);
d.add("qin",-14379);
d.add("qing",-14368);
d.add("qiong",-14355);
d.add("qiu",-14353);
d.add("qu",-14345);
d.add("quan",-14170);
d.add("que",-14159);
d.add("qun",-14151);
d.add("ran",-14149);
d.add("rang",-14145);
d.add("rao",-14140);
d.add("re",-14137);
d.add("ren",-14135);
d.add("reng",-14125);
d.add("ri",-14123);
d.add("rong",-14122);
d.add("rou",-14112);
d.add("ru",-14109);
d.add("ruan",-14099);
d.add("rui",-14097);
d.add("run",-14094);
d.add("ruo",-14092);
d.add("sa",-14090);
d.add("sai",-14087);
d.add("san",-14083);
d.add("sang",-13917);
d.add("sao",-13914);
d.add("se",-13910);
d.add("sen",-13907);
d.add("seng",-13906);
d.add("sha",-13905);
d.add("shai",-13896);
d.add("shan",-13894);
d.add("shang",-13878);
d.add("shao",-13870);
d.add("she",-13859);
d.add("shen",-13847);
d.add("sheng",-13831);
d.add("shi",-13658);
d.add("shou",-13611);
d.add("shu",-13601);
d.add("shua",-13406);
d.add("shuai",-13404);
d.add("shuan",-13400);
d.add("shuang",-13398);
d.add("shui",-13395);
d.add("shun",-13391);
d.add("shuo",-13387);
d.add("si",-13383);
d.add("song",-13367);
d.add("sou",-13359);
d.add("su",-13356);
d.add("suan",-13343);
d.add("sui",-13340);
d.add("sun",-13329);
d.add("suo",-13326);
d.add("ta",-13318);
d.add("tai",-13147);
d.add("tan",-13138);
d.add("tang",-13120);
d.add("tao",-13107);
d.add("te",-13096);
d.add("teng",-13095);
d.add("ti",-13091);
d.add("tian",-13076);
d.add("tiao",-13068);
d.add("tie",-13063);
d.add("ting",-13060);
d.add("tong",-12888);
d.add("tou",-12875);
d.add("tu",-12871);
d.add("tuan",-12860);
d.add("tui",-12858);
d.add("tun",-12852);
d.add("tuo",-12849);
d.add("wa",-12838);
d.add("wai",-12831);
d.add("wan",-12829);
d.add("wang",-12812);
d.add("wei",-12802);
d.add("wen",-12607);
d.add("weng",-12597);
d.add("wo",-12594);
d.add("wu",-12585);
d.add("xi",-12556);
d.add("xia",-12359);
d.add("xian",-12346);
d.add("xiang",-12320);
d.add("xiao",-12300);
d.add("xie",-12120);
d.add("xin",-12099);
d.add("xing",-12089);
d.add("xiong",-12074);
d.add("xiu",-12067);
d.add("xu",-12058);
d.add("xuan",-12039);
d.add("xue",-11867);
d.add("xun",-11861);
d.add("ya",-11847);
d.add("yan",-11831);
d.add("yang",-11798);
d.add("yao",-11781);
d.add("ye",-11604);
d.add("yi",-11589);
d.add("yin",-11536);
d.add("ying",-11358);
d.add("yo",-11340);
d.add("yong",-11339);
d.add("you",-11324);
d.add("yu",-11303);
d.add("yuan",-11097);
d.add("yue",-11077);
d.add("yun",-11067);
d.add("za",-11055);
d.add("zai",-11052);
d.add("zan",-11045);
d.add("zang",-11041);
d.add("zao",-11038);
d.add("ze",-11024);
d.add("zei",-11020);
d.add("zen",-11019);
d.add("zeng",-11018);
d.add("zha",-11014);
d.add("zhai",-10838);
d.add("zhan",-10832);
d.add("zhang",-10815);
d.add("zhao",-10800);
d.add("zhe",-10790);
d.add("zhen",-10780);
d.add("zheng",-10764);
d.add("zhi",-10587);
d.add("zhong",-10544);
d.add("zhou",-10533);
d.add("zhu",-10519);
d.add("zhua",-10331);
d.add("zhuai",-10329);
d.add("zhuan",-10328);
d.add("zhuang",-10322);
d.add("zhui",-10315);
d.add("zhun",-10309);
d.add("zhuo",-10307);
d.add("zi",-10296);
d.add("zong",-10281);
d.add("zou",-10274);
d.add("zu",-10270);
d.add("zuan",-10262);
d.add("zui",-10260);
d.add("zun",-10256);
d.add("zuo",-10254);
//通过查找字典得到与ascii码对应的拼音*/
function getKey(code)
{
if ((code>0)&&(code<160))
 return String.fromCharCode(code);// String.fromCharCode 就是把ascii码转成字符*/
else if ((code<-20319)||(code>-10247))
 return "";
else
for (var i=d.items.length-1;i>=0;i--)
{
 if (d.items[i].value<=code)
 break;
}
return d.items[i].key;
}
//转为小写*/
function convertToPinyinLower(str)
{
var result = "" ;
for (var i=1;i<=str.length;i++)
{
//执行指定语言的脚本代码：
//Mid(str,i,1)-指从str的第i个字符开始取长度为1的字符串
//asc(char)-指获取字符的acsii码
 execScript("ascCode=asc(mid(\"" + str + "\"," + i + ",1))", "vbscript");
 result = result  + getKey(ascCode);
}
return result.toLowerCase();
}
//转为大写*/
function convertToPinyinUpper(str)
{
var result = "" ;
for (var i=1;i<=str.length;i++)
{
//执行指定语言的脚本代码：
//Mid(str,i,1)-指从str的第i个字符开始取长度为1的字符串
//asc(char)-指获取字符的acsii码
 execScript("ascCode=asc(mid(\"" + str + "\"," + i + ",1))", "vbscript");
 result = result  + getKey(ascCode);
}
return result.toUpperCase();
}
//判断中英文
function isChinese(str){
 var entryVal=str;
 var entryLen=entryVal.length;
 var cnChar=entryVal.match(/[^\x00-\x80]/g);
 if(cnChar!=null&&cnChar.length>0) return true;
 else return false;
}















window.calender = (function(win,doc){
	function C(str,b){
		this.dom =  (typeof str=='object') ? str : doc.querySelector(str);  
		this.s = {
			date : [ new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()],
			button : false,
			format : 'yyyy年MM月dd日',
			left : 0,
			top: 0,
			addClass : '',
			onload : function(){}
		}
		this.inline = b ? true : false
	};
	C.prototype = {
		init : function(){
			var t = this;
			if( typeof arguments[0] == 'function'){
	    		t.cb = arguments[0];
	    	}else{
	    		t.newS = arguments[0];
	    		t.cb = arguments[1] || function(){}
	    	};
	    	t.yoff = false;
	    	t.moff = false;
			t.extend(t.s,t.newS);
			t.nt = new Date();
			t.nt.setFullYear(t.s.date[0]);
		  	t.nt.setMonth(t.s.date[1]-1);
		  	var len = this.getDateLength(t.nt.getFullYear(),t.nt.getMonth()  )
		  	t.nt.setDate(t.s.date[2]>len ? len : t.s.date[2]);
		  	t.day = t.nt.getDate();
		  	if(t.inline){
		  		t.create();
				t.bind();
				t.s.onload.call(t.dom)
		  	}else{
				t.dom.onclick = function(ev){
					var e = ev || event;
					t.create();
					t.bind();
					t.s.onload.call(this)
					e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true)
				};	
			}
		},
		hide : function(){
			var t = this;
			t.cb.call(t.dom,t.format( t.nt.getFullYear()+'/'+ (t.nt.getMonth()+1)+'/'+ t.day+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds(),t.s.format));
			if( g('.calender-wrap')) doc.body.removeChild( g('.calender-wrap') ),doc.body.removeChild( g('#calender-mask') );
		},
		bind : function(){
			var t = this;
			var Content = g('.calender-content');
			t.createDay();
			var Prev = g('#calender-prev'),
				Next = g('#calender-next'),
				Year = g('#calender-year'),
				Mon =  g('#calender-mon');
			if(t.s.button){
				var today = g('.calender-today');
				var enter = g('.calender-ent');
				today.onclick = function(){
					t.nt.setFullYear(new Date().getFullYear());
				  	t.nt.setMonth(new Date().getMonth());
				  	t.nt.setDate( new Date().getDate());
				  	t.s.date[2] = t.day = new Date().getDate()
					t.createYear()
					t.createDay()
					t.createMon()
				};
				enter.onclick = function(){
					t.hide();
				}
			}
			Content.onclick = function(ev){
				var ev = ev || event;  
		    	var _target = ev.target || ev.srcElement; 
		    	if(!t.has(_target,'calender-cell-dark') ){
		    		var chl = this.children;
		    		for(var i = 0;i<chl.length;i++){
		    			t.del(chl[i],'active');
		    		};
		    		t.add(_target,'active');
		    		t.nt.setDate(_target.getAttribute('data-n'));
		    		t.s.date[2] = t.day = _target.getAttribute('data-n')
		    		if(!t.s.button){
		    			t.hide();
		    		}
		    	}
			}
			Prev.onclick = Next.onclick = function(){
				var y = t.nt.getFullYear(),m = t.nt.getMonth();
				if(t.moff) return
				if(t.yoff){
					t.nt.setFullYear( this.id=="calender-prev" ? y -= 9 :  y += 9)
					t.createYear()
				}else{
					this.id=="calender-prev" ? m-- : m++;
					t.nt.setDate(1);
					t.nt.setMonth( m );
					t.createDay()
				}
			}
			Year.onclick = function(){
				t.createYear();
				t.yoff = true;
				t.moff = false;
				t.del(g('.calender-wrap'),'month');
				t.add(g('.calender-wrap'),'year');
			};
			Mon.onclick = function(){
				t.createMon();
				t.moff = true;
				t.yoff = false;
				t.del(g('.calender-wrap'),'year');
				t.add(g('.calender-wrap'),'month');
			};
		},
		getDateLength : function(year,month){
			//获取某一月有多少天, month为实际月份，一月即为1
			return new Date(year,month,0).getDate();
		},
		getFirstDay : function(year,month){
			//获取某一月第一天是周几,month为实际月份，一月即为1,返回0即为周日
			return new Date(year,month-1,0).getDay();
		},
		createMon : function(){
			var t= this,html='';
			var m = t.nt.getMonth()+1;
			m = m == 0 ? 12 : m;
			for(var i = 1;i<=12;i++){
				html+='<div class="calender-mon-cell '+( m == i ? 'active' : '') +' ">'+ (i) +'</div>';
			};
			g('.calender-list3').innerHTML = html;
			var cells = doc.querySelectorAll('.calender-mon-cell');
			for(var i2 = 0;i2<cells.length;i2++){
			 	cells[i2].onclick = function(){
			 		t.moff = false
			 		t.del(g('.calender-wrap'),'month');
			 		t.nt.setDate(1)
					t.nt.setMonth(+this.innerHTML-1);
					t.createDay();
			 	}
			}
		},
		createYear : function(){
			var t= this,html='',y = (t.nt.getFullYear());
			var Year = g('#calender-year');
			for(var i = 0;i<9;i++){
				html+='<div class="calender-year-cell '+( (y-(4-i)) == y ? 'active' :'') +' ">'+ (y-(4-i)) +'</div>';
			}
			Year.innerHTML = y
			g('.calender-list2').innerHTML = html;
			var cells = doc.querySelectorAll('.calender-year-cell');
			for(var i2 = 0;i2<cells.length;i2++){
			 	cells[i2].onclick = function(){
			 		t.yoff = false;
			 		t.del(g('.calender-wrap'),'year');
					t.nt.setFullYear(+this.innerHTML);
					t.createDay();
			 	}
			}
		},
		createDay : function(n){
			var t = this, 
				y = t.nt.getFullYear(),
				m = (t.nt.getMonth())+1;
			g('#calender-year').innerHTML = m===0 ? y-1 : y;
			g('#calender-mon').innerHTML =  m === 0 ? 12 : two(m);
			// if(t.nt.getMonth()+1 == t.s.date[1] && t.nt.getFullYear()==t.s.date[0]   ){
			//  	t.nt.setDate(t.s.date[2]);
			// };
			var firstDay = this.getFirstDay(y,m),
				length = this.getDateLength(y,m),
				lastMonthLength = this.getDateLength(y,m-1),
				i,html = '';
				t.day = t.s.date[2] > length ? length : t.s.date[2];
			//循环输出月前空格
			if(firstDay ===0) firstDay = 7;
			for(i=1;i<firstDay+1;i++){
				html += '<div class="calender-cell calender-cell-dark">' + (lastMonthLength - firstDay + i) + '</div>';
			}
			//循环输出当前月所有天
			for(i=1;i<length+1;i++){
				html += '<div  data-n='+i+' class="calender-cell '+ (i == t.day ? 'active' :'') +'">' + i + '</div>';
			}
			//if(8-(length+firstDay)%7 !=8){
			for(i=1;i<= (41-(length+(firstDay==0 ? 7 : firstDay)-1));i++){
				html+= '<div class="calender-cell calender-cell-dark">' + i + '</div>';
			};
			doc.querySelector('.calender-content').innerHTML = html
		},
		create : function(){
			var t= this;
			if( g('.calender-wrap')) doc.body.removeChild( g('.calender-wrap') )
			var private_Day_title=['一','二','三','四','五','六','日'];
			//内容
			var html = '<div class="calender-wrap '+ t.s.addClass +'">';
			html +='<div id="calender-header" class="calender-header none-btn "><a id="calender-prev" href="javascript:;">&lt;</a><a id="calender-next" href="javascript:;">&gt;</a>  <span id="calender-year">2016</span>年<span id="calender-mon">10</span>月</div>'
			//星期
			html += '<div class="calender-list"><div class="calender-caption">';
			for(i=0;i<7;i++){
				html += '<div class="calender-cell">' + private_Day_title[i] + '</div>';
			};
			html += '</div><div class="calender-content"></div>';
			if(this.s.button){
				html+='<div class="calender-button"><a href="javascript:;" class="calender-ent">确定</a><a href="javascript:;" class="calender-today">今天</a></div>';
			};
			html += '</div><div class="calender-list calender-list2"></div><div class="calender-list calender-list3"></div>'
			doc.body.insertAdjacentHTML("beforeend", html);
			doc.body.insertAdjacentHTML("beforeend", '<div id="calender-mask"></div>');
			var wrap = g('.calender-wrap');
			function setPosi(){
				var _top = doc.documentElement.scrollTop || doc.body.scrollTop;
				wrap.style.left = t.dom.getBoundingClientRect().left +t.s.left +'px';;
				wrap.style.top = t.dom.getBoundingClientRect().top + _top + t.dom.offsetHeight+t.s.top + 15 +'px';
			};
			setPosi();
			addEvent(window,'resize',function(){setPosi()})
			wrap.onclick = function(ev){
				var e = ev || event;
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true)
			}
			g('#calender-mask').onclick = function(ev){
				t.hide()
			}
		},
	    format : function(da,format){
	     	var _newDate = new Date(da);
	 		var WeekArr=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']; 
		    var o = {  
		        'M+' : _newDate.getMonth()+1, //month  
		        'd+' : _newDate.getDate(), //day  
		        'h+' : _newDate.getHours(), //hour  
		        'm+' : _newDate.getMinutes(), //minute  
		        's+' : _newDate.getSeconds(), //second  
		        'q+' : Math.floor((_newDate.getMonth()+3)/3), //quarter  
		        'S': _newDate.getMilliseconds(), //millisecond  
		        'E': WeekArr[_newDate.getDay()],  
		        'e+' : _newDate.getDay()  
		    };   
		    if (/(y+)/.test(format)){
		    	format = format.replace(RegExp.$1, (_newDate.getFullYear()+"").substr(4 - RegExp.$1.length));
		    };
		    for(var k in o) {  
		        if(new RegExp('('+ k +')').test(format)) {  
		            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ('00'+ o[k]).substr((''+ o[k]).length));  
		        };  
		    };  
		    return format; 
	    },
	    extend : function(n,n1){
	        for(var i in n1){n[i] = n1[i]};
	    },
		has : function(o,n){
		    return new RegExp('\\b'+n+'\\b').test(o.className);  
	    },
		add : function(o,n){
		    if(!this.has(o, n)) o.className+=' '+n;  
	    },
		del : function(o,n){
		    if(this.has(o, n)){  
		        o.className = o.className.replace(new RegExp('(?:^|\\s)'+n+'(?=\\s|$)'), '').replace(/^\s*|\s*$/g, '');  
		    }; 
	    }
	};
	function g(str){return doc.querySelector(str)};
	function addEvent(obj,name,fn){obj.addEventListener? obj.addEventListener(name, fn, false):obj.attachEvent('on'+name,fn);};
    function two(num){return num<10 ? ('0'+num) : (''+num)};
	function c(o,b){return new C(o,b)};return c;
})(window,document);

