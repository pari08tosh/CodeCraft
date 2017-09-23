$(function() {
  $(window).scroll(function() {
    if ($(document).scrollTop() > 800) {
      $(".go-to-top-btn").fadeIn(300);
    } else {
      $(".go-to-top-btn").fadeOut(300);
    }
  });
  $('.go-to-top-btn').click(function() {
    $('html,body').animate({
      scrollTop: 0
    }, 'slow');
    return false;
  });
  
});
