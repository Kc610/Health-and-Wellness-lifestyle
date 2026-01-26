
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill 'global' for libraries expecting a Node-like environment
(window as any).global = window;

const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // If the element isn't found, we log it and retry once if needed or just bail gracefully
    console.error("Critical Failure: Mount point 'root' not found in DOM.");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Use DOMContentLoaded to ensure the HTML is parsed before looking for #root
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
