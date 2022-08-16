
export const wordInputTarget = 'word-input';
export const channelInputTarget = 'channel-input';

export const guideSteps = [
  {
    target: `.${wordInputTarget}`,
    content: 'Enter the words you are looking for, will search through the Youtube captions 🔎',
    disableBeacon: true,
  },
  {
    target: `.${channelInputTarget}`,
    content: 'Specify a channel to be more precise! (optional)',
  },
]
