import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      
      // href属性が#で始まるリンクのみ処理
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        const href = target.getAttribute("href");
        if (!href || href === "#") return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const navHeight = 56; // ナビゲーションの高さ
          
          window.scrollTo({
            top: offsetTop - navHeight,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
