import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

function RouteLoader() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    NProgress.set(0.4); // start ahead to feel quick

    const timer = setTimeout(() => {
      NProgress.done(); // finish after a moment
    }, 500); // adjust this to make it faster/slower

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return null;
}

export default RouteLoader;
