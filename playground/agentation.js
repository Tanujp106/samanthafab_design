const query = new URLSearchParams(window.location.search);
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
const isLocalPreview = localHosts.has(window.location.hostname);
const isEnabled = isLocalPreview && query.get("agentation") !== "0";

if (isEnabled && !globalThis.__samanthaAgentationLoaded) {
  globalThis.__samanthaAgentationLoaded = true;

  const mountAgentation = async () => {
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
    console.warn("Agentation could not load in this local preview.", error);
  });
}
