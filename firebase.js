// Firebase initialization
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC7xNZRGA-t2rxVXn9Md1aaw42PycqE-oo",
  authDomain: "marketlengend.firebaseapp.com",
  databaseURL: "https://marketlengend-default-rtdb.firebaseio.com",
  projectId: "marketlengend",
  storageBucket: "marketlengend.firebasestorage.app",
  messagingSenderId: "637848488159",
  appId: "1:637848488159:web:5597855cc8eab35a58416a"
}

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

// Export both firebase and db
export const db = firebase.database()
export default firebase
