import { Innertube } from 'youtubei.js';

export const InnertubeProvider = [
  {
    provide: 'INNERTUBE_SOURCE',
    useFactory: async () => {
      return Innertube.create();
    },
  },
];
