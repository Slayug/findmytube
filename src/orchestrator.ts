import Configuration from "./configuration";

import { cpus } from 'os';
import { spawn } from 'child_process';
import cluster from "cluster";


interface Orchestrator {
    init: () => void,
    startGettingTranscript: (videoId: string) => void
}


export class BarOrchestrator implements Orchestrator {
    init() {
        

    }

    startGettingTranscript(videoId: string) {

    }

    private startJob(videoId: string) {
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
    init() {
        throw Error('Not implemented');
    }
    startGettingTranscript(videoId: string) {
        throw Error('Not implemented');
    }
}