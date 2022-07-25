from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter
from youtube_transcript_api._errors import TranscriptsDisabled
from elasticsearch import Elasticsearch

import sys
import functools

formatter = JSONFormatter()

TRANSCRIPT_INDEX = "transcript"

if len(sys.argv) < 4:
    sys.exit("Need {videoID} {elasticsearch_host} {elasticsearch_port} arguments")


# define function and stuff

def create_index(es):
    try:
        # Ignore 400 means to ignore "Index Already Exist" error.
        es.indices.create(index=TRANSCRIPT_INDEX, ignore=400)
    except Exception as ex:
        print(str(ex))


def format_language(result, _languages, key):
    _languages[key] = {
        "fullText": functools.reduce(lambda a, b: f"{a} {b['text']}", result, ""),
        # TODO format transcript returns String, must return a JSON array
        "translations": formatter.format_transcript(result)
    }


video_id = sys.argv[1]
elasticsearch_host = str(sys.argv[2])
elasticsearch_port = str(sys.argv[3])

es_client = Elasticsearch(f"http://{elasticsearch_host}:{elasticsearch_port}")

if not es_client.ping():
    sys.exit(f"Cannot connect to elasticsearch server {elasticsearch_host} {elasticsearch_port}")

create_index(es_client)

try:
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
except TranscriptsDisabled as ex:
    print(f"> TranscriptsDisabled for {video_id} do not continue.")
    exit(0)

languages = {}

# iterate over manually created language to scrap them
for key in transcript_list._manually_created_transcripts:
    language = transcript_list._manually_created_transcripts[key]

    format_language(language.fetch(), languages, key)

# iterate over generated to scrap them if they do not exist in the previous manually created
for key in transcript_list._generated_transcripts:
    if key not in languages:
        language = transcript_list._generated_transcripts[key]
        format_language(language.fetch(), languages, key)

# send result to elastic search
try:
    res = es_client.index(index=TRANSCRIPT_INDEX, id=video_id, document=languages)
    print(res['result'])
except Exception as ex:
    print(str(ex))
# print(json.dumps(languages))
