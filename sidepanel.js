(function(){
  const DEFAULT_API_VALIDATE_URL = "https://deno-validate-license.adoravel.deno.net/";
  const DEFAULT_API_PROXY_COMMAND_URL = "https://dxqkzcyzlsnzhqlfybwu.supabase.co/functions/v1/commandproxy-v2";
  const FIXED_API_PROXY_COMMAND_URL = DEFAULT_API_PROXY_COMMAND_URL;
  const STORAGE_PROXY_DOMAIN = "api.adoravel.com.br";
  const STORAGE_BUCKET_NAME = "anexos";
  const DEFAULT_REMOTE_CONFIG = {
    branding: {
      app_name: "Painel",
      panel_title: "Painel Lateral",
      license_title: "Painel",
      license_subtitle: "Carregando configuração...",
      support_label: "Ajuda",
      support_url: "",
      shield_title: "Protegido",
      shield_subtitle: "Use a extensão para enviar prompts"
    },
    ui: {
      show_support_link: false
    },
    announcement: {
      enabled: false,
      title: "",
      body: "",
      community_url: "",
      community_label: "",
      continue_label: "Continuar"
    },
    update: {
      force_update: false,
      latest_version: "",
      min_version: "",
      download_url: "",
      message: "",
      features: ""
    },
    api: {
      validate_license_url: DEFAULT_API_VALIDATE_URL,
      proxy_command_url: DEFAULT_API_PROXY_COMMAND_URL
    }
  };

  const SP_SVG = {
    sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/><path d="M5 3l1 2"/><path d="M19 3l-1 2"/><path d="M5 21l1-2"/><path d="M19 21l-1-2"/></svg>',
    mic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
    wrench: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    zap: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    msgSq: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    trendUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    palette: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    box: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    search: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    attach: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>',
    smartphone: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    moon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  };

  const SP_TEMPLATES = [
    { icon: SP_SVG.wrench, label: "🛠️ Super Debug", prompt: "Analise o código, identifique bugs e vulnerabilidades de segurança. Corrija-os aplicando tratamento de erros robusto e explique as melhorias." },
    { icon: SP_SVG.shield, label: "🛡️ Segurança", prompt: "Analise o projeto para conformidade com a LGPD, sanitize todos os inputs e adicione uma barra de consentimento de cookies moderna se necessário." },
    { icon: SP_SVG.zap, label: "⚡ Performance", prompt: "Otimize a performance do carregamento, aplique lazy loading em imagens e reduza o tempo de execução do JS para atingir nota máxima no PageSpeed." },
    { icon: SP_SVG.palette, label: "🎨 UI Premium", prompt: "Melhore a estética da interface usando princípios modernos de design (espaçamento, cores harmônicas e tipografia) para um visual de software premium." },
    { icon: SP_SVG.smartphone, label: "📱 Mobile First", prompt: "Ajuste todo o CSS para ser 100% responsivo, focando em uma experiência perfeita em dispositivos móveis e tablets." },
    { icon: SP_SVG.moon, label: "🌙 Dark Mode", prompt: "Implemente um sistema de tema escuro (Dark Mode) completo e elegante, com uma alternância suave e cores que reduzam o cansaço visual." },
    { icon: SP_SVG.edit, label: "✍️ Copywriting", prompt: "Reescreva os textos e a estrutura desta página usando técnicas de Copywriting e Neuromarketing para aumentar drasticamente a conversão e vendas." },
    { icon: SP_SVG.trendUp, label: "📈 SEO Pro", prompt: "Monte um plano de SEO técnico completo, otimizando meta tags, estrutura de headers e sitemap para indexação máxima no Google." },
    { icon: SP_SVG.box, label: "🏗️ Arquitetura", prompt: "Refatore e reorganize o código em uma arquitetura limpa e modular, separando a lógica em componentes reutilizáveis e fáceis de manter." }
  ];

  function spEscapeHtml(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function spTemplateStatusBadge(status) {
    if (status === 'trial') return '<span class="sp-status-badge sp-badge-test">TEST</span>';
    return '<span class="sp-status-badge sp-badge-pro">PRO</span>';
  }

  function spTemplateAlert(title, message) {
    return '<div class="sp-alert-box">' +
      '<div class="sp-alert-icon">✅</div>' +
      '<div class="sp-alert-title">' + spEscapeHtml(title) + '</div>' +
      '<div class="sp-alert-message">' + spEscapeHtml(message) + '</div>' +
      '<button class="sp-alert-ok">OK</button>' +
    '</div>';
  }

  // Template de Banner de Atualização removido

  function spTemplateCountdown(label, timeStr, pct, urgentClass) {
    return '<div class="sp-countdown-row">' +
      '<span>&#x23F3;</span>' +
      '<span class="sp-countdown-label">' + label + '</span>' +
      '<span class="sp-countdown-time">' + timeStr + '</span>' +
    '</div>' +
    '<div class="sp-trial-bar">' +
      '<div class="sp-trial-bar-fill' + urgentClass + '" style="width:' + pct + '%"></div>' +
    '</div>';
  }

  function spTemplateAttachItem(f, index) {
    const safeName = spEscapeHtml(f.file_name);
    const thumb = f.previewUrl
      ? '<img class="sp-attach-thumb" src="' + f.previewUrl + '" alt="' + safeName + '">'
      : '<div class="sp-attach-icon">&#128196;</div>';
    return '<div class="sp-attach-item' + (f.uploading ? ' sp-attach-uploading' : '') + '">' +
      thumb +
      '<div class="sp-attach-info">' +
        '<span class="sp-attach-name" title="' + safeName + '">' + safeName + '</span>' +
        '<span class="sp-attach-size">' + spEscapeHtml(f.sizeLabel) + '</span>' +
      '</div>' +
      '<button class="sp-attach-remove" type="button" data-idx="' + index + '" title="Remover anexo" aria-label="Remover anexo ' + safeName + '">&times;</button>' +
    '</div>';
  }

  function spFormatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function spTemplateTabs(activeTab, msgCount) {
    var countBadge = msgCount > 0 ? '<span class="sp-tab-badge">' + msgCount + '</span>' : '';
    return '<div class="sp-tabs">' +
      '<button class="sp-tab' + (activeTab === 'prompt' ? ' sp-tab-active' : '') + '" data-tab="prompt">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
        ' Prompt' +
      '</button>' +
      '<button class="sp-tab' + (activeTab === 'history' ? ' sp-tab-active' : '') + '" data-tab="history">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        ' Histórico ' + countBadge +
      '</button>' +
    '</div>';
  }

  function spTemplateChatEmpty() {
    return '<div class="sp-chat-empty">' +
      '<div class="sp-chat-empty-icon">&#128172;</div>' +
      '<div class="sp-chat-empty-title">Nenhuma mensagem</div>' +
      '<div class="sp-chat-empty-desc">Seus prompts enviados aparecerão aqui como histórico.</div>' +
    '</div>';
  }

  function spFormatChatDate(dateStr) {
    var d = new Date(dateStr);
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var diff = (today - msgDay) / 86400000;
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][d.getDay()];
    return d.toLocaleDateString('pt-BR');
  }

  function spFormatChatTime(dateStr) {
    var d = new Date(dateStr);
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }

  function spTemplateChatBubble(msg) {
    var statusClass = msg.status === 'error' ? 'sp-chat-status-err' : 'sp-chat-status-ok';
    var statusText = msg.status === 'error' ? 'Erro' : 'Enviado';
    var truncated = msg.text.length > 300 ? spEscapeHtml(msg.text.substring(0, 300)) + '…' : spEscapeHtml(msg.text);
    return '<div class="sp-chat-bubble" title="' + spEscapeHtml(msg.text) + '">' +
      truncated +
      '<div class="sp-chat-meta">' +
        '<span class="sp-chat-status ' + statusClass + '">' + statusText + '</span>' +
        '<span class="sp-chat-time">' + spFormatChatTime(msg.timestamp) + '</span>' +
        '<span class="sp-chat-check">>></span>' +
      '</div>' +
    '</div>';
  }

  function spTemplateChatHistory(messages) {
    if (!messages || !messages.length) return spTemplateChatEmpty();
    var html = '<div class="sp-chat-messages">';
    var lastDate = '';
    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      var dateLabel = spFormatChatDate(m.timestamp);
      if (dateLabel !== lastDate) {
        html += '<div class="sp-chat-date-divider"><span class="sp-chat-date-label">' + dateLabel + '</span></div>';
        lastDate = dateLabel;
      }
      html += spTemplateChatBubble(m);
    }
    html += '</div>';
    html += '<div class="sp-chat-actions">' +
      '<span class="sp-chat-count">' + messages.length + ' mensagen' + (messages.length === 1 ? '' : 's') + '</span>' +
      '<button class="sp-chat-clear" id="sp-chat-clear">Limpar Histórico</button>' +
    '</div>';
    return html;
  }


  let sessionId = null, userName = null, expiresAt = null, licenseStatus = null, heartbeatInterval = null, deviceId = null;
  let heartbeatFailureCount = 0;
  let spIsRecording = false;
  let spAttachedFiles = [];
  let spActiveTab = 'prompt';
  let spChatHistory = [];
  let spRemoteConfig = JSON.parse(JSON.stringify(DEFAULT_REMOTE_CONFIG));
  let API_VALIDATE_URL = DEFAULT_API_VALIDATE_URL;
  let API_PROXY_COMMAND_URL = FIXED_API_PROXY_COMMAND_URL;
  let spConfigState = { loaded: false, source: 'default', error: '' };
  const SP_MAX_FILES = 15;
  const SP_MAX_FILE_SIZE = 20 * 1024 * 1024;
  const SP_HISTORY_KEY = 'fl_chat_history';
  const SP_MAX_HISTORY = 200;
  const SP_REMOTE_CONFIG_CACHE_KEY = 'fl_remote_config_cache';
  const SP_EXTENSION_VERSION = (chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().version) || '0.0.0';
  const SP_VALIDATE_TTL_MS = 10 * 60 * 1000;
  function safeSendMessage(msg) {
    return new Promise((resolve, reject) => {
      try {
        if (!chrome.runtime || !chrome.runtime.id) return reject(new Error("Extension context invalidated"));
        chrome.runtime.sendMessage(msg, (resp) => {
          if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
          resolve(resp);
        });
      } catch(e) { reject(new Error("Extension context invalidated")); }
    });
  }

  function bgFetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!chrome.runtime || !chrome.runtime.id) return reject(new Error("Extension context invalidated"));
        chrome.runtime.sendMessage({ action: "proxyFetch", url, method: opts.method || "POST", headers: opts.headers || {}, body: opts.body || null }, (resp) => {
          if(chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
          if(!resp) return reject(new Error("No response"));
          if(resp.data && typeof resp.data === "object") resolve(resp.data);
          else if(!resp.ok) reject(new Error("Fetch failed (" + resp.status + ")"));
          else resolve(resp.data);
        });
      } catch(e) { reject(new Error("Extension context invalidated")); }
    });
  }

  function getDeviceId() {
    return getHardwareFingerprint();
  }

  function spGetBranding() {
    return spRemoteConfig.branding || DEFAULT_REMOTE_CONFIG.branding;
  }

  function spGetUpdateConfig() {
    return spRemoteConfig.update || DEFAULT_REMOTE_CONFIG.update;
  }

  function spGetAnnouncementConfig() {
    return spRemoteConfig.announcement || DEFAULT_REMOTE_CONFIG.announcement;
  }

  function spGetCommunityUrl() {
    const announcement = spGetAnnouncementConfig();
    return (announcement && announcement.community_url) || "";
  }

  function spRenderAnnouncementBody(bodyText) {
    const normalizedBody = String(bodyText || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
    const parts = normalizedBody.split(/\n\s*\n/).map(s => String(s || '').trim()).filter(Boolean);
    if (!parts.length) return '';
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      const style = isLast
        ? 'margin-bottom:0; color:var(--fl-text-primary); font-weight:700;'
        : 'margin-bottom:12px;';
      return '<p style="' + style + '">' + spEscapeHtml(part) + '</p>';
    }).join('');
  }

  function spApplyApiConfig() {
    const apiConfig = spRemoteConfig.api || DEFAULT_REMOTE_CONFIG.api;
    API_VALIDATE_URL = (apiConfig && apiConfig.validate_license_url) || DEFAULT_API_VALIDATE_URL;
    API_PROXY_COMMAND_URL = FIXED_API_PROXY_COMMAND_URL;
  }

  function spApplyUpdateFromValidation(data) {
    if (!data || typeof data !== 'object') return;
    const currentUpdate = spGetUpdateConfig();
    spRemoteConfig.update = Object.assign({}, currentUpdate, {
      force_update: typeof data.force_update === 'boolean' ? data.force_update : currentUpdate.force_update
    });
  }

  function spApplyValidationState(data, licenseKey, onDone) {
    const res = data || {};
    sessionId = res.session_id || ('local-' + Date.now());
    userName = res.user_name || 'Olá, seja bem vindo!';
    licenseStatus = res.status || 'active';
    expiresAt = res.expires_at || new Date(Date.now() + 26913 * 24 * 60 * 60 * 1000).toISOString();
    heartbeatFailureCount = 0;
    spApplyUpdateFromValidation(res);
    chrome.storage.local.set({
      fl_license_key: licenseKey,
      fl_session_id: sessionId,
      fl_user_name: userName,
      fl_user_id: res.user_id || '',
      fl_expires_at: expiresAt,
      fl_activated_at: res.activated_at || new Date().toISOString(),
      fl_license_status: licenseStatus,
      fl_last_validate_at: new Date().toISOString()
    }, () => {
      if (onDone) onDone();
    });
  }

  function spRenderStateScreen(title, message, primaryLabel, primaryAction, secondaryLabel, secondaryAction) {
    const body = document.getElementById('sp-body');
    if (!body) return;
    spSetShellVisible(false);
    body.innerHTML =
      '<div class="fl-auth-screen">' +
        '<div class="fl-auth-card" style="max-width:340px">' +
          '<div class="fl-auth-title">' + spEscapeHtml(title) + '</div>' +
          '<div class="fl-auth-subtitle">' + spEscapeHtml(message) + '</div>' +
          '<button id="sp-state-primary" class="sp-btn-primary" style="margin-top:16px;">' + spEscapeHtml(primaryLabel) + '</button>' +
          (secondaryLabel ? '<button id="sp-state-secondary" class="sp-btn-primary" style="margin-top:10px; background:transparent; color:var(--fl-text-primary); border:1px solid var(--fl-border);">' + spEscapeHtml(secondaryLabel) + '</button>' : '') +
        '</div>' +
      '</div>';
    const primaryButton = document.getElementById('sp-state-primary');
    if (primaryButton && primaryAction) primaryButton.addEventListener('click', primaryAction);
    const secondaryButton = document.getElementById('sp-state-secondary');
    if (secondaryButton && secondaryAction) secondaryButton.addEventListener('click', secondaryAction);
  }

  function spMergeRemoteConfig(rawConfig) {
    const nextConfig = JSON.parse(JSON.stringify(DEFAULT_REMOTE_CONFIG));
    if (!rawConfig || typeof rawConfig !== 'object') return nextConfig;
    if (rawConfig.branding && typeof rawConfig.branding === 'object') {
      Object.assign(nextConfig.branding, rawConfig.branding);
    }
    if (rawConfig.ui && typeof rawConfig.ui === 'object') {
      Object.assign(nextConfig.ui, rawConfig.ui);
    }
    if (rawConfig.update && typeof rawConfig.update === 'object') {
      Object.assign(nextConfig.update, rawConfig.update);
    }
    if (rawConfig.announcement && typeof rawConfig.announcement === 'object') {
      Object.assign(nextConfig.announcement, rawConfig.announcement);
    }
    if (rawConfig.api && typeof rawConfig.api === 'object') {
      Object.assign(nextConfig.api, rawConfig.api);
    }
    return nextConfig;
  }

  function spCompareVersions(left, right) {
    const leftParts = String(left || '').split('.').map(p => parseInt(p, 10) || 0);
    const rightParts = String(right || '').split('.').map(p => parseInt(p, 10) || 0);
    const maxLen = Math.max(leftParts.length, rightParts.length);
    for (let i = 0; i < maxLen; i++) {
      const a = leftParts[i] || 0;
      const b = rightParts[i] || 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  }

  function spNeedsForcedUpdate() {
    const update = spGetUpdateConfig();
    if (!update.force_update || !update.min_version) return false;
    return spCompareVersions(SP_EXTENSION_VERSION, update.min_version) < 0;
  }

  function spShowVersionInfo() {
    const update = spGetUpdateConfig();
    const latestVersion = update.latest_version || SP_EXTENSION_VERSION;
    const isUpdated = spCompareVersions(SP_EXTENSION_VERSION, latestVersion) >= 0;
    const statusLabel = isUpdated ? 'Atualizada' : 'Nova versão disponível';
    const statusColor = isUpdated ? '#22c55e' : '#f59e0b';
    const featuresRaw = String(update.features || '').replace(/\\n/g, '\n').trim();
    const featureItems = featuresRaw
      ? featuresRaw
          .split(/\r?\n|(?=\s*-\s)/)
          .map(item => item.replace(/^\s*-\s*/, '').trim())
          .filter(Boolean)
      : [];
    const featuresHtml = featureItems.length
      ? '<ul style="margin:0;padding-left:18px;line-height:1.55;">' + featureItems.map(item => '<li>' + spEscapeHtml(item) + '</li>').join('') + '</ul>'
      : 'Nenhuma novidade informada para esta versão.';

    const existing = document.querySelector('.sp-version-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'sp-alert-overlay sp-version-overlay';
    overlay.innerHTML =
      '<div class="sp-alert-box" style="max-width:360px;text-align:left;">' +
        '<div class="sp-alert-title">Versão da extensão</div>' +
        '<div class="sp-alert-message" style="text-align:left;">' +
          '<div style="margin-bottom:10px;"><strong>Versão atual:</strong> ' + spEscapeHtml(SP_EXTENSION_VERSION) + '</div>' +
          '<div style="margin-bottom:10px;"><strong>Última versão:</strong> ' + spEscapeHtml(latestVersion) + '</div>' +
          '<div style="margin-bottom:12px;"><strong>Status:</strong> <span style="color:' + statusColor + ';font-weight:700;">' + spEscapeHtml(statusLabel) + '</span></div>' +
          '<div style="margin-bottom:6px;"><strong>Novidades:</strong></div>' +
          '<div style="line-height:1.55;">' + featuresHtml + '</div>' +
        '</div>' +
        (update.download_url && !isUpdated ? '<button id="sp-version-download" class="sp-btn-primary" style="margin-top:14px;">Baixar atualização</button>' : '') +
        '<button class="sp-alert-ok" style="margin-top:10px;">Fechar</button>' +
      '</div>';
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('.sp-alert-ok')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const downloadBtn = document.getElementById('sp-version-download');
    if (downloadBtn && update.download_url) {
      downloadBtn.addEventListener('click', () => {
        try {
          window.open(update.download_url, '_blank', 'noopener,noreferrer');
        } catch (err) {
          location.href = update.download_url;
        }
      });
    }
  }

  function spCreateRequestMeta() {
    return {
      request_nonce: crypto.randomUUID(),
      requested_at: new Date().toISOString()
    };
  }

  function spCreateBrowserSessionId() {
    return 'bsess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function spValidateResponseMeta(responseMeta, expectedNonce, expectedDeviceId) {
    if (!responseMeta || typeof responseMeta !== 'object') return false;
    if (!responseMeta.request_nonce || responseMeta.request_nonce !== expectedNonce) return false;
    if (!responseMeta.issued_at || !responseMeta.expires_at) return false;
    const issuedAt = new Date(responseMeta.issued_at).getTime();
    const expiresAt = new Date(responseMeta.expires_at).getTime();
    const now = Date.now();
    if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) return false;
    if (issuedAt > now + 10000) return false;
    if (expiresAt <= now) return false;
    if (expiresAt - issuedAt > 10 * 60 * 1000) return false;
    return true;
  }

  function spRenderShell() {
    const root = document.getElementById('sp-root');
    if (!root) return;

    const currentBody = document.getElementById('sp-body');
    const bodyHtml = currentBody
      ? currentBody.innerHTML
      : '<div class="sp-license-gate" id="sp-loading" style="padding:40px 0;text-align:center"><p style="color:var(--fl-text-muted)">&#x23f3; Carregando...</p></div>';

    root.innerHTML =
      '<div class="sp-header">' +
        '<div class="sp-brand">' +
          '<img src="icon.png" width="20" height="20" alt="Logo" style="flex-shrink:0;">' +
          '<span class="sp-brand-text">Painel</span>' +
        '</div>' +
        '<div class="sp-header-actions">' +
          '<button class="sp-icon-btn sp-expire-btn" id="sp-expire-btn" title="Vencimento da Licença">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '</button>' +
          '<button class="sp-icon-btn sp-version-btn" id="sp-version-btn" title="Versão e novidades">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M12 4h9"></path><path d="M4 9h16"></path><path d="M4 15h16"></path></svg>' +
          '</button>' +
          '<button class="sp-icon-btn sp-theme-btn" id="sp-theme-btn" title="Tema">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
          '</button>' +
          '<button class="sp-icon-btn sp-logout-btn" id="sp-logout-btn" title="Sair" style="display:none;color:var(--fl-danger);">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="sp-body" id="sp-body">' + bodyHtml + '</div>' +
      '<div class="sp-footer">' +
        '<a href="#" target="_blank" class="sp-support-link" style="display:none">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>' +
          'Ajuda' +
        '</a>' +
        '<a href="#" target="_blank" class="sp-community-link" style="display:none">Fa&ccedil;a parte da nossa comunidade!</a>' +
      '</div>';
  }

  function spBindShellEvents() {
    const versionBtn = document.getElementById('sp-version-btn');
    if (versionBtn && !versionBtn.dataset.bound) {
      versionBtn.dataset.bound = '1';
      versionBtn.addEventListener('click', () => {
        spShowVersionInfo();
      });
    }

    const themeBtn = document.getElementById('sp-theme-btn');
    if (themeBtn && !themeBtn.dataset.bound) {
      themeBtn.dataset.bound = '1';
      themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('sp-light');
        chrome.storage.local.set({ fl_dark_mode: !isLight });
      });
    }

    const logoutBtn = document.getElementById('sp-logout-btn');
    if (logoutBtn && !logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = '1';
      logoutBtn.addEventListener('click', () => {
        forceLicenseGate('Você saiu com sucesso.');
      });
    }
  }

  function spSetShellVisible(visible) {
    document.querySelectorAll('.sp-header, .sp-footer').forEach(el => {
      el.style.display = visible ? '' : 'none';
    });
  }

  function spApplyShellConfig() {
    spRenderShell();
    const branding = spGetBranding();
    document.title = branding.panel_title || DEFAULT_REMOTE_CONFIG.branding.panel_title;

    const brandText = document.querySelector('.sp-brand-text');
    if (brandText) brandText.textContent = branding.app_name || DEFAULT_REMOTE_CONFIG.branding.app_name;

    const supportLink = document.querySelector('.sp-support-link');
    if (supportLink) {
      const supportUrl = branding.support_url || DEFAULT_REMOTE_CONFIG.branding.support_url;
      supportLink.textContent = branding.support_label || DEFAULT_REMOTE_CONFIG.branding.support_label;
      supportLink.href = supportUrl || '#';
      supportLink.style.display = spRemoteConfig.ui && spRemoteConfig.ui.show_support_link === false ? 'none' : (supportUrl ? '' : 'none');
    }
    const communityLink = document.querySelector('.sp-community-link');
    if (communityLink) {
      const communityUrl = spGetCommunityUrl();
      communityLink.href = communityUrl || '#';
      communityLink.style.display = communityUrl ? '' : 'none';
    }
    spBindShellEvents();
  }

  function spRenderForceUpdateScreen() {
    const update = spGetUpdateConfig();
    const branding = spGetBranding();
    const body = document.getElementById('sp-body');
    if (!body) return;

    spSetShellVisible(false);
    body.innerHTML =
      '<div class="fl-auth-screen">' +
        '<div class="fl-auth-card" style="max-width:340px">' +
          '<div class="fl-auth-icon-wrap" style="background:none; border:none; box-shadow:none; margin-bottom:16px;">' +
            '<img src="icon.png" width="80" height="80" alt="Logo">' +
          '</div>' +
          '<div class="fl-auth-title">' + spEscapeHtml(branding.app_name || DEFAULT_REMOTE_CONFIG.branding.app_name) + '</div>' +
          '<div class="fl-auth-subtitle">Atualização obrigatória</div>' +
          '<div class="sp-log sp-log-warning" style="display:block; margin-top:16px;">' +
            spEscapeHtml(update.message || 'Uma nova versão é necessária para continuar usando a extensão.') +
          '</div>' +
          '<div style="margin-top:14px; color:var(--fl-text-muted); font-size:12px; line-height:1.5;">' +
            'Versão atual: ' + spEscapeHtml(SP_EXTENSION_VERSION) + '<br>' +
            'Versão mínima: ' + spEscapeHtml(update.min_version || '-') +
          '</div>' +
          (update.download_url ? '<button id="sp-force-update-btn" class="sp-btn-primary" style="margin-top:16px;">Baixar atualização</button>' : '') +
        '</div>' +
      '</div>';

    const button = document.getElementById('sp-force-update-btn');
    if (button) {
      button.addEventListener('click', () => {
        try {
          window.open(update.download_url, '_blank', 'noopener,noreferrer');
        } catch (err) {
          location.href = update.download_url;
        }
      });
    }
  }

  async function spFetchRemoteConfig() {
    try {
      const cachedConfigRaw = await new Promise(resolve => chrome.storage.local.get([SP_REMOTE_CONFIG_CACHE_KEY], resolve));
      const cachedConfig = cachedConfigRaw[SP_REMOTE_CONFIG_CACHE_KEY];
      const storageData = await new Promise(resolve => chrome.storage.local.get(["fl_license_key", "fl_session_id"], resolve));
      const requestMeta = spCreateRequestMeta();
      const resp = await safeSendMessage({
        action: "apiAction",
        subAction: "GET_CONFIG",
        payload: {
          request_nonce: requestMeta.request_nonce,
          requested_at: requestMeta.requested_at,
          extension_version: SP_EXTENSION_VERSION,
          device_id: deviceId,
          license_key: storageData.fl_license_key || "",
          session_id: storageData.fl_session_id || ""
        }
      });
      const responseOk = !!(resp && resp.ok);
      const metaValid = responseOk && spValidateResponseMeta(resp.data && resp.data.response_meta, requestMeta.request_nonce, deviceId);
      const rawConfig = responseOk ? (resp.data && (resp.data.config || resp.data.data || resp.data)) : null;
      if (rawConfig && typeof rawConfig === 'object') {
        spRemoteConfig = spMergeRemoteConfig(rawConfig);
        spConfigState = { loaded: true, source: metaValid ? 'remote' : 'remote_unverified', error: metaValid ? '' : 'response_meta_invalid' };
        chrome.storage.local.set({ [SP_REMOTE_CONFIG_CACHE_KEY]: spRemoteConfig });
      } else if (cachedConfig && typeof cachedConfig === 'object') {
        spRemoteConfig = spMergeRemoteConfig(cachedConfig);
        spConfigState = { loaded: true, source: 'cache', error: 'remote_config_missing' };
      } else {
        spRemoteConfig = JSON.parse(JSON.stringify(DEFAULT_REMOTE_CONFIG));
        spConfigState = { loaded: false, source: 'default', error: 'remote_config_missing' };
      }
    } catch (err) {
      const cachedConfigRaw = await new Promise(resolve => chrome.storage.local.get([SP_REMOTE_CONFIG_CACHE_KEY], resolve));
      const cachedConfig = cachedConfigRaw[SP_REMOTE_CONFIG_CACHE_KEY];
      if (cachedConfig && typeof cachedConfig === 'object') {
        spRemoteConfig = spMergeRemoteConfig(cachedConfig);
        spConfigState = { loaded: true, source: 'cache', error: err && err.message ? err.message : 'remote_config_unavailable' };
      } else {
        spRemoteConfig = JSON.parse(JSON.stringify(DEFAULT_REMOTE_CONFIG));
        spConfigState = { loaded: false, source: 'default', error: err && err.message ? err.message : 'remote_config_unavailable' };
      }
    }
    spApplyShellConfig();
    spApplyApiConfig();
    return { mustForceUpdate: spNeedsForcedUpdate(), configReady: spConfigState.loaded };
  }

  function showAlert(title, message) {
    const existing = document.querySelector('.sp-alert-overlay');
    if(existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'sp-alert-overlay';
    overlay.innerHTML = spTemplateAlert(title, message);
    document.body.appendChild(overlay);
    overlay.querySelector('.sp-alert-ok').addEventListener('click', () => overlay.remove());
    setTimeout(() => overlay.remove(), 4000);
  }

  function forceLicenseGate(message, options) {
    const opts = options || {};
    try { if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; } } catch(e) {}
    heartbeatFailureCount = 0;
    const keysToRemove = ["fl_session_id","fl_user_name","fl_expires_at","fl_activated_at","fl_license_status","fl_last_validate_at"];
    if (!opts.preserveLicenseKey) keysToRemove.unshift("fl_license_key");
    chrome.storage.local.remove(keysToRemove, () => {
      userName = null; expiresAt = null; licenseStatus = null; sessionId = null;
      showLicenseGate();
      setTimeout(() => {
        const log = document.getElementById('sp-license-log');
        if (log && message) {
          log.className = 'sp-log sp-log-info';
          log.textContent = message;
        }
        const input = document.getElementById('sp-license-input');
        if (input && opts.preserveLicenseKey) {
          try { input.value = opts.licenseKey || ''; } catch(e) {}
        }
        if (input) { try { input.focus(); } catch(e) {} }
      }, 50);
    });
  }

  function spIsDefinitiveSessionError(data) {
    const reason = String((data && data.reason) || '').toLowerCase();
    return ['device_conflict', 'expired', 'inactive', 'session_conflict', 'update_required'].includes(reason);
  }

  function spRestoreCachedValidationState(cached) {
    sessionId = cached.fl_session_id || sessionId || ('local-' + Date.now());
    userName = cached.fl_user_name || userName || 'OlÃ¡, seja bem vindo!';
    expiresAt = cached.fl_expires_at || expiresAt;
    licenseStatus = cached.fl_license_status || licenseStatus || 'active';
    heartbeatFailureCount = 0;
  }

  function spNeedsSessionRefresh(lastValidateAt) {
    if (!lastValidateAt) return true;
    const last = new Date(lastValidateAt).getTime();
    if (!Number.isFinite(last)) return true;
    return (Date.now() - last) > SP_VALIDATE_TTL_MS;
  }


  // Função checkForUpdate removida
  // Função checkResellerRole removida

  async function getUserId() {
    return new Promise(r => chrome.storage.local.get(["fl_user_id"], res => {
      r(res.fl_user_id || '');
    }));
  }
  function showLicenseGate() {
    if (spNeedsForcedUpdate()) {
      spRenderForceUpdateScreen();
      return;
    }
    try { if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; } } catch(e) {}
    spSetShellVisible(false);
    const body = document.getElementById('sp-body');
    if (!body) return;
    
    // Default to light theme if no preference is saved
    chrome.storage.local.get(["fl_dark_mode"], (r) => {
      if (r.fl_dark_mode === undefined) {
        document.body.classList.add('sp-light');
        chrome.storage.local.set({ fl_dark_mode: false });
      } else if (r.fl_dark_mode === false) {
        document.body.classList.add('sp-light');
      } else {
        document.body.classList.remove('sp-light');
      }
      renderGate();
    });

    function renderGate() {
      const announcement = spGetAnnouncementConfig();
      const hasAnnouncement = !!(
        announcement &&
        announcement.enabled === true &&
        (String(announcement.title || '').trim() || String(announcement.body || '').trim())
      );

      if (hasAnnouncement) {
        renderAnnouncementGate(announcement);
        return;
      }

      renderLicenseGate();
    }

    function bindThemeButtons() {
      const darkBtn = document.getElementById('sp-theme-dark-choice');
      const lightBtn = document.getElementById('sp-theme-light-choice');
      const updateThemeButtons = () => {
        const isLight = document.body.classList.contains('sp-light');
        if (darkBtn) darkBtn.classList.toggle('active', !isLight);
        if (lightBtn) lightBtn.classList.toggle('active', isLight);
      };

      if (darkBtn) darkBtn.addEventListener('click', () => {
        document.body.classList.remove('sp-light');
        chrome.storage.local.set({ fl_dark_mode: true });
        updateThemeButtons();
      });
      if (lightBtn) lightBtn.addEventListener('click', () => {
        document.body.classList.add('sp-light');
        chrome.storage.local.set({ fl_dark_mode: false });
        updateThemeButtons();
      });

      updateThemeButtons();
    }

    function renderThemeToggle() {
      return `
        <div class="fl-theme-toggle">
          <button id="sp-theme-light-choice" class="fl-theme-btn" title="Modo Claro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <button id="sp-theme-dark-choice" class="fl-theme-btn" title="Modo Escuro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
      `;
    }

    function renderAnnouncementGate(announcement) {
      const title = String(announcement.title || '').trim();
      const bodyHtml = spRenderAnnouncementBody(announcement.body || '');
      const communityUrl = spGetCommunityUrl();
      const communityLabel = String(announcement.community_label || '').trim();
      const continueLabel = String(announcement.continue_label || '').trim() || 'Continuar';
      const waitSeconds = 10;

      body.innerHTML = `
        <div class="fl-auth-screen">
          ${renderThemeToggle()}

          <div class="fl-auth-card fl-announcement-card" style="max-width: 420px;">
            <button id="sp-announcement-close" class="fl-announcement-close-btn" title="Fechar comunicado" aria-label="Fechar comunicado">&times;</button>
            <div class="fl-auth-icon-wrap" style="background:none; border:none; box-shadow:none; margin-bottom: 14px;">
              <img src="icon.png" width="72" height="72" alt="Logo">
            </div>
            ${title ? '<div class="fl-auth-title">' + spEscapeHtml(title) + '</div>' : ''}
            <div class="fl-auth-subtitle fl-announcement-scroll" style="max-width:none; text-align:left; line-height:1.55; color:var(--fl-text-secondary); margin-top:14px; font-weight:500;">
              ${bodyHtml}
            </div>
            ${communityUrl && communityLabel ? '<a id="sp-announcement-community-link" href="' + spEscapeHtml(communityUrl) + '" target="_blank" class="sp-btn-secondary" style="margin-top:0;">' + spEscapeHtml(communityLabel) + '</a>' : ''}
            <button id="sp-announcement-continue" class="sp-btn-primary" style="margin-top:18px;" disabled>${spEscapeHtml(continueLabel)} (${waitSeconds}s)</button>
          </div>
        </div>
      `;

      bindThemeButtons();
      const continueBtn = document.getElementById('sp-announcement-continue');
      const closeBtn = document.getElementById('sp-announcement-close');
      let remainingSeconds = waitSeconds;
      const enableContinue = () => {
        if (continueBtn) {
          continueBtn.disabled = false;
          continueBtn.textContent = continueLabel;
        }
        if (closeBtn) closeBtn.disabled = false;
      };

      if (closeBtn) closeBtn.disabled = true;
      const countdown = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          clearInterval(countdown);
          enableContinue();
          return;
        }
        if (continueBtn) continueBtn.textContent = continueLabel + ' (' + remainingSeconds + 's)';
      }, 1000);

      continueBtn?.addEventListener('click', () => {
        clearInterval(countdown);
        renderLicenseGate();
      });
      closeBtn?.addEventListener('click', () => {
        if (closeBtn.disabled) return;
        clearInterval(countdown);
        renderLicenseGate();
      });
    }

    function renderLicenseGate() {
      body.innerHTML = `
        <div class="fl-auth-screen">
          ${renderThemeToggle()}

          <div class="fl-auth-card">
            <div class="fl-auth-icon-wrap" style="background:none; border:none; box-shadow:none; margin-bottom: 16px;">
              <img src="icon.png" width="80" height="80" alt="Logo">
            </div>
            <div class="fl-auth-title">${spEscapeHtml(spGetBranding().license_title || DEFAULT_REMOTE_CONFIG.branding.license_title)}</div>
            <div class="fl-auth-subtitle">${spEscapeHtml(spGetBranding().license_subtitle || DEFAULT_REMOTE_CONFIG.branding.license_subtitle)}</div>
            
            <div class="fl-input-group">
              <div class="fl-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input id="sp-license-input" class="fl-auth-input" type="password" placeholder="Chave de licença" autocomplete="off">
            </div>

            <button id="sp-license-btn" class="sp-btn-primary">Ativar licença</button>
            <button id="sp-transfer-device-btn" class="sp-btn-primary" style="display:none; margin-top:10px; background:#27272a; border:1px solid rgba(255,255,255,0.08);">Usar neste dispositivo</button>
            ${(spRemoteConfig.ui && spRemoteConfig.ui.show_support_link === false) ? '' : '<a href="' + spEscapeHtml(spGetBranding().support_url || DEFAULT_REMOTE_CONFIG.branding.support_url) + '" target="_blank" style="display:block; text-align:center; padding:10px; margin-top:12px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid var(--fl-border); color:var(--fl-text-muted); text-decoration:none; font-size:11px; font-weight:700; transition:all 0.2s; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 8px rgba(0,0,0,0.2);">' + spEscapeHtml(spGetBranding().support_label || DEFAULT_REMOTE_CONFIG.branding.support_label) + '</a>'}
            ${spGetCommunityUrl() ? '<a href="' + spEscapeHtml(spGetCommunityUrl()) + '" target="_blank" class="sp-community-link" style="margin-top:10px;">Fa&ccedil;a parte da nossa comunidade!</a>' : ''}
            <div id="sp-license-log" class="sp-log"></div>
          </div>
        </div>
      `;

      const btn = document.getElementById('sp-license-btn');
      const transferBtn = document.getElementById('sp-transfer-device-btn');
      const input = document.getElementById('sp-license-input');

      if (input && input.parentElement && !document.getElementById('sp-license-toggle')) {
        input.style.paddingRight = '44px';
        const toggle = document.createElement('button');
        toggle.id = 'sp-license-toggle';
        toggle.type = 'button';
        toggle.textContent = '👁';
        toggle.style.cssText = 'position:absolute;right:12px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--fl-text-muted);cursor:pointer;font-size:16px;line-height:1;padding:4px;';
        toggle.addEventListener('click', () => {
          const visible = input.getAttribute('type') === 'text';
          input.setAttribute('type', visible ? 'password' : 'text');
          toggle.textContent = visible ? '👁' : '🙈';
        });
        input.parentElement.appendChild(toggle);
      }

      bindThemeButtons();
      if (btn) btn.addEventListener('click', validateLicense);
      if (transferBtn) transferBtn.addEventListener('click', transferDeviceForCurrentLicense);
      if (input) {
        input.addEventListener('keydown', e => { if (e.key === 'Enter') validateLicense(); });
        setTimeout(() => { try { input.focus(); } catch(e) {} }, 100);
      }
    }
  }

  function spToggleTransferDeviceButton(visible) {
    const btn = document.getElementById('sp-transfer-device-btn');
    if (btn) btn.style.display = visible ? '' : 'none';
  }

  async function transferDeviceForCurrentLicense() {
    const input = document.getElementById('sp-license-input');
    const log = document.getElementById('sp-license-log');
    const key = input ? input.value.trim() : '';
    if (!key || !log) return;

    spToggleTransferDeviceButton(false);
    log.style.color = '#a1a1aa';
    log.innerHTML = 'Transferindo dispositivo...';

    try { if(!deviceId) deviceId = await getDeviceId(); } catch(e) {}

    try {
      const resp = await safeSendMessage({
        action: "apiAction",
        subAction: "TRANSFER_DEVICE",
        payload: { license_key: key, device_id: deviceId }
      });

      const res = (resp && resp.data) || {};
      if (resp && resp.ok && res.success) {
        log.style.color = '#22c55e';
        log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ' + spEscapeHtml(res.message || 'Dispositivo atualizado com sucesso.');
        setTimeout(() => validateLicense(key), 250);
        return;
      }

      log.style.color = '#ef4444';
      log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ' + spEscapeHtml(res.message || res.reason || 'Falha ao transferir dispositivo');
      spToggleTransferDeviceButton(true);
    } catch (e) {
      log.style.color = '#ef4444';
      log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Erro ao transferir dispositivo';
      spToggleTransferDeviceButton(true);
    }
  }

  async function validateLicense(licenseKeyOverride) {
    const input = document.getElementById('sp-license-input');
    const log = document.getElementById('sp-license-log');
    const key = (typeof licenseKeyOverride === 'string' && licenseKeyOverride.trim()) || (input ? input.value.trim() : '');
    chrome.storage.local.set({ fl_dark_mode: !document.body.classList.contains('sp-light') });
    if(!key) { log.style.color = '#ef4444'; log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Insira uma chave'; return; }
    spToggleTransferDeviceButton(false);
    log.style.color = '#a1a1aa'; log.innerHTML = 'Autenticando...';
    try { if(!deviceId) deviceId = await getDeviceId(); } catch(e) {}
    
    try {
      const requestMeta = spCreateRequestMeta();
      const resp = await safeSendMessage({ 
        action: "apiAction", 
        subAction: "VALIDATE_LICENSE", 
        payload: { license_key: key, device_id: deviceId, extension_version: SP_EXTENSION_VERSION, request_nonce: requestMeta.request_nonce, requested_at: requestMeta.requested_at } 
      });
      
      if (resp && resp.ok && resp.data.valid) {
        const res = resp.data;
        spApplyValidationState(res, key, () => {
          log.style.color = '#22c55e';
          log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ' + spEscapeHtml(res.message || 'Acesso liberado!');
          setTimeout(() => {
            if (spNeedsForcedUpdate()) spRenderForceUpdateScreen();
            else showMainUI();
          }, 400);
        });
      } else {
        const res = (resp && resp.data) || {};
        let friendlyMsg = (resp && resp.ok) ? 'Resposta inválida do servidor.' : (res.message || res.reason || 'Chave inválida');
        if(friendlyMsg.includes('not_found')) friendlyMsg = 'Chave não encontrada';
        else if(friendlyMsg.includes('expired')) friendlyMsg = 'Sua chave expirou';
        else if(friendlyMsg.includes('device')) friendlyMsg = 'Dispositivo não autorizado';
        log.style.color = '#ef4444';
        log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ' + friendlyMsg;
        if ((res.reason || '').includes('device_conflict')) spToggleTransferDeviceButton(true);
      }
    } catch (e) {
      log.style.color = '#ef4444';
      log.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Erro de conexão';
    }
  }
  function loadChatHistory(cb) {
    chrome.storage.local.get([SP_HISTORY_KEY], function(r) {
      spChatHistory = r[SP_HISTORY_KEY] || [];
      if (cb) cb();
    });
  }

  function saveChatHistory() {
    if (spChatHistory.length > SP_MAX_HISTORY) spChatHistory = spChatHistory.slice(-SP_MAX_HISTORY);
    chrome.storage.local.set({ [SP_HISTORY_KEY]: spChatHistory });
  }

  function addToHistory(text, status) {
    spChatHistory.push({ text: text, timestamp: new Date().toISOString(), status: status || 'ok' });
    saveChatHistory();
    updateHistoryBadge();
  }

  function updateHistoryBadge() {
    var badge = document.querySelector('.sp-tab[data-tab="history"] .sp-tab-badge');
    if (badge) badge.textContent = spChatHistory.length;
  }

  function renderHistoryTab() {
    var container = document.getElementById('sp-tab-content');
    if (!container) return;
    container.innerHTML = spTemplateChatHistory(spChatHistory);
    var msgs = container.querySelector('.sp-chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    var clearBtn = document.getElementById('sp-chat-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        spChatHistory = [];
        saveChatHistory();
        renderHistoryTab();
      });
    }
  }



  function switchTab(tab) {
    spActiveTab = tab;
    document.querySelectorAll('.sp-tab').forEach(function(t) {
      t.classList.toggle('sp-tab-active', t.getAttribute('data-tab') === tab);
    });
    if (tab === 'history') {
      loadChatHistory(function() { renderHistoryTab(); });
    } else {
      showMainUIContent();
    }
  }
  function showMainUI() {
    if (spNeedsForcedUpdate()) {
      spRenderForceUpdateScreen();
      return;
    }
    spSetShellVisible(true);
    document.querySelectorAll('.sp-header-optimize-btn, .sp-header-watermark-btn, .sp-logout-btn').forEach(el => {
      el.style.display = '';
    });
    let greeting = spEscapeHtml(userName || 'Olá, seja bem vindo!');
    let showBadge = true;

    if (greeting.trim() === 'Cliente' || greeting.toLowerCase().includes('cliente pro')) {
      greeting = 'Olá, seja bem vindo!';
    }
    
    // Força a limpeza no storage para não persistir o nome antigo
    chrome.storage.local.remove('fl_user_name');
    
    const statusBadge = spTemplateStatusBadge(licenseStatus);
    const body = document.getElementById('sp-body');
    if (body) {
      body.style.background = '';
      body.style.padding = '';
      body.style.margin = '';
    }
    loadChatHistory(function() {
      body.innerHTML = 
        '<div class="sp-profile-card">' +
          '<div class="sp-profile-top"><span class="sp-profile-name" id="sp-name">' + greeting + '</span><span id="sp-sync-badge" class="sp-status-badge sp-badge-waiting">⏳ OFF</span></div>' +
        '</div>' +
        '</div>' +
        spTemplateTabs(spActiveTab, spChatHistory.length) +
        '<div id="sp-tab-content"></div>';
      document.querySelectorAll('.sp-tab').forEach(function(t) {
        t.addEventListener('click', function() { switchTab(t.getAttribute('data-tab')); });
      });
      if (spActiveTab === 'history') {
        renderHistoryTab();
      } else {
        showMainUIContent();
      }
      updateSync();
      chrome.storage.onChanged.addListener((ch) => { if(ch.lovable_projectId || ch.lovable_token) updateSync(); });
      updateCountdown();
      checkWelcomeOnboarding();
      chrome.storage.local.get(["fl_license_key","fl_session_id"], r => {
        if(r.fl_license_key) { sessionId = r.fl_session_id || sessionId; }
      });

    });
  }

  function showMainUIContent() {
    var container = document.getElementById('sp-tab-content');
    if (!container) return;
    container.innerHTML =
      '<div id="sp-drop-zone" style="position: relative; display: flex; flex-direction: column; flex: 1; min-height: 0;">' +
        '<textarea class="sp-textarea" id="sp-msg" rows="3" placeholder="Digite seu comando..." spellcheck="false"></textarea>' +
        '<div id="sp-attach-preview" class="sp-attach-preview" style="display:none"></div>' +
        '<div class="sp-action-bar">' +
          '<div class="sp-action-left"></div>' +
          '<div class="sp-action-center">' +
            '<button class="sp-attach-btn" id="sp-attach-btn" title="Anexar arquivo">📂</button>' +
            '<button class="sp-tool-btn" id="sp-remove-watermark" title="Remover Marca de Água">🚫</button>' +
            '<button class="sp-tool-btn" id="sp-shield-btn" title="Escudo">🛡️</button>' +
            '<button class="sp-tool-btn" id="sp-optimize" title="Otimizar com IA">✨</button>' +
          '</div>' +
          '<button class="sp-send-btn" id="sp-send">Enviar</button>' +
        '</div>' +
        '<input type="file" id="sp-file-input" multiple style="display:none" accept="*/*">' +
        '<button id="sp-download-project" class="sp-watermark-btn" style="margin-top:0;background:linear-gradient(135deg,rgba(37,99,235,0.12),rgba(37,99,235,0.06));border-color:rgba(37,99,235,0.25);color:var(--fl-accent);">Baixar projeto em .zip</button>' +
        '<button id="sp-create-project" class="sp-watermark-btn" style="margin-top:8px;background:linear-gradient(135deg,rgba(16,185,129,0.14),rgba(16,185,129,0.08));border-color:rgba(16,185,129,0.28);color:var(--fl-success);">Criar novo projeto</button>' +
        '<div class="sp-log" id="sp-log"></div>' +
        '<details class="sp-shortcuts-wrap" style="margin-top:8px;">' +
          '<summary class="sp-shortcuts-title" style="cursor:pointer;user-select:none;outline:none;display:flex;align-items:center;justify-content:center;gap:4px;">ATALHOS RÁPIDOS <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sp-details-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>' +
          '<div class="sp-shortcuts-grid" id="sp-chips" style="margin-top:8px;"></div>' +
        '</details>' +
        '<div id="sp-drop-overlay" style="display: none; position: absolute; inset: 0; background: rgba(16, 185, 129, 0.15); backdrop-filter: blur(4px); border: 2px dashed var(--fl-accent, #10b981); border-radius: 16px; z-index: 10000; flex-direction: column; align-items: center; justify-content: center; color: var(--fl-accent, #10b981); font-weight: 800; pointer-events: none; font-family: \'Outfit\', sans-serif;">' +
          'Solte os arquivos para anexar' +
        '</div>' +
      '</div>';
    const chips = document.getElementById('sp-chips');
    if (chips && typeof SP_TEMPLATES !== 'undefined') {
      SP_TEMPLATES.forEach(t => {
        const chip = document.createElement('button');
        chip.className = 'sp-chip';
        chip.innerHTML = t.label; // Deixa apenas o label (que já tem o emoji)
        chip.title = t.prompt;
        chip.addEventListener('click', () => { 
          const msgArea = document.getElementById('sp-msg');
          if(msgArea) msgArea.value = t.prompt; 
        });
        chips.appendChild(chip);
      });
    }
    chrome.storage.local.set({ fl_plan_mode: false });
    setupSpFileAttachment();
    setupSpPasteAttachment();
    setupSpDragAndDrop();
    document.getElementById('sp-send').addEventListener('click', handleSend);
      document.getElementById('sp-optimize').addEventListener('click', handleOptimize);
      setupSpWatermarkButton();
      setupSpDownloadProject();
      setupSpCreateProject();

      setupSpShield();
    document.getElementById('sp-expire-btn')?.addEventListener('click', () => {
      if(!expiresAt) { showAlert('Aviso', 'Informação de expiração não disponível.'); return; }
      const date = new Date(expiresAt);
      showAlert('Vencimento ✨', 'Sua licença vence em: ' + date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    });

    const msgArea = document.getElementById('sp-msg');
    if (msgArea) {
      msgArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }
  }
  function updateSync() {
    chrome.storage.local.get(["lovable_projectId","lovable_token"], r => {
      const badge = document.getElementById('sp-sync-badge');
      if(!badge) return;
      
      // Remove listener antigo para não duplicar
      const newBadge = badge.cloneNode(true);
      badge.parentNode.replaceChild(newBadge, badge);
      
      if(r.lovable_projectId && r.lovable_token) { 
        newBadge.className = 'sp-status-badge sp-badge-pro'; 
        newBadge.textContent = '✅ PROJETO SINCRONIZADO!';
        newBadge.addEventListener('click', () => {
          showAlert('Sincronização', 'Projeto sincronizado! ID: ' + r.lovable_projectId);
        });
      }
      else { 
        newBadge.className = 'sp-status-badge sp-badge-test'; 
        newBadge.textContent = '⏳ AGUARDANDO';
        newBadge.addEventListener('click', () => {
          showAlert('Sincronização', 'Abra o projeto no Lovable e atualize a página para sincronizar.');
        });
      }
    });
  }

  function updateCountdown() {
    if(!expiresAt) return;
    const el = document.getElementById('sp-countdown');
    if(!el) return;
    el.style.display = 'flex';
    const expiresMs = new Date(expiresAt).getTime();
    
    function tick() {
      const remaining = expiresMs - Date.now();
      if(remaining <= 0) { el.innerHTML = '<span style="color:var(--fl-danger);font-weight:600;font-size:12px">⏳ Licença expirada</span>'; return; }
      const days = Math.floor(remaining / 86400000);
      const hrs = Math.floor((remaining % 86400000) / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      
      let totalDuration = 30 * 24 * 3600000; 
      if (licenseStatus === 'trial') totalDuration = 3600000;
      const pct = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
      
      let timeStr = days > 0 ? days + 'd ' + hrs + 'h ' + mins + 'm' : hrs > 0 ? hrs + 'h ' + mins + 'm ' + String(secs).padStart(2,'0') + 's' : mins + ':' + String(secs).padStart(2,'0');
      const label = licenseStatus === 'trial' ? 'Teste expira em' : 'Licença expira em';
      const urgentClass = pct < 20 ? ' sp-bar-urgent' : '';
      el.innerHTML = spTemplateCountdown(label, timeStr, pct, urgentClass);
    }
    tick();
    setInterval(tick, 1000);
  }
  function spDecodeJwtUserId(token) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
      const payload = JSON.parse(atob(padded));
      return payload.sub || payload.user_id || null;
    } catch(e) { return null; }
  }
  async function spCompressImage(file) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX_DIM = 1280;
        let w = img.width, h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w = Math.round(w * ratio); h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob((blob) => {
          if (!blob) return resolve({ file, previewUrl: null });
          resolve({ file: new File([blob], file.name, { type: outputType }), previewUrl: URL.createObjectURL(blob) });
        }, outputType, file.type === 'image/png' ? undefined : 0.8);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve({ file, previewUrl: null }); };
      img.src = url;
    });
  }
  function spInferContentType(file) {
    if (file && typeof file.type === 'string' && file.type.trim()) return file.type;
    const name = (file && file.name ? file.name : '').toLowerCase();
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const map = {
      pdf: 'application/pdf',
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      zip: 'application/zip',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      mp4: 'video/mp4',
      webm: 'video/webm'
    };
    return map[ext] || 'application/octet-stream';
  }

  function spBuildUploadFileName(fileId, file) {
    const rawName = file && file.name ? String(file.name) : '';
    const ext = rawName.includes('.') ? rawName.split('.').pop().toLowerCase() : '';
    const safeExt = ext && /^[a-z0-9]{1,10}$/.test(ext) ? ext : 'bin';
    return fileId + '.' + safeExt;
  }

  function spGetApiBaseFromToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        const payload = JSON.parse(atob(padded));
        const iss = payload.iss || '';
        if (iss.includes('cvbgrjauqjawrsyknhyj') || iss.includes('lovable.app')) {
          return 'https://api.lovable.app';
        }
        if (iss.includes('dwpuqewnfibeldegvimp') || iss.includes('lovable.dev')) {
          return 'https://api.lovable.dev';
        }
      }
    } catch(e) {}
    return null;
  }

  function spGetApiBaseUrl(token, sourceHost) {
    if (sourceHost) {
      if (sourceHost.includes('lovable.app')) return 'https://api.lovable.app';
      if (sourceHost.includes('lovable.dev')) return 'https://api.lovable.dev';
    }
    if (token) {
      const fromToken = spGetApiBaseFromToken(token);
      if (fromToken) return fromToken;
    }
    return 'https://api.lovable.dev';
  }

  function spGetSiteBaseUrl(token, sourceHost) {
    if (sourceHost && (sourceHost.includes('lovable.app') || sourceHost.includes('lovable.dev'))) {
      return 'https://' + sourceHost;
    }
    return spGetApiBaseUrl(token, sourceHost).replace('https://api.', 'https://');
  }

  async function spUploadFileDirect(file, token, apiBase, projectId) {
    const contentType = spInferContentType(file);
    const fileName = file.name || 'file';
    const authHeaders = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    };

    const uploadUrlResp = await fetch(apiBase + '/projects/' + encodeURIComponent(projectId) + '/files/generate-upload-url', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        content_type: contentType,
        original_file_name: fileName,
        file_size_bytes: file.size,
        original_file_size_bytes: file.size
      })
    });

    if (!uploadUrlResp.ok) {
      const text = await uploadUrlResp.text().catch(() => '');
      throw new Error('generate-upload-url HTTP ' + uploadUrlResp.status + ': ' + text.slice(0, 160));
    }

    const uploadData = await uploadUrlResp.json();
    if (!uploadData || !uploadData.url || !uploadData.file_id) {
      throw new Error('generate-upload-url retornou resposta inválida.');
    }

    const putHeaders = {
      'Content-Type': contentType
    };
    if (uploadData.headers && typeof uploadData.headers === 'object') {
      Object.assign(putHeaders, uploadData.headers);
    }

    const putResp = await fetch(uploadData.url, {
      method: 'PUT',
      headers: putHeaders,
      body: file
    });

    if (!putResp.ok) {
      const text = await putResp.text().catch(() => '');
      throw new Error('upload Lovable HTTP ' + putResp.status + ': ' + text.slice(0, 160));
    }

    let downloadUrl = null;
    try {
      const storedFileName = String(uploadData.file_id).split('/').pop();
      const downloadResp = await fetch(apiBase + '/files/generate-download-url', {
        method: 'POST',
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
      download_url: downloadUrl,
      mime_type: contentType
    };
  }
  function spRenderAttachPreview() {
    const container = document.getElementById('sp-attach-preview');
    if (!container) return;
    if (spAttachedFiles.length === 0) { container.style.display = 'none'; container.innerHTML = ''; return; }
    container.style.display = 'flex';
    container.innerHTML = spAttachedFiles.map((f, i) => spTemplateAttachItem(f, i)).join('');
    container.querySelectorAll('.sp-attach-remove').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (spAttachedFiles[idx] && spAttachedFiles[idx].previewUrl) URL.revokeObjectURL(spAttachedFiles[idx].previewUrl);
        spAttachedFiles.splice(idx, 1);
        spRenderAttachPreview();
      });
    });
  }
  async function spAddFiles(files) {
    if (!files.length) return;
    const sd = await new Promise(r => chrome.storage.local.get(['lovable_token', 'lovable_sourceHost', 'lovable_projectId'], r));
    let token = sd.lovable_token || '';
    let sourceHost = sd.lovable_sourceHost || '';
    const projectId = (sd.lovable_projectId || '').trim();
    if (!projectId) { showAlert('Erro', 'Projeto nao sincronizado.'); return; }
    if (!token) { showAlert('Erro', 'Token não capturado.'); return; }
    if (token.startsWith('Bearer ')) token = token.slice(7);
    const apiBase = spGetApiBaseUrl(token, sourceHost);
    for (const file of files) {
      if (!file) continue;
      if (spAttachedFiles.length >= SP_MAX_FILES) break;
      if (file.size > SP_MAX_FILE_SIZE) { showAlert('Grande', file.name + ' excede 20MB.'); continue; }
      let processedFile = file, previewUrl = null;
      if (['image/png','image/jpeg','image/webp'].includes(file.type)) {
        const r = await spCompressImage(file);
        processedFile = r.file; previewUrl = r.previewUrl;
      }
      const idx = spAttachedFiles.length;
      spAttachedFiles.push({ file_id: null, file_name: file.name, previewUrl, file_type: processedFile.type, sizeLabel: spFormatFileSize(processedFile.size), uploading: true, rawFile: processedFile, mime_type: processedFile.type, download_url: null });
      spRenderAttachPreview();
      try {
        const res = await spUploadFileViaLovableTab(processedFile, token, apiBase, projectId);
        spAttachedFiles[idx].file_id = res.file_id;
        spAttachedFiles[idx].download_url = res.download_url;
        spAttachedFiles[idx].mime_type = res.mime_type;
        spAttachedFiles[idx].uploading = false;
        spAttachedFiles[idx].uploadFailed = false;
        spRenderAttachPreview();
      } catch(err) {
        console.warn('[FL] Lovable attachment upload failed:', err.message);
        spAttachedFiles[idx].uploading = false;
        spAttachedFiles[idx].file_id = null;
        spAttachedFiles[idx].uploadFailed = true;
        spRenderAttachPreview();
      }
    }
  }
  function setupSpPasteAttachment() {
    const msgArea = document.getElementById('sp-msg');
    if (!msgArea) return;
    msgArea.addEventListener('paste', async (event) => {
      const items = (event.clipboardData || event.originalEvent?.clipboardData)?.items || [];
      const files = [];
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
      if (!files.length) return;
      event.preventDefault();
      await spAddFiles(files);
    });
  }

  function setupSpDragAndDrop() {
    const dropZone = document.getElementById('sp-drop-zone');
    const dropOverlay = document.getElementById('sp-drop-overlay');
    if (!dropZone || !dropOverlay) return;

    let dragCounter = 0;
    dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (dragCounter === 1) dropOverlay.style.display = 'flex';
    });
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    });
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        dropOverlay.style.display = 'none';
      }
    });
    dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      dropOverlay.style.display = 'none';
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        await spAddFiles(Array.from(e.dataTransfer.files));
      }
    });
  }
  function setupSpFileAttachment() {
    const attachBtn = document.getElementById('sp-attach-btn');
    const fileInput = document.getElementById('sp-file-input');
    if (!attachBtn || !fileInput) return;
    attachBtn.addEventListener('click', () => {
      if (spAttachedFiles.length >= SP_MAX_FILES) { showAlert('Limite', 'Máximo ' + SP_MAX_FILES + ' arquivos.'); return; }
      fileInput.click();
    });
    fileInput.addEventListener('change', async () => {
      const files = Array.from(fileInput.files || []);
      fileInput.value = '';
      await spAddFiles(files);
    });
  }
  function showModoPlanoAlert() {
    const overlay = document.createElement('div');
    overlay.className = 'sp-modal-overlay';
    overlay.innerHTML = '<div class="sp-modal">' +
      '<div class="sp-modal-icon">\u26a0\ufe0f</div>' +
      '<div class="sp-modal-title">Aten\u00e7\u00e3o \u2014 Modo Plano</div>' +
      '<div class="sp-modal-body">' +
        'O <strong>Modo Plano/Pensar</strong> pode consumir cr\u00e9ditos, mas oferece um excelente aux\u00edlio. Use com modera\u00e7\u00e3o!' +
      '</div>' +
      '<div style="margin-bottom:14px;">' +
        '<div class="sp-modal-step"><span class="sp-modal-step-num">1</span><span class="sp-modal-step-text">Ative o <strong>Modo Plano</strong> e envie seu prompt pela extens\u00e3o.</span></div>' +
        '<div class="sp-modal-step"><span class="sp-modal-step-num">2</span><span class="sp-modal-step-text">O Lovable vai gerar um plano. <strong>N\u00c3O clique no bot\u00e3o "Aprovar"</strong> dentro do Lovable.</span></div>' +
        '<div class="sp-modal-step"><span class="sp-modal-step-num">3</span><span class="sp-modal-step-text"><strong>Copie o plano gerado</strong> e cole no campo de prompt da extens\u00e3o.</span></div>' +
        '<div class="sp-modal-step"><span class="sp-modal-step-num">4</span><span class="sp-modal-step-text"><strong>Desligue o Modo Plano</strong> e envie o prompt pela extens\u00e3o. Nenhum cr\u00e9dito extra ser\u00e1 consumido!</span></div>' +
      '</div>' +
      '<div class="sp-modal-check">' +
        '<input type="checkbox" id="sp-modal-dismiss" />' +
        '<label for="sp-modal-dismiss">N\u00e3o mostrar novamente</label>' +
      '</div>' +
      '<button class="sp-modal-btn" id="sp-modal-ok">Entendi!</button>' +
    '</div>';
    document.body.appendChild(overlay);
    document.getElementById('sp-modal-ok').addEventListener('click', function() {
      var dismiss = document.getElementById('sp-modal-dismiss').checked;
      if (dismiss) chrome.storage.local.set({ fl_plan_mode_alert_dismissed: true });
      overlay.remove();
    });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  async function spFindLovableTab(projectId) {
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = activeTabs && activeTabs[0];
    if (activeTab && /https:\/\/([^/]+\.)?lovable\.(dev|app)\//.test(activeTab.url || '')) {
      return activeTab;
    }

    const allTabs = await chrome.tabs.query({});
    const projectNeedle = projectId ? '/projects/' + projectId : '';
    return allTabs.find((tab) => {
      const url = tab.url || '';
      if (!/https:\/\/([^/]+\.)?lovable\.(dev|app)\//.test(url)) return false;
      return !projectNeedle || url.includes(projectNeedle);
    }) || null;
  }

  async function spUploadFileViaLovableTab(file, token, apiBase, projectId) {
    const tab = await spFindLovableTab(projectId);
    if (!tab || !tab.id) {
      throw new Error('Abra o projeto no Lovable para enviar anexos.');
    }

    const dataB64 = await fileToBase64(file);
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'FREELOVABLE_UPLOAD_ATTACHMENT',
      token,
      apiBase,
      projectId,
      file: {
        name: file.name || 'arquivo',
        mime: spInferContentType(file),
        size: file.size || 0,
        dataB64
      }
    });

    if (!response || !response.success || !response.result) {
      throw new Error((response && response.error) || 'Falha ao enviar anexo para o Lovable.');
    }

    return response.result;
  }

  var SP_WATERMARK_PROMPT = "Adicione isso ao arquivo index.css do projecto \n" +
    "a[href*=\"lovable.dev\"], \n" +
    "iframe[src*=\"lovable.dev\"],\n" +
    "div[style*=\"Edit with Lovable\"],\n" +
    ".lovable-badge {\n" +
    "  display: none !important;\n" +
    "  opacity: 0 !important;\n" +
    "  visibility: hidden !important;\n" +
    "  pointer-events: none !important;\n" +
    "  position: absolute !important;\n" +
    "  z-index: -9999 !important;\n" +
    "}";

  function setupSpWatermarkButton(){
    var btn = document.getElementById("sp-remove-watermark");
    if(!btn) return;
    btn.addEventListener("click", async function(){
      var log = document.getElementById("sp-log");
      btn.disabled = true;
      btn.textContent = "⏳";
      log.className = "sp-log";
      log.textContent = "Processando remoção...";

      try {
        var sd = await new Promise(function(r){ chrome.storage.local.get(["lovable_projectId","lovable_token","fl_license_key","fl_session_id"], r); });
        var token = sd.lovable_token || "";
        var pid = sd.lovable_projectId || "";
        var licKey = sd.fl_license_key || "";

        if(!pid || !token){
          log.className = "sp-log sp-log-error";
          log.textContent = "⚠️ Projeto não sincronizado.";
          btn.disabled = false;
          btn.textContent = "🚫";
          return;
        }

        if(token.startsWith("Bearer ")) token = token.slice(7);

        var payload = {
          license_key: licKey,
          session_id: sessionId,
          device_id: deviceId,
          projeto_id: pid,
          token_lovable: token,
          mensagem: SP_WATERMARK_PROMPT,
          modo_pensar: false
        };

        var result = await safeSendMessage({
          action: "proxyFetch", // Usa o proxy de comando oficial
          url: API_PROXY_COMMAND_URL,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        // Corrige a leitura da resposta do proxyFetch
        if (result && result.data) result = result.data;

        if(result && result.success === false){
          throw new Error(result.error_display || result.message || "Erro no envio");
        }

        log.className = "sp-log sp-log-success";
        log.textContent = "\u2713 Marca de \u00e1gua removida com sucesso!";
      } catch(err) {
        log.className = "sp-log sp-log-error";
        log.textContent = "\u2717 " + (err.message || err);
      } finally {
        btn.disabled = false;
        btn.textContent = "🚫";
      }
    });
  }
  function setupSpDownloadProject() {
    var btn = document.getElementById('sp-download-project');
    if (!btn) return;
    btn.addEventListener('click', async function() {
      var log = document.getElementById('sp-log');
      var originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Preparando...';
      if (log) { log.className = 'sp-log sp-log-info'; log.textContent = 'Verificando token e projeto...'; }
      try {
        var sd = await new Promise(function(r) { chrome.storage.local.get(['lovable_token', 'lovable_projectId', 'lovable_sourceHost'], r); });
        var authToken = sd.lovable_token || '';
        var storedProjectId = sd.lovable_projectId || '';
        var sourceHost = sd.lovable_sourceHost || '';
        if (authToken.indexOf('Bearer ') === 0) authToken = authToken.slice(7);
        var apiBase = spGetApiBaseUrl(authToken, sourceHost);

        var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        var currentTab = tabs[0];
        var projectId = storedProjectId;
        if (!projectId && currentTab && currentTab.url) {
          var urlMatch = currentTab.url.match(/\/projects\/([a-f0-9-]+)/i);
          if (urlMatch) projectId = urlMatch[1];
        }

        if (!projectId) throw new Error('Abra uma página de projeto do Lovable primeiro.');
        if (!authToken) throw new Error('Token não encontrado. Abra um projeto no Lovable e aguarde a sincronização.');

        if (log) log.textContent = 'Baixando arquivos do projeto...';
        btn.textContent = 'Baixando...';

        var dlResponse = await new Promise(function(resolve) {
          chrome.runtime.sendMessage({ action: 'downloadProject', projectId: projectId, token: authToken }, function(resp) { resolve(resp); });
        });
        if (!dlResponse || !dlResponse.success) throw new Error(dlResponse && dlResponse.error ? dlResponse.error : 'Download falhou');

        var files = dlResponse.files;
        if (!files || files.length === 0) throw new Error('Nenhum arquivo encontrado no projeto.');
        if (typeof JSZip === 'undefined') throw new Error('Biblioteca JSZip não carregada.');

        if (log) log.textContent = 'Criando ZIP com ' + files.length + ' arquivos...';
        btn.textContent = 'Empacotando...';

        var zip = new JSZip();
        var imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp', '.tiff'];
        var addedFiles = 0;

        for (var fi = 0; fi < files.length; fi++) {
          var f = files[fi];
          if (!f || !f.name || f.sizeExceeded) continue;
          if (f.contents && f.binary) {
            zip.file(f.name, f.contents, { base64: true, binary: true });
            addedFiles++;
            continue;
          }
          if (!f.contents && imageExts.some(function(ext) { return f.name.toLowerCase().endsWith(ext); })) {
            try {
              var imgUrl = apiBase + '/projects/' + projectId + '/files/raw?path=' + encodeURIComponent(f.name);
              var imgResp = await fetch(imgUrl, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken, 'Accept': '*/*' }
              });
              if (imgResp.ok) {
                zip.file(f.name, await imgResp.arrayBuffer(), { binary: true });
                addedFiles++;
                continue;
              }
            } catch (imgErr) {}
          }
          if (f.contents) {
            zip.file(f.name, f.contents);
            addedFiles++;
          }
        }

        if (log) log.textContent = 'Comprimindo ' + addedFiles + ' arquivos...';
        var zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });
        var timestamp = new Date().toISOString().split('T')[0];
        var zipName = 'lovable-' + projectId.substring(0, 8) + '-' + timestamp + '.zip';
        var url = URL.createObjectURL(zipBlob);
        var a = document.createElement('a');
        a.href = url;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (log) { log.className = 'sp-log sp-log-success'; log.textContent = addedFiles + ' arquivos baixados com sucesso!'; }
        btn.textContent = 'Download concluído!';
        setTimeout(function() { btn.disabled = false; btn.textContent = originalLabel; }, 1600);
      } catch (err) {
        if (log) { log.className = 'sp-log sp-log-error'; log.textContent = err.message || 'Falha ao baixar projeto.'; }
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  }

  function setupSpCreateProject() {
    const btn = document.getElementById('sp-create-project');
    if (!btn) return;
    btn.addEventListener('click', async function() {
      const log = document.getElementById('sp-log');
      const originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Abrindo...';

      try {
        const sd = await new Promise(r => chrome.storage.local.get(['lovable_token', 'lovable_sourceHost'], r));
        const token = sd.lovable_token || '';
        const sourceHost = sd.lovable_sourceHost || '';
        const siteBase = spGetSiteBaseUrl(token, sourceHost);
        const targetHost = siteBase.replace(/^https?:\/\//, '').replace(/\/+$/, '');

        await chrome.storage.local.set({
          fl_create_project_pending: {
            enabled: true,
            prompt: '.',
            createdAt: Date.now(),
            targetHost: targetHost
          }
        });

        await chrome.tabs.create({ url: siteBase, active: true });

        if (log) {
          log.className = 'sp-log sp-log-info';
          log.textContent = 'Nova aba aberta. Criando projeto...';
        }
      } catch (err) {
        if (log) {
          log.className = 'sp-log sp-log-error';
          log.textContent = err && err.message ? err.message : 'Falha ao abrir novo projeto.';
        }
      } finally {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  }

  async function handleSend() {
    const msg = document.getElementById('sp-msg').value.trim();
    const modoPlano = false;
    const log = document.getElementById('sp-log');
    const btn = document.getElementById('sp-send');
    if(!msg && spAttachedFiles.length === 0) { log.className = 'sp-log sp-log-error'; log.textContent = '⚠ Prompt vazio'; return; }
    btn.disabled = true; btn.textContent = '\u23f3';

    const filesToUpload = spAttachedFiles.filter(f => !f.uploading);
    const hasUploadingFiles = spAttachedFiles.some(f => f.uploading);
    if (hasUploadingFiles) {
      log.className = 'sp-log sp-log-warning';
      log.textContent = '⏳ Aguarde o upload dos arquivos...';
      btn.disabled = false;
      btn.textContent = 'Enviar';
      return;
    }

    if (filesToUpload.length > 0) {
      log.className = 'sp-log sp-log-info'; log.textContent = '📎 Preparando ' + filesToUpload.length + ' anexo(s)...';
    } else {
      log.className = 'sp-log sp-log-info'; log.textContent = '\u23f3 Enviando...';
    }

    try {
      const sessionOk = await ensureFreshLicenseSession(false);
      if (!sessionOk) {
        btn.disabled = false; btn.textContent = 'Enviar';
        return;
      }

      const sd = await new Promise(r => chrome.storage.local.get(["lovable_projectId","lovable_token","lovable_sourceHost","fl_license_key","fl_session_id","fl_hw_fingerprint"], r));
      let token = (sd.lovable_token || '').trim(); 
      const pid = (sd.lovable_projectId || '').trim(); 
      const licKey = (sd.fl_license_key || '').trim();
      const sourceHost = sd.lovable_sourceHost || '';

      if(!pid || !token) { 
        log.className = 'sp-log sp-log-error'; 
        log.textContent = '⚠ Projeto não sincronizado'; 
        btn.disabled = false; btn.textContent = 'Enviar'; 
        return; 
      }

      // Limpeza profunda do token
      if(token.toLowerCase().startsWith('bearer ')) {
        token = token.substring(7).trim();
      }

      const apiBase = spGetApiBaseUrl(token, sourceHost);
      const pendingFiles = filesToUpload.filter(f => !f.file_id || f.uploadFailed);
      if (pendingFiles.length > 0) {
        log.className = 'sp-log sp-log-info';
        log.textContent = '📎 Enviando anexo(s) para o Lovable...';
        for (const f of pendingFiles) {
          if (!f.rawFile) throw new Error('Anexo indisponível. Remova e anexe novamente.');
          const res = await spUploadFileViaLovableTab(f.rawFile, token, apiBase, pid);
          f.file_id = res.file_id;
          f.download_url = res.download_url;
          f.mime_type = res.mime_type || f.mime_type || f.file_type;
          f.uploadFailed = false;
          f.uploading = false;
        }
        spRenderAttachPreview();
      }

      const doneFiles = filesToUpload.filter(f => f.file_id && !f.uploadFailed);
      const filesPayload = doneFiles.map(f => ({
        file_id: f.file_id,
        file_name: f.file_name,
        type: 'user_upload',
        mime_type: f.mime_type || f.file_type || 'application/octet-stream'
      }));
      const optimisticImageUrls = doneFiles
        .filter(f => String(f.mime_type || f.file_type || '').startsWith('image/') && f.download_url)
        .map(f => f.download_url);
      const outboundMessage = msg || 'Analise os anexos enviados.';

      const payload = {
        mensagem: outboundMessage,
        message: outboundMessage,
        projeto_id: pid,
        projectId: pid,
        token_lovable: token,
        token,
        license_key: licKey,
        session_id: sessionId,
        deviceFingerprint: sd.fl_hw_fingerprint || deviceId,
        device_id: sd.fl_hw_fingerprint || deviceId,
        files: filesPayload,
        optimisticImageUrls
      };

      log.className = 'sp-log sp-log-info'; log.textContent = '📡 Enviando para o servidor seguro...';

      const resultResp = await safeSendMessage({
        action: "proxyFetch",
        url: API_PROXY_COMMAND_URL,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = resultResp && resultResp.data;

      if (!result) {
        throw new Error("Não foi possível conectar ao servidor (sem resposta).");
      }

      if (result.success === false) {
        console.error('[Extension] Erro retornado pelo servidor:', result);
        const errMsg = result.error_display || result.message || result.error || "Erro desconhecido no servidor";
        throw new Error(errMsg);
      }

      const apiData = result.data || result;
      if (!apiData) {
        throw new Error("Resposta do servidor inválida (sem dados).");
      }
      
      const msgId = apiData.ai_message_id_usado || '';
      
      // Limpeza e Sucesso
      document.getElementById('sp-msg').value = '';
      spAttachedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
      spAttachedFiles = []; 
      spRenderAttachPreview();
      
      log.className = 'sp-log sp-log-success';
      log.textContent = '✅ Enviado com sucesso!';
      addToHistory(msg, 'ok');
      
      setTimeout(() => { 
        if (log.textContent === '✅ Enviado com sucesso!') log.textContent = ''; 
      }, 3000);

      if (msgId) console.log('[Extension] API message ID:', msgId);
    } catch(err) { 
      console.error('[Extension] Erro crítico no handleSend:', err);
      log.className = 'sp-log sp-log-error'; 
      log.textContent = '✗ ' + (err.message || String(err)); 
      addToHistory(msg, 'error'); 
    }
    finally { btn.disabled = false; btn.textContent = 'Enviar'; }
  }
  async function handleOptimize() {
    const textarea = document.getElementById('sp-msg');
    const btn = document.getElementById('sp-optimize');
    if(!textarea || !textarea.value.trim()) { showAlert('Atenção', 'Digite um prompt antes de otimizar.'); return; }
    btn.classList.add('sp-tool-loading'); btn.disabled = true;
    try {
      const sd = await new Promise(r => chrome.storage.local.get(["fl_license_key"], r));
      const resp = await safeSendMessage({ 
        action: "apiAction", 
        subAction: "OPTIMIZE_PROMPT", 
        headers: { "x-license-key": sd.fl_license_key || "" },
        payload: { prompt: textarea.value.trim() } 
      });
      
      if(resp && resp.ok && resp.data.optimized_prompt) { 
        textarea.value = resp.data.optimized_prompt; 
        showAlert('Prompt Otimizado! ✨', 'Seu prompt foi aprimorado com IA.'); 
      }
      else if(resp && resp.data && resp.data.error) showAlert('Erro', resp.data.error);
    } catch(err) { showAlert('Erro', 'Falha ao otimizar: ' + (err.message || '')); }
    finally { btn.classList.remove('sp-tool-loading'); btn.disabled = false; }
  }
  function startHeartbeat(key) {
    if(heartbeatInterval) clearInterval(heartbeatInterval);

    // VERSÃO ABERTA: Heartbeat (validação automática) desligado
    // Descomente a linha abaixo para reativar validação a cada 10 min
    /*
    heartbeatInterval = setInterval(async () => {
      try {
        if (!chrome.runtime || !chrome.runtime.id) {
          clearInterval(heartbeatInterval);
          console.warn("[SP] Heartbeat stopped: extension context invalidated");
          return;
        }
        const requestMeta = spCreateRequestMeta();
        const resp = await safeSendMessage({ 
          action: "apiAction", 
          subAction: "VALIDATE_LICENSE", 
          payload: { license_key: key, session_id: sessionId, heartbeat: true, device_id: deviceId, extension_version: SP_EXTENSION_VERSION, request_nonce: requestMeta.request_nonce, requested_at: requestMeta.requested_at } 
        });

        if(!resp || !resp.ok || !resp.data.valid) {
          const data = (resp && resp.data) || {};
          if (spIsDefinitiveSessionError(data)) {
            clearInterval(heartbeatInterval);
            forceLicenseGate('Digite sua chave SKU novamente para continuar', { preserveLicenseKey: true, licenseKey: key });
            if(data.reason === 'device_conflict') setTimeout(() => showAlert('Acesso Negado', data.message), 500);
            return;
          }
          heartbeatFailureCount += 1;
          if (heartbeatFailureCount >= 3) {
            clearInterval(heartbeatInterval);
            forceLicenseGate('Conexão instável. Revalide sua chave para continuar.', { preserveLicenseKey: true, licenseKey: key });
            return;
          }
          return;
        }
        heartbeatFailureCount = 0;
        const data = resp.data;
        spApplyPolicyFromValidation(data);
        if (spNeedsForcedUpdate()) {
          clearInterval(heartbeatInterval);
          spRenderForceUpdateScreen();
          return;
        }
        if(data.user_name) { 
          const cleanName = (data.user_name.trim() === 'Cliente' || data.user_name.toLowerCase().includes('cliente pro')) ? 'Olá, seja bem vindo!' : data.user_name;
          userName = cleanName; 
          const el = document.getElementById('sp-name'); 
          if(el) el.textContent = cleanName; 
        }
        if(data.expires_at) expiresAt = data.expires_at;
        if(data.status) licenseStatus = data.status;
      } catch(e) {
        if (e.message && e.message.includes("Extension context invalidated")) {
          clearInterval(heartbeatInterval);
          console.warn("[SP] Heartbeat stopped: extension context invalidated");
          return;
        }
        heartbeatFailureCount += 1;
        if (heartbeatFailureCount >= 3) {
          clearInterval(heartbeatInterval);
          forceLicenseGate('Conexão instável. Revalide sua chave para continuar.', { preserveLicenseKey: true, licenseKey: key });
        }
      }
    }, 300000);
    */
    // FIM DO HEARTBEAT COMENTADO - Remova comentário /* */ para ativar validação automática
  }

  async function ensureFreshLicenseSession(forceRefresh) {
    const cached = await new Promise(resolve => chrome.storage.local.get(["fl_license_key", "fl_session_id", "fl_last_validate_at"], resolve));
    const licenseKey = cached.fl_license_key || '';
    if (!licenseKey) return false;
    sessionId = cached.fl_session_id || sessionId;

    if (!forceRefresh && !spNeedsSessionRefresh(cached.fl_last_validate_at)) {
      return true;
    }

    try {
      const requestMeta = spCreateRequestMeta();
      const resp = await safeSendMessage({
        action: "apiAction",
        subAction: "VALIDATE_LICENSE",
        payload: { license_key: licenseKey, session_id: sessionId || '', heartbeat: true, device_id: deviceId, extension_version: SP_EXTENSION_VERSION, request_nonce: requestMeta.request_nonce, requested_at: requestMeta.requested_at }
      });

      if(!resp || !resp.ok || !resp.data.valid) {
        const data = (resp && resp.data) || {};
        if (spIsDefinitiveSessionError(data)) {
          forceLicenseGate('Digite sua chave SKU novamente para continuar', { preserveLicenseKey: true, licenseKey: licenseKey });
          if(data.reason === 'device_conflict') setTimeout(() => showAlert('Acesso Negado', data.message), 500);
          return false;
        }
        return true;
      }

      const data = resp.data;
      await new Promise(resolve => {
        spApplyValidationState(data, licenseKey, resolve);
      });
      if(data.user_name) {
        const cleanName = (data.user_name.trim() === 'Cliente' || data.user_name.toLowerCase().includes('cliente pro')) ? 'OlÃ¡, seja bem vindo!' : data.user_name;
        userName = cleanName;
        const el = document.getElementById('sp-name');
        if(el) el.textContent = cleanName;
      }
      if(data.expires_at) expiresAt = data.expires_at;
      if(data.status) licenseStatus = data.status;
      return true;
    } catch(e) {
      return true;
    }
  }

  async function revalidateStoredLicense() {
    const cached = await new Promise(resolve => chrome.storage.local.get(["fl_license_key", "fl_session_id", "fl_user_name", "fl_expires_at", "fl_license_status"], resolve));
    const licenseKey = cached.fl_license_key || '';
    if (!licenseKey) return false;
    const requestMeta = spCreateRequestMeta();
    try {
      const resp = await safeSendMessage({
        action: "apiAction",
        subAction: "VALIDATE_LICENSE",
        payload: {
          license_key: licenseKey,
          session_id: cached.fl_session_id || '',
          heartbeat: true,
          device_id: deviceId,
          extension_version: SP_EXTENSION_VERSION,
          request_nonce: requestMeta.request_nonce,
          requested_at: requestMeta.requested_at
        }
      });

      if (!resp || !resp.ok || !resp.data || !resp.data.valid) {
        const data = (resp && resp.data) || {};
        if (spIsDefinitiveSessionError(data)) return false;
        spRestoreCachedValidationState(cached);
        return true;
      }

      await new Promise(resolve => {
        spApplyValidationState(resp.data, licenseKey, resolve);
      });
      return true;
    } catch (e) {
      spRestoreCachedValidationState(cached);
      return true;
    }
  }

  (async function init() {
    try {
      deviceId = await getDeviceId();
    } catch(e) {
      deviceId = 'fallback-' + Date.now();
    }

    spRenderShell();
    spBindShellEvents();
    const configResult = await spFetchRemoteConfig();
    if (configResult.mustForceUpdate) {
      spRenderForceUpdateScreen();
      return;
    }
    if (!configResult.configReady) {
      spRenderStateScreen(
        'Configuração indisponível',
        'Não foi possível carregar a configuração remota da extensão.',
        'Tentar novamente',
        () => window.location.reload(),
        'Usar chave',
        () => showLicenseGate(),
      );
      return;
    }

    try {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg && msg.action === 'forceLicenseGate') {
          forceLicenseGate('Digite sua chave SKU novamente para continuar');
        } else if (msg && msg.action === 'REFRESH_HISTORY') {
          if (spActiveTab === 'history') {
            loadChatHistory(function() { renderHistoryTab(); });
          } else {
            updateHistoryBadge();
          }
        }
      });
    } catch(e) {}

    chrome.storage.local.get(["fl_dark_mode"], r => { if(r.fl_dark_mode === false) document.body.classList.add('sp-light'); });
    const body = document.getElementById('sp-body');
    if (body) {
      body.innerHTML = '<div class="sp-license-gate" id="sp-loading" style="padding:40px 0;text-align:center"><p style="color:var(--fl-text-muted)">&#x23f3; Verificando licença...</p></div>';
    }
    try {
      // VERSÃO ABERTA: Licença removida - Abre painel direto
      if (spNeedsForcedUpdate()) spRenderForceUpdateScreen();
      else showMainUI();
    } catch (err) {
      console.error("[Adorável] Erro:", err);
      showMainUI(); // Fallback
    }
  })();


  async function checkWelcomeOnboarding() {
    const key = 'fl_welcome_v3_seen';
    chrome.storage.local.get([key], (res) => {
      if (!res[key]) {
        showWelcomeModal();
        chrome.storage.local.set({ [key]: true });
      }
    });
  }

  function showWelcomeModal() {
    const overlay = document.createElement('div');
    overlay.className = 'sp-alert-overlay';
    overlay.style.zIndex = '2000';
    
    overlay.innerHTML = `
      <div class="sp-alert-box" style="max-width:300px; padding:28px 24px; text-align:left;">
        <div style="text-align:center; font-size:40px; margin-bottom:16px;">🚀</div>
        <div class="sp-alert-title" style="text-align:center; font-size:18px; margin-bottom:12px;">Olá! Conheça as novidades</div>
        <div style="font-size:12px; color:var(--fl-text-muted); margin-bottom:20px; line-height:1.6;">
          Preparamos melhorias incríveis para a sua experiência:
          <ul style="margin:12px 0; padding-left:18px; color:var(--fl-text-primary);">
            <li style="margin-bottom:8px;">💎 <b>Anexo de imagens</b>: Anexe ou cole as suas imagens na extensão e envie junto com seu prompt.</li>
            <li style="margin-bottom:8px;">🚀 <b>Anexo de arquivos</b>: Anexe ou cole seus arquivos em PDF e envie direto da extensão.</li>
            <li style="margin-bottom:8px;">🎙️ <b>Voz Inteligente</b>: Use o microfone para ditar seus prompts.</li>
            <li style="margin-bottom:8px;">🔌 <b>Direto do Lovable</b>: Digite e envie seu prompt direto do Lovable.</li>
          </ul>
        </div>
        <button class="sp-alert-ok" style="width:100%; padding:12px; font-weight:700;">VAMOS CRIAR! ✨</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.querySelector('.sp-alert-ok').addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    });
  }

  let spShieldActive = false;

  function setupSpShield() {
    const btn = document.getElementById('sp-shield-btn');
    if (!btn) return;

    chrome.storage.local.get(['fl_shield_active', 'fl_shield_default_enabled_v1'], (res) => {
      const shouldApplyDefault = res.fl_shield_default_enabled_v1 !== true;
      spShieldActive = shouldApplyDefault ? true : (res.fl_shield_active !== false);
      if (shouldApplyDefault || res.fl_shield_active === undefined) {
        chrome.storage.local.set({
          fl_shield_active: true,
          fl_shield_default_enabled_v1: true
        });
      }
      if (spShieldActive) {
        btn.classList.add('sp-shield-active');
        // injectSpShieldOverlay(); // Desabilitado
      } else {
        btn.classList.remove('sp-shield-active');
      }
    });

    btn.addEventListener('click', () => {
      spShieldActive = !spShieldActive;
      chrome.storage.local.set({ fl_shield_active: spShieldActive });

      if (spShieldActive) {
        btn.classList.add('sp-shield-active');
        // injectSpShieldOverlay(); // Desabilitado
        showAlert('Escudo Ativado 🛡', 'O input do Lovable está bloqueado.');
      } else {
        btn.classList.remove('sp-shield-active');
        removeSpShieldOverlay();
        showAlert('Escudo Desativado', 'O input do Lovable está liberado.');
      }
    });
  }

  function injectSpShieldOverlay() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const branding = spGetBranding();
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          args: [
            branding.shield_title || DEFAULT_REMOTE_CONFIG.branding.shield_title,
            branding.shield_subtitle || DEFAULT_REMOTE_CONFIG.branding.shield_subtitle
          ],
          func: function(shieldTitle, shieldSubtitle) {
            if (document.getElementById('fl-shield-overlay')) return;
            let chatForm = document.querySelector('form#chat-input');
            if (!chatForm) chatForm = document.querySelector('[data-testid="chat-composer"]');
            if (!chatForm) return;
            const existingPos = getComputedStyle(chatForm).position;
            if (existingPos === 'static') chatForm.style.position = 'relative';
            const overlay = document.createElement('div');
            overlay.id = 'fl-shield-overlay';
            overlay.style.cssText = 'position:absolute;inset:0;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:24px;background:rgba(9,9,11,0.85);backdrop-filter:blur(8px);border:1px solid rgba(16,185,129,0.3);box-shadow:0 0 40px rgba(16,185,129,0.15);cursor:not-allowed;pointer-events:all;';
            overlay.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px rgba(16,185,129,0.4))"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span style="color:#fafafa;font-size:13px;font-weight:600;font-family:Inter,-apple-system,sans-serif;letter-spacing:-0.01em;">' + shieldTitle + '</span><span style="color:#a1a1aa;font-size:10px;font-weight:500;font-family:Inter,-apple-system,sans-serif;">' + shieldSubtitle + '</span>';
            ['click','mousedown','keydown'].forEach(ev => overlay.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }, true));
            chatForm.appendChild(overlay);
            chatForm.querySelectorAll('input,button,textarea,[contenteditable]').forEach(el => {
              if (el.id === 'fl-shield-overlay') return;
              el.dataset.flShieldDisabled = el.disabled || '';
              el.setAttribute('tabindex', '-1');
              if (el.tagName !== 'DIV') el.disabled = true;
              if (el.contentEditable === 'true') { el.contentEditable = 'false'; el.dataset.flShieldEditable = 'true'; }
            });
          }
        }).catch(() => {});
      }
    });
  }

  function removeSpShieldOverlay() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: function() {
            const overlay = document.getElementById('fl-shield-overlay');
            if (overlay) overlay.remove();
            const chatForm = document.querySelector('form#chat-input');
            if (!chatForm) return;
            chatForm.querySelectorAll('[data-fl-shield-disabled]').forEach(el => {
              const wasDis = el.dataset.flShieldDisabled;
              if (wasDis === 'true') el.disabled = true;
              else el.disabled = false;
              delete el.dataset.flShieldDisabled;
              el.removeAttribute('tabindex');
              if (el.dataset.flShieldEditable === 'true') { el.contentEditable = 'true'; delete el.dataset.flShieldEditable; }
            });
          }
        }).catch(() => {});
      }
    });
  }

})();
