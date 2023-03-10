export default {
  manifest_version: 3,
  name: "Chestr - Universal Shopping Wishlist",
  description: "Save items and track discounts from any online store.",
  background: {
    service_worker: 'serviceWorker.ts',
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
    default_icon: {
      "16": "/images/logo.png",
      "32": "/images/logo.png",
      "48": "/images/logo.png",
      "128": "/images/logo.png"
    },
    default_popup: 'pages/popup/index.html',
  },
  icons: {
    "16": "/images/logo.png",
    "32": "/images/logo.png",
    "48": "/images/logo.png",
    "128": "/images/logo.png"
  },
  host_permissions: [
    'https://*/*',
    'http://*/*',
  ],
  permissions: [
    'scripting',
    'activeTab',
    'storage'
  ],
  externally_connectable: {
    matches: [
      'https://chestr.com/*',
      'https://chestr.app/*',
      'https://chestr-staging.com/*',
      '\*://localhost/\*',
    ]
  },
} as Partial<chrome.runtime.ManifestV3>