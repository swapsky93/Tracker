// import {StrictMode} from 'react';
// import {createRoot} from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// ✅ COMPLETE STYLE SHIELD: Catch and scrub illegal @import injections 
// from third-party libraries across all dynamic stylesheet entry points.
if (typeof CSSStyleSheet !== 'undefined') {
  // 1️⃣ Intercept insertRule
  if (CSSStyleSheet.prototype.insertRule) {
    const originalInsertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function (rule, index) {
      if (typeof rule === 'string' && rule.includes('@import')) {
        console.warn("Bypassed invalid insertRule(@import):", rule);
        return 0;
      }
      return originalInsertRule.call(this, rule, index);
    };
  }

  // 2️⃣ Intercept replaceSync
  if (CSSStyleSheet.prototype.replaceSync) {
    const originalReplaceSync = CSSStyleSheet.prototype.replaceSync;
    CSSStyleSheet.prototype.replaceSync = function (cssText) {
      if (typeof cssText === 'string' && cssText.includes('@import')) {
        console.warn("Sanitized replaceSync(@import)");
        // Strip out the @import statement but preserve the rest of the layout CSS
        const cleanedCss = cssText.replace(/@import[\s\S]*?;/g, '');
        return originalReplaceSync.call(this, cleanedCss);
      }
      return originalReplaceSync.call(this, cssText);
    };
  }

  // 3️⃣ Intercept replace (Async)
  if (CSSStyleSheet.prototype.replace) {
    const originalReplace = CSSStyleSheet.prototype.replace;
    CSSStyleSheet.prototype.replace = function (cssText) {
      if (typeof cssText === 'string' && cssText.includes('@import')) {
        console.warn("Sanitized async replace(@import)");
        const cleanedCss = cssText.replace(/@import[\s\S]*?;/g, '');
        return originalReplace.call(this, cleanedCss);
      }
      return originalReplace.call(this, cssText);
    };
  }
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
