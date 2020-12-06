window.onload = function() { 
    setTimeout(function(){
        $(".load").fadeIn(1500);
        $(".load").fadeOut(1500);
    },500)
    
    setTimeout(function(){
      $(".waitloading").css("opacity","1");
    },4000)
};
