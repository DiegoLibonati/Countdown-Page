import { CountdownProps } from "@src/entities/props";

export const Countdown = ({
  id,
  count,
  title,
}: CountdownProps): HTMLDivElement => {
  const divRoot = document.createElement("div");
  divRoot.className = "flex items-center justify-center flex-col";
  divRoot.id = id;

  divRoot.innerHTML = `
        <h4 class="py-3 px-2 bg-primary bg-opacity-75 rounded-lg text-white font-bold mb-2">
            ${count}
        </h4>
        <span class="text-secondary">${title}</span>
    `;

  return divRoot;
};
