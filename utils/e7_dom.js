(function(){
var dom = nimei.dom;
var userAgent = navigator.userAgent.toLowerCase();

extend( dom, {
	/**
	 * 判断浏览器类型
	 */
	browser : {
		/**
		 * 获取版本号
		 */
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
		/**
		 * 是否webkit浏览器
		 */
		webkit: /webkit/.test( userAgent ),
		/**
		 * 是否opera浏览器
		 */
		opera: /opera/.test( userAgent ),
		/**
		 * 是否IE浏览器
		 */
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		/**
		 * 是否mozilla浏览器
		 */
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		/**
		 * 是否TT浏览器
		 */
		tt: /tencenttraveler/.test( userAgent ),
		/**
		 * 是否chrome浏览器
		 */
		chrome: /chrome/.test( userAgent ),
		/**
		 * 是否firefox浏览器
		 */
		firefox: /firefox/.test( userAgent ),
		/**
		 * 是否safari浏览器
		 */
		safari: /safari/.test( userAgent ),
		/**
		 * 是否gecko浏览器
		 */
		gecko: /gecko/.test( userAgent ),
		/**
		 * 是否IE6
		 */
		ie6: this.msie && this.version.substr(0,1) == '6'
	
	},
	
	/**
	 * 获取dom对象
	 * @param {string|dom} dom的id或对象
	 * @return {dom} 
	 */
	g : function(obj){
		return (typeof obj=='object')?obj:document.getElementById(obj);
	},
	
	/**
	 * 判断DOM对象是否存在样式类名称
	 * @param {dom} element dom对象
	 * @param {string} className 样式名称
	 * @return {bool} 
	 */	 
	hasClassName : function(element, className) {
        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    },
	
	/**
	 * 为DOM对象增加样式类名称
	 * @param {dom} element dom对象
	 * @param {string} className 样式名称
	 * @return {dom} 
	 */
    addClassName : function(element, className) {
        if (!nimei.hasClassName(element, className))
            element.className += (element.className ? ' ' : '') + className;
        return element;
    },
	
	/**
	 * 为DOM对象删除样式类名称
	 * @param {dom} element dom对象
	 * @param {string} className 样式名称
	 * @return {dom} 
	 */
    removeClassName : function(element, className) {
        element.className = nimei.trim(element.className.replace(
			new RegExp("(^|\\s+)" + className + "(\\s+|$)") , ' '));
        return element;	
    },
	
	/**
	 * 为dom对象设置样式
	 * @param {dom} ele dom对象
	 * @param {object} styles 样式对象 like:{width:100,height:100}
	 * @return undefined
	 */
	setStyle: function(ele, styles){
		for (var i in styles) {
			ele.style[i] = styles[i];
		}
	},
	
	/**
	 * 为dom对象获取选定属性的样式
	 * @param {dom} ele dom对象
	 * @param {string} prop 属性名称
	 * @return 属性样式
	 */
	getStyle: function(el, prop){
		//(typeof document.defaultView == 'function') 
		var viewCSS = isFunction(document.defaultView) ? document.defaultView() : document.defaultView;
		if (viewCSS && viewCSS.getComputedStyle) {
			var s = viewCSS.getComputedStyle(el, null);
			return s && s.getPropertyValue(prop);
		}
		return (el.currentStyle && (el.currentStyle[prop] || null) || null);
	},
	
	/**
	 * 获取页面最大高度
	 * @return 属性样式
	 */
	getMaxH: function(){
		return (this.getPageHeight() > this.getWinHeight() ? this.getPageHeight() : this.getWinHeight())
	},
	
	/**
	 * 获取页面最大宽度
	 * @return 属性样式
	 */
	getMaxW: function(){
		return (this.getPageWidth() > this.getWinWidth() ? this.getPageWidth() : this.getWinWidth())
	},
	
	/**
	 * 网页内容高度
	 * @return {int} 网页内容高度
	 */
	getPageHeight: function(){
		var h = (window.innerHeight && window.scrollMaxY) ? (window.innerHeight + window.scrollMaxY) : (document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight);
		return h > document.documentElement.scrollHeight ? h : document.documentElement.scrollHeight
	},
	
	/**
	 * 网页内容宽度
	 * @return {int} 网页内容宽度
	 */
	getPageWidth: function(){
		return (window.innerWidth && window.scrollMaxX) ? (window.innerWidth + window.scrollMaxX) : (document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth : document.body.offsetWidth);
	},
	
	/**
	 * 浏览器可视区域高度
	 * @return {int} 网可视区域高度
	 */
	getWinHeight: function(){
		return (window.innerHeight) ? window.innerHeight : 
		(document.documentElement && document.documentElement.clientHeight) 
		? document.documentElement.clientHeight 
		: document.body.offsetHeight
	},
	
	/**
	 * 浏览器可视区域宽度
	 * @return {int} 网可视区域宽度
	 */
	getWinWidth: function(){
		return (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth
	},
	
	/**
	 * 设置dom透明度
	 * @param {dom} ele dom对象
	 * @param {int} level 透明度值（0-100的整数）
	 * @return {undefined} 
	 */	
	setOpacity: function(ele, level){
		//level = Math.min(1,Math.max(level,0));
		if(this.browser.msie && (!document.documentMode || document.documentMode < 9)){
			ele.style.filter = 'Alpha(opacity=' + level + ')'
		}else{
			ele.style.opacity = level / 100
		 }
    },
	/**
	 * 获取页面中对象的绝对X位置
	 * @param {dom} e dom对象
	 * @return {int} 
	 */	
	getX: function(e) {
		var t = e.offsetLeft;
		while (e = e.offsetParent) t += e.offsetLeft;
		return t
	},
	/**
	 * 获取页面中对象的绝对Y位置
	 * @param {dom} e dom对象
	 * @return {int} 
	 */	
	getY: function(e) {
		var t = e.offsetTop;
		while (e = e.offsetParent) t += e.offsetTop;
		return t
	},
	
	/**
	 * 获取url中的参数值
	 * @param {string} pa 参数名称
	 * @return {string} 参数值
	 */	
	request: function(pa){ 
		var url = window.location.href.replace(/#+.*$/, ''),
			params = url.substring(url.indexOf("?")+1,url.length).split("&"),
			param = {} ;
		for (var i=0; i<params.length; i++){ 
			var t = params[i].split("=");
			param[t[0]]=t[1];
		} 
		return (typeof(param[pa])=="undefined") ? "" : param[pa];
	} 
})
})();