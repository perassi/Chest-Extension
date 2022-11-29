export default {
  manifest_version: 3,
  name: 'Chestr - Universal Shopping Wishlist',
  background: {
    service_worker: 'serviceWorker/index.ts',
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
  action: {
    default_popup: 'pages/popup/index.html',
  }
} as chrome.runtime.ManifestV3