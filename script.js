// Message all users at once
document.getElementById('msg-all-btn').onclick = async () => {
  const text = document.getElementById('msg-all').value.trim();
  if (!text) return alert('Enter a message first.');

  const usersSnap = await getDocs(collection(db, "users"));
  if (usersSnap.empty) return alert('No users to message.');

  let count = 0;
  usersSnap.forEach(async userDoc => {
    await setDoc(doc(db, "messages", userDoc.id), { text });
    count++;
  });

  alert(`Message sent to ${count} users.`);
  document.getElementById('msg-all').value = ''; // clear input
};
