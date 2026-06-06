// import {StrictMode} from 'react';
// import {createRoot} from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// ✅ GLOBAL STYLE SHIELD: Catch and sanitize illegal runtime @import injections 
// from third-party libraries before they can trigger a browser crash.
if (typeof CSSStyleSheet !== 'undefined' && CSSStyleSheet.prototype.insertRule) {
  const originalInsertRule = CSSStyleSheet.prototype.insertRule;
  CSSStyleSheet.prototype.insertRule = function (rule, index) {
    if (typeof rule === 'string' && rule.includes('@import')) {
      console.warn("Bypassed an invalid runtime style @import to prevent page crash:", rule);
      return 0; // Safely skip this rule without crashing the page
    }
    return originalInsertRule.call(this, rule, index);
  };
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
