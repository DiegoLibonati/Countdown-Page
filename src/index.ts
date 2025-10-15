import { CountdownPage } from "@src/pages/CountdownPage/CountdownPage";

const onInit = () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const countdownPage = CountdownPage();
  app.appendChild(countdownPage);
};

document.addEventListener("DOMContentLoaded", onInit);
