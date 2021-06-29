$(document).ready(function () {
  //열기 버튼 클릭 이벤트
  $('.md_open_btn').on('click', function () {
    //1) 필요한 변수 선언
    const $openBtn = $(this); //모달 닫기 버튼 클릭시 포커스 강제 이동을 위해
    //const $mdCnt = $( $(this).attr('data-targetmodal') );
    const $mdCnt = $( $(this).data('targetmodal') );
    //console.log($mdCnt, typeof $mdCnt); //string타입을 $()로 감싸서 선택자로 변경함 
    const $closeBtn = $mdCnt.find('.btn_close_modal');
    const $first = $mdCnt.find('.first');
    const $last = $mdCnt.find('.last');
    let timer = 0;

    // 태블릿과 모바일에서 모달창 클릭하면 본문1로 올라가는 것 차단
    const scrollY = $(window).scrollTop();  //스크롤바가 움직인 거리
    const wrapHei = $('#wrap').height();    //문서 전체의 높이를 구하기
    console.log(scrollY, wrapHei);

    //2) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어(보조기술이 미구현 되어서 추가해 줌) aria-hidden="true" inert(비활성, 불활성)
    $mdCnt.siblings().attr({'aria-hidden': true, inert: true});

    /* 3) #dim 동적 생성 : 열려질 상세 모달의 바로 앞에 동적 생성
    $('부모').prepend('자식'); 어디에 무엇을 생성할것인지?
    $('기준').before('동적생성할 태그'); */
    $mdCnt.before('<div id="dim"></div>');
    const $dim =$('#dim');

    //4) resize 이벤트로 열려질 모달의 위치 제어
    $(window).on('resize', function () {
      clearTimeout(timer);

      timer = setTimeout(function () {
        const x = ($(this).width() - $mdCnt.outerWidth()) / 2;
        const y = ($(this).height() - $mdCnt.outerHeight()) / 2;
        //console.log(x, y);
        $mdCnt.css({left: x, top: y});

        if ($(this).width() <= 1080) {
          $(window).scrollTop(scrollY);
          $('html, body').css({height: wrapHei, overflow: 'hidden'});
        }
      }, 50);
    });
    $(window).trigger('resize'); //resize 이벤트를 강제로 실행시켜 모달을 가운데 위치 시킴

    //5) 위치 제어가 끝나면 #dim, 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
    $dim.stop().fadeIn('fast').next().css('visibility', 'visible');
    $first.focus();

    /* 비디오 재생과 정지
    $('#호출할비디오의 아이디명').get(0).play();
    $('#호출할비디오의 아이디명').get(0).pause();
    $('#호출할비디오의 아이디명').get(0).currentTime = 0; 재생이 시작되는 시간을 초로 지정

    .get() 선택한 요소를 배열로 반환
    */
    //비디오를 자동 실행
    $('#infoVideo').get(0).play();

    // 6) 접근성을 위해 추가 : 닫기 버튼을 누르기 전까지 포커스는 모달 내부에 존재해야 함
    //첫번째 링크에서 shift+tab을 누르면 가장 마지막으로 포커스 강제이동
    $first.on('keydown', function (e) {
      //console.log(e.keyCode); //tab 9
      if (e.shiftKey && e.keyCode === 9) {
        e.preventDefault();   //이전으로 되돌아가는 기본 기능 차단
        $last.focus();
      }
    });

    //마지막 링크에서 shift(X)+tab을 누르면 가장 처음으로 포커스 강제이동
    $last.on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode === 9) {
          e.preventDefault(); //기본 기능차단
          $first.focus();     //포커스 처음으로
      }
    });

    //닫기 버튼 클릭 이벤트
    $closeBtn.on('click', function () {
      //1) dim 투명도 0으로 사라지기(완료함수로 remove()로 제거) 
      $dim.stop().fadeOut('fast', function () {
        $(this).remove();
      });
      //2) 모달컨텐츠 숨기기(visibility) => 모달상세컨텐츠의 나머지 형제들을 스크린리더에서 접근할수 있도록 되돌리기(속성제거 - aria-hidden, inert)
      $mdCnt.css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');

      //3) 열기 버튼으로 포커스 강제 이동
      $openBtn.focus();

      //4) 비디오를 정지, 0초로 만들기
      $('#infoVideo').get(0).pause();
      $('#infoVideo').get(0).currentTime = 0;

      if ($(window).width() <= 1080) {
        $('html, body').removeAttr('style');
      }
    });

    //#dim을 클릭하는 경우도 닫겨진다
    $dim.on('click', function () {
      $closeBtn.trigger('click');
    });
    //esc 키보드를 누른 경우도 닫겨진다
    $(window).on('keydown', function (e) {
      //console.log(e.keyCode); //esc 27
      if (e.keyCode === 27) $closeBtn.click();
    });
  });

});