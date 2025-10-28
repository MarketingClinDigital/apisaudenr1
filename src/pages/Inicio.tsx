import React from "react";
import { useNavigate } from "react-router-dom";
import PlasmicPage from "@/components/PlasmicPage";

const Inicio: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const target = containerRef.current;
    if (!target) {
      return;
    }

    const boundElements = new Set<HTMLElement>();

    const handleNavigate = (event: Event) => {
      event.preventDefault();
      navigate("/home");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigate("/home");
      }
    };

    const enhanceCta = () => {
      const candidates = target.querySelectorAll<HTMLElement>(
        "a, button, div, span"
      );

      candidates.forEach((element) => {
        if (!element.textContent) {
          return;
        }

        const normalized = element.textContent.trim().toLowerCase();
        if (normalized === "quero conhecer" && !boundElements.has(element)) {
          element.style.cursor = "pointer";
          element.setAttribute("role", "button");
          element.setAttribute("tabindex", "0");
          element.setAttribute("aria-label", "Ir para a página Home");
          element.addEventListener("click", handleNavigate);
          element.addEventListener("keydown", handleKeyDown);
          boundElements.add(element);
        }
      });
    };

    const mutationObserver = new MutationObserver(enhanceCta);
    mutationObserver.observe(target, { childList: true, subtree: true });
    enhanceCta();

    return () => {
      mutationObserver.disconnect();
      boundElements.forEach((element) => {
        element.removeEventListener("click", handleNavigate);
        element.removeEventListener("keydown", handleKeyDown);
      });
      boundElements.clear();
    };
  }, [navigate]);

  return (
    <div ref={containerRef}>
      <PlasmicPage pagePath="/home" />
    </div>
  );
};

export default Inicio;
