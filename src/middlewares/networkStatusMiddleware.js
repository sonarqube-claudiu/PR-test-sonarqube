import { toast } from "react-toastify";
import { setNetworkStatus } from "../features/networkSlice";

// Outer function to set up event listeners
export const createNetworkStatusMiddleware = () => {
  let listenersAdded = false;

  const handleNetworkStatusChange = store => {
    store.dispatch(setNetworkStatus(navigator.onLine));
  };

  // Actual middleware function
  return store => next => action => {
    // Add the event listeners only once
    if (!listenersAdded) {
      window.addEventListener('online', () => handleNetworkStatusChange(store));
      window.addEventListener('offline', () => handleNetworkStatusChange(store));
      listenersAdded = true;
    }

    return next(action);
  };
};

// Usage:
// const networkStatusMiddleware = createNetworkStatusMiddleware();
