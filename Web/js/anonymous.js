window.onload = function() { 
    setTimeout(function(){
        $(".load").fadeIn(1500);
        $(".load").fadeOut(1500);
    },500)
    
    setTimeout(function(){
      $(".waitloading").css("opacity","1");
    },4000)
};

$(function(){
	$('#BackTop').click(function(){ 
		$('html,body').animate({scrollTop:0}, 333);
	});
	$(window).scroll(function() {
		if ( $(this).scrollTop() > 10 ){
			$('#BackTop').fadeIn(10);
		} else {
			$('#BackTop').stop().fadeOut(222);
		}
	}).scroll();
});