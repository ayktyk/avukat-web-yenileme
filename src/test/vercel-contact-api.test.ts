import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../../api/contact";

describe("vercel contact api", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects non-post access", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(405);
    expect(body.ok).toBe(false);
  });

  it("returns config error when resend envs are missing", async () => {
    const request = new Request("https://vegahukuk.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://vegahukuk.com",
        "x-forwarded-for": "203.0.113.10",
      },
      body: JSON.stringify({
        adsoyad: "Ada Lovelace",
        email: "ada@example.com",
        mesaj: "Merhaba",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.code).toBe("not_configured");
  });

  it("sends email via resend when env is configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "office@example.com";
    process.env.CONTACT_FROM_EMAIL = "Vega Hukuk <onboarding@resend.dev>";
    process.env.CONTACT_ALLOWED_ORIGINS = "https://vegahukuk.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email_123" }),
      }),
    );

    const request = new Request("https://vegahukuk.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://vegahukuk.com",
        "x-forwarded-for": "203.0.113.20",
      },
      body: JSON.stringify({
        adsoyad: "Ada Lovelace",
        email: "ada@example.com",
        mesaj: "Merhaba",
        source: "website-contact-form",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
