// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, deleteDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL = "harrisonrobertwoods@gmail.com";

// 🔹 Auth state listener (redirect logic)
onAuthStateChanged(auth, user => {
  const path = window.location.pathname;

  if (!user) {
    // not logged in → send to index
    if (!path.endsWith("index.html")) window.location.href = "index.html";
    return;
  }

  // logged in → route appropriately
  if (user.email === ADMIN_EMAIL && !path.endsWith("admin.html")) {
    window.location.href = "admin.html";
  } else if (user.email !== ADMIN_EMAIL && !path.endsWith("welcome.html")) {
    window.location.href = "welcome.html";
  }
});

// 🔹 Export helpers
export async function signup(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), { name, email });
  return cred.user;
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export async function getUserMessage(uid) {
  const docRef = await getDoc(doc(db, "messages", uid));
  return docRef.exists() ? docRef.data().text : null;
}

export async function sendMessage(uid, text) {
  return setDoc(doc(db, "messages", uid), { text });
}

export async function deleteUser(uid) {
  await deleteDoc(doc(db, "users", uid));
  await deleteDoc(doc(db, "messages", uid));
}
