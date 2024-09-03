let orderClick = function (underline) {
  const link = document.querySelectorAll(".order__info__link");
  link.forEach((element) => {
    if (element.hasAttribute("data-active", "yes")) {
      element.setAttribute("data-active", "");
    }
  });
  underline.setAttribute("data-active", "yes");
};
