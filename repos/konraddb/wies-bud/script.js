// header fixed

window.onscroll = function () {
  const docScrollTop = document.documentElement.scrollTop;

  if (window.innerWidth > 991) {
    if (docScrollTop > 100) {
      document.querySelector("header").classList.add("fixed");
      $(".skills-addition").css({
        "background-color": "#ffffff",
        padding: "20px",
      });
      $(".skills-addition li").css("color", "#000000");
    } else {
      document.querySelector("header").classList.remove("fixed");
      $(".skills-addition li").css("color", "#ffffff");
      $(".skills-addition").css({ background: "none", padding: "0" });
    }
  }
};

// navbar links

const navbar = document.querySelector(".navbar");
a = navbar.querySelectorAll("a");

a.forEach(function (element) {
  element.addEventListener("click", function () {
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
    }
    this.classList.add("active");
    document.querySelector(".navbar").classList.toggle("show");
  });
});

$(".nav-skills").hover(
  function () {
    $(".skills-addition").show();
  },
  function () {
    $(".skills-addition").hide();
  }
);
// ham-burger

const hamBurger = document.querySelector(".ham-burger");

hamBurger.addEventListener("click", function () {
  document.querySelector(".navbar").classList.toggle("show");
});

//MODALS AND APPOINTMENTS SCRIPTS

$("#btnDetailsCollectionFlat").click(function () {
  $("#modalDetailsCollectionFlat").show();
});

$("#btnDetailsCollectionHouse").click(function () {
  $("#modalDetailsCollectionHouse").show();
});

$("#btnDetailsManagement").click(function () {
  $("#modalDetailsManagement").show();
});

$("#btnDetailsQuantities").click(function () {
  $("#modalDetailsQuantities").show();
});

$("#btnDetailsEstimate").click(function () {
  $("#modalDetailsEstimate").show();
});

$(".appointment-modal-show").click(function () {
  $("#modalAppointment").show();
});

$(".close").click(function () {
  $("#modalDetailsCollectionFlat").hide();
  $("#modalDetailsCollectionHouse").hide();
  $("#modalDetailsManagement").hide();
  $("#modalDetailsQuantities").hide();
});

$(document).on("click", function (event) {
  if (
    !$(event.target).closest(".modal-content").length &&
    !$(event.target).closest(".appointment-modal-show").length
  ) {
    $("#modalAppointment").hide();
  }
});
