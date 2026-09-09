const query = new URLSearchParams(window.location.search);
const isEnabled = query.get("agentation") !== "0";

if (isEnabled && !globalThis.__samanthaAgentationLoaded) {
  globalThis.__samanthaAgentationLoaded = true;

  // Undo Agentation's "Hide Until Restart" so the control is visible again.
  try {
    sessionStorage.removeItem("agentation-session-toolbar-hidden");
  } catch {
    // Ignore storage failures in private / blocked contexts.
  }

  const ensureVisibleStyles = () => {
    if (document.getElementById("samantha-agentation-visibility")) return;
    const style = document.createElement("style");
    style.id = "samantha-agentation-visibility";
    style.textContent = `
      /* Keep the collapsed Agentation control visible on dark campaign heroes. */
      [data-feedback-toolbar] {
        box-shadow:
          0 0 0 2px #fffdf9,
          0 10px 28px rgba(36, 23, 28, 0.35) !important;
      }
    `;
    document.head.append(style);
  };

  const mountAgentation = async () => {
    ensureVisibleStyles();

    const reactUrl = "https://esm.sh/react@18";
    const reactDomUrl = "https://esm.sh/react-dom@18/client";
    const agentationUrl = `https://esm.sh/agentation@3?alias=react:${reactUrl}`;
    const mount = document.createElement("div");
    mount.id = "agentation-root";
    document.body.append(mount);

    const [React, ReactDOM, agentationModule] = await Promise.all([
      import(reactUrl),
      import(reactDomUrl),
      import(agentationUrl),
    ]);

    const props = {
      reactComponents: false,
      copyToClipboard: true,
      className: "samantha-agentation",
    };

    if (query.get("agentationSync") === "1") {
      props.endpoint = "http://localhost:4747";
    }

    ReactDOM.createRoot(mount).render(
      React.createElement(agentationModule.Agentation, props),
    );
  };

  mountAgentation().catch((error) => {
    globalThis.__samanthaAgentationLoaded = false;
    console.warn("Agentation could not load on this page.", error);
  });
}
