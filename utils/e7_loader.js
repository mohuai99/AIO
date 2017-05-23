(function(loader){	
	var __loading = null,
		loaded = {}, //是否下载
		loading = {}, //正在下载  下载前就建立，以处理同时多次请求，但此处写了，就对不住loaded了，需重构
		queue = [],  //define的deps队列 
		modulemap = {};//加载队列	
		charset = "gb2312";
	loader.set = function(obj){
		charset = obj.charset;		
	}
	/**
	 * 加载对象方法 对应模块需有define方法定义，否则返回中无法使用
	 * @param {array} modules 模块名称 
	 * @param {function} callback 回调 回调方法中的参数为加载模块的返回
	 * @return {undefined} undefined 
	 */
	loader.need = function(modules,callback){
		//参数不作长度判断，由回调时自动对应，如多则undefined，如缺则无法使用
		//**如callback不是function或不存在则不进行回调
		//**modules只作数组判断。
		if (!isArray(modules) ) { 
			modules = new Array(modules)
        }
		
		var mc = moduleContainer("", modules, callback);
		start(mc);
		//**考虑是否增咖中间过渡层，以增加通用性及可移值性
		//**下一期考虑扩展，允许本方法return得到一个对象，以直接使用对象的方法（talk）
		return undefined;
	}
	
	/**
	 * 模块定义方法
	 * @param {string} name 下载对象
	 * @param {array} modules 下载对象
	 * @param {function} callback 下载对象
	 * @return {undefined} undefined 
	 */
	loader.define = function(name,deps,callback){
		//无name参数时从文件名取name（urlcb回调中处理）
		//无deps，则[]		
		if (!isString(name)){
			callback = deps;
			deps = name;			
			name = null;			
		}
		
		if (!isArray(deps)){
			callback = deps;
			deps = [];
		}	

		//**callback非function 为object时，直接为name返回object（cb回调中）
		queue.push([name, deps, callback]);
		return undefined;
	}
	
	//jquery支持
	loader.define.amd = {
        //multiversion: true,
        //plugins: true,
        jQuery: true
    };
	
	/**
	 * 加载文件方法(多个文件)
	 * 适合进行跨域请求
	 * @public
	 * @param {array} filepaths 需要加载脚本
	 * @param {function} callback 回调方法中带有一参数表明加载是否成功。
	 * @return {undefined} 无
	 */
	loader.include = function(filepaths, callback){
		//refactoring
		//filepaths && deps对于类型需要增加判断string形式并相应处理
		var files = new Array();
		files = files.concat(filepaths);
		if (!isFunction(callback)) {callback = function(){}}
		var ic = includerContainer(files, callback);
		start(ic);
	}
	
	/**
	 * 加载脚本基础方法（单一文件）
	 * @param {string} url 路径 url路径不做任何验证
	 * @param {function} callback 回调方法  方法参数表明是否加载成功
	 * @return {undefined} undefined 
	 */
	loader.loadScript = function(url, callback){
		if (!isFunction(callback)) callback = function(){};
		loadScript(url, callback);
	}
	
	/**
	 * 加载CSS基础样式 
	 * @param {string} url 路径 url如以http开头，则按模块名相同规则，添加path及css，如不是css结尾，则不予加载
	 * @param {function} callback 回调方法  方法参数表明是否加载成功
	 * @return {undefined} undefined 
	 */
	loader.loadCSS = function(url, callback){
		// if (url.search(/^http:\/\//i) == -1){
		// 	url = nimei.config.loaderPath + url.replace(/\./g, "/") + ".css"
		// 			 + "?" + nimei.config.version; 
		// }
		var isCSS = /\.css(\?|$)/i.test(url);		
		if (!isFunction(callback)) callback = function(){};
		if (isCSS & !loaded[url]) {
			loadCSS(url, callback);
			loaded[url] = true;
		}
	}
	
	/**
	 * 内容加载器
	 * @private
	 * @param {string} name 下载名称
	 * @param {array} modules 依赖模块对象
	 * @param {function} callback 回调方法
	 * @return {object} object 
	 * 每一个命令对需要下载的文件即增加一个加载器
	 */
	function moduleContainer(name, modules, callback){	
		var needown = 0,
			hasdown = 0,
			hasmaped = 0,
			need = {};
		for(var i=0 ; i < modules.length; i++){
			var url = getModulePath(modules[i]);
			needown ++;
			modules[i] = modules[i].replace(/\//g, ".");
			//已下载过的模块进行处理，表明已下载
			//但不处理maped情况，由回调统一处理			
			if (loaded[modules[i]] || loading[modules[i]]) {
				hasdown ++;
				continue;
			}
			need[modules[i]] = url;			
		}

		return {
			name : name, //模块名
			modules : modules, //依赖模块名
			need : need,   //依赖对象数组(用于load下载)
			res : new Array(), //依赖对象结果 结果集
			//对于对象的时间处理还需要调整
			expires : (modules.length) * nimei.config.expires, //过期时间
			callback : callback, //模块加载完成后的回调
			needown : needown,  //需要下载数
			hasdown : hasdown,	//已下载数
			hasmaped : hasmaped, //已成功定义数

			/**
			 * 单文件下载成功后回调
			 * @private
			 * @param {bool} ret 下载情况
			 * @param {string} name 模块名称
			 * @return {undefined} undefined 
			 * 获取文件内的define对象，创建新mc
			 */
			loadUrlCallback : function(ret, name){
				//无论是否成功都增加已下载数，表明已处理
				this.hasdown ++;	
				if(ret){					
					loaded[name] = true;
				 	while (1){
						var deps = queue.splice(0,1).pop();
						if (deps==null) {
							modulemap[name] = ret;
							break;
						}
						//**如deps名字与name名字不一致时。。。那么。。。那么。。
						if (deps[0] 
							&& deps[0].toLowerCase() != name.substr(name.lastIndexOf(".")+1).toLowerCase()
							&& deps[0].toLowerCase().indexOf(name.substr(name.lastIndexOf(".")+1).toLowerCase()) <0 
							&& name.toLowerCase().indexOf(deps[0].toLowerCase()) <0){
						}
						else{
							deps[0] = name;
							//每新建一个deps则处理					
							var mc = moduleContainer.apply(null,deps);
							start(mc);
							break;
						}
					}							
				}
				else{
					//失败提前处理结果	
					//this.res[name] = "undefined"; 	
					modulemap[name] = "undefined"; 	
				}
			},		
			
			/**
			 * mc所有文件下载成功后回调
			 * @private
			 * @param {bool} ret 下载情况
			 * @param {string} name 模块名称
			 * @return {undefined} undefined 
			 * 等待maped成功后
			 */
			loadInluderCallback : function(ret){		
				if (!ret){
					//**看失败是否可提前处理结果
					//失败处理	
					//给模块中未定义模块置为undefined
					//并置maped数量					
				}				
				this.checkMaped();
			},
			
			/**
			 * mc所有文件下载成功后回调
			 * @private
			 * @param {bool} ret 下载情况
			 * @param {string} name 模块名称
			 * @return {undefined} undefined 
			 * 等待maped成功后
			 */
			completeLoad : function(maped){	
				var ret = [];
				//**取content的deps对应查modulemap存在与否
				for(var i=0 ; i < this.modules.length; i++){
					ret.push(this.res[this.modules[i]]);
				}
				
				if (!isFunction(this.callback) && !isObject(this.callback)) return false;
				if (this.name == "")
					this.callback.apply(null,ret)
				else{	
					isObject(this.callback) 
					? modulemap[this.name] = this.callback
					: modulemap[this.name] = this.callback.apply(null,ret);
				}	
			},
			
			/**
			 * 检查是否已有maped的对象
			 * @private
			 * @return {undefined} undefined 
			 * 在限定时间内检查modulemap
			 */
			checkMaped : function(){
				//如modulemap存在maped对象，则为res添加。
				for(var i=0 ; i < this.modules.length; i++){
					if (isUndefined(this.res[this.modules[i]]) 
					  && !isUndefined(modulemap[this.modules[i]])
					  ){
						this.res[this.modules[i]] = modulemap[this.modules[i]];
						this.hasmaped ++ ;
					}
				}
				//加载完成
				if (this.hasmaped == this.needown){
					this.completeLoad.apply(this, [true]);
					return;
				}
				
				//加载超时
				if (this.hasmaped < this.needown && this.expires<=0){
					for(var i=0 ; i < this.modules.length; i++){
						if (!isObject(modulemap[this.modules[i]])){
							this.res[this.modules[i]] = "undefined";
							this.hasmaped ++ ;
						}
					}
					this.completeLoad.apply(this, [false]);
					return;
				}
								
				//继续监听
				if (this.hasmaped < this.needown  && this.expires>0){			
					this.expires = this.expires - 50;
					var mc = this
					setTimeout(
					function (){
						mc.checkMaped();
					},50);
				}			
			}
		};
	}
	
	/**
	 * load加载开始
	 * @private
	 * @param {object} mc 下载对象
	 * @return {undefined} undefined 
	 */
	function start(mc){	
		var need = mc.need;

		//for(var key=0 ; key < need.length; key++){
	    for(var key in need){
			load(need[key],key,mc);				
		}
		//检查加载状态
		checkloaded(mc);	
	}
	
	/**
	 * 下载文件
	 * @private
	 * @param {object} mc 下载对象
	 * @return {undefined} undefined 
	 */
	function load(url, name, mc){
		var isCSS = /\.css(\?|$)/i.test(url);
		loading[name] = true;
		isCSS ? loadCSS(url, function(ret){
				mc.loadUrlCallback.call(mc, [ret, name]);
			}) 
		  	: loadScript(url, function(ret){
				mc.loadUrlCallback.apply(mc, [ret, name]);
			}) ;		
	}
	
	/**
	 * 检查加载情况
	 * @private
	 * @param {object} mc 下载对象
	 * @return {undefined} undefined 
	 */
	function checkloaded(mc){
		//加载完成
		if (mc.hasdown == mc.needown){
			mc.loadInluderCallback.apply(mc, [true]);
			return;
		}
		
		//加载超时
		if (mc.hasdown < mc.needown && mc.expires<=0){
			//**不用等expires,对单个文件失败的可以提前判断
			mc.loadInluderCallback.apply(mc, [false]);
			return;
		}
		
		//继续监听
		if (mc.hasdown < mc.needown  && mc.expires>0){			
			mc.expires = mc.expires - 50;
			setTimeout(
			function (){
				checkloaded(mc);
			},50);
		}
	}
	
	/**
	 * 获取脚本路径
	 * 以http://开头的，为fullpath
	 * 其它的均视为相对路径
	 * 组合路径或模块方式考虑中
	 * @private
	 * @param {string} filepath 路径
	 * @return {string} fullpath 全局路径 
	 */
	function getModulePath(filepath){
		if (filepath.search(/^http:\/\//i) == -1){
			//var loc = window.location.href,    //extend
			//	path = loc.substr(0,loc.lastIndexOf("/"));
			//filepath = filepath.replace(/\./g, "/");
			filepath = nimei.config.loaderPath + filepath.replace(/\./g, "/") + ".js"
					 + "?" + nimei.config.version;
		}
		return filepath;
	}
	
	/**
	 * 获取模块名称
	 * 以http://开头的，为fullpath
	 * 其它的均视为相对路径
	 * 组合路径或模块方式考虑中
	 * @private
	 * @param {string} filepath 路径
	 * @return {string} fullpath 全局路径 
	 */
	function getModuleName(){
		return null;
	}
	

	/**
	 * includer内容加载器
	 * @private
	 * @param {string} name 下载名称
	 * @param {array} files 依赖模块对象
	 * @param {function} callback 回调方法
	 * @return {object} object 
	 */
	function includerContainer(files, callback){	
		var needown = 0,
			hasdown = 0,
			need = {};

		for(var i=0 ; i < files.length; i++){
			var url = getModulePath(files[i]);			
			needown ++;
			if (loaded[files[i]]) {
				hasdown ++;
				break;
			}
			need[files[i]] = url;			
		}

		return {
			files : files,
			need : need,   //依赖对象数组(用于load下载)
			res : new Array(), //依赖对象结果 结果集
			expires : needown * nimei.config.expires, //过期时间
			callback : callback, //模块加载完成后的回调
			needown : needown,  //需要下载数
			hasdown : hasdown,	//已下载数

			/**
			 * 单文件下载成功后回调
			 * @private
			 * @param {bool} ret 下载情况
			 * @param {string} name 模块名称
			 * @return {undefined} undefined 
			 * 获取文件内的define对象，创建新mc
			 */
			loadUrlCallback : function(ret, name){
				if(ret)	this.hasdown ++;
				loaded[name] = ret;				
			},		
			
			/**
			 * 所有文件下载成功后回调
			 * @private
			 */
			loadInluderCallback : function(ret){
				var res = [];
				for(var i=0 ; i < this.files.length; i++){
					res.push(loaded[this.files[i]]);
				}
				this.callback.apply(null,res);
			}
		};
	}
	
	/**
	 * 加载脚本基础方法
	 * @private
	 * @param {string} filepath 路径
	 * @param {function} callback 回调方法
	 * @return {undefined} undefined 
	 */
	function loadScript(url, callback){
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");			
		script.type = "text/javascript";
		script.charset = charset;
		script.src = url;
		var timeout = setTimeout(
			function (){
				head.removeChild(script);
				callback.call(this,false);	
			},
			nimei.config.expires
		);
		
		onload(
			script,
			function(Ins){
				head.removeChild(script);
				clearTimeout(timeout);
				callback(true);
			}
		);
		head.appendChild(script);
		return true;
	}
	
	/**
	 * 加载样式基础方法
	 * 暂不处理加载的情况，均认为加载成功。
	 * @private
	 */
	function loadCSS(url, callback){
		var head = document.getElementsByTagName("head")[0];
		var link = head.appendChild(
			document.createElement("link")
		);
		link.href = url;
	    link.rel = 'stylesheet';
		callback.call(this,true);
	}
	
	/**
	 * 加载脚本完成后的处理
	 * @private
	 * @param {dom} node script DOM
	 * @param {function} callback 回调方法
	 * @return {undefined} undefined 
	 */
	function onload(node, callback){		
		var isImpOnLoad = ('onload' in node) ? true :
			(function(){
				node.setAttribute('onload','');
				return typeof node.onload == 'function' ; 
			})();
	
		if(document.addEventListener){
			node.addEventListener('load', function(){
				callback.call(this,node);
			}, false);	
		}
		else if (!isImpOnLoad){
			node.attachEvent ('onreadystatechange', function(){
				var rs = node.readyState.toLowerCase();
				if (rs === 'loaded' || rs === 'complete') {
					node.detachEvent('onreadystatechange');
					callback.call(this,node.innerHTML);
				}
			});
		}
		else{
			//maybe someother browser
		}
	}
	
})(window);