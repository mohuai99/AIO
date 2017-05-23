(function(){

var string = nimei.string;
extend( string, {
	/**
	 * 查找字符串的字节长度<br/>
	 * 中文算2 英文算1<br/>
	 * @param {string} str 字符串
	 * @return {int}
	 */
	getByteLength : function(str){
		var bytes=0,i=0;
		for (; i<str.length; ++i,++bytes) {
			if ( str.charCodeAt(i) > 255 ) {
					++bytes;
			}
		}
		return bytes;
	},
	/**
	 * 查找有多少个双字节字符
	 * @param {string} str 字符串
	 * @return {int}
	 */
	getDwordNum : function(str){
		return string.getByteLength(str) - str.length;
	},
	/**
	 * 查找有多少个汉字字符
	 * @param {string} str 字符串
	 * @return {int}
	 */
	getChineseNum : function(str){
		return str.length - str.replace(/[\u4e00-\u9fa5]/g,"").length;
	},
	/**
	 * 截取中文字符串<br/>
	 * 取iMaxBytes 或最后一个中文字符出现的地方替换字符<br/>
	 * @param {string} str 字符串
	 * @param {int} iMaxBytes 字符串
	 * @param {string} sSuffix 替补字符串
	 * @return {string}
	 */
	cutChinese : function(str, iMaxBytes, sSuffix){
		if(isNaN(iMaxBytes)) return str;
		if(string.getByteLength(str)<=iMaxBytes) return str;
		var i=0, bytes=0;
		for (; i<str.length && bytes<iMaxBytes; ++i,++bytes) {
			if ( str.charCodeAt(i) > 255 ) {
					++bytes;
			}
		}
		sSuffix = sSuffix || "";
		return (bytes-iMaxBytes == 1 ? str.substr(0,i-1) : str.substr(0,i) ) + sSuffix;
	},
	/**
	 * 去掉字符串左边的非空字符
	 * @param {string} str 字符串
	 * @return {string}
	 */
	trimLeft : function(str){
		return str.replace(/^\s+/,"");
	},
	/**
	 * 去掉字符串右边的非空字符
	 * @param {string} str 字符串
	 * @return {string}
	 */
	trimRight : function(str){
		return str.replace(/\s+$/,"");
	},
	/**
	 * 去掉字符串左右两边的非空字符
	 * @param {string} str 字符串
	 * @return {string}
	 */
	trim : function(str){
		return nimei.trimRight(nimei.trimLeft(str));
	},
	/**
	 * 成对字符串替换
	 * @param {string} str 字符串
	 * @param {array} str 字符串<br/>
	      array包含两个 [0] 查找内容，[1] 替换内容<br/>
		  array可以出现多次<br/>
	 * @return {string}
	 */
	replacePairs : function(){
		var str = arguments[0];
		for (var i=1; i<arguments.length; ++i) {
			var re = new RegExp(arguments[i][0], "g"); 
			str = str.replace(re, arguments[i][1]);
		}
		return str;
	},
	/**
	 * 字符串替换为HTML编码形式
	 * @param {string} str 字符串
	 * @return {string}
	 */
	toHtml : function(str){
		var CONVERT_ARRAY =
		[
			["&", "&#38;"],
			[" ", "&#32;"],
			["'", "&#39;"], 
			["\"", "&#34;"],
			["/", "&#47;"],
			["<", "&#60;"],
			[">", "&#62;"],
			["\\\\", "&#92;"],
			["\n", "<br />"],
			["\r", ""]
		];
		return nimei.replacePairs.apply(this, [str].concat(CONVERT_ARRAY));
	},
	/**
	 * 校验邮箱地址
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isMail : function(str){
		return /^(?:[\w-]+\.?)*[\w-]+@(?:[\w-]+\.)+[\w]{2,4}$/.test(str);    
	},
	/**
	 * 校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isTel : function(str){
		return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(str);
	},
	/**
	 * 校验手机号码：必须以数字开头
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isMobile : function(str){
		return /^1[358]\d{9}$/.test(str);
	},
	/**
	 * 校验邮政编码
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isZipCode : function(str){
		return /^(\d){6}$/.test(str);
	},
	/**
	 * 是否身份证号码
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isIDCard : function(str){
		var C15ToC18 = function(c15) {
			var cId=c15.substring(0,6)+"19"+c15.substring(6,15);
			var strJiaoYan  =[  "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
			var intQuan =[7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			var intTemp=0;
			for(i = 0; i < cId.length ; i++)
			intTemp +=  cId.substring(i, i + 1)  * intQuan[i];  
			intTemp %= 11;
			cId+=strJiaoYan[intTemp];
			return cId;
		}
		var Is18IDCard = function(IDNum) {
			var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		
			var iSum=0, info="", sID=IDNum;
			if(!/^\d{17}(\d|x)$/i.test(sID)) {
				return false;
			}
			sID=sID.replace(/x$/i,"a");
		
			if(aCity[parseInt(sID.substr(0,2))]==null) {
				return false;
			}
			
			var sBirthday=sID.substr(6,4)+"-"+Number(sID.substr(10,2))+"-"+Number(sID.substr(12,2));
			var d=new Date(sBirthday.replace(/-/g,"/"))
			
			if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
			
			for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sID.charAt(17 - i),11)
			
			if(iSum%11!=1)return false;
			return true;
		}
		
		return str.length==15 ? Is18IDCard(C15ToC18(str)) : Is18IDCard(str);
	},	
	/**
	 * 是否全部是中文
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isChinese : function(str){
		return nimei.getChineseNum(str)==str.length ? true : false;
	},
	/**
	 * 是否全部是英文
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isEnglish : function(str){
		return /^[A-Za-z]+$/.test(str);
	},
	/**
	 * 是否链接地址
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isURL : function(str){
		return /^http:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);
	},
	/**
	 * 是否数字字符串
	 * @param {string} str 字符串
	 * @return {bool}
	 */
	isNumberString : function(str){
		return /^\d+$/.test(str);
	}
})
})();