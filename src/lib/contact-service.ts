import { ContactServiceError, type ContactFormPayload } from "@/types/contact";

const CONTACT_RATE_LIMIT_KEY = "vega-hukuk-contact-last-submit-at";
const CONTACT_RATE_LIMIT_WINDOW_MS = 60_000;

const readEnv = (key: keyof ImportMetaEnv) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const inferDefaultEndpoint = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const { hostname } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  return isLocal ? "" : "/api/contact";
};

const getContactConfig = () => ({
  endpoint: readEnv("VITE_CONTACT_FORM_ENDPOINT") || inferDefaultEndpoint(),
  token: readEnv("VITE_CONTACT_FORM_TOKEN"),
});

const normalize = (value: string) => value.trim();

const getRemainingCooldownMs = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const lastSubmitAt = window.localStorage.getItem(CONTACT_RATE_LIMIT_KEY);
  if (!lastSubmitAt) {
    return 0;
  }

  const diff = Date.now() - Number(lastSubmitAt);
  return diff < CONTACT_RATE_LIMIT_WINDOW_MS ? CONTACT_RATE_LIMIT_WINDOW_MS - diff : 0;
};

const markSubmittedNow = () => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONTACT_RATE_LIMIT_KEY, String(Date.now()));
  }
};

const validatePayload = (payload: ContactFormPayload) => {
  const adsoyad = normalize(payload.adsoyad);
  const email = normalize(payload.email);
  const mesaj = normalize(payload.mesaj);

  if (!adsoyad || !email || !mesaj) {
    throw new ContactServiceError("invalid", "Lutfen tum zorunlu alanlari doldurun.");
  }

  if (!payload.kvkkOnay) {
    throw new ContactServiceError("consent_required", "Gonderim icin KVKK onayi gereklidir.");
  }

  if (payload.website && payload.website.trim().length > 0) {
    throw new ContactServiceError("spam_detected", "Gonderim dogrulanamadi.");
  }

  const remainingMs = getRemainingCooldownMs();
  if (remainingMs > 0) {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    throw new ContactServiceError("rate_limit", `Lutfen ${remainingSeconds} saniye sonra tekrar deneyin.`);
  }

  return {
    adsoyad,
    email,
    mesaj,
  };
};

export const submitContactForm = async (payload: ContactFormPayload) => {
  const { endpoint, token } = getContactConfig();
  const sanitized = validatePayload(payload);

  if (!endpoint) {
    throw new ContactServiceError(
      "not_configured",
      "Iletisim endpoint'i henuz tanimli degil. Simdilik telefon, e-posta veya WhatsApp kullanin.",
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ...sanitized,
      source: "website-contact-form",
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ContactServiceError(
      "request_failed",
      payload?.message ?? "Mesaj gonderilemedi. Lutfen daha sonra tekrar deneyin.",
    );
  }

  markSubmittedNow();
};
