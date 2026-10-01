export function mountConnectionNotice({ doc = document, win = window, nav = navigator } = {}) {
  const notice = doc.createElement("aside");
  notice.className = "connection-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.textContent = "You are offline. Saved items remain available on this device.";
  doc.body.append(notice);

  const sync = () => {
    notice.hidden = nav.onLine !== false;
  };
  win.addEventListener("online", sync);
  win.addEventListener("offline", sync);
  sync();
  return notice;
}
