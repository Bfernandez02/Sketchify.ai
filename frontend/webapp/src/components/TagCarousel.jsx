import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";

export default function TagCarousel({ children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: true, align: "start" });
  const scrollInterval = useRef(null);

  const startAutoscroll = () => {
    if (!emblaApi) return;
    stopAutoscroll(); // Prevent duplicate intervals
    scrollInterval.current = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      }
    }, 1000); // Adjust interval for desired speed
  };

  const stopAutoscroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    if (emblaApi) {
      emblaApi.scrollTo(0); // Reset to the start on hover exit
    }
  };

  useEffect(() => {
    return () => stopAutoscroll(); // Cleanup interval on unmount
  }, []);

  return (
    <div
      className="relative h-6 overflow-hidden whitespace-nowrap"
      ref={emblaRef}
      onMouseEnter={startAutoscroll}
      onMouseLeave={stopAutoscroll}
    >
      <div className="flex select-none gap-2 mr-6">{children}</div>
      <div className="pointer-events-none absolute top-0 h-full w-full bg-gradient-to-r from-transparent from-90% to-white" />
    </div>
  );
}
