const API_BASE_URL = "https://api.freelovable.com.br";
const API_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cWt6Y3l6bHNuemhxbGZ5Ynd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTQ1MjEsImV4cCI6MjA5Mjg5MDUyMX0.amaNqE2XB3Pox-a5IMQmbhOB-EcGFdw2Nc9prxOpulc";
const DEFAULT_API_VALIDATE_URL = "https://deno-validate-license.freelovable.deno.net/";
const DEFAULT_API_PROXY_COMMAND_URL = "https://dxqkzcyzlsnzhqlfybwu.supabase.co/functions/v1/commandproxy-v2";
const FIXED_API_PROXY_COMMAND_URL = DEFAULT_API_PROXY_COMMAND_URL;
const REMOTE_CONFIG_CACHE_KEY = "fl_remote_config_cache";

const API = {
  CONFIG: API_BASE_URL + "/functions/v1/extension-config",
  VALIDATE: DEFAULT_API_VALIDATE_URL,
  OPTIMIZE: API_BASE_URL + "/functions/v1/optimize-prompt",
  TRANSFER_DEVICE: API_BASE_URL + "/functions/v1/transfer-device",
  PROXY_CMD: FIXED_API_PROXY_COMMAND_URL
};

function applyRemoteApiConfig(remoteConfig) {
  const apiConfig = remoteConfig && remoteConfig.api;
  if (!apiConfig || typeof apiConfig !== "object") return;
  if (typeof apiConfig.validate_license_url === "string" && apiConfig.validate_license_url.trim()) {
    API.VALIDATE = apiConfig.validate_license_url.trim();
  }
  API.PROXY_CMD = FIXED_API_PROXY_COMMAND_URL;
}

chrome.storage.local.get([REMOTE_CONFIG_CACHE_KEY], (res) => {
  const cached = res && res[REMOTE_CONFIG_CACHE_KEY];
  if (cached && typeof cached === "object") {
    applyRemoteApiConfig(cached);
  }
});

console.log("[Background] Motor FreeLovable Ativado");

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch(err) {
    console.error("[Background] Falha ao abrir painel:", err);
  }
});

chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log("[Background] Pulso de vida...");
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg && msg.action === "lovableSync") {
    const updates = {};
    if (msg.token) updates.lovable_token = msg.token;
    if (msg.projectId) updates.lovable_projectId = msg.projectId;
    if (Object.keys(updates).length) {
      chrome.storage.local.set(updates, () => {
        console.log("[Background] Projeto Sincronizado:", Object.keys(updates));
      });
    }
    return false;
  }

  if (msg && msg.action === "OFFICIAL_PROMPT_CAPTURED") {
    handleBypassSilent(msg.prompt);
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

  if (msg && msg.action === "apiAction") {
    handleApiAction(msg, sendResponse);
    return true;
  }

  // H) Upload de Arquivo via API Proxy (CORS-Bypass)
  if (msg && msg.action === "uploadFileProxy") {
    handleUploadFileProxy(msg, sendResponse);
    return true;
  }
});

async function handleApiAction(msg, sendResponse) {
  try {
    const { subAction, payload, headers = {} } = msg;
    let url = "";
    let method = "POST";

    switch(subAction) {
      case "GET_CONFIG": url = API.CONFIG; break;
      case "VALIDATE_LICENSE": url = API.VALIDATE; break;
      case "OPTIMIZE_PROMPT": url = API.OPTIMIZE; break;
      case "TRANSFER_DEVICE": url = API.TRANSFER_DEVICE; break;
      default: throw new Error("Ação de API desconhecida");
    }

    const fetchHeaders = { 
      "Content-Type": "application/json", 
      "apikey": API_PUBLIC_KEY,
      "Authorization": "Bearer " + API_PUBLIC_KEY,
      ...headers 
    };

    const resp = await fetch(url, {
      method: method,
      headers: fetchHeaders,
      body: method === "POST" ? JSON.stringify(payload) : null
    });

    const data = await resp.json();
    if (resp.ok && subAction === "GET_CONFIG" && data && typeof data === "object") {
      const remoteConfig = data.config || data.data || data;
      applyRemoteApiConfig(remoteConfig);
      chrome.storage.local.set({ [REMOTE_CONFIG_CACHE_KEY]: remoteConfig }, () => {});
    }
    sendResponse({ ok: resp.ok, data });
  } catch(err) {
    sendResponse({ ok: false, error: err.message });
  }
}

async function handleBypassSilent(msg) {
  try {
    const sd = await chrome.storage.local.get([
      "lovable_projectId", "lovable_token", "fl_license_key", "fl_session_id", "fl_hw_fingerprint", "fl_plan_mode", "fl_chat_history"
    ]);

    if (!sd.lovable_projectId || !sd.lovable_token) {
      console.warn("[Background] Ignorado: Projeto não sincronizado.");
      return;
    }

    let token = sd.lovable_token.trim();
    if (token.toLowerCase().startsWith('bearer ')) token = token.substring(7).trim();

    const licenseKey = sd.fl_license_key || "";
    const deviceFingerprint = sd.fl_hw_fingerprint || sd.fl_device_id || 'dv-unknown';
    const payload = {
      mensagem: msg,
      message: msg,
      projeto_id: sd.lovable_projectId,
      projectId: sd.lovable_projectId,
      token_lovable: token,
      token,
      license_key: licenseKey,
      session_id: sd.fl_session_id || ('bg-' + Date.now()),
      deviceFingerprint,
      device_id: deviceFingerprint,
      files: []
    };

    const resp = await fetch(API.PROXY_CMD, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": API_PUBLIC_KEY },
      body: JSON.stringify(payload)
    });

    const respText = await resp.text();
    let result = { success: false };
    try {
      if (respText) result = JSON.parse(respText);
      else console.warn("[Background] Resposta do servidor vazia.");
    } catch (e) {
      console.error("[Background] Resposta não é um JSON válido:", respText);
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
    console.error("[Background] Falha no processamento silencioso:", err);
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
      sendResponse({ success: false, error: 'API upload HTTP ' + response.status + ': ' + errText });
      return;
    }

    const downloadUrl = `https://${customDomain}/storage/v1/object/public/${bucketName}/${encodeURIComponent(fileName)}`;
    sendResponse({ success: true, downloadUrl });
  } catch (err) {
    console.error("[Background] uploadFileProxy error:", err);
    sendResponse({ success: false, error: err.message || "Falha no upload em segundo plano" });
  }
}
