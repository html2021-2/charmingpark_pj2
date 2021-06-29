$(function(){
  /* 스크롤을 내리면 headerTop이 .on을 갖도록 */
  $(window).on('scroll', function(){
    if ($(this).scrollTop()>10){
      $('#header')
    }else{

    }
  });

});