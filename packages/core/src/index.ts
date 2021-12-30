'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scrapeYoutube = require('scrape-youtube');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ytch = require('yt-channel-info');
class YoutubeHelper {
    static loadChannelVideos(channelId, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            return ytch.getChannelVideos(channelId, sortBy);
        });
    }
    static search(content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return scrapeYoutube.youtube.search(content, options);
        });
    }
}

var _a;
const QueueName = (_a = process.env.QUEUE_NAME) !== null && _a !== void 0 ? _a : 'videos';
const ExtractorFileName = 'extractor.py';
const Config = {
    sonarHost: 'localhost',
    sonarPort: 9200,
    sonarIndex: 'videos',
    redisHost: 'localhost',
    redisPort: 6379,
    queueName: QueueName,
    extractorFileName: ExtractorFileName,
};

exports.Config = Config;
exports.YoutubeHelper = YoutubeHelper;
//# sourceMappingURL=index.ts.map
