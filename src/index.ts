//import { Client } from '@elastic/elasticsearch';

//const client = new Client({ node: 'http://localhost:9200' })


import { exec } from 'child_process';



function loadTranscription(videoId: string) {
	exec(`python extractor.py ${videoId}`, (error, stdout, stderr) => {
		if (error) {
			console.error(error);
			console.error(stderr);
		} else {
			const languages = JSON.parse(stdout);
			console.log(languages);
			for (let key in languages) {
				console.log('key', key);
				//console.log('=>', typeof languages[key]);

			}
		}
	});

}

loadTranscription('HpUVJcKBMb0')