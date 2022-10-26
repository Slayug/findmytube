import {LanguageList, Transcription, VideoResult} from "@findmytube/core";


export function getCurrentTranscription(videoResult: VideoResult): Transcription[] {
  for (const language of LanguageList) {
    if (videoResult[language])
      return JSON.parse(videoResult[language].translations);
  }
  return [];
}
