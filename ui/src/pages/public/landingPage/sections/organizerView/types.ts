import type { QueuePhoto } from "@pages/public/landingPage/data";

export type Decision = "approve" | "reject";

export interface DecidedPhoto {
  photo: QueuePhoto;
  decision: Decision;
}

export interface OrganizerStats {
  photos: number;
  guests: number;
  likes: number;
}
