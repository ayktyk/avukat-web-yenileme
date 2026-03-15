const MAPS_PUBLIC_URL =
  "https://www.google.com/maps/place/Vega+Hukuk+%C4%B0stanbul/@40.9906768,29.0306268,17z/data=!3m1!4b1!4m6!3m5!1s0x14cab9eeccae6d3f:0x12e5898af266fb0d!8m2!3d40.9906768!4d29.0306268!16s%2Fg%2F11n9bmx32t!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D";
const DEFAULT_PLACE_QUERY =
  "Vega Hukuk İstanbul Osmanağa Mahallesi Karadut Sokak No:14/10 Kadıköy İstanbul";

type GoogleTextSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    googleMapsUri?: string;
  }>;
};

type GooglePlaceDetailsResponse = {
  id?: string;
  displayName?: { text?: string };
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: Array<{
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
  }>;
};

const getEnv = (key: string) => process.env[key]?.trim() ?? "";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });

const error = (status: number, code: string, message: string) => json({ ok: false, code, message }, status);

const googleHeaders = (apiKey: string, fieldMask: string) => ({
  "Content-Type": "application/json",
  "X-Goog-Api-Key": apiKey,
  "X-Goog-FieldMask": fieldMask,
});

const resolvePlaceId = async (apiKey: string) => {
  const configuredPlaceId = getEnv("GOOGLE_PLACE_ID");
  if (configuredPlaceId) {
    return configuredPlaceId;
  }

  const textQuery = getEnv("GOOGLE_PLACE_TEXT_QUERY") || DEFAULT_PLACE_QUERY;

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: googleHeaders(apiKey, "places.id,places.displayName,places.googleMapsUri"),
    body: JSON.stringify({
      textQuery,
      languageCode: "tr",
      maxResultCount: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Text Search failed with ${response.status}`);
  }

  const payload = (await response.json()) as GoogleTextSearchResponse;
  const placeId = payload.places?.[0]?.id;

  if (!placeId) {
    throw new Error("Google Text Search returned no place");
  }

  return placeId;
};

const normalizeReview = (review: NonNullable<GooglePlaceDetailsResponse["reviews"]>[number]) => ({
  authorName: review.authorAttribution?.displayName || "Google Kullanıcısı",
  authorUrl: review.authorAttribution?.uri,
  profilePhotoUrl: review.authorAttribution?.photoUri,
  rating: typeof review.rating === "number" ? review.rating : 0,
  relativeTimeDescription: review.relativePublishTimeDescription,
  publishTime: review.publishTime,
  text: review.text?.text || review.originalText?.text || "",
});

export async function GET() {
  const apiKey = getEnv("GOOGLE_MAPS_API_KEY");

  if (!apiKey) {
    return error(503, "not_configured", "Google yorum entegrasyonu için GOOGLE_MAPS_API_KEY tanımlanmalı.");
  }

  try {
    const placeId = await resolvePlaceId(apiKey);
    const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: googleHeaders(
        apiKey,
        "id,displayName,googleMapsUri,rating,userRatingCount,reviews,rating",
      ),
    });

    if (!detailsResponse.ok) {
      throw new Error(`Google Place Details failed with ${detailsResponse.status}`);
    }

    const payload = (await detailsResponse.json()) as GooglePlaceDetailsResponse;

    return json({
      ok: true,
      placeName: payload.displayName?.text || "Vega Hukuk İstanbul",
      mapsUrl: payload.googleMapsUri || MAPS_PUBLIC_URL,
      rating: payload.rating,
      userRatingCount: payload.userRatingCount,
      reviews: (payload.reviews ?? []).map(normalizeReview).filter((review) => review.text),
    });
  } catch (err) {
    console.error("Google reviews API failed", err);
    return error(502, "request_failed", "Google yorumları alınamadı.");
  }
}
