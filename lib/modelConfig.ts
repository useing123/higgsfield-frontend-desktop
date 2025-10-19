// Model configuration mapping UI categories to API endpoints

export const MODEL_CONFIG = {
  "Image to Video": {
    type: "i2v",
    models: ["kling25", "minimax", "seedance", "veo3", "wan25-fast"],
    defaultModel: "seedance",
  },
  "Text to Video": {
    type: "t2v",
    models: ["minimax-hailuo-02", "seedance-v1-lite"],
    defaultModel: "seedance-v1-lite",
  },
  "Text to Image": {
    type: "t2i",
    models: ["nano-banana", "seedream4"],
    defaultModel: "seedream4",
  },
  "Speak": {
    type: "i2v", // Speak uses image-to-video with additional audio params
    models: ["veo3"], // Assuming veo3 supports speak functionality
    defaultModel: "veo3",
  },
} as const;

export type ModelCategory = keyof typeof MODEL_CONFIG;
