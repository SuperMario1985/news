var $config = {
	ajax:false,
	nav:false,
	content:[0]
}

// var liWidth,navWidth,navHeight,navCountOffsetX

var index = index || 0;
var winWidth = $(window).width();
var winHeight = $(window).height();

// 请求ajax来加载nav
function addNavAjax(){
	$.ajax({
		url: '../html/nav.php',
		type: 'post',
		dataType: 'json',
		data: {nav: "start"}
	})
	.done(function(result) {
		var navStr = result
		var htmlStr = template("J_Nav",navStr)
		$(".bg-list").prepend(htmlStr)

		// 获取并设置导航栏nav宽度
		var liWidth = $('#J_Nav li').width();
		var navWidth = $('#J_Nav li').size()*liWidth;
		var navHeight = $('#J_Nav').height()
		$('#J_Nav').width(navWidth);
		var slideHeight = winHeight-$('.g-header-nav-gap').height()
		$('.swiper-slide').height(winHeight-$('.g-header-nav-gap').height());
		var navCountOffsetX=0;
		$('.swiper-slide').height(winHeight-$('.g-header-nav-gap').height());
		navMove();
		slideScroll();
		// 加载第一项的内容
		var status = $('#J_Nav li').eq(index).data("status")
		if(status!=1){
			addContentAjax(index,0);
			$('#J_Nav li').eq(index).data("status",1)
		}
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		// console.log("complete");
	});

}

// 请求ajax来加载第一次的内容
function addContentAjax(channel,page){
	$config.ajax = true
	$.ajax({
		url: '../html/data.php',
		type: 'post',
		dataType: 'json',
		data: {
			channel_code:channel,
			start:page,
			size:20
		}
	})
	.done(function(result) {
		var data = result.data;
		var html = template('J_Style',data);
		var page = $('.swiper-wrapper .swiper-slide').eq(index).append(html).find("li").size();
		$('.swiper-wrapper .swiper-slide').eq(index).data("pages",page)
		// 给滑动页面固定高度解决内容高度不同跳动问题
		$config.ajax = false;
		return;
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		// console.log("complete");
	});
}

// 请求ajax来加载更多的内容
function addMoreAjax(channel,page){
	$config.ajax = true;
	$.ajax({
		url: '../html/more.php',
		type: 'post',
		dataType: 'json',
		data: {
			channel_code:channel,
			start:page,
			size:20
		}
	})
	.done(function(result) {
		var data = result.data;
		var html = template('J_More',data);
		var page = $('.swiper-wrapper .swiper-slide').eq(index).find(".g-list").append(html)
					.find("li").size();
		console.log(page)
		$('.swiper-wrapper .swiper-slide').eq(index).data("pages",page)
		$config.ajax = false;
		return;
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		// console.log("complete");
	});
	
}

// nav移动函数
function navMove(){
	// 得到当前nav下ul的translateX的值
	var nav = document.getElementById('J_Nav');
	var navWidth = $(nav).width()
	var navCountOffsetX;

	function getTransform(select){
		var transZRegex = /\.*translateX\((.*)px\)/i;
		var tabletParent = document.querySelector(select);
		return transZRegex.exec(tabletParent.style.transform)[1];
	}

	var startTime,startX,moveDistance,currentOffsetX;
		// 手指滑动屏幕监听事件
		
	//手指按下的处理事件
	var startHandler = function(evt){
		startTime = new Date() * 1;
		startX = evt.touches[0].pageX;
		//下次点击时清除移动距离
		moveDistance = 0;
		// 当前偏移量
		currentOffsetX = parseInt(getTransform('#J_Nav'));
	}

	//手指移动的处理事件
	var moveHandler = function(evt){
		//兼容chrome android，阻止浏览器默认行为
		// evt.preventDefault();

		//计算手指的偏移量     
		moveDistance = evt.targetTouches[0].pageX - startX;

		// 手指的偏移量
		navCountOffsetX = currentOffsetX + moveDistance;

		// 处理边界问题，超出边界时滑动时处理
		if(navCountOffsetX >= 100){
			navCountOffsetX = 100;
		}else if(navCountOffsetX <= -navWidth +winWidth -100 ){
			navCountOffsetX = -navWidth+winWidth
		}
		// navCountOffsetX = parseInt(navCountOffsetX/54)*54-54; 不加它为了滑动时顺畅
		//最小化改变DOM属性 让nav跟着手指移动
		nav.style.webkitTransition = '-webkit-transform 0s ease-out';
		nav.style.webkitTransform = 'translateX(' +navCountOffsetX+'px)';
	}

	//手指抬起的处理事件
	var endHandler = function(evt){
		// evt.preventDefault();
		//停止时 改变过渡的方式，从无动画变为有动画
		nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
		//超出边界时滑动时处理
		navCountOffsetX = moveDistance > 0 ? (parseInt(navCountOffsetX/54)*54+54):(parseInt(navCountOffsetX/54)*54-54);
		
		if(navCountOffsetX >= 0){
			navCountOffsetX = 0;
		}else if(navCountOffsetX <= -navWidth +winWidth ){
			navCountOffsetX = -navWidth+winWidth
		}
		//改变动画后所应该的位移值
		nav.style.webkitTransform = 'translateX(' +navCountOffsetX+'px)';
	}

	nav.addEventListener('touchstart',startHandler);
	nav.addEventListener('touchmove',moveHandler);
	nav.addEventListener('touchend',endHandler);

	// 导航点击输出对应的的内容

	$("#J_Nav li").on('click',function(){
		var liWidth = $(this).width();
		var navWidth = $("#J_Nav").width();
		console.log('nav被点击了');
		var _this = $(this);
		var id = $.trim(_this.attr('id'));
		index = _this.index();
		_this.addClass('active').siblings().removeClass('active');
		navCountOffsetX = winWidth*0.5 - index*liWidth - 0.5 * liWidth;
		if(navCountOffsetX >= 0){
			navCountOffsetX = 0;
		}else if(navCountOffsetX <= -navWidth +winWidth ){
			navCountOffsetX = -navWidth+winWidth
		}
		nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
		nav.style.webkitTransform = 'translateX(' +navCountOffsetX+'px)';

		if(_this.data('status') != 1){
			_this.data('status',1);
		addContentAjax(index,0);
		}

	// 先根据当前索引设置完nav后再滑动改变index
		swiper.slideTo(index);
	})

	// 初始化 scrollTop 和 page 数  给$('.swiper-slide')的所有数据添加数据
	$('.swiper-slide').data('scrolltop',0);
	$('.swiper-wrapper .swiper-slide').data('page',0);
	/**
	 *导航点击， 获取对应的index值，添加active
	 * slideTo(index) 滑动到对应的index 值
	 * 滑动的时候 onTouchEnd  获取对应的index值，并且给导航添加上
	 * 
	 */
	 var swiper = new Swiper('.swiper-container',{
	 	resistanceRatio : 0.7,
	 	onTransitionEnd:function(){
			// 获取当前li的索引
			index = swiper.activeIndex||0;
			// 获取当前data记录的window的scrollTop值
			var fs = $('.swiper-slide').eq(index).data('scrolltop');

			// var id = $.trim($("#J_Nav li").eq(index).attr('id'));
			// 得到当前队形的li
			var navActive = $("#J_Nav li").eq(index);

			// $(window).scrollTop(fs);
			// 第4个人索引导航开始位置始终处于中间位置
			var liWidth = $("#J_Nav li").eq(index).width();
			navCountOffsetX = winWidth*0.5 - index*liWidth - 0.5 * liWidth;
			// 前几个索引重置为0
			if(navCountOffsetX >= 0){
				navCountOffsetX = 0;
			}else if(navCountOffsetX <= -navWidth +winWidth ){
				navCountOffsetX = -navWidth+winWidth
			}
			nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
			nav.style.webkitTransform = 'translateX(' +navCountOffsetX+'px)';

			navActive.addClass('active').siblings().removeClass('active');
			if(navActive.data('status') != 1){
				navActive.data('status',1);
				addContentAjax(index,0);
			}
		}
		// 记录当前浏览的id值，关闭浏览器后，下次打开浏览器时，可以回复上次观看的页面
		// localStorage.setItem('id',index);
			
	})
}

function slideScroll(){
	$(".swiper-slide").on('scroll',function(){
		var contentHeight = $(this).children(".g-search").height() 
		+$(this).children(".g-list").height()
		+$(this).children(".g-banner").height()

		var contentScrollTop = $(this).scrollTop()
		var containsHeight = $(this).height();
		var lastHeight = contentHeight-contentScrollTop-containsHeight
		if(lastHeight<100){
			var page = $('.swiper-slide').eq(index).data("datas")
			var channel = index;
			if(!$config.ajax){
				addMoreAjax(channel,page)
				console.log("加载ajax")
			}		
		}
	})
}
addNavAjax();








