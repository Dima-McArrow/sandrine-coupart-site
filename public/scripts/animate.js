window.onload = function () {
  if (window.innerWidth > 768) {
    setTimeout(function () {
      const parTwo = document.querySelector(".the_pres_one");
      if (parTwo) {
        parTwo.style.left = "1.5%";
        parTwo.style.opacity = "1";
      }
    }, 700);

    setTimeout(function () {
      const parThree = document.querySelector(".the_pres_two");
      if (parThree) {
        parThree.style.opacity = "1";
      }
    }, 2000);

    document.querySelectorAll(".card_wrapper").forEach((element) => {
      const hrTop = element.querySelector(".card_hr_top");
      const hrBottom = element.querySelector(".card_hr_bottom");
      const name = element.querySelector(".service_name");
      const text = element.querySelector(".service_text");
      const container = element.querySelector(".service_card");

      element.addEventListener("mouseenter", function () {
        console.log("mouse in");

        hrTop.style.top = "-100%";
        hrBottom.style.top = "-100%";
        name.style.top = "-100%";
        text.style.top = "-30%";
        hrTop.style.opacity = "0";
        hrBottom.style.opacity = "0";
        name.style.opacity = "0";
        text.style.opacity = "1";
        container.style.backgroundColor = "#DC9A7D";
      });

      element.addEventListener("mouseleave", function () {
        console.log("mouse out");

        hrTop.style.top = "30%";
        hrBottom.style.top = "30%";
        name.style.top = "30%";
        text.style.top = "100%";
        hrTop.style.opacity = "1";
        hrBottom.style.opacity = "1";
        name.style.opacity = "1";
        text.style.opacity = "0";
        container.style.backgroundColor = "#F3F3F7";
      });
    });
  }
};
