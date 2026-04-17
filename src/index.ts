import "@/index.css";
import ZeroHourPage from "@/pages/ZeroHourPage/ZeroHourPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const zeroHourPage = ZeroHourPage();
  app.appendChild(zeroHourPage);
};

document.addEventListener("DOMContentLoaded", onInit);
