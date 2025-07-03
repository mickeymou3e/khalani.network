
  // gallery item filter
  const filterButtons=document.querySelector("#filter-btns").children;
  const items=document.querySelector(".portfolio-gallery").children;

   for(let i=0; i<filterButtons.length; i++){
   	 filterButtons[i].addEventListener("click",function(){
   	 	for(let j=0; j<filterButtons.length; j++){
   	 		filterButtons[j].classList.remove("active") 

   	 	}
   	 	this.classList.add("active");
        const target=this.getAttribute("data-target")
      
   	 	for(let k=0; k<items.length; k++){
   	 		items[k].style.display="none";
            if(target==items[k].getAttribute("data-id"))
            {
            	items[k].style.display="block";
            }
            if(target=="all"){
                items[k].style.display="block";	
            }
   	 	}

   	 	

   	 })
   }
   


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


  //animation
var test = document.getElementById("animation");

var text = "Konrad Bieniek";
var result = "";
//Press rerun button to see effect
window.addEventListener("load", (event) => {
  for (let i = 0; i < text.length; i++) {
    setTimeout(function () {
      result += text[i];
      test.innerHTML = result;
    }, 180 * i);
  }
});




 




