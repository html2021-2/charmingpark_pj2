$(function () {
	/*  $('#movie .videoCtrl button').on('keyup', function (e) {
	console.log(e.keyCode); // 엔터 = 13
	if (e.keyCode === 13) $(this).focus();
	}); */
	/* focus 엔터 눌러도 다음으로 바로 넘어가지 않고 제자리에 있도록 제어 */
	// 엔터로 버튼 클릭시 포커스 이탈함 : 제어가 불필요한가? 

	/* search 에서 input태그 에게 달린 label */
	$('#site_search_txt').on({
		focus: function () {
			$(this).prev().css('left', 990);
		},
		blur: function () {
			if ($(this).val() === '') $(this).prev().css('left', 0);
		}
	});

	/* 메뉴 모달 안에 있는 메인 네비게이션 */
	// dep2의 ul로 가면 dep1의 애니메이션이 남아있게 제어하기
	const $header = $('#headerWrap');
	const $gnb = $('.menu #menu_modal .main_menu > ul');

	//1) depth2 ul 숨기기
	$gnb.find('ul').hide();

	//2) depth1 a - mouseenter focus
	$gnb.find('> li > a').on('mouseenter focus', function () {
		//초기화
		$gnb.find('> li.on').removeClass('on').children('ul').hide();
		$header.removeClass('active');

		//활성화
		$(this).parent().has('ul').closest($header).addClass('active'); //100% 너비의 밑줄 바 생성을 위한 클래스명 추가
		$(this).next().show().parent().addClass('on');
	});

	//3) $gnb에서 마우스가 벗어나면 mouseleave => 활성화 상태를 초기화면으로 되돌림
	$gnb.on('mouseleave', function () {
		//마우스가 떠나기전 마지막 활성화상태를 초기화
		$header.removeClass('active');
		$gnb.find('> li.on').removeClass('on').children('ul').hide();
	});

	// 4) 키보드 이탈 2가지 : 첫번째(shift + tab)와 마지막(!shift + tab) a
	// $gnb.find('a:first')
	$gnb.find('a').first().on('keydown', function (e) {
		console.log(e.keyCode); //tab:9
		// if (( e.shiftKey  && e.keyCode === 9 ) || (e.keyCode === 16 && e.keyCode === 9 )) $gnb.trigger('mouseleave');
		if ((e.shiftKey || e.keyCode === 16) && e.keyCode === 9) $gnb.trigger('mouseleave');
	});
	$gnb.find('a').last().on('keydown', function (e) {
		if ((!e.shiftKey || e.keyCode !== 16) && e.keyCode === 9) $gnb.trigger('mouseleave');
	});

	$('.md_open').on('click', function (e) {
		// 1) 변수선언 : 열기버튼, 열려질 상세 모달 내용, 닫기버튼, 포커스를 처음가질 요소, 포커스를 마지막에 가질 요소
		const $openBtn = $(this);
		const $mdCnt = $($(this).data('href'));
		const mdCntWid = $mdCnt.outerWidth();
		// console.log($mdCnt, typeof $mdCnt, mdCntWid);

		const $closeBtn = $mdCnt.find('.md_close');
		console.log($openBtn, $closeBtn);
		const $first = $mdCnt.find('[data-link="first"]');
		// const $first = $mdCnt.find('.first');
		const $last = $mdCnt.find('[data-link="last"]');

		// 부모 div.search.on / div.menu.on
		$openBtn.parent().addClass('on');

		// 2) 현재의 스크롤 그대로 유지 : #wrap 높이값 -> html, body에게 적용
		const wrapHei = $('#wrap').outerHeight();
		$('html, body').css({
			height: wrapHei,
			overflow: 'hidden'
		});

		// 2) #menu_modal 보여지게 처리 : visibility, animate() - right 0px => 첫번째 요소에 포커스 강제 이동
		$openBtn.next().css('visibility', 'visible').stop().animate({
			right: 0
		});
		// 검색창 열기가 아닌 경우만 포커스 첫번째 요소에 넣어주기
		if ($first.attr('id') !== 'site_search_txt') {
			$first.focus();
		}


		// 3) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
		// $mdCnt.siblings().attr({
		// 	'aria-hidden': true,
		// 	inert: ''
		// });

		// 4) dim 동적생성후 모달 보여지게 처리 -> 첫번째 요소에 포커스 강제 이동
		$mdCnt.before('<div id="dim"></div>');
		const $dim = $('#dim');
		$dim.stop().fadeIn().next().css('visibility', 'visible').find('[data-link="first"]').focus();

		// 5) 닫기 버튼을 누르기 전까지 포커스 제어 -> 키보드 trapping
		// $first에서 shift+tab => $last강제이동
		$first.on('keydown', function (e) {
			console.log(e.keyCode); //tab => 9
			if (e.shiftKey && e.keyCode === 9) {
				e.preventDefault(); //shift+tab을 누르면 이전 요소에 포커스가 이동해야 하는데 기본 기능을 차단하기 위해 추가
				$last.focus();
			}
		});
		// $last에서 shift(X)+tab => $first 강제이동
		$last.on('keydown', function (e) {
			if (!e.shiftKey && e.keyCode === 9) {
				e.preventDefault();
				$first.focus();
			}
		});

		$closeBtn.on('click', function () {
			// 1) html, body에게 준 높이를 제거 -> removeAttr('style')
			$('html, body').removeAttr('style');

			// 2) #menu_modal 다시 닫아주기 : visibility, animate() - right 원래 위치 좌표값
			$(this).parents('.md_cnt').stop().animate({
				right: -800
			}, function () {
				// a) 열려진 모달도 숨기기
				$(this).css('visibility', 'hidden');
				// 열기버튼에 포커스 강제 이동후, 부모 div.search.on / div.menu.on => .on제거
				$openBtn.focus().parent().removeClass('on');
			});

			// 2) dim 보이지 않게 숨기고 -> 삭제
			$dim.stop().fadeOut(function () {
				$(this).remove();
			});
		});

		//  esc , #dim 클릭시 닫기버튼과 동일하게 처리
		$dim.on('click', function () {
			$closeBtn.trigger('click');
		});
		$(window).on('keydown', function (e) {
			console.log(e.keyCode); //esc => 27
			// if (e.keyCode === 27) $closeBtn.trigger('click');
			if (e.keyCode === 27) $closeBtn.click();
		});

		// 열려진 네비게이션 안에서 검색 열기를 클릭한 경우 => event 중복으로 오류 : 외부로 별도 분리
		// $('#search2Close').on('click', function () {
		// 	$closeBtn.click();
		// 	$('.util>.search>.md_open').click();
		// });
	});

	$('#search2Close').on('click', function () {
		$('.menu_close.md_close').click();
		$('.util>.search>.md_open').click();
	});

/* cnt5 nav */
// var $header = $('#header');
// 	var $gnb=$("#gnb > ul");
// 	$gnb.find(" li ul").hide();	//depth2의 ul 태그는 자동으로 숨기고 시작

// 	//언어선택
//   $('#lang button').on('mouseenter click', function () {
// 		var $btn = $(this);
//     $(this).next().stop().slideDown().parent().addClass('active');

//     $('#lang').on('mouseleave', function () {
//       $(this).find('ul').stop().slideUp().parent().removeClass('active');
//     });

// 		//언어선택이 열린채로 포커스가 나가면 닫아주자
// 		$(this).on('keydown', function (e) {
//       if (e.shiftKey && e.keyCode === 9) $('#lang').mouseleave();
//     });
//     $('#lang ul li:last a').on('keydown', function (e) {
//       if ( !e.shiftKey && e.keyCode === 9 ) $('#lang').mouseleave();
//     });
//   });

// 	//1)depth1 <a>에 마우스 진입:mouseenter, focus
// 	$gnb.find("> li > a").on("mouseenter focus",function  () {
// 		//초기화
// 		$gnb.find("> li.on").removeClass("on").children("ul").hide();
// 		//$header.removeClass('active');

// 		//현재설정
// 		$(this).parent().has('ul').closest($header).addClass('active');	//#header 너비의 100% 흰색바 생성을 위한 클래스명 추가
// 		$(this).next().show().parent().addClass("on");
// 	});

// 	//2)nav에서 마우스 떠나기:mouseleave
// 	$gnb.on("mouseleave",function  () {
// 		$header.removeClass('active');
// 		$gnb.find("> li.on").removeClass("on").children("ul").hide();
// 	});

// 	//3)blur: shift탭을 눌러서 gnb에서 포커스가 나가던지, 탭을 눌러 gnb에서 포커스가 나가던지, 
// 	$("#gnb a:first , #gnb a:last").on("blur",function  () {
// 		setTimeout(function  () {
// 			if ( !$("#gnb a").is(":focus") ) {
// 				$gnb.mouseleave();
// 			}1
// 		}, 10);
// 	});

// 	// top 이동
// 	$('.btn_top').on('click', function () {
// 		fullpage_api.moveTo(1); //본문1의 위치로 자동 이동시키기
// 		// 접근성을 위해 문서의 처음으로 포커스 강제 이동
// 		$('.logo a').focus();
// 	});

$('.cnt .view ul').each(function(){
	$(this).children().attr('aria-hidden', true);
	// 2) 앞에서 부터 3개만 aria-hidden: false로 바꾸기 .slice(시작인덱스, 종료인덱스) 종료인덱스 자신은 포함하지 않음
	$(this).children().slice(0, 1).attr('aria-hidden', false);
});

let $sliderUl;
$('.prev').on('click', function () {
	const $cnt = $(this).parents('.cnt');
	const $view = $cnt.find('article.view');
	$sliderUl = $view.find('ul');
	const oneSize = $sliderUl.children().outerWidth(true); /* = onceMove 1개씩만 움직임 */
	console.log($sliderUl,oneSize);
	console.log($cnt.attr('id'));
	
	if ($sliderUl.is(':animated')) return false;
	$sliderUl.prepend($sliderUl.children().last().clone()).css('marginLeft', -oneSize).animate({marginLeft: 0}, 1000, function () {
		$(this).children().last().remove();
		ariaHidden();
	});
	
	//if ($(this).parents('#cnt6'))  
});

$('.next').on('click', function () {
	const $cnt = $(this).parents('.cnt');
	const $view = $cnt.find('article.view');
	$sliderUl = $view.find('ul');
	const oneSize = $sliderUl.children().outerWidth(true);

  if ($sliderUl.is(':animated')) return false;
	$sliderUl.append($sliderUl.children().first().clone()).animate({marginLeft: -oneSize}, 1000, function () {
		$(this).css('marginLeft', 0).children().first().remove();
		ariaHidden();
	});
});

// 접근성 추가
function ariaHidden() {
	// 1) 모든 li를 aria-hidden: true 속성 설정
	$sliderUl.children().attr('aria-hidden', true);
	// 2) 앞에서 부터 3개만 aria-hidden: false로 바꾸기 .slice(시작인덱스, 종료인덱스) 종료인덱스 자신은 포함하지 않음
	$sliderUl.children().slice(0, 1).attr('aria-hidden', false);
}




	// top버튼 이동
	$('.btn_top').on('click', function () {
		fullpage_api.moveTo(1); //본문1의 위치로 자동 이동시키기
		// 접근성을 위해 문서의 처음으로 포커스 강제 이동
		$('.logo a').focus();
	});

	//
});