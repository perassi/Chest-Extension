import { WEB_URL } from '../config'
import debounce from 'lodash.debounce'

// chrome.action.disable()

const check = debounce(
  (
    tabId: any,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
  ) => {

    const id = tabId?.tabId || tabId
    if (tab?.url?.startsWith('chrome')) return

    // if (changeInfo.status === 'complete') {
    chrome.scripting
      .executeScript({
        target: {
          tabId: id,
        },
        files: ['preset.js'],
      })
      .then(([{ result }]: any) => {
        if (!result) {
          chrome.action.disable(id)
          // chrome.action.setBadgeText({
          //   text: 'N',
          //   tabId: id,
          // })
        } else {
          if (result?.product?.url || result?.meta?.url) {
            chrome.action.enable(id)
            // chrome.action.setBadgeText({
            //   text: 'Y',
            //   tabId: id,
            // })
          } else {
            chrome.action.disable(id)
            // chrome.action.setBadgeText({
            //   text: 'N',
            //   tabId: id,
            // })
          }
        }
      })
      .catch(console.error)
    // }
  },
  500
)

chrome.tabs.onUpdated.addListener(check)

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: WEB_URL + '/sign-up' })
  }
})
