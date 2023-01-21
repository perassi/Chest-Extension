import { storage } from '@extend-chrome/storage'
// import preset from "@chestrapp/presets";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeAuth } from "firebase/auth";
// import { initializeAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBgKQmVVt4OBkIILBN_MFIjFvFRBNwMquU",
//     authDomain: "chestrapp.firebaseapp.com",
//     databaseURL: "https://chestrapp-default-rtdb.firebaseio.com",
//     projectId: "chestrapp",
//     storageBucket: "chestrapp.appspot.com",
//     messagingSenderId: "496271595233",
//     appId: "1:496271595233:web:7b663daf53c9203b6909a0",
//     measurementId: "G-VZ1J6363K0"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app);
// const analytics = initializeAnalytics(app, {
//     config: {
//         send_page_view: false,
//     },

// });

console.log('ServiceWorker script')

// chrome.action.onClicked.addListener(
//     (tab: chrome.tabs.Tab) => {
//         chrome.scripting.executeScript({
//             target: {
//                 tabId: tab.id!
//             },
//             func: () => window.__CHESTR__
//         },
//             ([{ result }]: any) => {
//                 console.log(result)
//                 // chrome.action.setPopup({})
//             }
//         )
//     }
// )

chrome.action.disable()

chrome.tabs.onUpdated.addListener(
    (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (changeInfo.status === 'complete') {
            chrome.scripting.executeScript({
                target: {
                    tabId
                },
                files: ['preset.js'],
            })
                .then(
                    ([{ result }]: any) => {
                        if (result?.product) {
                            chrome.action.enable(tabId)
                            chrome.action.setBadgeText({
                                text: 'Y',
                                tabId
                            })
                        } else {
                            chrome.action.disable(tabId)
                            chrome.action.setBadgeText({
                                text: 'N',
                                tabId
                            })
                        }
                    }
                ).catch(() => undefined)
        }
    }
)

chrome.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
        storage.local.set(request)
    }
);