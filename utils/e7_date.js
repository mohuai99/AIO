(function(){
var date = nimei.date;
var _d = new Date();
extend( date, {
	/**
	 * 获取日期
	 * @param {string} sep 分隔符 默认为-
	 * @return {string} yyyy-mm-dd
	 */
	toDateString : function(nd){	
		var a=[],
			dt = isDate(nd) ? nd : _d;
			m = dt.getMonth()+1,
			d = dt.getDate(),
			sep = arguments[1] ? arguments[1] : (isString(arguments[0]) ? arguments[0] : "-"); 
		a.push(dt.getFullYear());
		a.push( m.toString().length < 2 ? "0" + m : m);
		a.push( d.toString().length < 2 ? "0" + d : d);
		return a.join(sep);
	},
	/**
	 * 获取日期和时间
	 * @param {string} sep 分隔符 默认为-
	 * @return {string} yyyy-mm-dd hh:ii:ss
	 */
	toDateTimeString : function(nd){
	    var dt = isDate(nd) ? nd : _d,
			h = dt.getHours(),
			i = dt.getMinutes(),
			s = dt.getSeconds(),
			a = [];
		a.push(h.toString().length < 2 ? "0" + h : h);
		a.push(i.toString().length < 2 ? "0" + i : i);
		a.push(s.toString().length < 2 ? "0" + s : s);
		return date.toDateString.apply(this,arguments) + " " + a.join(":");
	},
	/**
	 * 是否润年
	 * @param {int} year 年份
	 * @return {bool} 是/否
	 */
	isLeapYear : function(year) {
		return (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0)))
	},
	/**
	 * 获取服务器时间
	 * @return {date} Date
	 */
	getSeverDateTime : function(){
		var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		xhr.open("HEAD", window.location.href, false);
		xhr.send();	
		var d= new Date(xhr.getResponseHeader("Date"));
		return d;
	}	
});
})();