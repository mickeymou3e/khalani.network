async function loadMermaid() {
  if (window.mermaid) {
    // console.log('[MermaidThemer] Mermaid already loaded.');
    return window.mermaid;
  }
  // console.log('[MermaidThemer] Mermaid not found, loading from CDN...');
  try {
    const mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.esm.min.mjs');
    window.mermaid = mermaidModule.default; // Assuming the default export is the mermaid object
    // console.log('[MermaidThemer] Mermaid loaded successfully from CDN.');
    return window.mermaid;
  } catch (error) {
    console.error('[MermaidThemer] Failed to load Mermaid from CDN:', error);
    return null;
  }
}

async function renderMermaidDiagrams() {
  const mermaid = await loadMermaid();
  if (!mermaid) {
    console.error('[MermaidThemer] Mermaid library not available. Skipping rendering.');
    return;
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  // console.log(`[MermaidThemer] Rendering diagrams for theme: ${currentTheme}`);

  let themeConfig = { 
    theme: 'default', 
    // securityLevel: 'loose' // Apply globally or conditionally
  };

  if (currentTheme === 'dark') {
    themeConfig = {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: document.documentElement.style.getPropertyValue('--sl-color-bg') || '#101010', // Use site dark bg
        textColor: '#f0f0f0',
        lineColor: '#c0c0c0',
        primaryColor: '#282828', // Darker node bg for contrast with page
        primaryTextColor: '#f0f0f0',
        primaryBorderColor: '#555555',
        actorBkg: '#333333',
        actorTextColor: '#f0f0f0',
        actorBorderColor: '#555555',
        signalColor: '#f0f0f0',
        signalTextColor: '#f0f0f0',
        noteBkgColor: '#4a4a30', // Darker olive for notes
        noteTextColor: '#f0f0f0',
        noteBorderColor: '#6b6b45',
        defaultLinkColor: '#c0c0c0',
        // Add specific theme variables for other diagram types if needed
      }
    };
  }
  
  try {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose', // important for HTML labels in diagrams
      ...themeConfig // Spread the theme or themeVariables
    });
    // console.log('[MermaidThemer] Mermaid initialized with config:', JSON.parse(JSON.stringify(themeConfig)));

    const mermaidPres = document.querySelectorAll('pre.mermaid');
    // console.log(`[MermaidThemer] Found ${mermaidPres.length} pre.mermaid elements.`);

    for (let i = 0; i < mermaidPres.length; i++) {
      const preElement = mermaidPres[i];
      const id = `mermaid-client-${Date.now()}-${i}`;
      let originalCode = preElement.getAttribute('data-original-mermaid-code');

      if (!originalCode) {
        const codeElement = preElement.querySelector('code.language-mermaid');
        if (codeElement) {
            originalCode = codeElement.textContent || codeElement.innerText;
        } else {
            originalCode = preElement.textContent || preElement.innerText;
        }
        
        if (originalCode && originalCode.trim()) {
          preElement.setAttribute('data-original-mermaid-code', originalCode.trim());
          // console.log(`[MermaidThemer] Stored original code for element #${i}`);
        } else {
          // console.warn(`[MermaidThemer] No original code found for element #${i}. Content:`, preElement.innerHTML);
          continue; 
        }
      }
      
      originalCode = preElement.getAttribute('data-original-mermaid-code');

      if (originalCode) {
        // console.log(`[MermaidThemer] Rendering element #${i} with ID ${id} using stored code.`);
        preElement.innerHTML = ''; 
        preElement.removeAttribute('data-processed');

        try {
          const { svg } = await mermaid.render(id, originalCode);
          preElement.innerHTML = svg;
        } catch (error) {
          console.error(`[MermaidThemer] Error rendering element #${i} (ID: ${id}):`, error, originalCode);
          preElement.innerHTML = `<p style="color:red; font-family:monospace;">Error rendering diagram. Check console. Code: <br><pre>${originalCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></p>`;
        }
      }
    }
    // console.log('[MermaidThemer] Mermaid rendering pass completed.');
  } catch (error) {
    console.error('[MermaidThemer] Error during Mermaid init or main rendering loop:', error);
  }
}

// console.log('[MermaidThemer] Script loaded (client-side strategy v2).');

// Export renderMermaidDiagrams to window for use by other scripts
window.renderMermaidDiagrams = renderMermaidDiagrams;

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedRenderMermaidDiagrams = debounce(renderMermaidDiagrams, 100);

function initialRender() {
    // console.log('[MermaidThemer] Event triggered initial render call.');
    // Using debounce here as well, as multiple events might fire close together on load
    debouncedRenderMermaidDiagrams();
}

document.addEventListener('DOMContentLoaded', initialRender);
document.addEventListener('astro:page-load', initialRender);

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      // console.log('[MermaidThemer] data-theme attribute changed, queueing re-render.');
      debouncedRenderMermaidDiagrams();
      break;
    }
  }
});

observer.observe(document.documentElement, { attributes: true });
// console.log('[MermaidThemer] MutationObserver observing document.documentElement.');

document.addEventListener('astro:after-swap', () => {
    // console.log('[MermaidThemer] astro:after-swap event, queueing re-render.');
    debouncedRenderMermaidDiagrams();
});

if (document.readyState !== 'loading') {
    if (document.querySelector('pre.mermaid')) {
        // console.log('[MermaidThemer] DOM already interactive, queueing initial render (early).');
        Promise.resolve().then(initialRender);
    }
} 