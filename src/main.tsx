import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide loading screen when app mounts
const loadingScreen = document.getElementById("loading-screen");
if (loadingScreen) {
  loadingScreen.style.display = "none";
}

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker with update checking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Listen for controller change (new service worker activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Optionally show update notification
          console.log('App has been updated');
        });
      })
      .catch(() => {
        // Service worker registration failed, continue without it
      });
  });
}

