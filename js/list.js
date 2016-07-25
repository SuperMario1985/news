/**
 * 首先给出整体的宽度
 * 然后记录
 * move 的时候记录move 的距离
 * 
 * touchend 的时候 到达记录的距离
 *
 */
//获取nav 的ul
nav = document.getElementById('J_Nav');

// li的个数
var len = $('#J_Nav li').length;

// li的宽度
var itemW = 54;
var win = $(window).width();
var w = len*itemW

// 设置导航的宽度
$(nav).width(w + 'px');

// nav超出窗口的部分 宽度
var navW = -(w-win);
var index = 0;
var count = 0;
/**
 * 获取transform 的值
 * @param  {string} el 获取的挂钩
 * @return {array}    返回数组
 */

// 得到当前nva下ul的translateX的值
function getTransform(){
	var transZRegex = /\.*translateX\((.*)px\)/i;
	var tabletParent = document.querySelector("#J_Nav");
	return transZRegex.exec(tabletParent.style.webkitTransform)[1];

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
	//最小化改变DOM属性 让nav跟着手指移动
	nav.style.webkitTransition = '-webkit-transform 0s ease-out';
	nav.style.webkitTransform = 'translateX(' +count+'px)';
	// lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)';
};

//手指抬起的处理事件
var endHandler = function(evt){
	// evt.preventDefault();


	//手指抬起的时间值
	var endTime = new Date() * 1;

	//当手指移动时间超过300ms 的时候，按位移算
	if(endTime - startTime > 300){
		
	}else{
		//优化
		//快速移动的缓冲？？？？？？
		count = count  + offsetX;
	}

	//停止时 改变过渡的方式，从无动画变为有动画
	nav.style.webkitTransition = '-webkit-transform 0.2s ease-out';

	//超出边界时 处理
	if(count >= 0){
		count = 0;
	}else if(count <= navW){
		count = navW;
	}

	//改变动画后所应该的位移值
	nav.style.webkitTransform = 'translateX(' +count+'px)';

	
};

nav.addEventListener('touchstart',startHandler);
nav.addEventListener('touchmove',moveHandler);
nav.addEventListener('touchend',endHandler);

// 初始化 scrollTop 和 page 数  给$('.swiper-slide')的所有数据添加数据
$('.swiper-slide').data('scrolltop',0);
$('.swiper-wrapper .swiper-slide').data('page',0);
/**
 *导航点击， 获取对应的index值，添加active
 * slideTo(index) 滑动到对应的index 快速移动的缓冲？？？？？？
 * 滑动的时候 onTouchEnd  获取对应的index值，并且给导航添加上
 * 
 */
var swiper = new Swiper('.swiper-container',{
	onTransitionEnd:function(){
		autoHeight();
		var w = $(window).width();
		// 获取当前list的索引
		index = swiper.activeIndex||0;
		// 获取当前data记录的window的scrollTop值
		var fs = $('.swiper-slide').eq(index).data('scrolltop');

		var id = $.trim($("#J_Nav li").eq(index).attr('id'));
		// 得到当前队形的li
		var navActive = $("#J_Nav li").eq(index);

		$(window).scrollTop(fs);
		var long = itemW*index + itemW;
		
		if(long > w){
			w = w - long;
			nav.style.webkitTransition = '-webkit-transform 0s ease-out';
			nav.style.webkitTransform = 'translateX(' +w+'px)';
		}
		navActive.addClass('active').siblings().removeClass('active');
		if(navActive.data('status') != 1){
			navActive.data('status',1);
			ajaxChannel(id,0);
		}
		
		localStorage.setItem('id',index);
		
	}
});

// 导航点击输出对应的的内容
$("#J_Nav li").click(function(){
	var _this = $(this);
	var id = $.trim(_this.attr('id'));
    
	if(_this.data('status') != 1){
		_this.data('status',1);
		ajaxChannel(id,0);
	}
	
	index = _this.index();
	_this.addClass('active').siblings().removeClass('active');
	swiper.slideTo(index);
	localStorage.setItem('id',index);
	
	var fs = $('.swiper-slide').eq(index).data('scrolltop');
	$(window).scrollTop(fs);
})

// 监听scroll 的高度，达到每个滚动条独立
$(window).scroll(function(){
	var nowScrolltop  = $(window).scrollTop();
	$('.swiper-slide').eq(index).data('scrolltop',nowScrolltop);
})

// 重置每个内容区域的高度
function autoHeight(){
	//console.log(index, '++++====>')
	var current = $('.swiper-slide').eq(index);
	if(current.find('.life-wrap').length >= 1){
		var h4 = $('.swiper-slide').eq(index).find('.life-wrap').height();
	}else{
		var h1 = current.find('.g-banner').height();
		var h2 = current.find('.g-search').height();
		var h3 = 0;
		$('.swiper-slide').eq(index).find('.g-list').each(function(index, el) {
				h3 += $(this).height();
		});

		var h4 = h1+h2+h3;
	}

	$('.swiper-container').height(h4);
}


// 初始化导航加载
if($CONFIG.code !== '' && $CONFIG.code !=='news'){
	var id = $CONFIG.code;
	var index = $('#J_Nav li[id="'+id+'"]').index();

	swiper.slideTo(parseInt(index));
}else{
	if( $CONFIG.code =='news'){
		localStorage.setItem('id', 0)
	}
	if(localStorage.getItem('id') == null){
		localStorage.setItem('id', 0)
	}

	if(localStorage.getItem('id') == null){
		localStorage.setItem('id',0);
		setTimeout(function(){
			swiper.slideTo(0);
		}, 100)
	}else{
		var id = localStorage.getItem('id');
		$("#J_Nav li").eq(id).addClass('active').siblings().removeClass('active');
		var navActive = $("#J_Nav li").eq(index);
		var code = $.trim($("#J_Nav li").eq(index).attr('id'));
		//console.log(id, '===>')
		if(id == 0){
			if(navActive.data('status') != 1){
				navActive.data('status',1);
				ajaxChannel(code,0);
			}
		}else{
			swiper.slideTo(parseInt(id));
		}
	}

}

// 去掉内容区域的空白
// autoHeight();


// ajax 加载内容
function ajaxChannel(channel,page){
	// 正在加载标示
	var $loading = $('<div style="text-align:center; line-height:30px;">正在加载中···</div>');
	$('.swiper-wrapper .swiper-slide').eq(index).append($loading);

	//iapp判断加载类型
	if(channel == 'iapp'){	
		console.log('iapp');
		$.ajax({
			url: '/h5/default/channel_data',
			type: 'POST',
			dataType: 'json',
			data: {
				channel_code: 'iapp',
				start: 0,
				size: 100
			},
		})
		.done(function(result) {
			
			$CONFIG.ajax = !1;
			$loading.remove();
			var list = result.data.top_item;
			var data = result.data;
			if(list != undefined){
				var banner = template('J_ABaner',list);
				$('.swiper-wrapper .swiper-slide').eq(index).append(banner);
			}else{
				$('.swiper-wrapper .swiper-slide').eq(index).append('<div class="life-wrap">');
			}
			var html = template('J_AList',data);
			$('.swiper-wrapper .swiper-slide').eq(index).find('.life-wrap').append(html);
			
			setTimeout(function (){
				autoHeight();
			}, 80)
			//autoHeight();
			changeNav();
			
			return;
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}else{
		$.ajax({
			url: '/h5/default/channel_data',
			type: 'POST',
			dataType: 'json',
			data: {
				channel_code: channel,
				start: page,
				size: 20
			},
		})
		.done(function(result) {
			$CONFIG.ajax = !1;

			//清除正在加载
			$loading.remove();

			// 拿数据
			var list = result.data.list;
			var banner = template('J_Banner',list[0]);
			if(page == 0){
				result.data.list.shift()
				$('.swiper-wrapper .swiper-slide').eq(index).append(banner);
			}
			var data = result.data;
			var html = template('J_Style',data);
			$('.swiper-wrapper .swiper-slide').eq(index).append(html);
			// 改变
			autoHeight();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}
}


// 加载栏目
function ajaxCategory(id){
	$.ajax({
		url: '/h5/default/channel_data',
		type: 'POST',
		dataType: 'json',
		data: {
			channel_code: 'iapp',
			start: 0,
			category: id,
			size: 100
		},
	})
	.done(function(result) {
		console.log(result);
		$CONFIG.ajax = !1;
		var data = result.data;

		if(id == 1){
			var html = template('J_Category1',data);
			$('.J_LifeWrap > div').eq(id).find('.life-list').append(html);
		}else{
			var html = template('J_Category2',data);
			$('.J_LifeWrap > div').eq(id).find('.life-list').append(html);
		}
		
		autoHeight();
		return;
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

// 下拉加载
$(window).scroll(function () {
	var id = $.trim($("#J_Nav li").eq(index).attr('id'));
	if(id == 'iapp'){
		return;
	}
	// 文档高度
    var h = $(document).height();
    var page = 0;
    // body滚动高度
    var scroTop = $("body").scrollTop();
    var scroWinTop = $(window).scrollTop();
    var winH = $(window).height();
    if (1.5 * winH >= h - scroTop && !$CONFIG.ajax && !$CONFIG.end) {
    	if($('.swiper-wrapper .swiper-slide').eq(index).data('page') == "undefined"){
    		page = 0;
    	}else {
    		page = $('.swiper-wrapper .swiper-slide').eq(index).find('.g-list li').length;
    	}
        $CONFIG.ajax = !0;
        ajaxChannel(id,page);
    }
})

// 爱应用导航切换
function changeNav(){
	$('.J_LifeNav li').click(function(){
		var _this = $(this);
		var index = _this.index();
		_this.addClass('current').siblings().removeClass('current');

		$('.J_LifeWrap > div').eq(index).show().siblings().hide();
		console.log(_this.data('status'));
		if(_this.data('status') != 1){
			if(index == 1){
				_this.data('status',1);
				ajaxCategory(index);
			}else if(index == 2){
				_this.data('status',1);
				ajaxCategory(index);
			}
		}
	})
}