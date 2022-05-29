import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

function initApp()
{
    const firebaseConfig = {
        apiKey: "AIzaSyA4i_9C1kw83UtFqwDpQPFzqM1Kor-1plc",
        authDomain: "tohacksproj2022.firebaseapp.com",
        projectId: "tohacksproj2022",
        storageBucket: "tohacksproj2022.appspot.com",
        messagingSenderId: "216847207461",
        appId: "1:216847207461:web:e2cde10a10bf5286d403cc",
        measurementId: "G-EKFP1G5BNV"
    };
    const app = initializeApp(firebaseConfig);
}

function login() {
    let user = document.getElementById('login_email').value;
    let pass = document.getElementById('login_pass').value;

    console.log(app)
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, user, pass)
    .then((userCredential) => {
        console.log('user signed in');
        const user = userCredential.user;
    })
    .catch((error) => {
        console.log('user signed in failed');
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

window.onload = function() {
    initApp();
};

export { login }
