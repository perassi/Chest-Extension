export default {
  manifest_version: 2,
  name: 'Chestr - Universal Shopping Wishlist',
  background: {
    scripts: ['serviceWorker.ts'],
  },
  content_scripts: [
    {
      js: [
        'content/index.ts',
      ],
      matches: [
        'https://*/*',
        'http://*/*',
      ]
    },
  ],
  browser_action: {
    default_popup: 'pages/popup/index.html',
  }
} as chrome.runtime.ManifestV2