import { BaseApiService, httpClient } from "./api";
import {
  ImageToVideoParams,
  SpeakParams,
  TextToImageParams,
  TextToVideoParams,
} from "../types";

class GenerationService extends BaseApiService {
  async textToImage(model: string, params: TextToImageParams) {
    try {
      return await this.http.post(`/v1/text2image/${model}`, { params });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async textToVideo(model: string, params: TextToVideoParams) {
    try {
      return await this.http.post(`/generate/${model}`, { params });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async imageToVideo(model: string, params: ImageToVideoParams) {
    try {
      return await this.http.post(`/generate/${model}`, { params });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async speak(model: string, params: SpeakParams) {
    try {
      return await this.http.post(`/v1/speak/${model}`, { params });
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const generationService = new GenerationService(httpClient);