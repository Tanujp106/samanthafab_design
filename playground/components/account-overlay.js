function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function closeIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("account-overlay__close-icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.8");
  icon.setAttribute("stroke-linecap", "square");
  icon.innerHTML = '<path d="m5 5 14 14M19 5 5 19"/>';
  return icon;
}

function googleIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("account-overlay__google-icon");
  icon.setAttribute("viewBox", "0 0 48 48");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.innerHTML = [
    '<path fill="#4285F4" d="M47.5 24.5c0-1.7-.2-3.3-.5-4.9H24v9.3h13.2c-.6 3-2.4 5.5-5.1 7.2v6h8.2c4.8-4.4 7.2-10.9 7.2-17.6Z"/>',
    '<path fill="#34A853" d="M24 48c6.9 0 12.7-2.3 16.9-6.2l-8.2-6c-2.3 1.5-5.2 2.4-8.7 2.4-6.7 0-12.4-4.5-14.5-10.6H1v6.2C5.2 42.4 13.9 48 24 48Z"/>',
    '<path fill="#FBBC05" d="M9.5 27.6A14.4 14.4 0 0 1 8.7 24c0-1.3.2-2.5.5-3.6v-6.2H1A24 24 0 0 0 0 24c0 3.5.8 6.8 2.1 9.8l7.4-6.2Z"/>',
    '<path fill="#EA4335" d="M24 9.6c3.8 0 7.1 1.3 9.8 3.9l7.2-7.2C36.7 2.3 30.9 0 24 0 13.9 0 5.2 5.6 1 14.2l7.4 6.2C11.6 14.1 17.3 9.6 24 9.6Z"/>',
  ].join("");
  return icon;
}

export function renderAccountOverlay({ brandSrc = "/assets/samantha-logo.png", brandAlt = "Samantha Fab" } = {}) {
  const root = element("div", "account-overlay");
  root.dataset.accountOverlay = "true";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("aria-labelledby", "account-overlay-title");
  root.inert = true;

  const backdrop = element("button", "account-overlay__backdrop");
  backdrop.type = "button";
  backdrop.dataset.accountBackdrop = "true";
  backdrop.setAttribute("aria-label", "Close account login");

  const panel = element("div", "account-overlay__panel");
  const close = element("button", "account-overlay__close");
  close.type = "button";
  close.dataset.accountClose = "true";
  close.setAttribute("aria-label", "Close account login");
  close.append(closeIcon());

  const brand = element("img", "account-overlay__brand");
  brand.src = brandSrc;
  brand.alt = brandAlt;
  brand.loading = "eager";
  brand.decoding = "async";

  const titleRow = element("div", "account-overlay__title-row");
  titleRow.append(
    element("span", "account-overlay__rule"),
    element("h1", "account-overlay__title", "Login with OTP"),
    element("span", "account-overlay__rule"),
  );
  titleRow.querySelector("h1").id = "account-overlay-title";

  const form = element("form", "account-overlay__form");
  form.dataset.accountForm = "true";
  const email = element("input", "account-overlay__input");
  email.type = "email";
  email.name = "email";
  email.autocomplete = "email";
  email.inputMode = "email";
  email.placeholder = "Enter Email";
  email.required = true;
  email.setAttribute("aria-label", "Email address");
  const submit = element("button", "account-overlay__submit", "Get OTP");
  submit.type = "submit";
  form.append(email, submit);

  const newUser = element("p", "account-overlay__new-user", "New to Samantha Fab? Login via OTP");

  const divider = element("div", "account-overlay__divider");
  divider.append(
    element("span", "account-overlay__rule"),
    element("span", "account-overlay__divider-label", "OR"),
    element("span", "account-overlay__rule"),
  );

  const google = element("button", "account-overlay__google");
  google.type = "button";
  google.dataset.accountGoogle = "true";
  google.append(googleIcon(), document.createTextNode("Login with Google"));

  const terms = element("p", "account-overlay__terms");
  terms.append(
    document.createTextNode("By continuing, you agree to our "),
    (() => {
      const link = element("a", "account-overlay__terms-link", "Terms & Conditions");
      link.href = "/design";
      return link;
    })(),
  );

  panel.append(close, brand, titleRow, form, newUser, divider, google, terms);
  root.append(backdrop, panel);
  return root;
}
