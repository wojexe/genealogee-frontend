import { clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import { twMerge } from "tailwind-merge";

/** @param {string[]} inputs */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const flyAndScale = (
  /** @type {Element} */ node,
  params = { y: -8, x: 0, start: 0.95, duration: 150 },
) => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  /**
   * @param {number}  valueA
   * @param {[number, number]} scaleA
   * @param {[number, number]} scaleB
   */
  const scaleConversion = (valueA, scaleA, scaleB) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  /**
   * @param {{ [x: string]: any; }} style
   */
  const styleToString = (style) => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return `${str}${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    /**
     * @param {number} t
     */
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};
