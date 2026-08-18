// content.js - Ponte entre a pagina Lovable e o service worker.
const FL_PAGE_HOOK_SOURCE = "freelovable-page-hook";
const FL_CONTENT_SCRIPT_SOURCE = "freelovable-content-script";
const FL_SPECIAL_LABEL = "FreeLovable";
const FL_SPECIAL_LABELS = new Set([
  "fast visual edit",
  "visual edit",
  "edição visual",
  "edicao visual",
  "fast edit",
  "fix error",
  "fix build error",
  "corrigir erro de build",
  "tentar corrigir problema de seo: meta description",
  "security scan",
  "security fix",
  "security",
  "verificação de segurança",
  "verificacao de seguranca",
  "correção de segurança",
  "correcao de seguranca"
]);

// Injeta o hook para capturar Tokens e Project IDs
(function injectHook(){
  try {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL("pageHook.js");
    s.onload = () => {
      window.postMessage({
        source: FL_CONTENT_SCRIPT_SOURCE,
        type: "lovableRequestToken"
      }, window.location.origin);
      s.remove();
    };
    (document.documentElement || document.head || document.body).appendChild(s);
  } catch (e) {
    console.warn("[FreeLovable] Falha ao injetar pageHook", e);
  }
})();

// Escuta mensagens do pageHook.js
window.addEventListener("message", (event) => {
  try {
    if (
      event.source !== window ||
      event.origin !== window.location.origin ||
      event.data?.source !== FL_PAGE_HOOK_SOURCE
    ) return;
    if (event.data.type === "lovableTokenFound") {
      const { token, projectId, sourceHost } = event.data;
      const validToken = typeof token === "string" && token.split(".").length === 3;
      const validProjectId =
        typeof projectId === "string" &&
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(projectId);
      if (!validToken && !validProjectId) return;

      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        const values = { lovable_sourceHost: sourceHost || "" };
        if (validToken) values.lovable_token = token;
        if (validProjectId) values.lovable_projectId = projectId;
        flStorageSet(values);
      }
    }
  } catch (e) {}
});

function flNormalizeLabel(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function flInstallBrandStyles() {
  if (document.getElementById("fl-special-message-styles")) return;

  const style = document.createElement("style");
  style.id = "fl-special-message-styles";
  style.textContent = `
    .special-message.fl-special-message-brand {
      display: inline-flex !important;
      align-items: center !important;
      width: fit-content !important;
      padding: 4px 10px !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 999px !important;
      background: linear-gradient(135deg, #e83e8c, #ff6b35) !important;
      background-clip: border-box !important;
      -webkit-background-clip: border-box !important;
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      font-style: normal !important;
      font-weight: 700 !important;
      line-height: 1.25 !important;
      letter-spacing: 0.01em !important;
      text-shadow: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      filter: none !important;
      mix-blend-mode: normal !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

function flReplaceSpecialLabel(root) {
  if (!root) return 0;
  let replacements = 0;
  const candidates = [];

  if (root.nodeType === Node.ELEMENT_NODE) {
    if (root.matches?.(".special-message")) candidates.push(root);
    root.querySelectorAll?.(".special-message").forEach((node) => candidates.push(node));
  } else if (root.nodeType === Node.TEXT_NODE && root.parentElement) {
    candidates.push(root.parentElement);
  }

  for (const element of candidates) {
    const normalized = flNormalizeLabel(element.textContent);
    if (normalized === flNormalizeLabel(FL_SPECIAL_LABEL)) {
      element.dataset.flBranded = "true";
      element.classList.add("fl-special-message-brand");
      continue;
    }
    if (!FL_SPECIAL_LABELS.has(normalized)) continue;
    element.textContent = FL_SPECIAL_LABEL;
    element.dataset.flBranded = "true";
    element.classList.add("fl-special-message-brand");
    replacements += 1;
  }

  return replacements;
}

function flInstallLabelOverride() {
  flInstallBrandStyles();
  let replacementCount = 0;
  let windowStartedAt = Date.now();
  let pausedUntil = 0;

  const replaceSafely = (root) => {
    const now = Date.now();
    if (now < pausedUntil) return;
    if (now - windowStartedAt >= 1000) {
      replacementCount = 0;
      windowStartedAt = now;
    }

    replacementCount += flReplaceSpecialLabel(root);
    if (replacementCount > 30) pausedUntil = now + 3000;
  };

  replaceSafely(document.documentElement);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") replaceSafely(mutation.target);
      mutation.addedNodes.forEach(replaceSafely);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

flInstallLabelOverride();

let flCreateProjectRunning = false;

function flStorageSet(values) {
  try {
    const result = chrome.storage.local.set(values);
    if (result && typeof result.then === 'function') return result;
  } catch (e) {}
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set(values, () => resolve());
    } catch (e) {
      resolve();
    }
  });
}

function flStorageRemove(keys) {
  try {
    const result = chrome.storage.local.remove(keys);
    if (result && typeof result.then === 'function') return result;
  } catch (e) {}
  return new Promise((resolve) => {
    try {
      chrome.storage.local.remove(keys, () => resolve());
    } catch (e) {
      resolve();
    }
  });
}

function flBase64ToBlob(dataB64, mimeType) {
  const binary = atob(String(dataB64 || ""));
  const chunks = [];
  for (let offset = 0; offset < binary.length; offset += 8192) {
    const slice = binary.slice(offset, offset + 8192);
    const bytes = new Uint8Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) bytes[i] = slice.charCodeAt(i);
    chunks.push(bytes);
  }
  return new Blob(chunks, { type: mimeType || "application/octet-stream" });
}

function flNormalizeApiBase(apiBase) {
  const value = String(apiBase || "").trim().replace(/\/+$/, "");
  if (value) return value;
  if (location.hostname.includes("lovable.app")) return "https://api.lovable.app";
  return "https://api.lovable.dev";
}

async function flUploadLovableAttachment(uploadRequest) {
  const token = String(uploadRequest?.token || "").replace(/^Bearer\s+/i, "").trim();
  const projectId = String(uploadRequest?.projectId || "").trim();
  const apiBase = flNormalizeApiBase(uploadRequest?.apiBase);
  const file = uploadRequest?.file || {};
  const fileName = String(file.name || "arquivo");
  const mimeType = String(file.mime || file.type || "application/octet-stream");
  const blob = flBase64ToBlob(file.dataB64, mimeType);
  const size = Number(file.size || blob.size || 0);

  if (!token || !projectId || !file.dataB64) {
    throw new Error("Dados insuficientes para enviar o anexo.");
  }

  const authHeaders = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  };

  const uploadUrlResp = await fetch(apiBase + "/projects/" + encodeURIComponent(projectId) + "/files/generate-upload-url", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      content_type: mimeType,
      original_file_name: fileName,
      file_size_bytes: size,
      original_file_size_bytes: size
    })
  });

  if (!uploadUrlResp.ok) {
    const text = await uploadUrlResp.text().catch(() => "");
    throw new Error("generate-upload-url HTTP " + uploadUrlResp.status + ": " + text.slice(0, 160));
  }

  const uploadData = await uploadUrlResp.json();
  if (!uploadData || !uploadData.url || !uploadData.file_id) {
    throw new Error("Resposta de upload invalida.");
  }

  const putHeaders = { "Content-Type": mimeType };
  if (uploadData.headers && typeof uploadData.headers === "object") {
    Object.assign(putHeaders, uploadData.headers);
  }

  const putResp = await fetch(uploadData.url, {
    method: "PUT",
    headers: putHeaders,
    body: blob
  });

  if (!putResp.ok) {
    const text = await putResp.text().catch(() => "");
    throw new Error("upload Lovable HTTP " + putResp.status + ": " + text.slice(0, 160));
  }

  let downloadUrl = null;
  try {
    const storedFileName = String(uploadData.file_id).split("/").pop();
    const downloadResp = await fetch(apiBase + "/files/generate-download-url", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        dir_name: projectId,
        file_name: storedFileName
      })
    });
    if (downloadResp.ok) {
      const downloadData = await downloadResp.json();
      downloadUrl = downloadData.url || null;
    }
  } catch (e) {}

  return {
    file_id: uploadData.file_id,
    file_name: fileName,
    type: "user_upload",
    mime_type: mimeType,
    download_url: downloadUrl
  };
}

try {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== "FREELOVABLE_UPLOAD_ATTACHMENT") return false;
    flUploadLovableAttachment(message)
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }));
    return true;
  });
} catch (e) {}

function flSafeSendRuntimeMessage(message) {
  try {
    const result = chrome.runtime.sendMessage(message);
    if (result && typeof result.then === 'function') {
      result.catch(() => {});
    }
  } catch (e) {}
}

function flIsVisible(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function flFindChatInput() {
  const selectors = [
    'div[data-testid="chat-composer-editor"]',
    'form#chat-input div[contenteditable="true"][aria-label="Chat input"]',
    '#chatinput div[contenteditable="true"][aria-label="Chat input"]',
    'textarea[placeholder*="Ask Lovable"]',
    'textarea[placeholder*="build a web app"]',
    'div[aria-label="Chat input"]',
    'textarea',
    'div[role="textbox"]',
    '[contenteditable="true"]'
  ];
  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll(selector));
    const input = nodes.find((node) => {
      if (!flIsVisible(node)) return false;
      if (node.tagName === 'TEXTAREA') return true;
      if (node.isContentEditable) return true;
      return (
        (node.getAttribute('role') || '').toLowerCase() === 'textbox' ||
        (node.getAttribute('aria-label') || '').toLowerCase().includes('chat')
      );
    });
    if (input) return input;
  }
  return null;
}

function flFindSendButton(chatInput) {
  const selectors = [
    'button[data-testid="chat-input-send"]',
    'button#chatinput-send-message-button',
    'form#chat-input button[type="submit"]',
    'button[type="submit"]',
    'button[aria-label*="Send"]',
    'button[aria-label*="send"]',
    'button[data-testid*="send"]',
    'button svg[data-testid*="arrow"]'
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const btn = el?.closest ? el.closest('button') : el;
    if (btn && flIsVisible(btn) && !btn.disabled) return btn;
  }
  if (chatInput) {
    const containers = [
      chatInput.closest('form'),
      chatInput.closest('[role="group"]'),
      chatInput.parentElement,
      chatInput.closest('div')
    ].filter(Boolean);
    for (const container of containers) {
      const buttons = Array.from(container.querySelectorAll('button')).filter((btn) => flIsVisible(btn) && !btn.disabled);
      const preferred = buttons.find((btn) => {
        const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
        const title = (btn.getAttribute('title') || '').trim().toLowerCase();
        const testid = (btn.getAttribute('data-testid') || '').trim().toLowerCase();
        return aria.includes('send') || aria.includes('submit') || title.includes('send') || testid.includes('send');
      });
      if (preferred) return preferred;
      const candidates = buttons.filter((btn) => {
        const text = (btn.textContent || '').trim().toLowerCase();
        const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
        return !(
          text === '+' ||
          text.includes('build') ||
          text.includes('voice') ||
          text.includes('micro') ||
          aria.includes('build') ||
          aria.includes('voice') ||
          aria.includes('micro')
        );
      });
      if (candidates.length) return candidates[candidates.length - 1];
    }
  }
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find((btn) => {
    const text = (btn.textContent || '').trim().toLowerCase();
    const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
    if (!flIsVisible(btn) || btn.disabled) return false;
    if (
      text === '+' ||
      text.includes('build') ||
      text.includes('voice') ||
      text.includes('micro') ||
      aria.includes('build') ||
      aria.includes('voice') ||
      aria.includes('micro')
    ) return false;
    return (
      text === 'send' ||
      text === 'enviar' ||
      aria.includes('send') ||
      aria.includes('enviar')
    );
  }) || null;
}

function flFindCancelButton() {
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find((btn) => {
    const text = (btn.textContent || '').trim().toLowerCase();
    const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
    return flIsVisible(btn) && (
      text.includes('cancel') ||
      text.includes('stop') ||
      text.includes('parar') ||
      aria.includes('cancel') ||
      aria.includes('stop') ||
      aria.includes('parar')
    );
  }) || null;
}

function flFindCreateProjectControl() {
  const selectors = [
    'a[href*="/projects/new"]',
    'a[href*="/new"]',
    'button[data-testid*="new-project"]',
    'button[data-testid*="create-project"]',
    'button[aria-label*="New project"]',
    'button[aria-label*="Create project"]',
    'button[aria-label*="Novo projeto"]',
    'button[aria-label*="Criar projeto"]'
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && flIsVisible(el) && !el.disabled) return el;
  }
  const controls = Array.from(document.querySelectorAll('button, a'));
  return controls.find((el) => {
    const text = (el.textContent || '').trim().toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').trim().toLowerCase();
    const href = (el.getAttribute('href') || '').trim().toLowerCase();
    return flIsVisible(el) && (
      text.includes('new project') ||
      text.includes('create project') ||
      text.includes('novo projeto') ||
      text.includes('criar projeto') ||
      text.includes('start building') ||
      aria.includes('new project') ||
      aria.includes('create project') ||
      aria.includes('novo projeto') ||
      aria.includes('criar projeto') ||
      href.includes('/projects/new')
    );
  }) || null;
}

function flSetChatInputValue(chatInput, value) {
  chatInput.focus();
  if (chatInput instanceof HTMLTextAreaElement || chatInput instanceof HTMLInputElement) {
    const prototype = Object.getPrototypeOf(chatInput);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(chatInput, value);
    } else {
      chatInput.value = value;
    }
  } else {
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(chatInput);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('delete', false);
      document.execCommand('insertText', false, value);
    } catch (e) {
      chatInput.innerHTML = '<p>' + value + '</p>';
      chatInput.textContent = value;
    }
  }
  chatInput.dispatchEvent(new InputEvent('beforeinput', {
    bubbles: true,
    data: value,
    inputType: 'insertText'
  }));
  chatInput.dispatchEvent(new InputEvent('input', {
    bubbles: true,
    data: value,
    inputType: 'insertText'
  }));
  chatInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function flSubmitChatInput(chatInput) {
  const enterKeydown = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true
  });
  const enterKeyup = new KeyboardEvent('keyup', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true
  });

  chatInput.focus();
  chatInput.dispatchEvent(enterKeydown);
  chatInput.dispatchEvent(enterKeyup);

  if (chatInput instanceof HTMLTextAreaElement || chatInput instanceof HTMLInputElement) {
    chatInput.dispatchEvent(new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    }));
  }

  const form = chatInput.closest('form');
  if (form && typeof form.requestSubmit === 'function') {
    try {
      form.requestSubmit();
      return true;
    } catch (e) {}
  }

  const sendButton = flFindSendButton(chatInput);
  if (sendButton) {
    sendButton.click();
    return true;
  }

  return false;
}

function flClearCreateProjectPending() {
  flStorageRemove(['fl_create_project_pending']);
  flCreateProjectRunning = false;
}

function flStartCancelPolling(attempt) {
  const cancelBtn = flFindCancelButton();
  if (cancelBtn) {
    cancelBtn.click();
    flClearCreateProjectPending();
    return;
  }
  if (attempt >= 30) {
    flClearCreateProjectPending();
    return;
  }
  setTimeout(() => flStartCancelPolling(attempt + 1), 500);
}

function flWaitAndSubmit(chatInput, attempt) {
  const sendButton = flFindSendButton(chatInput);
  if (sendButton && !sendButton.disabled && sendButton.getAttribute('aria-disabled') !== 'true') {
    sendButton.click();
    setTimeout(() => flStartCancelPolling(0), 700);
    return;
  }
  if (attempt >= 20) {
    const submitted = flSubmitChatInput(chatInput);
    if (!submitted) flClearCreateProjectPending();
    else setTimeout(() => flStartCancelPolling(0), 700);
    return;
  }
  setTimeout(() => flWaitAndSubmit(chatInput, attempt + 1), 150);
}

function flMaybeCreateProject() {
  if (flCreateProjectRunning) return;
  chrome.storage.local.get(['fl_create_project_pending'], (res) => {
    const pending = res.fl_create_project_pending;
    if (!pending || !pending.enabled) return;
    if (pending.targetHost && pending.targetHost !== window.location.hostname) return;
    if (Date.now() - Number(pending.createdAt || 0) > 120000) {
      flClearCreateProjectPending();
      return;
    }

    const chatInput = flFindChatInput();
    if (!chatInput) {
      const createControl = flFindCreateProjectControl();
      if (createControl && !pending.projectOpened) {
        flCreateProjectRunning = true;
        try {
          flStorageSet({
            fl_create_project_pending: {
              ...pending,
              projectOpened: true
            }
          });
          createControl.click();
        } finally {
          flCreateProjectRunning = false;
        }
      }
      return;
    }

    flCreateProjectRunning = true;
    try {
      flSetChatInputValue(chatInput, pending.prompt || '.');
      setTimeout(() => {
        try {
          flWaitAndSubmit(chatInput, 0);
        } catch (e) {
          flClearCreateProjectPending();
        }
      }, 250);
    } catch (e) {
      flClearCreateProjectPending();
    }
  });
}

// Ativa a interceptação automaticamente
setInterval(() => {
  const chatInput = flFindChatInput();
  if (chatInput && !chatInput.dataset.flIntercepted) {
    chatInput.dataset.flIntercepted = "true";
    console.log("[FreeLovable] Chat input encontrado e interceptado");

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const prompt = (typeof chatInput.value === 'string' ? chatInput.value : chatInput.innerText).trim();
        if (prompt) {
          try {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (typeof chatInput.value === 'string') {
              chatInput.value = '';
            } else {
              chatInput.innerHTML = '<p><br></p>';
            }

            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
              console.log("[FreeLovable] Prompt capturado:", prompt.substring(0, 50) + "...");
              flSafeSendRuntimeMessage({
                action: "OFFICIAL_PROMPT_CAPTURED",
                prompt: prompt
              });
            }

            showCaptureFeedback();
          } catch (err) {}
        }
      }
    }, true);
  }
  flMaybeCreateProject();
}, 2000);

function showCaptureFeedback() {
  document.getElementById('fl-capture-toast')?.remove();

  const feedback = document.createElement('div');
  feedback.id = 'fl-capture-toast';
  feedback.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(16, 185, 129, 0.95);
    backdrop-filter: blur(8px);
    color: white;
    padding: 12px 20px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fl-slide-down 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;

  feedback.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Enviado via FreeLovable</span>
    </div>
    <div id="fl-toast-close" style="cursor: pointer; padding: 4px; display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.2); margin-left: 4px;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  `;

  if (!document.getElementById('fl-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'fl-toast-styles';
    style.textContent = `
      @keyframes fl-slide-down {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes fl-slide-up {
        to { opacity: 0; transform: translate(-50%, -20px); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(feedback);

  const closeToast = () => {
    feedback.style.animation = 'fl-slide-up 0.4s forwards';
    setTimeout(() => feedback.remove(), 400);
  };

  document.getElementById('fl-toast-close').onclick = closeToast;
  setTimeout(closeToast, 5000);
}

function flReplaceSecurityLabels(root = document.body) {
  try {
    if (!root) return;
    const shouldReplaceLabel = (value) => FL_SPECIAL_LABELS.has(flNormalizeLabel(value));

    try {
      const exactLabels = (root.querySelectorAll ? root.querySelectorAll('.special-message') : []);
      exactLabels.forEach((el) => {
        const text = String(el.textContent || '').trim();
        if (shouldReplaceLabel(text)) {
          el.setAttribute('data-fl-security-label', '1');
        }
        if (text.includes('Verificação de segurança')) {
          el.setAttribute('data-fl-security-label', '1');
        }
      });
    } catch (e) {}

    const replaceInTree = (treeRoot) => {
      if (!treeRoot) return;

      try {
        const walker = document.createTreeWalker(treeRoot, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
          if (shouldReplaceLabel(textNode.nodeValue)) {
            textNode.nodeValue = 'FreeLovable';
            continue;
          }
          if (String(textNode.nodeValue || '').trim() === 'Verificação de segurança') {
            textNode.nodeValue = 'FreeLovable';
          }
        }
      } catch (e) {}

      try {
        const elements = treeRoot.querySelectorAll
          ? treeRoot.querySelectorAll('*')
          : [];
        elements.forEach((el) => {
          try {
            if (el.childNodes && el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
              const onlyText = String(el.textContent || '').trim();
              if (shouldReplaceLabel(onlyText)) {
                el.textContent = 'FreeLovable';
              }
              if (onlyText === 'Verificação de segurança') {
                el.textContent = 'FreeLovable';
              }
            }
            ['aria-label', 'title'].forEach((attr) => {
              const value = el.getAttribute && el.getAttribute(attr);
              if (shouldReplaceLabel(value)) {
                el.setAttribute(attr, 'FreeLovable');
              }
              if (String(value || '').trim() === 'Verificação de segurança') {
                el.setAttribute(attr, 'FreeLovable');
              }
            });
            if (el.shadowRoot) {
              replaceInTree(el.shadowRoot);
            }
          } catch (e) {}
        });
      } catch (e) {}
    };

    replaceInTree(root);
    if (root.shadowRoot) replaceInTree(root.shadowRoot);
  } catch (e) {}
}

function flStartSecurityLabelOverride() {
  const run = () => flReplaceSecurityLabels(document.documentElement || document.body);
  run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['aria-label', 'title']
  });

  setInterval(run, 1000);
}

function flInjectSecurityLabelStyles() {
  try {
    if (document.getElementById('fl-security-label-style')) return;
    const style = document.createElement('style');
    style.id = 'fl-security-label-style';
    style.textContent = `
      .special-message[data-fl-security-label="1"] {
        position: relative !important;
        color: transparent !important;
      }
      .special-message[data-fl-security-label="1"]::after {
        content: "FreeLovable";
        position: absolute;
        inset: 0;
        color: inherit;
        color: var(--foreground, currentColor) !important;
        white-space: pre-wrap;
        pointer-events: none;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  } catch (e) {}
}

flInjectSecurityLabelStyles();
flStartSecurityLabelOverride();
