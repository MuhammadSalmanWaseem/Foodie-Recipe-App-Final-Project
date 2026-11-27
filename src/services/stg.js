
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  users: '@foodie/users',
  session: '@foodie/session',
  favorites: '@foodie/favorites',
  recipes: '@foodie/my-recipes',
  settings: '@foodie/settings'
};

// Read data from local storage
export async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Storage read failed:', key, error);
    return fallback;
  }
}

// Save data to local storage
export async function writeJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// Load all application data
export async function loadAppData() {
  const [session, favorites, recipes, settings] =
    await Promise.all([
      readJSON(KEYS.session, null),
      readJSON(KEYS.favorites, []),
      readJSON(KEYS.recipes, []),
      readJSON(KEYS.settings, {
        notificationsEnabled: true
      })
    ]);

  return {
    session,
    favorites,
    recipes,
    settings
  };
}

// Register a new user
export async function registerUser({
  username,
  email,
  password
}) {
  const users = await readJSON(KEYS.users, []);

  const normalizedEmail = email.trim().toLowerCase();

  if (!username.trim() || !normalizedEmail || !password) {
    throw new Error('Please complete all three fields.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password must contain at least 6 characters.');
  }

  if (users.some(user => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: `u-${Date.now()}`,
    username: username.trim(),
    email: normalizedEmail,
    password
  };

  await writeJSON(KEYS.users, [...users, user]);

  const session = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  await writeJSON(KEYS.session, session);

  return session;
}

// Login user
export async function loginUser({ email, password }) {
  const users = await readJSON(KEYS.users, []);

  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    item =>
      item.email === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error(
      'Email or password is incorrect. Please try again.'
    );
  }

  const session = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  await writeJSON(KEYS.session, session);

  return session;
}

// Save and clear user session
export async function saveSession(session) {
  await writeJSON(KEYS.session, session);
}

export async function clearSession() {
  await AsyncStorage.removeItem(KEYS.session);
}

// Save favorites
export async function saveFavorites(ids) {
  await writeJSON(KEYS.favorites, ids);
}

// Save personal recipes
export async function saveMyRecipes(recipes) {
  await writeJSON(KEYS.recipes, recipes);
}

// Save application settings
export async function saveSettings(settings) {
  await writeJSON(KEYS.settings, settings);
}

// Inspect stored application data
export async function inspectStorage() {
  const keys = Object.values(KEYS);

  const entries = await Promise.all(
    keys.map(async key => [
      key,
      await AsyncStorage.getItem(key)
    ])
  );

  return Object.fromEntries(entries);
}

// Clear all application data
export async function clearAllAppData() {
  await AsyncStorage.multiRemove(
    Object.values(KEYS)
  );
}

export { KEYS };
