curl -X GET "http://localhost:9200/transcript/_search?pretty" -H "Content-Type: application/json" -d '{"query": {
                         "query_string" : {"default_field" : "*.fullText", "query" : "*craintes*"}
                     } }'