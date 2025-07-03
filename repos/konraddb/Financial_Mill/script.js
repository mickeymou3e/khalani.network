var app = new Vue({
  el: '#app',
  data: {
      currentSlide: 0,
      isPreviousSlide: false,
      isFirstLoad: true,
      slides: [
          // {
          //     headlineFirstLine: "Otwarte Konto Oszczędnościowe",
          //     headlineSecondLine: "Jedno oko na maroko drugie w banku",
          //     sublineFirstLine: "#bankowość #wpis",
          //     bgImg: "images/eye-3440464_1920.jpg",
          //     rectImg: "images/eye-3440464_1920.jpg",
          //     hrefLink: "readpageoko/readpage.html"
          // },
          {
              headlineFirstLine: "Rachunek Oszczędnościwo-Rozliczeniowy",
              headlineSecondLine: "Pierwszym krokiem do bogactwa...",
              // sublineFirstLine: "Il n'y a rien de neuf sous",
              // sublineSecondLine: "le soleil",
              bgImg: "images/piggy-bank-2889046_1920.jpg",
              rectImg: "images/piggy-bank-2889046_1920.jpg",
              hrefLink: "readpageror/readpage.html"
          },
          {
              headlineFirstLine: "Lokata",
              headlineSecondLine: "Zamrażarka z kostkami lodu",
              // sublineFirstLine: "Τίποτα καινούργιο κάτω από",
              // sublineSecondLine: "τον ήλιο",
              bgImg: "images/ice-cubes-3506781_1920.jpg",
              rectImg: "images/ice-cubes-3506781_1920.jpg",
              hrefLink: "readpagelokata/readpage.html"
          },
          {
            headlineFirstLine: "Obligacje",
            headlineSecondLine: "Chcesz być właścicielem Polski? Nie ma problemu?",
            // sublineFirstLine: "Τίποτα καινούργιο κάτω από",
            // sublineSecondLine: "τον ήλιο",
            bgImg: "images/key-2486606_1920.jpg",
            rectImg: "images/key-2486606_1920.jpg",
            hrefLink: "readpageobligacje/readpage.html"
        }
      ]
  },
mounted: function () {
  var productRotatorSlide = document.getElementById("app");
      var startX = 0;
      var endX = 0;

      productRotatorSlide.addEventListener("touchstart", (event) => startX = event.touches[0].pageX);

      productRotatorSlide.addEventListener("touchmove", (event) => endX = event.touches[0].pageX);

      productRotatorSlide.addEventListener("touchend", function(event) {
          var threshold = startX - endX;

          if (threshold < 150 && 0 < this.currentSlide) {
              this.currentSlide--;
          }
          if (threshold > -150 && this.currentSlide < this.slides.length - 1) {
              this.currentSlide++;
          }
      }.bind(this));
},
  methods: {
      updateSlide(index) {
          index < this.currentSlide ? this.isPreviousSlide = true : this.isPreviousSlide = false;
          this.currentSlide = index;
          this.isFirstLoad = false;
      }
  }
})



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

// slider home

const slides = document.querySelector('.slider').children;
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const indicator = document.querySelector('.indicator');
let index = 0;

  prev.addEventListener('click', function(){
    prevSlide();
    updateCircleIndicator();
    resetTimer();
  })

  next.addEventListener('click', function(){
    nextSlide();
    updateCircleIndicator();
    resetTimer();
  })

  function circleIndicator() {
    for(let i=0; i<slides.length; i++) {
        const div = document.createElement('div');
              div.setAttribute('onclick', 'indicateSlide(this)');
              div.id="1";
              if(i == 0) {
                div.className='active';
              }
              indicator.appendChild(div);
    }
  }

  circleIndicator();

  function indicateSlide(element) {
    index = element.id;
    changeSlide();
    updateCircleIndicator();
    resetTimer();
  }

  function updateCircleIndicator() {
    for(let i=0; i < indicator.children.length; i++) {
      indicator.children[i].classList.remove('active');
    }
    indicator.children[index].classList.add('active');
  }

  function prevSlide(){
    if(index == 0){
      index=slides.length-1;
    } else {
      index--;
    }
    changeSlide();
  }

  function nextSlide(){
    if(index == slides.length-1) {
      index=0;
    } else {
      index++;
    }
    changeSlide();
  }

  function changeSlide() {
    for(let i=0; i<slides.length; i++) {
      slides[i].classList.remove('active');
    }

    slides[index].classList.add('active');
  }

  function resetTimer(){
    clearInterval(timer);

    timer=setInterval(autoPlay,6000);
  }

  function autoPlay(){
    nextSlide();
    updateCircleIndicator();
  }

  let timer=setInterval(autoPlay,6000);

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

    $('.test').parallaxie({
      speed: 0.5,
      offset: 50,
    });
  
  });

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  
