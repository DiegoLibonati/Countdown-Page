export const getElements = () => ({
  giveawayContainer: document.querySelector(
    ".info-center h4"
  ) as HTMLHeadingElement,
  times: document.querySelectorAll(".cd-center h4") as NodeList,
  countdownOverContainer: document.querySelector(
    ".countdown-container"
  ) as HTMLDivElement,
});
