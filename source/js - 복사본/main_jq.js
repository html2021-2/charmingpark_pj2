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
	const $gnb = $('.menu.on #menu_modal .main_menu > ul');

	//1) depth2 ul 숨기기
	$gnb.find('ul').hide();

	//2) 현재페이지 활성화를 위해 li.on 넣기위해 변수 선언
	const dep1 = $('body').data('dep-one') - 1;
	const dep2 = $('body').data('dep-two') - 1;
	console.log("depth1? " + dep1 + " , depth2? " + dep2);

	//3) depth1 a - mouseenter focus
	$gnb.find('> li > a').on('mouseenter focus', function () {
		//초기화
		$gnb.find('> li.on').removeClass('on').children('ul').hide();
		$header.removeClass('active');

		//활성화
		$(this).parent().has('ul').closest($header).addClass('active'); //100% 너비의 밑줄 바 생성을 위한 클래스명 추가
		$(this).next().show().parent().addClass('on');
	});

	//4) $gnb에서 마우스가 벗어나면 mouseleave => 활성화 상태를 초기화면으로 되돌림
	$gnb.on('mouseleave', function () {
		//마우스가 떠나기전 마지막 활성화상태를 초기화
		$header.removeClass('active');
		$gnb.find('> li.on').removeClass('on').children('ul').hide();
		//body id="nav_3_1"을 통해 선언한 dep1과 dep2 변수에 맞는 li.on 추가
		if (dep1 >= 0) $gnb.children().eq(dep1).addClass('on').find('ul li').eq(dep2).addClass('on');
	});

	//5) $gnb에서 가장 첫번째와 마지막 a에서 blur 된 경우 - 초기화면으로 되돌리기(조건을 만족하는 경우만)
	$gnb.find('a:first, a:last').on('blur', function () {
		setTimeout(function () {
			//#gnb안에 있는 a태그가 포커스를 가지지 않는 경우만
			if (!$gnb.find('a').is(':focus')) $gnb.trigger('mouseleave');
		}, 10);
	});

	//6) 페이지 로딩후 보여질 화면 => li.on 넣어서 스타일이 적용된 화면
	if (dep1 >= 0) $gnb.trigger('mouseleave');

	$('.md_open').on('click', function () {
		// 1) 변수선언 : 열기버튼, 열려질 상세 모달 내용, 닫기버튼, 포커스를 처음가질 요소, 포커스를 마지막에 가질 요소
		const $openBtn = $(this);
		const $mdCnt = $($(this).data('href'));

		// console.log($mdCnt, typeof $mdCnt);

		const $closeBtn = $mdCnt.find('.md_close');
		const $first = $mdCnt.find('[data-link="first"]');
		// const $first = $mdCnt.find('.first');
		const $last = $mdCnt.find('[data-link="last"]');

		// 2) 현재의 스크롤 그대로 유지 : #wrap 높이값 -> html, body에게 적용
		const wrapHei = $('#wrap').outerHeight();
		$('html, body').css({
			height: wrapHei,
			overflow: 'hidden'
		});

		// 3) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
		$mdCnt.siblings().attr({
			'aria-hidden': true,
			inert: ''
		});

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


			// 2) dim 보이지 않게 숨기고 -> 삭제
			$dim.stop().fadeOut(function () {
				$(this).remove();
			});

			// 3-1) 열려진 모달도 숨기기
			// 3-2) 열려진 모달을 제외한 나머지에 스크린리더 접근 허용: aria-hidden, inert을 제거
			$mdCnt.css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');

			// 4) 모달열기 버튼에 포커스 강제 이동
			$openBtn.focus();
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
	});


});