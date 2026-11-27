export async function registerUser({ username, email, password }) {
  const users = await readJSON(KEYS.users, []);

  const normalizedEmail = email.trim().toLowerCase();

  // Validate all fields
  if (!username.trim() || !normalizedEmail || !password) {
    throw new Error('Please complete all three fields.');
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid email address.');
  }

  // Validate password
  if (password.length < 6) {
    throw new Error('Password must contain at least 6 characters.');
  }

  // Check existing account
  if (users.some(user => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  // Create new user
  const user = {
    id: `u-${Date.now()}`,
    username: username.trim(),
    email: normalizedEmail,
    password
  };

  // Save account locally
  await writeJSON(KEYS.users, [...users, user]);

  const session = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  await writeJSON(KEYS.session, session);

  return session;
}
