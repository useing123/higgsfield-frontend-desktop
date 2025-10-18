import { useState } from "react";
import { generationService } from "../services";
import { GenerationParams } from "../types";

export const useGeneration = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (params: GenerationParams) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      switch (params.type) {
        case "text2image":
          response = await generationService.textToImage(
            "nano-banana",
            params.params
          );
          break;
        case "text2video":
          response = await generationService.textToVideo(
            "seedance-v1-lite-t2v",
            params.params
          );
          break;
        case "image2video":
          response = await generationService.imageToVideo(
            "kling-2-5",
            params.params
          );
          break;
        case "speak":
          response = await generationService.speak("veo3", params.params);
          break;
        default:
          throw new Error("Invalid generation type");
      }
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, generate };
};