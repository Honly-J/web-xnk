function randomBannerBg(){
	var getRandom = function(){return  Math.floor( Math.random()*3 )   };
	$(".banner.animate").addClass(' bg'+ getRandom() );
}

 
function homeBanner(){
	var $b = $(".banner.animate");
	var classStr = $b.attr("class").replace("/active\d/","");
	var getRandomClassStr = function(){return  classStr+ "  active"+ Math.floor( Math.random()*5 )};
	setTimeout(function(){
		$b.attr("class",getRandomClassStr());
	},100)
	setInterval(function(){
		$b.attr("class",getRandomClassStr())
	},5500)
}
//more btn
function randomRoate(){
	var $bt = $(".more-3d-wper .more-btn");
	// var getRandomOrigin = function(){return  Math.floor( Math.random()*100 )+"% " + "50%"  };
	$bt.addClass('active') 
	setInterval(function(){
		// $bt.css({"transform-origin": getRandomOrigin(),"-webkit-transform-origin": getRandomOrigin() })
		$bt.addClass('active') 
	},10000)
}
//4个图标
function randomIocShow(){
	var timer , _one,_lastIndexArr = [0,0],tempInd;
	var $ems = $(".ul-4-animate").find("em");
	var getRandom = function(){
		tempInd =  Math.floor( Math.random()*4 ) ; 
		if(_lastIndexArr.indexOf(tempInd)>-1){
			getRandom()
		}else{
			_lastIndexArr.shift();
			_lastIndexArr.push(tempInd);
			return tempInd;
		}
		 
	};
	setInterval(function(){
		  _one = $ems.eq(getRandom()).addClass("cur");
		  timer = setTimeout(function(){
			_one.removeClass("cur");
			clearTimeout(timer)
		},1500)
	},3000)
}

function scrollFn(){
	new IScroll('#wrapper', {
		scrollbars: true,
		mouseWheel: true,
	     // resizeScrollbars:false,
	     indicatorHeight:100,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		// fadeScrollbars: true
	})
}

function showDialog( $selector){
	var name = $selector.find(".name").text(),
		chirf =  $selector.find(".chirf").text(),
		article = $selector.find(".article").html();
	var htmls = '<div class="mask"  ></div>\
	<div class="dialog-show"  >\
		<em class="close"></em>\
		<div class="body">\
			<div class="name">'+name+'</div>\
			<div class="chirf toggle-btn">'+chirf+'</div>\
			<div id="wrapper">\
				<div id="scroller">\
					<div class="article">'+article+'</div>\
				</div>\
			</div>\
		</div>\
	</div>';
	$("body").append(htmls);
	scrollFn();
	$(".close",".dialog-show").click(function(){
		$(".dialog-show,.mask").remove();
	})
}
function showManText(){
	if( $(window).width() <= 940  ){
		$(".chirf.toggle-btn").off().on("click",function(){
			showDialog($(this).parent(".one"))
		})
	}else{
		$(".chirf.toggle-btn").off().toggle(function(){
			$(this).addClass("active").next(".article").fadeIn();
		},function(){
			$(this).removeClass("active").next(".article").fadeOut();
		});
	}
}

function asyncNewsList( url ){
	var $p = $(".async-news-list");
	url && $p.size()>0  &&  $.ajax({
		url:url,
		dataType:"html",
		success:function(res){
			if($.trim(res)==""){
				res = '<div class="tac pb50 pt50">No Data</div>';
			}
			$p.html(res );
		},
		error:function(){
			$p.html( '<div class="tac pb50 pt50">Network Error!!!</div>');
		}
	})

}
$(function(){
	var isWap = $(window).width() <= 1024 ;
    //wap
	if( isWap  ){
		$._wint = 0,_h=0;
		$(".wap-nav-btn").click(function(){
			if( $(this).hasClass("active")  ){
				$(".wap-nav-btn").removeClass("active").prev(".nav").fadeOut();
				$(window).scrollTop($._wint);
			}else{
				$(this).addClass("active").prev(".nav").height($("body").height()-100).fadeIn();
				$._wint = $(window).scrollTop();	
				$(window).scrollTop(0);
			}
		})
		$(".nav").click(function(e){
			$(".wap-nav-btn").removeClass("active").prev(".nav").fadeOut();
			e.stopPropagation();
		})
	}
	showManText();	
	$(window).on("resize",function(){
		showManText()
	})
	if($(".second-nav > span").size()==0 || $(".second-nav").hasClass('hide')){
		$(".header-blank").height(132);
	}
	$(".second-nav > span  ").click(function(){
		$(".second-nav > span").removeClass("cur").find("a").css("font-weight","normal")
		$(this).addClass("cur").find("a").css('font-weight',"bold");
	})
	window.onhashchange =function(){
		if( $(location.hash).size() == 0) return false;
		$(window).scrollTop( $(location.hash).offset().top - ($(".header-blank").css("display") != "none"? $(".header-blank").height() : 0) )
	}
})