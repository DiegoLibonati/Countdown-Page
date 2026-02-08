import "@/index.css";
import { CountdownPage } from "@/pages/CountdownPage/CountdownPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (app) {
    const countdownPage = CountdownPage();
    app.appendChild(countdownPage);
  }
};

document.addEventListener("DOMContentLoaded", onInit);
