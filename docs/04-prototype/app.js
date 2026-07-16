/* ==========================================================
   Safety Doggy — Click-through Prototype
   Plain vanilla JS. No backend, no build step, no dependencies.
   All data below is fake and lives only in memory / localStorage.
   ========================================================== */

/* ---------------- i18n ---------------- */

const translations = {
  fr: {
    common: {
      cancel: "Annuler", save: "Enregistrer", skip: "Passer", delete: "Supprimer",
      confirm: "Confirmer", close: "Fermer", retry: "Réessayer", and: "et la",
      backToLogin: "Retour à la connexion"
    },
    map: {
      filters: "Filtres",
      language: "Langue",
      account: { login: "Connexion" },
      locationBanner: "Localisation indisponible",
      locationBannerAction: "Activer",
      networkBanner: "Impossible de charger les signalements",
      networkBannerAction: "Réessayer"
    },
    filter: {
      title: "Filtrer les signalements",
      hazards: "⚠ Dangers",
      positive: "✅ Points positifs",
      clearAll: "Tout décocher",
      selectAll: "Tout cocher"
    },
    types: {
      active_hunting: "Chasse en cours",
      caterpillars: "Chenilles processionnaires",
      stray_animal: "Animal errant",
      foxtail_spot: "Coin épillet",
      dangerous_bait: "Appât dangereux",
      blocked_road: "Route barrée / difficile d'accès",
      shaded_path: "Chemin ombragé",
      offleash_area: "Zone sans laisse",
      water_point: "Point d'eau",
      dog_friendly: "Lieu dog-friendly"
    },
    reportDetail: {
      reportedAt: "Signalé le {date}",
      activeFor: "Actif encore ~{time}",
      permanent: "Permanent",
      expired: "Ce signalement a expiré.",
      extend: "Prolonger la durée",
      delete: "Supprimer",
      flag: "Signaler comme incorrect",
      flagged: "Signalé — merci",
      extendToast: "Durée prolongée",
      deleteToast: "Signalement supprimé",
      flagToast: "Merci, nous allons vérifier"
    },
    language: { title: "Langue / Language" },
    auth: {
      landing: {
        title: "Compte",
        subtitle: "Un compte permet de responsabiliser les signalements.",
        ageCheckbox: "J'ai 16 ans ou plus",
        termsCheckboxPrefix: "J'accepte les",
        googleBtn: "Continuer avec Google",
        emailBtn: "S'inscrire par email",
        haveAccount: "Vous avez déjà un compte ?",
        loginLink: "Se connecter"
      },
      signup: {
        title: "Inscription",
        emailLabel: "Email",
        passwordLabel: "Mot de passe",
        submit: "S'inscrire",
        testHint: "Astuce démo : utilisez taken@example.com pour voir l'erreur \"email déjà utilisé\".",
        emailInUse: "Cet email est déjà utilisé.",
        loginInstead: "Se connecter à la place",
        fillFields: "Merci de remplir l'email et le mot de passe."
      },
      nickname: {
        title: "Comment doit-on vous appeler ?",
        subtitle: "Visible uniquement par vous.",
        placeholder: "Surnom (optionnel)"
      },
      login: {
        title: "Connexion",
        resumeNote: "Connectez-vous pour terminer votre signalement.",
        forgot: "Mot de passe oublié ?",
        submit: "Se connecter",
        testHint: "Astuce démo : disabled@example.com (compte désactivé), mot de passe \"wrongpass\" (erreur).",
        wrongCreds: "Email ou mot de passe incorrect.",
        disabledAccount: "Votre compte a été désactivé — contactez contact@safetydoggy.app.",
        fillFields: "Merci de remplir l'email et le mot de passe."
      },
      forgot: {
        title: "Réinitialiser le mot de passe",
        submit: "Envoyer le lien",
        sent: "Si cet email existe, un lien de réinitialisation a été envoyé."
      },
      confirmPending: {
        title: "Confirmez votre email",
        message: "Nous avons envoyé un lien de confirmation à {email}",
        resend: "Renvoyer l'email",
        resent: "Email envoyé",
        confirmedDemoBtn: "[Démo] J'ai confirmé mon email",
        backToMap: "Retour à la carte"
      }
    },
    report: {
      create: {
        title: "Nouveau signalement",
        durationLabel: "Durée :",
        positionLabel: "Position",
        positionAutoLabel: "📍 Position détectée automatiquement",
        positionManualHint: "Position ajustée manuellement",
        positionNoGps: "⚠️ Localisation indisponible — placez le repère manuellement",
        recenterBtn: "Utiliser ma position",
        outsideArea: "Safety Doggy couvre uniquement la zone du Havre pour le moment.",
        suggestType: "Suggérer un nouveau type de signalement →",
        submit: "Publier",
        duplicateTitle: "Un signalement similaire existe déjà à proximité",
        duplicateBody: "{type}, il y a {time}. Publier quand même ?",
        publishAnyway: "Publier quand même",
        publishedToast: "Signalement publié",
        antiSpam: "Limite de 5 signalements par heure atteinte. Réessayez vers {time}.",
        permanentLabel: "Permanent"
      }
    },
    profile: {
      title: "Profil",
      edit: "Modifier",
      memberSince: "Membre depuis {date}",
      myReports: "Mes signalements",
      logout: "Se déconnecter",
      deleteAccount: "Supprimer mon compte",
      logoutToast: "Déconnecté",
      photoAdd: "Ajouter une photo",
      photoChange: "Changer la photo",
      photoRemove: "Supprimer la photo",
      photoNotPublic: "Jamais visible sur les signalements"
    },
    history: {
      title: "Mes signalements",
      emptyTitle: "Aucun signalement pour l'instant",
      emptyBody: "Vous avez repéré quelque chose lors de votre balade ?",
      emptyCta: "Créer votre premier signalement",
      statusActive: "Actif",
      statusExpired: "Expiré",
      statusDeleted: "Supprimé"
    },
    deleteReport: { title: "Supprimer ce signalement ?", body: "Cette action est irréversible." },
    deleteAccount: {
      title: "Supprimer votre compte ?",
      body: "Vos signalements restent sur la carte, anonymisés. Vos données personnelles seront supprimées sous 30 jours.",
      passwordLabel: "Mot de passe",
      deletedToast: "Compte supprimé"
    },
    legal: {
      termsTitle: "Conditions d'utilisation",
      privacyTitle: "Politique de confidentialité",
      translationNotice: "Traduction non officielle — la version française fait foi.",
      viewFrench: "Voir la version française",
      termsBody: [
        "1. Objet — Safety Doggy est une application communautaire permettant de consulter et signaler des événements liés à la promenade des chiens dans la zone du Havre.",
        "2. Compte — La création d'un compte est nécessaire pour publier un signalement. Vous devez avoir 16 ans ou plus.",
        "3. Contenu des signalements — Les signalements ne doivent jamais identifier une personne ou un animal précis.",
        "4. Suppression — Vous pouvez supprimer votre compte à tout moment depuis votre profil.",
        "(Texte de démonstration — le texte juridique définitif sera rédigé avant la mise en ligne.)"
      ],
      privacyBody: [
        "1. Données collectées — Email, surnom (optionnel), photo de profil (optionnelle), date d'inscription.",
        "2. Finalité — Ces données servent uniquement à sécuriser et responsabiliser les signalements.",
        "3. Conservation — Les données personnelles sont supprimées sous 30 jours après suppression du compte. Les signalements sont conservés de façon anonymisée.",
        "4. Vos droits — Accès, rectification, suppression : contact@safetydoggy.app.",
        "(Texte de démonstration — le texte juridique définitif sera rédigé avant la mise en ligne.)"
      ]
    }
  },

  en: {
    common: {
      cancel: "Cancel", save: "Save", skip: "Skip", delete: "Delete",
      confirm: "Confirm", close: "Close", retry: "Retry", and: "and the",
      backToLogin: "Back to login"
    },
    map: {
      filters: "Filters",
      language: "Language",
      account: { login: "Log in" },
      locationBanner: "Location unavailable",
      locationBannerAction: "Enable",
      networkBanner: "Can't load reports",
      networkBannerAction: "Retry"
    },
    filter: {
      title: "Filter reports",
      hazards: "⚠ Hazards",
      positive: "✅ Positive points",
      clearAll: "Clear all",
      selectAll: "Select all"
    },
    types: {
      active_hunting: "Active hunting",
      caterpillars: "Processionary caterpillars",
      stray_animal: "Stray / loose animal",
      foxtail_spot: "Foxtail / grass-awn spot",
      dangerous_bait: "Dangerous bait",
      blocked_road: "Blocked / hard-to-access road",
      shaded_path: "Tree-lined / shaded path",
      offleash_area: "Off-leash area",
      water_point: "Water point for dogs",
      dog_friendly: "Dog-friendly place"
    },
    reportDetail: {
      reportedAt: "Reported on {date}",
      activeFor: "Active for another ~{time}",
      permanent: "Permanent",
      expired: "This report has expired.",
      extend: "Extend duration",
      delete: "Delete",
      flag: "Flag as incorrect",
      flagged: "Flagged — thanks",
      extendToast: "Duration extended",
      deleteToast: "Report deleted",
      flagToast: "Thanks, we'll review this"
    },
    language: { title: "Language / Langue" },
    auth: {
      landing: {
        title: "Account",
        subtitle: "An account keeps reports accountable.",
        ageCheckbox: "I'm 16 or older",
        termsCheckboxPrefix: "I accept the",
        googleBtn: "Continue with Google",
        emailBtn: "Sign up with email",
        haveAccount: "Already have an account?",
        loginLink: "Log in"
      },
      signup: {
        title: "Sign up",
        emailLabel: "Email",
        passwordLabel: "Password",
        submit: "Sign up",
        testHint: "Demo tip: use taken@example.com to see the \"email already in use\" error.",
        emailInUse: "This email is already in use.",
        loginInstead: "Log in instead",
        fillFields: "Please fill in email and password."
      },
      nickname: {
        title: "What should we call you?",
        subtitle: "Only visible to you.",
        placeholder: "Nickname (optional)"
      },
      login: {
        title: "Log in",
        resumeNote: "Log in to finish your report.",
        forgot: "Forgot password?",
        submit: "Log in",
        testHint: "Demo tip: disabled@example.com (disabled account), password \"wrongpass\" (error).",
        wrongCreds: "Incorrect email or password.",
        disabledAccount: "Your account has been disabled — contact contact@safetydoggy.app.",
        fillFields: "Please fill in email and password."
      },
      forgot: {
        title: "Reset your password",
        submit: "Send reset link",
        sent: "If that email exists, a reset link has been sent."
      },
      confirmPending: {
        title: "Confirm your email",
        message: "We sent a confirmation link to {email}",
        resend: "Resend email",
        resent: "Email sent",
        confirmedDemoBtn: "[Demo] I've confirmed my email",
        backToMap: "Back to map"
      }
    },
    report: {
      create: {
        title: "New report",
        durationLabel: "Duration:",
        positionLabel: "Position",
        positionAutoLabel: "📍 Position detected automatically",
        positionManualHint: "Position manually adjusted",
        positionNoGps: "⚠️ Location unavailable — place the pin manually",
        recenterBtn: "Use my location",
        outsideArea: "Safety Doggy currently covers the Le Havre area only.",
        suggestType: "Suggest a new report type →",
        submit: "Publish",
        duplicateTitle: "A similar report already exists nearby",
        duplicateBody: "{type}, {time} ago. Publish anyway?",
        publishAnyway: "Publish anyway",
        publishedToast: "Report published",
        antiSpam: "You've reached the limit of 5 reports per hour. Try again around {time}.",
        permanentLabel: "Permanent"
      }
    },
    profile: {
      title: "Profile",
      edit: "Edit",
      memberSince: "Member since {date}",
      myReports: "My reports",
      logout: "Log out",
      deleteAccount: "Delete my account",
      logoutToast: "Logged out",
      photoAdd: "Add photo",
      photoChange: "Change photo",
      photoRemove: "Remove photo",
      photoNotPublic: "Never shown on reports"
    },
    history: {
      title: "My reports",
      emptyTitle: "No reports yet",
      emptyBody: "Spotted something on your walk?",
      emptyCta: "Create your first report",
      statusActive: "Active",
      statusExpired: "Expired",
      statusDeleted: "Deleted"
    },
    deleteReport: { title: "Delete this report?", body: "This can't be undone." },
    deleteAccount: {
      title: "Delete your account?",
      body: "Your reports stay on the map, anonymized. Your personal data is purged within 30 days.",
      passwordLabel: "Password",
      deletedToast: "Account deleted"
    },
    legal: {
      termsTitle: "Terms of Use",
      privacyTitle: "Privacy Policy",
      translationNotice: "Unofficial translation — the French version is legally binding.",
      viewFrench: "View French version",
      termsBody: [
        "1. Purpose — Safety Doggy is a community app for viewing and reporting dog-walking related events in the Le Havre area.",
        "2. Account — Creating an account is required to publish a report. You must be 16 or older.",
        "3. Report content — Reports must never identify a specific person or animal.",
        "4. Deletion — You can delete your account at any time from your profile.",
        "(Placeholder text for the prototype — final legal text will be drafted before launch.)"
      ],
      privacyBody: [
        "1. Data collected — Email, nickname (optional), profile photo (optional), sign-up date.",
        "2. Purpose — This data is used only to secure and hold reports accountable.",
        "3. Retention — Personal data is purged within 30 days of account closure. Reports are retained anonymized.",
        "4. Your rights — Access, correction, deletion: contact@safetydoggy.app.",
        "(Placeholder text for the prototype — final legal text will be drafted before launch.)"
      ]
    }
  }
};

function t(path, vars) {
  const dict = translations[state.lang] || translations.fr;
  const parts = path.split(".");
  let node = dict;
  for (const p of parts) {
    node = node && node[p];
  }
  if (node == null) return path;
  if (vars) {
    return Object.keys(vars).reduce((str, k) => str.replace(`{${k}}`, vars[k]), node);
  }
  return node;
}

/* ---------------- Report type configuration ---------------- */

const REPORT_TYPES = [
  { id: "active_hunting", category: "hazard", color: "red", icon: "🎯", durationHours: 4 },
  { id: "caterpillars", category: "hazard", color: "red", icon: "🐛", durationHours: 168 },
  { id: "stray_animal", category: "hazard", color: "orange", icon: "🐕", durationHours: 24 },
  { id: "foxtail_spot", category: "hazard", color: "orange", icon: "🌾", durationHours: 720 },
  { id: "dangerous_bait", category: "hazard", color: "red", icon: "☠️", durationHours: 48 },
  { id: "blocked_road", category: "hazard", color: "orange", icon: "🚧", durationHours: 48 },
  { id: "shaded_path", category: "positive", color: "green", icon: "🌳", durationHours: null },
  { id: "offleash_area", category: "positive", color: "blue", icon: "🐾", durationHours: null },
  { id: "water_point", category: "positive", color: "blue", icon: "💧", durationHours: null },
  { id: "dog_friendly", category: "positive", color: "blue", icon: "🏠", durationHours: null }
];

function typeConfig(id) { return REPORT_TYPES.find(rt => rt.id === id); }

/* ---------------- Mock data ---------------- */

function hoursAgo(h) { return Date.now() - h * 3600 * 1000; }

function freshMockReports() {
  return [
    { id: "r1", type: "stray_animal", x: 35, y: 40, createdAt: hoursAgo(2), ownerId: "other1", deletedAt: null },
    { id: "r2", type: "water_point", x: 55, y: 30, createdAt: hoursAgo(72), ownerId: "other2", deletedAt: null },
    { id: "r3", type: "caterpillars", x: 70, y: 55, createdAt: hoursAgo(24), ownerId: "other3", deletedAt: null },
    { id: "r4", type: "blocked_road", x: 20, y: 65, createdAt: hoursAgo(10), ownerId: "other1", deletedAt: null },
    { id: "r5", type: "shaded_path", x: 45, y: 72, createdAt: hoursAgo(400), ownerId: "me", deletedAt: null },
    { id: "r6", type: "active_hunting", x: 60, y: 22, createdAt: hoursAgo(1), ownerId: "me", deletedAt: null },
    { id: "r7", type: "offleash_area", x: 80, y: 40, createdAt: hoursAgo(200), ownerId: "other2", deletedAt: null },
    { id: "r8", type: "dog_friendly", x: 25, y: 25, createdAt: hoursAgo(300), ownerId: "other3", deletedAt: null },
    { id: "r9", type: "active_hunting", x: 62, y: 60, createdAt: hoursAgo(10), ownerId: "me", deletedAt: null } // already expired (4h duration)
  ];
}

function freshState() {
  return {
    lang: "fr",
    loggedIn: false,
    emailConfirmed: false,
    authProvider: null,
    user: { id: "me", email: "", nickname: "", photoUrl: null, createdAt: null },
    gpsGranted: true,
    networkOk: true,
    filters: new Set(REPORT_TYPES.map(rt => rt.id)),
    reports: freshMockReports(),
    flaggedReportIds: new Set(),
    reportsThisSession: 0,
    screenStack: ["screen-map"],
    selectedReportId: null,
    pendingAction: null,
    reportDraft: { type: null, x: 50, y: 50, usingGps: true },
    lastCreatedTypeSelectorScroll: 0
  };
}

let state = freshState();

/* ---------------- Utilities ---------------- */

function getReportStatus(r) {
  if (r.deletedAt) return "deleted";
  const cfg = typeConfig(r.type);
  if (cfg.durationHours == null) return "active";
  const expiresAt = r.createdAt + cfg.durationHours * 3600 * 1000;
  return Date.now() < expiresAt ? "active" : "expired";
}

function remainingLabel(r) {
  const cfg = typeConfig(r.type);
  if (cfg.durationHours == null) return t("report.create.permanentLabel");
  const expiresAt = r.createdAt + cfg.durationHours * 3600 * 1000;
  const msLeft = expiresAt - Date.now();
  if (msLeft <= 0) return null;
  const hoursLeft = msLeft / 3600000;
  if (hoursLeft >= 24) return `${Math.round(hoursLeft / 24)} j`;
  return `${Math.max(1, Math.round(hoursLeft))}h`;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(state.lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgoLabel(ts) {
  const hours = (Date.now() - ts) / 3600000;
  if (hours < 1) return state.lang === "fr" ? "quelques minutes" : "a few minutes";
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)} ${state.lang === "fr" ? "j" : "d"}`;
}

let toastTimer = null;
function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ---------------- Navigation ---------------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function pushScreen(id) {
  state.screenStack.push(id);
  showScreen(id);
  renderCurrentScreen(id);
  renderDevPanel();
}

function replaceScreen(id) {
  state.screenStack[state.screenStack.length - 1] = id;
  showScreen(id);
  renderCurrentScreen(id);
  renderDevPanel();
}

function goBack() {
  if (state.screenStack.length > 1) {
    state.screenStack.pop();
  }
  const id = state.screenStack[state.screenStack.length - 1] || "screen-map";
  showScreen(id);
  renderCurrentScreen(id);
  renderDevPanel();
}

function goToMapRoot() {
  state.screenStack = ["screen-map"];
  showScreen("screen-map");
  renderMap();
  renderDevPanel();
}

function renderCurrentScreen(id) {
  if (id === "screen-map") renderMap();
  else if (id === "screen-profile") renderProfile();
  else if (id === "screen-history") renderHistory();
  else if (id === "screen-report-create") renderReportCreate();
  else if (id === "screen-terms") renderLegal("terms");
  else if (id === "screen-privacy") renderLegal("privacy");
  else if (id === "screen-confirm-pending") renderConfirmPending();
  else if (id === "screen-login") renderLoginScreen();
}

function renderLoginScreen() {
  document.getElementById("loginResumeNote").hidden = state.pendingAction !== "report";
}

/* ---- Sheets & modals share one scrim ---- */

let openOverlayId = null;

function openSheet(id) {
  document.getElementById("scrim").hidden = false;
  document.getElementById(id).hidden = false;
  openOverlayId = id;
}
function openModal(id) {
  document.getElementById("scrim").hidden = false;
  document.getElementById(id).hidden = false;
  openOverlayId = id;
}
function closeOverlay() {
  if (openOverlayId) document.getElementById(openOverlayId).hidden = true;
  document.getElementById("scrim").hidden = true;
  openOverlayId = null;
}

/* ---------------- Rendering: translations ---------------- */

function applyStaticTranslations() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.getElementById("langBtnLabel").textContent = state.lang.toUpperCase();
  document.getElementById("accountBtnLabel").textContent = state.loggedIn
    ? (state.user.nickname || state.user.email.split("@")[0])
    : t("map.account.login");
}

/* ---------------- Rendering: Map ---------------- */

function activeReports() {
  return state.reports.filter(r => getReportStatus(r) === "active");
}

function activeVisibleReports() {
  return activeReports().filter(r => state.filters.has(r.type));
}

function renderMap() {
  const canvas = document.getElementById("mapCanvas");
  canvas.querySelectorAll(".map-marker").forEach(m => m.remove());

  document.getElementById("mapYouMarker").style.display = state.gpsGranted ? "block" : "none";
  document.getElementById("bannerLocation").hidden = state.gpsGranted;
  document.getElementById("bannerNetwork").hidden = state.networkOk;

  if (!state.networkOk) return; // no report data while "offline"

  activeVisibleReports().forEach(r => {
    const cfg = typeConfig(r.type);
    const el = document.createElement("div");
    el.className = "map-marker";
    el.style.left = r.x + "%";
    el.style.top = r.y + "%";
    el.innerHTML = `<div class="marker-swatch marker-${cfg.color}"><span>${cfg.icon}</span></div>`;
    el.addEventListener("click", () => openReportDetail(r.id));
    canvas.appendChild(el);
  });
}

/* ---------------- Rendering: Filter sheet ---------------- */

function renderFilterSheet() {
  const hazardList = document.getElementById("filterListHazard");
  const positiveList = document.getElementById("filterListPositive");
  hazardList.innerHTML = "";
  positiveList.innerHTML = "";
  REPORT_TYPES.forEach(rt => {
    const row = document.createElement("label");
    row.className = "filter-row";
    row.innerHTML = `
      <span class="type-icon-swatch marker-${rt.color}">${rt.icon}</span>
      <span style="flex:1">${t("types." + rt.id)}</span>
      <input type="checkbox" ${state.filters.has(rt.id) ? "checked" : ""} data-type="${rt.id}">
    `;
    row.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) state.filters.add(rt.id);
      else state.filters.delete(rt.id);
      renderMap();
    });
    (rt.category === "hazard" ? hazardList : positiveList).appendChild(row);
  });
}

/* ---------------- Rendering: Report detail sheet ---------------- */

function openReportDetail(id) {
  state.selectedReportId = id;
  renderReportDetail();
  openSheet("sheet-report-detail");
}

function renderReportDetail() {
  const r = state.reports.find(rep => rep.id === state.selectedReportId);
  if (!r) return;
  const cfg = typeConfig(r.type);
  const status = getReportStatus(r);
  const isOwner = r.ownerId === "me";
  const remaining = remainingLabel(r);

  let actionsHtml = "";
  if (status !== "active") {
    actionsHtml = `<div class="report-detail-expired-note">${t("reportDetail.expired")}</div>`;
  } else if (!state.loggedIn) {
    actionsHtml = "";
  } else if (isOwner) {
    actionsHtml = `
      ${cfg.durationHours != null ? `<button class="btn btn-secondary" id="btnExtendReport">${t("reportDetail.extend")}</button>` : ""}
      <button class="btn btn-danger-text" id="btnDeleteReportOpen">${t("reportDetail.delete")}</button>
    `;
  } else {
    const flagged = state.flaggedReportIds.has(r.id);
    actionsHtml = `<button class="btn btn-secondary" id="btnFlagReport" ${flagged ? "disabled" : ""}>${flagged ? t("reportDetail.flagged") : t("reportDetail.flag")}</button>`;
  }

  document.getElementById("reportDetailBody").innerHTML = `
    <div class="report-detail-header">
      <div class="report-detail-icon marker-${cfg.color}">${cfg.icon}</div>
      <div>
        <div class="report-detail-type">${t("types." + r.type)}</div>
        <div class="report-detail-meta">${t("reportDetail.reportedAt", { date: formatDate(r.createdAt) })}</div>
      </div>
    </div>
    <div class="report-detail-remaining">${remaining ? t("reportDetail.activeFor", { time: remaining }) : ""}</div>
    ${actionsHtml}
  `;

  const extendBtn = document.getElementById("btnExtendReport");
  if (extendBtn) extendBtn.addEventListener("click", () => {
    r.createdAt = Date.now();
    showToast(t("reportDetail.extendToast"));
    renderReportDetail();
    renderMap();
  });

  const deleteOpenBtn = document.getElementById("btnDeleteReportOpen");
  if (deleteOpenBtn) deleteOpenBtn.addEventListener("click", () => openModal("modal-delete-report"));

  const flagBtn = document.getElementById("btnFlagReport");
  if (flagBtn) flagBtn.addEventListener("click", () => {
    state.flaggedReportIds.add(r.id);
    showToast(t("reportDetail.flagToast"));
    renderReportDetail();
  });
}

/* ---------------- Auth: landing ---------------- */

function updateLandingGate() {
  const enabled = document.getElementById("chkAge").checked && document.getElementById("chkTerms").checked;
  document.getElementById("btnGoogleAuth").disabled = !enabled;
  document.getElementById("btnEmailSignup").disabled = !enabled;
}

/* ---------------- Sign up ---------------- */

function handleSignup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const errEl = document.getElementById("signupEmailError");
  errEl.hidden = true;

  if (!email || !password) {
    errEl.hidden = false;
    errEl.textContent = t("auth.signup.fillFields");
    return;
  }
  if (email.toLowerCase() === "taken@example.com") {
    errEl.hidden = false;
    errEl.innerHTML = `${t("auth.signup.emailInUse")} <a href="#" id="linkLoginInsteadFromSignup">${t("auth.signup.loginInstead")}</a>`;
    document.getElementById("linkLoginInsteadFromSignup").addEventListener("click", (e) => {
      e.preventDefault();
      replaceScreen("screen-login");
    });
    return;
  }

  state.loggedIn = true;
  state.authProvider = "email";
  state.emailConfirmed = false;
  state.user.email = email;
  state.user.createdAt = Date.now();
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
  pushScreen("screen-nickname");
}

function handleGoogleAuth() {
  state.loggedIn = true;
  state.authProvider = "google";
  state.emailConfirmed = true; // Google already verifies email
  state.user.email = "you@gmail.com";
  state.user.createdAt = Date.now();
  pushScreen("screen-nickname");
}

/* ---------------- Nickname ---------------- */

function finishNickname(nickname) {
  state.user.nickname = nickname || `Dog Walker ${Math.floor(1000 + Math.random() * 9000)}`;
  goToMapRoot();
}

/* ---------------- Login ---------------- */

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errEl = document.getElementById("loginError");
  errEl.hidden = true;

  if (!email || !password) {
    errEl.hidden = false;
    errEl.textContent = t("auth.login.fillFields");
    return;
  }
  if (email.toLowerCase() === "disabled@example.com") {
    errEl.hidden = false;
    errEl.textContent = t("auth.login.disabledAccount");
    return;
  }
  if (password === "wrongpass") {
    errEl.hidden = false;
    errEl.textContent = t("auth.login.wrongCreds");
    return;
  }

  state.loggedIn = true;
  state.authProvider = "email";
  state.emailConfirmed = true; // returning, already-confirmed user
  state.user.email = email;
  if (!state.user.createdAt) state.user.createdAt = Date.now() - 30 * 24 * 3600 * 1000;
  if (!state.user.nickname) state.user.nickname = `Dog Walker ${Math.floor(1000 + Math.random() * 9000)}`;

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";

  if (state.pendingAction === "report") {
    state.pendingAction = null;
    replaceScreen("screen-report-create");
  } else {
    goToMapRoot();
  }
}

/* ---------------- Forgot password ---------------- */

function handleForgotSubmit() {
  document.getElementById("forgotForm").hidden = true;
  document.getElementById("forgotSent").hidden = false;
}

/* ---------------- Email confirmation pending ---------------- */

function renderConfirmPending() {
  document.getElementById("confirmPendingMessage").textContent = t("auth.confirmPending.message", { email: state.user.email || "you@example.com" });
}

/* ---------------- Report button entry logic ---------------- */

function handleReportFabClick() {
  if (!state.loggedIn) {
    state.pendingAction = "report";
    pushScreen("screen-auth-landing");
    return;
  }
  if (state.authProvider === "email" && !state.emailConfirmed) {
    state.pendingAction = "report";
    pushScreen("screen-confirm-pending");
    return;
  }
  state.reportDraft = { type: null, x: 50, y: 50, usingGps: state.gpsGranted };
  pushScreen("screen-report-create");
}

/* ---------------- Report creation ---------------- */

function renderReportCreate() {
  const hazardGrid = document.getElementById("typeGridHazard");
  const positiveGrid = document.getElementById("typeGridPositive");
  hazardGrid.innerHTML = "";
  positiveGrid.innerHTML = "";

  REPORT_TYPES.forEach(rt => {
    const card = document.createElement("div");
    card.className = "type-card" + (state.reportDraft.type === rt.id ? " selected" : "");
    card.innerHTML = `<div class="type-icon-swatch marker-${rt.color}">${rt.icon}</div><span>${t("types." + rt.id)}</span>`;
    card.addEventListener("click", () => {
      state.reportDraft.type = rt.id;
      renderReportCreate();
    });
    (rt.category === "hazard" ? hazardGrid : positiveGrid).appendChild(card);
  });

  const durationRow = document.getElementById("durationRow");
  const submitBtn = document.getElementById("btnSubmitReport");
  document.getElementById("antiSpamError").hidden = true;

  if (state.reportDraft.type) {
    const cfg = typeConfig(state.reportDraft.type);
    durationRow.hidden = false;
    document.getElementById("durationValue").textContent = cfg.durationHours == null
      ? t("report.create.permanentLabel")
      : (cfg.durationHours >= 24 ? `${cfg.durationHours / 24} ${state.lang === "fr" ? "jours" : "days"}` : `${cfg.durationHours}h`);
  } else {
    durationRow.hidden = true;
  }

  if (state.reportsThisSession >= 5) {
    const retryTime = new Date(Date.now() + 3600000);
    document.getElementById("antiSpamError").hidden = false;
    document.getElementById("antiSpamError").textContent = t("report.create.antiSpam", {
      time: retryTime.toLocaleTimeString(state.lang === "fr" ? "fr-FR" : "en-GB", { hour: "2-digit", minute: "2-digit" })
    });
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = !state.reportDraft.type;
  }

  renderMiniMapPin();
  renderMiniMapContext();
  renderMiniMapLabel();
}

function renderMiniMapLabel() {
  const label = document.getElementById("miniMapLabel");
  const recenterBtn = document.getElementById("btnRecenterPin");
  if (!state.gpsGranted) {
    label.textContent = t("report.create.positionNoGps");
    recenterBtn.hidden = true;
  } else if (state.reportDraft.usingGps) {
    label.textContent = t("report.create.positionAutoLabel");
    recenterBtn.hidden = true;
  } else {
    label.textContent = t("report.create.positionManualHint");
    recenterBtn.hidden = false;
  }
}

function renderMiniMapContext() {
  const miniMap = document.getElementById("miniMap");
  miniMap.querySelectorAll(".mini-map-marker").forEach(m => m.remove());
  activeReports().forEach(r => {
    const cfg = typeConfig(r.type);
    const el = document.createElement("div");
    el.className = "mini-map-marker";
    el.style.left = r.x + "%";
    el.style.top = r.y + "%";
    el.textContent = cfg.icon;
    miniMap.insertBefore(el, document.getElementById("draggablePin"));
  });
}

function renderMiniMapPin() {
  const pin = document.getElementById("draggablePin");
  pin.style.left = state.reportDraft.x + "%";
  pin.style.top = state.reportDraft.y + "%";
}

function setupPinDragging() {
  const pin = document.getElementById("draggablePin");
  const miniMap = document.getElementById("miniMap");
  let dragging = false;

  function clampToSafeZone(x, y) {
    const min = 8, max = 92;
    let outside = false;
    if (x < min) { x = min; outside = true; }
    if (x > max) { x = max; outside = true; }
    if (y < min) { y = min; outside = true; }
    if (y > max) { y = max; outside = true; }
    return { x, y, outside };
  }

  function moveTo(clientX, clientY) {
    const rect = miniMap.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    const clamped = clampToSafeZone(x, y);
    state.reportDraft.x = clamped.x;
    state.reportDraft.y = clamped.y;
    state.reportDraft.usingGps = false;
    document.getElementById("pinAreaError").hidden = !clamped.outside;
    renderMiniMapPin();
    renderMiniMapLabel();
  }

  pin.addEventListener("pointerdown", (e) => {
    dragging = true;
    pin.setPointerCapture(e.pointerId);
  });
  pin.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    moveTo(e.clientX, e.clientY);
  });
  pin.addEventListener("pointerup", () => { dragging = false; });
  miniMap.addEventListener("click", (e) => {
    if (e.target === pin) return;
    moveTo(e.clientX, e.clientY);
  });
}

function distanceBetween(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function handleSubmitReport() {
  if (!state.reportDraft.type) return;
  const duplicate = activeReports().find(r =>
    r.type === state.reportDraft.type && distanceBetween(r, state.reportDraft) < 10
  );
  if (duplicate) {
    document.getElementById("duplicateModalBody").textContent = t("report.create.duplicateBody", {
      type: t("types." + duplicate.type),
      time: timeAgoLabel(duplicate.createdAt)
    });
    openModal("modal-duplicate");
    return;
  }
  publishReport();
}

function publishReport() {
  const newReport = {
    id: "r" + Math.random().toString(36).slice(2, 9),
    type: state.reportDraft.type,
    x: state.reportDraft.x,
    y: state.reportDraft.y,
    createdAt: Date.now(),
    ownerId: "me",
    deletedAt: null
  };
  state.reports.push(newReport);
  state.reportsThisSession += 1;
  closeOverlay();
  showToast(t("report.create.publishedToast"));
  goToMapRoot();
}

/* ---------------- Profile ---------------- */

function renderProfile() {
  document.getElementById("profileEmail").textContent = state.user.email;
  document.getElementById("profileNicknameDisplay").textContent = state.user.nickname;
  document.getElementById("profileMemberSince").textContent = t("profile.memberSince", { date: formatDate(state.user.createdAt || Date.now()) });
  document.getElementById("profileLangValue").textContent = state.lang.toUpperCase();
  document.getElementById("nicknameEditRow").hidden = true;
  document.getElementById("profileNicknameRow").hidden = false;

  const img = document.getElementById("profileAvatarImg");
  const placeholder = document.getElementById("profileAvatarPlaceholder");
  const removeBtn = document.getElementById("btnProfileAvatarRemove");
  const actionBtn = document.getElementById("btnProfileAvatarAction");
  if (state.user.photoUrl) {
    img.src = state.user.photoUrl;
    img.hidden = false;
    placeholder.hidden = true;
    removeBtn.hidden = false;
    actionBtn.textContent = t("profile.photoChange");
  } else {
    img.hidden = true;
    placeholder.hidden = false;
    removeBtn.hidden = true;
    actionBtn.textContent = t("profile.photoAdd");
  }
}

/* ---------------- Report history ---------------- */

function renderHistory() {
  const mine = state.reports.filter(r => r.ownerId === "me");
  const body = document.getElementById("historyBody");

  if (mine.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="big-icon">🐾</div>
        <h3>${t("history.emptyTitle")}</h3>
        <p>${t("history.emptyBody")}</p>
        <button class="btn btn-primary" id="btnEmptyHistoryCreate">${t("history.emptyCta")}</button>
      </div>
    `;
    document.getElementById("btnEmptyHistoryCreate").addEventListener("click", handleReportFabClick);
    return;
  }

  body.innerHTML = mine.map(r => {
    const cfg = typeConfig(r.type);
    const status = getReportStatus(r);
    const statusKey = status === "active" ? "statusActive" : status === "expired" ? "statusExpired" : "statusDeleted";
    return `
      <div class="history-row ${status !== "active" ? "inert" : ""}" data-report-id="${r.id}">
        <div class="history-row-icon marker-${cfg.color}">${cfg.icon}</div>
        <div class="history-row-main">
          <div class="history-row-type">${t("types." + r.type)}</div>
          <div class="history-row-date">${formatDate(r.createdAt)}</div>
        </div>
        <div class="history-status history-status-${status}">${t("history." + statusKey)}</div>
      </div>
    `;
  }).join("");

  body.querySelectorAll(".history-row:not(.inert)").forEach(row => {
    row.addEventListener("click", () => openReportDetail(row.getAttribute("data-report-id")));
  });
}

/* ---------------- Legal pages ---------------- */

function renderLegal(kind) {
  const bodyId = kind === "terms" ? "termsBody" : "privacyBody";
  const bodyKey = kind === "terms" ? "termsBody" : "privacyBody";
  const container = document.getElementById(bodyId);
  const paragraphs = t(`legal.${bodyKey}`);
  const list = Array.isArray(paragraphs) ? paragraphs : [];

  let noticeHtml = "";
  if (state.lang === "en") {
    noticeHtml = `<div class="legal-notice">⚠ ${t("legal.translationNotice")}</div>`;
  }

  container.innerHTML = `
    ${noticeHtml}
    <div class="legal-body">${list.map(p => `<p>${p}</p>`).join("")}</div>
  `;
}

/* ---------------- Language switch ---------------- */

function setLanguage(lang) {
  state.lang = lang;
  document.getElementById("langChoiceFr").checked = lang === "fr";
  document.getElementById("langChoiceEn").checked = lang === "en";
  applyStaticTranslations();
  renderCurrentScreen(state.screenStack[state.screenStack.length - 1]);
}

/* ---------------- Dev panel ---------------- */

function renderDevPanel() {
  document.getElementById("devLoginToggle").textContent = state.loggedIn ? "Logged in ✅ (tap to log out)" : "Logged out (tap to log in)";
  document.getElementById("devConfirmRow").hidden = !(state.loggedIn && state.authProvider === "email");
  document.getElementById("devConfirmToggle").textContent = state.emailConfirmed ? "Confirmed ✅" : "Unconfirmed ⏳";
  document.getElementById("devGpsToggle").textContent = state.gpsGranted ? "Granted ✅" : "Denied 🚫";
  document.getElementById("devNetworkToggle").textContent = state.networkOk ? "Online ✅" : "Offline 🚫";
  document.getElementById("devSessionExpiryRow").hidden = state.screenStack[state.screenStack.length - 1] !== "screen-report-create";
}

/* ---------------- Wiring ---------------- */

function wireEvents() {
  document.querySelectorAll("[data-back]").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); goBack(); }));

  // Map topbar
  document.getElementById("btnOpenFilter").addEventListener("click", () => { renderFilterSheet(); openSheet("sheet-filter"); });
  document.getElementById("btnOpenLanguage").addEventListener("click", () => openSheet("sheet-language"));
  document.getElementById("btnOpenAccount").addEventListener("click", () => {
    if (state.loggedIn) pushScreen("screen-profile");
    else pushScreen("screen-auth-landing");
  });
  document.getElementById("btnReportFab").addEventListener("click", handleReportFabClick);
  document.getElementById("btnLocationAction").addEventListener("click", () => {
    state.gpsGranted = true;
    renderMap();
    renderDevPanel();
  });
  document.getElementById("btnNetworkRetry").addEventListener("click", () => {
    state.networkOk = true;
    renderMap();
    renderDevPanel();
  });

  // Scrim closes topmost overlay
  document.getElementById("scrim").addEventListener("click", closeOverlay);

  // Modals: clicking the backdrop (outside the box) closes them too, same as the scrim.
  // The modal wrapper sits above the scrim and would otherwise swallow that click.
  document.querySelectorAll(".modal").forEach(modalEl => {
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) closeOverlay();
    });
  });

  // Filter sheet
  document.getElementById("btnFilterClear").addEventListener("click", () => { state.filters.clear(); renderFilterSheet(); renderMap(); });
  document.getElementById("btnFilterAll").addEventListener("click", () => { REPORT_TYPES.forEach(rt => state.filters.add(rt.id)); renderFilterSheet(); renderMap(); });

  // Language sheet
  document.getElementById("langChoiceFr").addEventListener("change", () => setLanguage("fr"));
  document.getElementById("langChoiceEn").addEventListener("change", () => setLanguage("en"));

  // Delete report modal
  document.getElementById("btnDeleteReportCancel").addEventListener("click", closeOverlay);
  document.getElementById("btnDeleteReportConfirm").addEventListener("click", () => {
    const r = state.reports.find(rep => rep.id === state.selectedReportId);
    if (r) r.deletedAt = Date.now();
    closeOverlay();
    document.getElementById("sheet-report-detail").hidden = true;
    showToast(t("reportDetail.deleteToast"));
    renderMap();
  });

  // Duplicate modal
  document.getElementById("btnDuplicateCancel").addEventListener("click", closeOverlay);
  document.getElementById("btnDuplicateConfirm").addEventListener("click", publishReport);

  // Auth landing
  document.getElementById("chkAge").addEventListener("change", updateLandingGate);
  document.getElementById("chkTerms").addEventListener("change", updateLandingGate);
  document.getElementById("btnGoogleAuth").addEventListener("click", handleGoogleAuth);
  document.getElementById("btnEmailSignup").addEventListener("click", () => pushScreen("screen-signup"));
  document.getElementById("linkGoToLogin").addEventListener("click", (e) => { e.preventDefault(); pushScreen("screen-login"); });
  document.getElementById("linkTermsFromLanding").addEventListener("click", (e) => { e.preventDefault(); pushScreen("screen-terms"); });
  document.getElementById("linkPrivacyFromLanding").addEventListener("click", (e) => { e.preventDefault(); pushScreen("screen-privacy"); });

  // Sign up
  document.getElementById("btnSubmitSignup").addEventListener("click", handleSignup);

  // Nickname
  document.getElementById("btnSkipNickname").addEventListener("click", () => finishNickname(null));
  document.getElementById("btnSaveNickname").addEventListener("click", () => finishNickname(document.getElementById("nicknameInput").value.trim()));

  // Login
  document.getElementById("btnSubmitLogin").addEventListener("click", handleLogin);
  document.getElementById("linkForgotPassword").addEventListener("click", (e) => { e.preventDefault(); pushScreen("screen-forgot"); });

  // Forgot password
  document.getElementById("btnSubmitForgot").addEventListener("click", handleForgotSubmit);

  // Email confirmation pending
  document.getElementById("btnResendEmail").addEventListener("click", () => showToast(t("auth.confirmPending.resent")));
  document.getElementById("btnConfirmDemo").addEventListener("click", () => {
    state.emailConfirmed = true;
    if (state.pendingAction === "report") {
      state.pendingAction = null;
      replaceScreen("screen-report-create");
    } else {
      goToMapRoot();
    }
  });
  document.getElementById("linkBackToMapFromConfirm").addEventListener("click", (e) => { e.preventDefault(); goToMapRoot(); });

  // Report creation
  document.getElementById("btnSubmitReport").addEventListener("click", handleSubmitReport);
  document.getElementById("btnRecenterPin").addEventListener("click", () => {
    state.reportDraft.x = 50;
    state.reportDraft.y = 50;
    state.reportDraft.usingGps = true;
    document.getElementById("pinAreaError").hidden = true;
    renderMiniMapPin();
    renderMiniMapLabel();
  });
  setupPinDragging();

  // Profile
  document.getElementById("btnProfileAvatar").addEventListener("click", () => {
    document.getElementById("profileAvatarInput").click();
  });
  document.getElementById("btnProfileAvatarAction").addEventListener("click", () => {
    document.getElementById("profileAvatarInput").click();
  });
  document.getElementById("profileAvatarInput").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.user.photoUrl = reader.result;
      renderProfile();
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("btnProfileAvatarRemove").addEventListener("click", () => {
    state.user.photoUrl = null;
    document.getElementById("profileAvatarInput").value = "";
    renderProfile();
  });
  document.getElementById("btnEditNickname").addEventListener("click", () => {
    document.getElementById("nicknameEditInput").value = state.user.nickname;
    document.getElementById("profileNicknameRow").hidden = true;
    document.getElementById("nicknameEditRow").hidden = false;
  });
  document.getElementById("btnCancelNicknameEdit").addEventListener("click", renderProfile);
  document.getElementById("btnSaveNicknameEdit").addEventListener("click", () => {
    const val = document.getElementById("nicknameEditInput").value.trim();
    if (val) state.user.nickname = val;
    renderProfile();
    applyStaticTranslations();
  });
  document.getElementById("btnGoLanguageFromProfile").addEventListener("click", () => openSheet("sheet-language"));
  document.getElementById("btnGoHistory").addEventListener("click", () => pushScreen("screen-history"));
  document.getElementById("btnGoTermsFromProfile").addEventListener("click", () => pushScreen("screen-terms"));
  document.getElementById("btnGoPrivacyFromProfile").addEventListener("click", () => pushScreen("screen-privacy"));
  document.getElementById("btnLogout").addEventListener("click", () => {
    state.loggedIn = false;
    state.authProvider = null;
    state.emailConfirmed = false;
    showToast(t("profile.logoutToast"));
    goToMapRoot();
    applyStaticTranslations();
  });
  document.getElementById("btnOpenDeleteAccount").addEventListener("click", () => openModal("modal-delete-account"));

  // Delete account modal
  document.getElementById("btnDeleteAccountCancel").addEventListener("click", closeOverlay);
  document.getElementById("btnDeleteAccountConfirm").addEventListener("click", () => {
    state.reports.forEach(r => { if (r.ownerId === "me") r.ownerId = null; });
    state.loggedIn = false;
    state.authProvider = null;
    state.emailConfirmed = false;
    state.user = { id: "me", email: "", nickname: "", createdAt: null };
    closeOverlay();
    showToast(t("deleteAccount.deletedToast"));
    goToMapRoot();
    applyStaticTranslations();
  });

  // Dev panel
  document.getElementById("devLoginToggle").addEventListener("click", () => {
    if (state.loggedIn) {
      state.loggedIn = false; state.authProvider = null; state.emailConfirmed = false;
    } else {
      state.loggedIn = true; state.authProvider = "email"; state.emailConfirmed = true;
      state.user.email = "demo@example.com";
      state.user.nickname = state.user.nickname || "Dog Walker 42";
      state.user.createdAt = state.user.createdAt || Date.now() - 60 * 24 * 3600 * 1000;
    }
    applyStaticTranslations();
    renderDevPanel();
    renderCurrentScreen(state.screenStack[state.screenStack.length - 1]);
  });
  document.getElementById("devConfirmToggle").addEventListener("click", () => {
    state.emailConfirmed = !state.emailConfirmed;
    renderDevPanel();
  });
  document.getElementById("devGpsToggle").addEventListener("click", () => {
    state.gpsGranted = !state.gpsGranted;
    renderMap();
    renderDevPanel();
    if (state.screenStack[state.screenStack.length - 1] === "screen-report-create") renderMiniMapLabel();
  });
  document.getElementById("devNetworkToggle").addEventListener("click", () => {
    state.networkOk = !state.networkOk;
    renderMap();
    renderDevPanel();
  });
  document.getElementById("devSessionExpiry").addEventListener("click", () => {
    state.loggedIn = false;
    state.authProvider = null;
    state.emailConfirmed = false;
    state.pendingAction = "report";
    replaceScreen("screen-login");
  });
  document.getElementById("devReset").addEventListener("click", () => {
    state = freshState();
    applyStaticTranslations();
    goToMapRoot();
    renderDevPanel();
  });
}

/* ---------------- Init ---------------- */

function init() {
  wireEvents();
  applyStaticTranslations();
  document.getElementById("langChoiceFr").checked = true;
  renderDevPanel();

  setTimeout(() => {
    showScreen("screen-map");
    renderMap();
  }, 900);
}

document.addEventListener("DOMContentLoaded", init);
