// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// import { initializeAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBgKQmVVt4OBkIILBN_MFIjFvFRBNwMquU",
    authDomain: "chestrapp.firebaseapp.com",
    databaseURL: "https://chestrapp-default-rtdb.firebaseio.com",
    projectId: "chestrapp",
    storageBucket: "chestrapp.appspot.com",
    messagingSenderId: "496271595233",
    appId: "1:496271595233:web:7b663daf53c9203b6909a0",
    measurementId: "G-VZ1J6363K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
// const analytics = initializeAnalytics(app, {
//     config: {
//         send_page_view: false,
//     },
    
// });

console.log('ServiceWorker script', app, auth)
