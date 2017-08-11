$(function() {
  $('app-root').hide(0);
  $('.load-image').fadeIn(500);
  setTimeout(function() {
    $('.load-screen').fadeOut(500);
    $('app-root').fadeIn();
  }, 1500);
});
