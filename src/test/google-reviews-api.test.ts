import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../api/google-reviews";

describe("google reviews api", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns config error when Google Maps API key is missing", async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
  });

  it("returns normalized reviews when Google details request succeeds", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "google_test";
    process.env.GOOGLE_PLACE_ID = "place_123";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          displayName: { text: "Vega Hukuk İstanbul" },
          googleMapsUri: "https://maps.google.com/?cid=test",
          rating: 4.9,
          userRatingCount: 12,
          reviews: [
            {
              rating: 5,
              relativePublishTimeDescription: "1 hafta önce",
              text: { text: "Çok memnun kaldık." },
              authorAttribution: {
                displayName: "Ada Lovelace",
                uri: "https://maps.google.com/user",
              },
            },
          ],
        }),
      }),
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.placeName).toBe("Vega Hukuk İstanbul");
    expect(body.reviews[0].authorName).toBe("Ada Lovelace");
    expect(body.reviews[0].text).toBe("Çok memnun kaldık.");
  });
});
