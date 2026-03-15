export interface GoogleReview {
  authorName: string;
  authorUrl?: string;
  profilePhotoUrl?: string;
  rating: number;
  relativeTimeDescription?: string;
  publishTime?: string;
  text: string;
}

export interface GoogleReviewsPayload {
  ok: true;
  placeName: string;
  mapsUrl: string;
  rating?: number;
  userRatingCount?: number;
  reviews: GoogleReview[];
}
