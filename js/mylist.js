
// var liWidth = $('#J_Nav li').width()
// $('#J_Nav').width($('#J_Nav li').size()*liWidth)
// // var navWidth = $('#J_Nav').width()
// var winWidth = $(window).width()
var index = index||0;
$config = {
	ajax:false
}
/**
 * 首先给出整体的宽度
 * 然后记录
 * move 的时候记录move 的距离
 * 
 * touchend 的时候 到达记录的距离
 *
 */
//获取nav 的ul
var count;
nav = document.getElementById('J_Nav');

// li的个数
var len = $('#J_Nav li').length;

// li的宽度
var liWidth = $('#J_Nav li').width()
var winWidth = $(window).width();
var navWidth = len*liWidth

// 设置导航的宽度
$(nav).width(navWidth + 'px');

var winHeight = $(window).height()
var navHeight = $('#J_Nav').height()
$('.swiper-slide').height(winHeight-navHeight)


// 得到当前nav下ul的translateX的值
function getTransform(select){
	var transZRegex = /\.*translateX\((.*)px\)/i;
	var tabletParent = document.querySelector(select);
	console.log(tabletParent.style.transform)
	return transZRegex.exec(tabletParent.style.transform)[1];

}
//手指按下的处理事件
var startHandler = function(evt){

	//记录刚刚开始按下的时间
	startTime = new Date() * 1;

	//记录手指按下的坐标
	startX = evt.touches[0].pageX;

	//清除偏移量
	offsetX = 0;

	// 当前偏移量
	offset = getTransform('#J_Nav');
	offset--;
};

//手指移动的处理事件
var moveHandler = function(evt){
	//兼容chrome android，阻止浏览器默认行为
	// evt.preventDefault();

	//计算手指的偏移量     self.startX？？？
	offsetX = evt.targetTouches[0].pageX - self.startX;

	// 手指的偏移量
	count = offset + offsetX;


	// 处理边界问题
	if(count >= 100){
		count = 100;
	}else if(count <= -navWidth +winWidth ){
		count = -navWidth+winWidth
	}
	// count = parseInt(count/54)*54-54;
	//最小化改变DOM属性 让nav跟着手指移动
	nav.style.webkitTransition = '-webkit-transform 0s ease-out';
	nav.style.webkitTransform = 'translateX(' +count+'px)';
	// lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)';
};

//手指抬起的处理事件
var endHandler = function(evt){
	// evt.preventDefault();
	//停止时 改变过渡的方式，从无动画变为有动画
	nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
	//超出边界时 处理
	count = offsetX>0?(parseInt(count/54)*54+54):(parseInt(count/54)*54-54)
	// count = parseInt(count/54)*54-54
	if(count >= 0){
		count = 0;
	}else if(count <= -navWidth +winWidth ){
		count = -navWidth+winWidth

	}
	
		//改变动画后所应该的位移值
	nav.style.webkitTransform = 'translateX(' +count+'px)';

	
}


nav.addEventListener('touchstart',startHandler);
nav.addEventListener('touchmove',moveHandler);
nav.addEventListener('touchend',endHandler);

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
	onTransitionBefore:function(){

	},
	onTransitionEnd:function(){
		// autoHeight();
		// var w = $(window).width();
		// 获取当前list的索引
		index = swiper.activeIndex||0;
		// 获取当前data记录的window的scrollTop值
		var fs = $('.swiper-slide').eq(index).data('scrolltop');

		// var id = $.trim($("#J_Nav li").eq(index).attr('id'));
		// 得到当前队形的li
		var navActive = $("#J_Nav li").eq(index);

		// $(window).scrollTop(fs);
		var long = liWidth*index + liWidth;
// var w;
// 		// 处理nav下li的跟进
// 		if(long > winWidth){
// 			w = winWidth - long;
// 			nav.style.webkitTransition = '-webkit-transform 0s ease-out';
// 			nav.style.webkitTransform = 'translateX(' +w+'px)';
// 		}
// 		
// 		
	  count = winWidth*0.5 - index*liWidth - 0.5 * liWidth;
  if(count >= 0){
		count = 0;
	}else if(count <= -navWidth +winWidth ){
		count = -navWidth+winWidth
	}
nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
	nav.style.webkitTransform = 'translateX(' +count+'px)';
 		
		navActive.addClass('active').siblings().removeClass('active');
		if(navActive.data('status') != 1){
			navActive.data('status',1);
			// ajaxChannel(id,0);
			ajaxChannel(index,0);
		}

		// 将记录的滚动条的高度设置给当前滚动条  怎么去除跳动的效果???????
		$(window).scrollTop($('.swiper-slide').eq(index).data('scrolltop'));
		localStorage.setItem('id',index);
		
	}
})


// 监听scroll 的高度，达到每个滚动条独立
$(window).scroll(function(){
	var nowScrolltop  = $(window).scrollTop();
	// console.log('滚轮'+ nowScrolltop)
	$('.swiper-slide').eq(index).data('scrolltop',nowScrolltop);
})
	// 导航点击输出对应的的内容
	// 

$("#J_Nav li").on('click',function(){
	console.log('nav被点击了')
	var _this = $(this);
	var id = $.trim(_this.attr('id'));
    
	if(_this.data('status') != 1){
		_this.data('status',1);
		// ajaxChannel(id,0);
	}
	


	index = _this.index();
	_this.addClass('active').siblings().removeClass('active');
	  count = winWidth*0.5 - index*liWidth - 0.5 * liWidth;
  if(count >= 0){
		count = 0;
	}else if(count <= -navWidth +winWidth ){
		count = -navWidth+winWidth
	}
	nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';
	nav.style.webkitTransform = 'translateX(' +count+'px)';

	swiper.slideTo(index);
	
})


// // 请求ajax来加载内容
// function addHeadAjax(channel,page){
// 	if($config.ajax){
// 		return
// 	}
// 	$config.ajax = true
// 	$.ajax({
// 		url: '../html/data.php',
// 		type: 'post',
// 		dataType: 'json',
// 		data: {
// 			// channel_code:channel,
// 			// start:page,
// 			// size:20
// 		}
// 	})
// 	.done(function(result) {
// 		// console.log("success");			
// 		// $loading.remove();
// 		// var list = result.data.top_item;
// 		var data = result.data;
// 		var html = template('J_Style',data);
// 		$('.swiper-wrapper .swiper-slide').eq(index).find('.g-list').append(html);
		
// 		setTimeout(function (){
// 			$config.ajax = false;
// 		}, 80)
// 		return;
// 	})
// 	.fail(function(err) {
// 		console.log(err);
// 	})
// 	.always(function() {
// 		// console.log("complete");
// 	});
// }


// 请求ajax来加载内容
function addContentAjax(channel,page){
	if($config.ajax){
		return
	}
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
		// console.log("success");			
		// $loading.remove();
		// var list = result.data.top_item;
		console.log(result.items.length);
		var data = result.data;
		var html = template('J_Style',data);
		$('.swiper-wrapper .swiper-slide').eq(index).find('.g-list').append(html);
		
		setTimeout(function (){
			$config.ajax = false;
		}, 80)
		return;
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		// console.log("complete");
	});
}
addContentAjax(0,0);

// 监听.swiper-slide的滚动事件，发起ajax
$(".swiper-slide").on('scroll',function(){
	var contentHeight = $(this).children(".g-search").height() 
	+$(this).children(".g-list").height()
	+$(this).children(".g-banner").height()

	var contentScrollTop = $(this).scrollTop()
	var containsHeight = $(this).height();
	var lastHeight = contentHeight-contentScrollTop-containsHeight
	if(lastHeight<100){
		var page = $('.swiper-slide').eq(index).find('.g-list li').size()
		// var channel = $.trim($('#J_Nav li').eq(index).attr('id'))
		var channel = index;
		if(!$config.ajax){
			addContentAjax(channel,page)
			console.log("加载ajax")
		}		
	}
})


