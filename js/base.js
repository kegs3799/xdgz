var Main = {
	top: function() {
		$("#m" + m).addClass("on");
		Search.one("#topBtn", "topkey", "", "鍏抽敭璇嶄笉鑳戒负绌猴紒", "杈撳叆鐨勫叧閿瘝瀛楁暟涓嶈杩囧锛�", "鎮ㄨ緭鍏ョ殑鍐呭瀛樺湪鐗规畩瀛楃锛�", searchpath)
		//鍒ゆ柇鏄惁鏈変笅鎷�
		var _li=$("menu li")
		_li.each(function(){
			var n=$(this).find("dd").length
			if(n>=1){
				$(this).addClass("hasSub");
				$(this).find('.quia').after('<i class="quiaa"></i>');
			}else{
				$(this).find('.qui_submenu').remove();
			}
			//鏀瑰彉閫変腑 榧犳爣缁忚繃鍘绘帀褰撳墠鏍忕洰閫変腑
			$(this).hover(function(){
				$(this).addClass("on").siblings().removeClass("on");
			},function(){
				$(this).removeClass("on");
				$("#m"+m).addClass("on");
			});
		});
		$('.qui_top_box .ULLIST>li .quiaa').click(function(event) {
			$(this).parents('li').toggleClass('wapon');
			$(this).next('.qui_submenu').slideToggle('fast').parents('li').siblings('li').find('.qui_submenu').hide();
		});
	},
	bottom: function() {
		Main.top();
		//鏈€澶ч珮搴�
		$(".MAXBOX").each(function(i,item){
			var maxheight = 0;
			for(var i = 0;i<$(this).find('.MAXLI').length;i++){
				if(maxheight <= $(this).find('.MAXLI').eq(i).find('.MAXLI2').innerHeight()){
					maxheight = $(this).find('.MAXLI').eq(i).find('.MAXLI2').innerHeight();
				}
			}
			$(this).find('.MAXLI2').css('height',parseInt(maxheight)+'px');
		});
		//鏁寸珯鏃犲浘澶勭悊
		setTimeout(function(){
			$.each($("img"), function(i, n) {
				$(n).on('error', function() {
					n.src = nopicpath;
				});
				n.src = n.src;
			});	
			$(".Ispic").each(function(){
				var img=$(this).css("background-image")
				var nop='url("'+ location.protocol +'//'+ location.hostname +''+picpath+'")'
				if(img==nop){
					$(this).css("background-image","url("+nopicpath+")") 
				}
			})
		},500)
		//杩斿洖椤堕儴
		$(window).scroll(function() {
			var stop = $(document).scrollTop()
			if (stop > 150) {
				$(".qui_gotop22").css('opacity', '1');
			} else {
				$(".qui_gotop22").css('opacity', '0');
			}
		});
		$(".qui_gotop").click(function() {
			$('body,html').animate({
				scrollTop: 0
			}, 300)
		});
		var LocalHref=encodeURIComponent(window.location.href);
		var WebTt = $('title').html();
		//鍒嗕韩鏂版氮寰崥
		$(".qui_share_sina").attr("href","//service.weibo.com/share/share.php?url="+LocalHref+"&title="+ WebTt +'&searchPic=false');
		//鍒嗕韩QQ
		$(".qui_share_qq").attr("href","//connect.qq.com/widget/shareqq/index.html?url="+LocalHref+"&title="+ WebTt);
		//tab鍒囨崲
		$(".qui_tab_box .qui_tab_ll").hide();
		$(".qui_tab_box .qui_tab_tt .quia").each(function(i,item){
			$(this).click(function(){
				$(this).addClass("on").siblings().removeClass("on");
				$(".qui_tab_box .qui_tab_ll").eq(i).stop().fadeIn('fast').siblings(".qui_tab_ll").hide();
			})
		})
		$(".qui_tab_box").each(function(i,item){
			$(this).find('.qui_tab_ll').eq(0).show();
			$(this).find('.quia').eq(0).addClass("on");
		});
	},
    keyword:function(){
    	var str=$("#keyWord").text()
    	var regExp = new RegExp(str, 'g');
    	$(".qui_tt_list .li").each(function(){
    		var html = $(this).find(".quitt").html();
			var newHtml = html.replace(regExp, "<i class='qui_col_df'>" + str + '</i>'); //灏嗘壘鍒扮殑鍏抽敭瀛楁浛鎹紝鍔犱笂highlight灞炴€э紱
			$(this).find(".quitt").html(newHtml); //鏇存柊鏂囩珷锛�
		})
    },
    form:function(){
    	$(".qui_form_tt .lab").each(function () {
    	var tips = $(this).find(".qui_all_lab");
    	var input = $(this).find(".qui_text");
    	input.bind('input porpertychange',function(){
    	if ($(this).val()=="") {
    		tips.show();
    	}else{
    		tips.hide();
    	}
    	});
    	});
    },
}

var Search = {
	one: function(btn, kid, txt, txt1, txt2, txt3, url) {
		$(btn).jqSearch({
			TxtVal: txt,
			KeyTxt1: txt1,
			KeyTxt2: txt2,
			KeyTxt3: txt3,
			KeyId: kid, //杈撳叆妗唅d
			KeyUrl: url, //璺宠浆閾炬帴
			KeyHref: "key", //閾炬帴浼犲€�
			Static: false //鏄惁闈欐€佺珯
		});
	}
}
// <video src='' controls autoplay  x-webkit-airplay='true' x5-video-player-type='h5' x5-video-player-fullscreen='true' webkit-playsinline='true' playsinline='true'></video>