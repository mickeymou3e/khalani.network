
// header fixed

window.onscroll=function(){
  const docScrollTop=document.documentElement.scrollTop;

  if(window.innerWidth>991){
    if(docScrollTop>100){
      document.querySelector("header").classList.add("fixed")
    }
    else{
    document.querySelector("header").classList.remove("fixed")	
    }
  }
} 


// navbar links

const navbar = document.querySelector(".navbar");
a=navbar.querySelectorAll("a");

a.forEach(function(element){
    element.addEventListener("click",function(){
     for(let i=0; i<a.length; i++){
         a[i].classList.remove("active");
     }
        this.classList.add("active")
        document.querySelector(".navbar").classList.toggle("show");
    })
})

// ham-burger

const hamBurger=document.querySelector(".ham-burger");

hamBurger.addEventListener("click",function(){
document.querySelector(".navbar").classList.toggle("show");
})



// SIDEBAR

  $(document).ready(function() {

    function toggleSidebar() {
      $(".openSidebar").toggleClass("active");
      $("main").toggleClass("move-to-left");
      $(".sidebar-item").toggleClass("active");
    }
  
    $(".button").on("click tap", function() {
      toggleSidebar();
    });
  
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        toggleSidebar();
      }
    });
  
  });

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  $(document).ready(function() {
      $('.investments').hide(0);
      $('.reviews').hide(0);

      $('.btn-investment').click(function() {
        $('.investments').show(0);
        $('.banking').hide(0);
        $('.reviews').hide(0);
        $('.btn-banking').removeClass('btn-active');
        $('.btn-investment').addClass('btn-active');
        $('.btn-reviews').removeClass('btn-active')
      })

      $('.btn-banking').click(function() {
        $('.investments').hide(0);
        $('.banking').show(0);
        $('.reviews').hide(0);
        $('.btn-banking').addClass('btn-active');
        $('.btn-investment').removeClass('btn-active');
        $('.btn-reviews').removeClass('btn-active')
      })

      $('.btn-reviews').click(function() {
        $('.investments').hide(0);
        $('.banking').hide(0);
        $('.reviews').show(0);
        $('.btn-banking').removeClass('btn-active');
        $('.btn-investment').removeClass('btn-active');
        $('.btn-reviews').addClass('btn-active')
      })
  })