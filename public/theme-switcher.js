(() => {
  const KEY = "ebagzunlock-site-theme";
  const root = document.documentElement;
  const readTheme = () => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === "dark" ? "dark" : "light";
    } catch (_) {
      return "light";
    }
  };
  const apply = (theme) => {
    const selected = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-site-theme", selected);
    try { localStorage.setItem(KEY, selected); } catch (_) {}
    const button = document.querySelector(".site-header .theme-toggle");
    if (button) {
      const nextLabel = selected === "dark" ? "Activer le thème clair" : "Activer le thème sombre";
      button.setAttribute("aria-pressed", selected === "dark" ? "true" : "false");
      button.setAttribute("aria-label", nextLabel);
      button.setAttribute("title", nextLabel);
    }
  };
  apply(readTheme());
  const install = () => {
    const picker = document.querySelector(".site-header .language-picker");
    if (!picker || document.querySelector(".site-header .theme-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 15.2A8.8 8.8 0 0 1 8.8 3.5 8.9 8.9 0 1 0 20.5 15.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    picker.parentNode.insertBefore(button, picker);
    apply(readTheme());
    button.addEventListener("click", () => {
      apply(root.getAttribute("data-site-theme") === "dark" ? "light" : "dark");
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();