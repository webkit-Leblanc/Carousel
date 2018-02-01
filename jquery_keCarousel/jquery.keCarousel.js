;(function($){
	// $.prototype.lxCarousel = function(options){
	$.fn.keCarousel = function(options){
		// 如何安全使用$：匿名函数传参
		// 如何获取.box：this=>jquery对象

		// 默认参数
		var defualts = {
			width:320,
			height:320,
			index:0,
			page:true,
			autoPlay:true,
			// 轮播间隔
			duration:2000,
			// 轮播类型
			type:'vertical',//horizontal,fade
			// 无缝滚动
			marquee:true
		}
		return this.each(function(){
			// 这里的this为dom节点
			// var opt = Object.assign({},defualts,options);

			// 比assign强大   
			var opt = $.extend({},defualts,options);
			
			// 判断是否无缝滚动
	     
			if(opt.marquee&&opt.type!="fade"){
				// 复制第一张到最后一张
				opt.imgs.push(opt.imgs[0])		 
			}
			opt.len = opt.imgs.length;
			var $this = $(this);

			// 添加特定类
			$this.addClass('ke-carousel');

			// 设定样式
			$this.css({
				width:opt.width,
				height:opt.height
			});

			var $ul;
			init();
			var timer;

			// 鼠标移入移除
			$this.on('mouseenter',function(){
				clearInterval(timer);
			}).on('mouseleave',function(){
				timer = setInterval(function(){
					opt.index++;

					show();
					pageshow();
				},opt.duration);
			}).trigger('mouseleave');
			// 鼠标移进圆点
			$this.on('mouseenter','div.page span',function(){
				var newIndex=this.className.match(/[\d{1}]/)[0];
				opt.index=newIndex;
				show();
				pageshow();     
			})
			$this.on('click','.prev',function(){
				if(opt.index<1){
					opt.index=opt.len-1;
					console.log(opt.index,opt.len)  
					// 改定位
					switch(opt.type){
						case 'vertical':
							if(opt.marquee){  
								$ul.css({top:-opt.height*(opt.len-1)});
								break;	
							}
							else{
								opt.index=opt.len;
								break;
							}
						case 'horizontal':
							$ul.css({left:-opt.width*(opt.len-1)});
							break;
						case 'fade':
							opt.index=opt.len;
					}	
				}
				opt.index--;
				show();
				pageshow();    
			})
			$this.on('click','.next',function(){
				if(opt.index>opt.len-1){opt.index=0}
				opt.index++;
				show();
				pageshow();     
			})
			// 初始化:   获取/生成节点   绑定事件
			function init(){
				$ul = $('<ul/>')

				var html = $.map(opt.imgs,function(url){
					return '<li><img src="'+ url +'"/></li>';
				}).join('\n');

				$ul.html(html);
				$this.append($ul);
				console.log(opt)

				if(opt.page){
					var $pgdiv=$('<div/>').addClass('page');   
					if(opt.marquee){
						// 无缝 多了一张 从第一张开始
						for(var i=1;i<opt.imgs.length;i++){
							var $span=$('<span/>').addClass('num'+(i-1));   
							$span.appendTo($pgdiv); 
							// 高亮第一张
							if(i==opt.index+1){
								$span.addClass('active');
							}    
						}
					}else{
						for(var i=0;i<opt.imgs.length;i++){
							var $span=$('<span/>').addClass('num'+i);
							$span.appendTo($pgdiv);
							if(i==opt.index){
								$span.addClass('active');
							}     
						}
					}
					$pgdiv.appendTo($this);
					opt.ele=$pgdiv;

					// 创建左右切换按钮
					var $arrowLeft=$('<span/>').addClass('prev');
					var $arrowRight=$('<span/>').addClass('next');
					$arrowLeft.appendTo($this);
					$arrowRight.appendTo($this);
				}
			}
			function show(){
				if(opt.type=="vertical"){
					$ul.css("width",opt.width).find('li img').css({
						display:'block'
					})
					if(opt.index >= opt.len){
						opt.index = 0;
						if(opt.marquee){
							opt.index=1;
							$ul.css('top',0);
						}
					}else if(opt.index<0){
						opt.index = opt.len-1;
					}
					var target = -opt.index*opt.height;
					$ul.stop(true,true).animate({top:target});

				}
				else if(opt.type=="horizontal"){
					$ul.css('width',opt.width*opt.len).find('li img').css({
						float:'left'
					});
					if(opt.index >= opt.len){
						opt.index = 0;
						if(opt.marquee){
							opt.index=1;
							$ul.css('left',0);
						}
					}else if(opt.index<0){
						opt.index = opt.len-1;
					}
					var target = -opt.index*opt.width;     
					$ul.stop().animate({left:target});	
				}
				else if(opt.type=="fade"){
					$ul.find('li').css({
						position:'absolute',
						zIndex:-1
					})
					$ul.children('li').first().css({zIndex:0})
					if(opt.index >= opt.len){
						opt.index = 0;
					}else if(opt.index<0){
						opt.index = opt.len-1;
					}
					var $lis=$ul.children('li');
					$($lis[opt.index]).stop().fadeIn().siblings('li').stop().fadeOut();
					// $($lis[opt.index]).stop(true).animate({opacity:1}).siblings('li').stop(true).animate({opacity:0});
				}			     
			}
			function pageshow(){
				if(opt.page==false)return
				if(opt.marquee){
					opt.ele.find('.active').removeClass('active');
					if(opt.index<opt.len-1){
						$(opt.ele.find('span')[opt.index]).addClass('active');     
					}else{
						$(opt.ele.find('span')[0]).addClass('active'); 
					}
				}else{
					opt.ele.find('.active').removeClass('active');    
					if(opt.index<opt.len){
						$(opt.ele.find('span')[opt.index]).addClass('active');
					}
				}
			}
		
		});


		// return this便于链式调用
		// return this;
	}

	// 插件库建议写法
	// $.fn.extend({
	// 	lxCarousel:function(){},
	// 	lxDraggable:function(){},

	// 	// 倒计时插件
	// 	lxCountdown:function(){}
	// })

})(jQuery);