from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter

import json
import sys

if (len(sys.argv) < 2):
    sys.exit("Need videoID argument")


formatter = JSONFormatter()


video_id=sys.argv[1]
transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

languages={}

# iterate over manually created language to scrap them
for key in transcript_list._manually_created_transcripts:
    language = transcript_list._manually_created_transcripts[key]
    languages[key] = formatter.format_transcript(language.fetch())

# iterate over generated to scrap them if they do not exist in the previous manually created
for key in transcript_list._generated_transcripts:
    if key not in languages:
        language = transcript_list._generated_transcripts[key]
        languages[key] = formatter.format_transcript(language.fetch())
        
print(json.dumps(languages))