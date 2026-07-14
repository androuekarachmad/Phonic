document.addEventListener("DOMContentLoaded", () => {
  const components = document.querySelectorAll("[data-component]");

  components.forEach(async (el) => {
    const componentUrl = el.getAttribute("data-component");
    if (!componentUrl) return;

    try {
      const response = await fetch(componentUrl);
      if (response.ok) {
        const html = await response.text();
        el.innerHTML = html;
        
        // Ensure scripts inside the component are executed
        const scripts = el.querySelectorAll("script");
        scripts.forEach(script => {
          const newScript = document.createElement("script");
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
        });
      } else {
        console.error(`Failed to load component: ${componentUrl}`);
      }
    } catch (error) {
      console.error(`Error loading component ${componentUrl}:`, error);
    }
  });
});
