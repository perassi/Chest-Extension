import { WEB_URL } from '../config'

console.log('ServiceWorker script')

chrome.action.disable()

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
  ) => {
    console.log('chrome.tabs.onUpdated', changeInfo.status)
    if (changeInfo.status === 'complete') {
      chrome.scripting
        .executeScript({
          target: {
            tabId,
          },
          files: ['preset.js'],
        })
        .then(([{ result }]: any) => {
          if (result?.product?.url || result?.meta?.url) {
            chrome.action.enable(tabId)
            chrome.action.setBadgeText({
              text: 'Y',
              tabId,
            })
          } else {
            chrome.action.disable(tabId)
            chrome.action.setBadgeText({
              text: 'N',
              tabId,
            })
          }
        })
        .catch(console.error)
    }
  },
)

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: WEB_URL + '/sign-up' })
  }
})
