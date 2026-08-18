const PROXY_COMMAND_URL = "http://localhost:3000/api/generate";

console.log("[Adorável] Motor ativado");

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch(err) {
    console.error("[Adorável] Falha ao abrir painel:", err);
  }
});

chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log("[Adorável] ✓ Pulso");
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "lovableSync") {
    const updates = {};
    if (msg.token) updates.lovable_token = msg.token;
    if (msg.projectId) updates.lovable_projectId = msg.projectId;
    if (Object.keys(updates).length) {
      chrome.storage.local.set(updates, () => {
        console.log("[Adorável] Projeto sincronizado");
      });
    }
    return false;
  }

  if (msg && msg.action === "OFFICIAL_PROMPT_CAPTURED") {
    handlePromptCapture(msg.prompt);
    return false;
  }

  if (msg && msg.action === "openSidePanel") {
    if (sender.tab?.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch(e => console.warn(e));
    }
    return false;
  }

  if (msg && msg.action === "proxyFetch") {
    handleProxyFetch(msg, sendResponse);
    return true;
  }

  if (msg && msg.action === "downloadProject") {
    handleDownload(msg, sendResponse);
    return true;
  }

  if (msg && msg.action === "uploadFileProxy") {
    handleUploadFileProxy(msg, sendResponse);
    return true;
  }
});

async function handlePromptCapture(msg) {
  try {
    console.log("[Adorável] 🔄 Iniciando handlePromptCapture com:", msg);

    const sd = await chrome.storage.local.get([
      "lovable_projectId", "lovable_token", "fl_chat_history"
    ]);

    console.log("[Adorável] 📦 Storage data:", { projectId: sd.lovable_projectId, hasToken: !!sd.lovable_token });

    if (!sd.lovable_projectId || !sd.lovable_token) {
      console.warn("[Adorável] ❌ Projeto não sincronizado");
      return;
    }

    console.log("[Adorável] ✓ Enviando para Llama local:", PROXY_COMMAND_URL);

    const payload = {
      model: "llama2",
      prompt: msg,
      stream: false
    };

    console.log("[Adorável] 📤 Enviando prompt:", msg.substring(0, 50));

    const resp = await fetch(PROXY_COMMAND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("[Adorável] 📡 Resposta - Status:", resp.status, "OK:", resp.ok);
    const respText = await resp.text();
    console.log("[Adorável] 📝 Resposta recebida:", respText.substring(0, 100));

    let result = { success: false, response: "" };
    try {
      if (respText) result = JSON.parse(respText);
      else console.warn("[Adorável] ⚠️ Resposta vazia");
    } catch (e) {
      console.error("[Adorável] ❌ JSON inválido:", respText.substring(0, 200));
    }

    if (resp.ok && result.response) {
      console.log("[Adorável] ✓ Resposta gerada com sucesso!");
      console.log("[Adorável] 🎯 Resposta:", result.response.substring(0, 100));
    } else {
      console.error("[Adorável] ❌ Falha:", result);
    }

    const history = sd.fl_chat_history || [];
    history.unshift({
      text: msg,
      timestamp: new Date().toISOString(),
      status: (resp.ok && result.success !== false) ? 'ok' : 'error'
    });
    if (history.length > 50) history.pop();

    await chrome.storage.local.set({ fl_chat_history: history });
    chrome.runtime.sendMessage({ action: "REFRESH_HISTORY" }).catch(() => {});

  } catch (err) {
    console.error("[Adorável] ❌ Erro:", err);
  }
}

async function handleProxyFetch(msg, sendResponse) {
  try {
    const resp = await fetch(msg.url, {
      method: msg.method || "POST",
      headers: msg.headers || {},
      body: msg.body
    });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { raw: text }; }
    sendResponse({ ok: resp.ok, status: resp.status, data });
  } catch(err) {
    sendResponse({ ok: false, data: { error: err.message } });
  }
}

async function handleDownload(msg, sendResponse) {
  try {
    const url = `https://lovable-api.com/projects/${msg.projectId}/source-code`;
    const resp = await fetch(url, {
      headers: { "Authorization": "Bearer " + msg.token, "Accept": "application/json" }
    });
    const data = await resp.json();
    sendResponse({ success: resp.ok, files: data.files || [] });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

async function handleUploadFileProxy(msg, sendResponse) {
  try {
    const { customDomain, bucketName, fileName, contentType, base64Data, anonKey } = msg;
    const uploadUrl = `https://${customDomain}/storage/v1/object/${bucketName}/${encodeURIComponent(fileName)}`;

    const bin = atob(base64Data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey,
        'Content-Type': contentType
      },
      body: bytes
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      sendResponse({ success: false, error: 'HTTP ' + response.status });
      return;
    }

    const downloadUrl = `https://${customDomain}/storage/v1/object/public/${bucketName}/${encodeURIComponent(fileName)}`;
    sendResponse({ success: true, downloadUrl });
  } catch (err) {
    console.error("[Adorável] Upload error:", err);
    sendResponse({ success: false, error: err.message });
  }
}
