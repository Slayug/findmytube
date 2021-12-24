import Configuration from "./configuration";

import { spawn } from 'child_process';

const EXTRACTOR_FILENAME = "extractor.py";

interface Orchestrator {
    startGettingTranscript: (videoId: string) => void
}


export class BarOrchestrator implements Orchestrator {
    startGettingTranscript(videoId: string) {
        const transcriptor = spawn('python',
            [EXTRACTOR_FILENAME,
                videoId,
                Configuration.sonarHost,
                Configuration.sonarPort.toString()
            ]
        );
        console.log(`${EXTRACTOR_FILENAME} ${videoId} ${Configuration.sonarHost} ${Configuration.sonarPort}`);

        transcriptor.stderr.on('data', (data: string) => {
            console.error(`stderr for ${videoId}: ${data}`);
        });

        transcriptor.on('close', (code: string) => {
            console.log(`child process for ${videoId} exited with code ${code}`);
        });
    }
}

export class KubernetesOrchestrator implements Orchestrator {
    startGettingTranscript(videoId: string) {
        throw Error('Not implemented');
    }
}