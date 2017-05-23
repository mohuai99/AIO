(function(){
var cookie = nimei.cookie;
extend( cookie, {
	/**
	 * 设置cookie
	 * @param {string} sName cookie名
	 * @param {string} sValue cookie值
	 * @param {int} iExpireSec 失效时间（秒）
	 * @param {string} sDomain 作用域
	 * @param {string} sPath 作用路径
	 * @param {bool} bSecure 是否加密
	 * @return {void}
	 */
	set : function(sName,sValue,iExpireSec,sDomain,sPath,bSecure){
		if(sName==undefined) {
			return;
		}
		if(sValue==undefined) {
			sValue="";
		}
		var oCookieArray = [sName+"="+escape(sValue)];
		if(!isNaN(iExpireSec)){
			var oDate = new Date();
			oDate.setTime(oDate.getTime()+iExpireSec*1000);
			iExpireSec==0 ? '' : oCookieArray.push("expires=" + oDate.toGMTString()) ;
		}
		if(sDomain!=undefined){
			oCookieArray.push("domain="+sDomain);
		}
		if(sPath!=undefined){
			oCookieArray.push("path="+sPath);
		}
		if(bSecure){
			oCookieArray.push("secure");
		}
		document.cookie=oCookieArray.join("; ");
	},
	/**
	 * 获取cookie
	 * @param {string} sName cookie名
	 * @param {string} sValue 默认值
	 * @return {string} cookie值
	 */
	get : function(sName,sDefaultValue){
		var sRE = "(?:; |^)" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);
		
		if (oRE.test(document.cookie)) {
			return unescape(RegExp["$1"]);
		} else {
			return sDefaultValue||null;
		}
	},
	/**
	 * 获取cookie
	 * @param {string} sName cookie名
	 * @param {string} sDomain 作用域
	 * @param {sPath} sPath 作用路径
	 * @return {void} 
	 */
	clear : function(sName, sDomain, sPath){
		var oDate = new Date();
		cookie.set(sName,"", -oDate.getTime()/1000, sDomain, sPath);
	}	
});
})();