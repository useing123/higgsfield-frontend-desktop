export interface TextToImageParams {
  prompt: string;
  width_and_height: string;
  enhance_prompt: boolean;
  quality: string;
  batch_size: number;
}

export interface TextToVideoParams {
  duration: number;
  resolution: string;
  aspect_ratio: string;
  camera_fixed: boolean;
}

export interface ImageToVideoParams {
  model: string;
  duration: number;
  enhance_prompt: boolean;
}

export interface SpeakParams {
  model: string;
  quality: string;
  aspect_ratio: string;
  enhance_prompt: boolean;
}

export type GenerationParams =
  | { type: "text2image"; params: TextToImageParams }
  | { type: "text2video"; params: TextToVideoParams }
  | { type: "image2video"; params: ImageToVideoParams }
  | { type: "speak"; params: SpeakParams };