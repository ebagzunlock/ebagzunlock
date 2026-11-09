
(() => {
  const KEY = "ebagzunlock-site-theme";
  const root = document.documentElement;
  const getSaved = () => {
    try { return localStorage.getItem(KEY) === "mono" ? "mono" : "blue"; }
    catch (_) { return "blue"; }
  };
  const apply = (theme) => {
    if (theme === "mono") root.setAttribute("data-site-theme", "mono");
    else root.removeAttribute("data-site-theme");
    try { localStorage.setItem(KEY, theme); } catch (_) {}
    const button = document.querySelector(".site-header .theme-toggle");
    if (button) {
      button.setAttribute("aria-pressed", theme === "mono" ? "true" : "false");
      button.setAttribute("aria-label", theme === "mono" ? "Revenir au thème bleu" : "Activer le thème noir et blanc");
      button.setAttribute("title", theme === "mono" ? "Revenir au thème bleu" : "Activer le thème noir et blanc");
    }
  };
  apply(getSaved());
  const install = () => {
    const picker = document.querySelector(".site-header .language-picker");
    if (!picker || document.querySelector(".site-header .theme-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 1.8v2.4M12 19.8v2.4M4.8 4.8l1.7 1.7m11 11 1.7 1.7M1.8 12h2.4m15.6 0h2.4M4.8 19.2l1.7-1.7m11-11 1.7-1.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
    picker.parentNode.insertBefore(button, picker);
    apply(getSaved());
    button.addEventListener("click", () => apply(root.getAttribute("data-site-theme") === "mono" ? "blue" : "mono"));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
