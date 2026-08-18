(function () {
  if (window.__freeLovablePageHookInstalled) return;
  window.__freeLovablePageHookInstalled = true;

  const MESSAGE_SOURCE = "freelovable-page-hook";
  let capturedToken = null;
  let capturedProjectId = null;

  function getProjectFromPage() {
    try {
      const match = window.location.pathname.match(
        /projects\/([0-9a-fA-F-]{36})/i,
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  function extractProjectIdFromUrl(url) {
    try {
      const match = String(url).match(/projects\/([0-9a-fA-F-]{36})/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  function normalizeToken(value) {
    if (typeof value !== "string") return null;
    const token = value.replace(/^Bearer\s+/i, "").trim();
    return token.split(".").length === 3 ? token : null;
  }

  function getLatestTokenFromStorage() {
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key?.startsWith("sb-") || !key.includes("-auth-token")) continue;

        const authData = JSON.parse(localStorage.getItem(key));
        const token = normalizeToken(authData?.access_token);
        if (token) return token;
      }
    } catch {
      // The fetch/XHR hooks remain available if localStorage is inaccessible.
    }
    return null;
  }

  function notifyFound(token, projectId, force = false) {
    const normalizedToken = normalizeToken(token) || getLatestTokenFromStorage();
    const nextProjectId = projectId || getProjectFromPage();
    let changed = false;

    if (normalizedToken && normalizedToken !== capturedToken) {
      capturedToken = normalizedToken;
      changed = true;
    }
    if (nextProjectId && nextProjectId !== capturedProjectId) {
      capturedProjectId = nextProjectId;
      changed = true;
    }
    if (!changed && !force) return;

    window.postMessage(
      {
        source: MESSAGE_SOURCE,
        type: "lovableTokenFound",
        token: capturedToken,
        projectId: capturedProjectId,
        sourceHost: window.location.hostname,
      },
      window.location.origin,
    );
  }

  window.addEventListener("message", (event) => {
    if (
      event.source !== window ||
      event.origin !== window.location.origin ||
      event.data?.source !== "freelovable-content-script" ||
      event.data?.type !== "lovableRequestToken"
    ) {
      return;
    }

    notifyFound(capturedToken, getProjectFromPage() || capturedProjectId, true);
  });

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const request = args[0];
      const options = args[1] || {};
      let requestUrl =
        typeof request === "string" ? request : request?.url || "";
      let authorization = null;

      if (request instanceof Request) {
        requestUrl = request.url || requestUrl;
        authorization =
          request.headers?.get("Authorization") ||
          request.headers?.get("authorization");
      }
      if (options.headers instanceof Headers) {
        authorization =
          options.headers.get("Authorization") ||
          options.headers.get("authorization") ||
          authorization;
      } else if (options.headers && typeof options.headers === "object") {
        authorization =
          options.headers.Authorization ||
          options.headers.authorization ||
          authorization;
      }

      notifyFound(authorization, extractProjectIdFromUrl(requestUrl));
    } catch {
      // Never interfere with the page request.
    }

    return originalFetch.apply(this, args);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSetRequestHeader =
    XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__freeLovableUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (String(name).toLowerCase() === "authorization") {
      notifyFound(value, extractProjectIdFromUrl(this.__freeLovableUrl));
    }
    return originalSetRequestHeader.apply(this, arguments);
  };

  let lastPath = window.location.pathname;
  setInterval(() => {
    const currentPath = window.location.pathname;
    const pathChanged = currentPath !== lastPath;
    lastPath = currentPath;
    notifyFound(getLatestTokenFromStorage(), getProjectFromPage(), pathChanged);
  }, 2000);
})();
