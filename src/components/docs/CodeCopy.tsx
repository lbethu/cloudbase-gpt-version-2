"use client";

import { useEffect } from "react";

/** Adds a copy button to every rendered code block inside `containerId`. */
export function CodeCopy({ containerId }: { containerId: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const blocks = root.querySelectorAll<HTMLElement>(".codeblock");
    const cleanups: Array<() => void> = [];
    blocks.forEach((block) => {
      if (block.querySelector(".cb-copy")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cb-copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
      const onClick = async () => {
        const code = block.querySelector("code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Copy failed";
        }
        setTimeout(() => (button.textContent = "Copy"), 1600);
      };
      button.addEventListener("click", onClick);
      block.appendChild(button);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });
    return () => cleanups.forEach((fn) => fn());
  }, [containerId]);
  return null;
}
