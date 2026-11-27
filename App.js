import React, { useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import RecipeEditorScreen from './src/screens/RecipeEditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import RecipeCard from './src/components/RecipeCard';
import { STARTER_RECIPES } from './src/data/recipes';
import { clearSession, loadAppData, loginUser, registerUser, saveFavorites, saveMyRecipes, saveSettings, inspectStorage } from './src/services/storage';
import { searchMeals } from './src/services/recipeApi';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [screen, setScreen] = useState('auth');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [apiRecipes, setApiRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState({ notificationsEnabled: true });
  const [storageSnapshot, setStorageSnapshot] = useState({});
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [apiBusy, setApiBusy] = useState(false);
  const [apiError, setApiError] = useState('');

  const recipes = useMemo(() => [...STARTER_RECIPES, ...apiRecipes, ...myRecipes], [apiRecipes, myRecipes]);

  useEffect(() => {
    (async () => {
      const data = await loadAppData();
      setUser(data.session);
      setFavorites(data.favorites || []);
      setMyRecipes(data.recipes || []);
      setSettings(data.settings || { notificationsEnabled: true });
      setScreen(data.session ? 'home' : 'auth');
      setBooting(false);
    })();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (menuOpen) { setMenuOpen(false); return true; }
      if (screen === 'detail') { setScreen(previousScreen); return true; }
      if (screen === 'editor') { setScreen(previousScreen); setEditingRecipe(null); return true; }
      if (screen === 'settings' || screen === 'notifications' || screen === 'favorites' || screen === 'profile') { setScreen('home'); return true; }
      if (screen === 'home') { return false; }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screen, previousScreen, menuOpen]);

  const refreshStorageSnapshot = async () => setStorageSnapshot(await inspectStorage());

  const handleAuthSubmit = async form => {
    setAuthError(''); setAuthBusy(true);
    try {
      const nextUser = authMode === 'signup' ? await registerUser(form) : await loginUser(form);
      setUser(nextUser); setScreen('home'); setSearch('');
    } catch (error) { setAuthError(error.message || 'Something went wrong. Please try again.'); }
    finally { setAuthBusy(false); }
  };

  const toggleFavorite = async id => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(next); await saveFavorites(next);
    refreshStorageSnapshot();
  };

  const openRecipe = recipe => {
    setSelectedRecipe(recipe);
    setPreviousScreen(screen === 'favorites' ? 'favorites' : screen === 'home' ? 'home' : 'home');
    setScreen('detail');
  };

  const openEditor = recipe => {
    setEditingRecipe(recipe || null);
    setPreviousScreen(recipe ? 'detail' : 'home');
    setScreen('editor');
  };

  const saveRecipe = async recipe => {
    const next = editingRecipe
      ? myRecipes.map(item => item.id === recipe.id ? recipe : item)
      : [recipe, ...myRecipes];
    setMyRecipes(next); await saveMyRecipes(next);
    setEditingRecipe(null); setSelectedRecipe(recipe); setScreen('detail');
    refreshStorageSnapshot();
    Alert.alert('Saved', editingRecipe ? 'Your recipe has been updated.' : 'Your recipe has been added to My Recipes.');
  };

  const deleteRecipe = recipe => {
    Alert.alert('Remove recipe', `Are you sure you want to remove “${recipe.name}”?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        const next = myRecipes.filter(item => item.id !== recipe.id);
        setMyRecipes(next); await saveMyRecipes(next);
        const nextFavs = favorites.filter(id => id !== recipe.id); setFavorites(nextFavs); await saveFavorites(nextFavs);
        setSelectedRecipe(null); setScreen('home'); refreshStorageSnapshot();
      }}
    ]);
  };

  const fetchApiRecipes = async () => {
    setApiBusy(true); setApiError('');
    try {
      const result = await searchMeals('chicken');
      if (!result.length) throw new Error('The recipe API returned no results. Try again later.');
      setApiRecipes(result);
      setCategory('All');
      setScreen('home');
    } catch (error) { setApiError(error.message || 'Could not fetch recipes. Check your internet connection.'); }
    finally { setApiBusy(false); }
  };

  const toggleNotificationSetting = async value => {
    const next = { ...settings, notificationsEnabled: value };
    setSettings(next); await saveSettings(next); refreshStorageSnapshot();
  };

  const openSettings = async () => { setMenuOpen(false); await refreshStorageSnapshot(); setScreen('settings'); };
  const openNotifications = () => { setMenuOpen(false); setScreen('notifications'); };
  const logout = async () => { await clearSession(); setUser(null); setMenuOpen(false); setAuthMode('login'); setAuthError(''); setScreen('auth'); };

  if (booting) {
    return <View style={styles.loading}><Text style={styles.loadingEmoji}>🍊</Text><Text style={styles.loadingText}>Getting Foodie ready…</Text></View>;
  }

  if (!user || screen === 'auth') {
    return <><StatusBar barStyle="dark-content" /><AuthScreen mode={authMode} onModeChange={mode => { setAuthMode(mode); setAuthError(''); }} onSubmit={handleAuthSubmit} error={authError} busy={authBusy} /></>;
  }

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' && <HomeScreen recipes={recipes} category={category} setCategory={setCategory} search={search} setSearch={setSearch} onOpenRecipe={openRecipe} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMenu={() => setMenuOpen(true)} onOpenFavorites={() => setScreen('favorites')} onOpenProfile={() => setScreen('profile')} onRefreshApi={fetchApiRecipes} apiBusy={apiBusy} apiError={apiError} onAddRecipe={() => openEditor(null)} />}
      {screen === 'detail' && <DetailScreen recipe={selectedRecipe} isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false} onToggleFavorite={() => selectedRecipe && toggleFavorite(selectedRecipe.id)} onBack={() => setScreen(previousScreen)} onEdit={() => openEditor(selectedRecipe)} onDelete={() => selectedRecipe && deleteRecipe(selectedRecipe)} />}
      {screen === 'editor' && <RecipeEditorScreen initialRecipe={editingRecipe} onSave={saveRecipe} onCancel={() => { setEditingRecipe(null); setScreen(previousScreen); }} />}
      {screen === 'settings' && <SettingsScreen settings={settings} onToggleNotifications={toggleNotificationSetting} onOpenNotifications={openNotifications} onRefreshApi={fetchApiRecipes} storageSnapshot={storageSnapshot} onBack={() => setScreen('home')} apiBusy={apiBusy} />}
      {screen === 'notifications' && <NotificationsScreen onBack={() => setScreen('settings')} />}
      {screen === 'favorites' && (
        <View style={styles.simpleScreen}>
          <View style={styles.simpleHeader}><Pressable onPress={() => setScreen('home')}><Text style={styles.backLink}>‹ Back</Text></Pressable><Text style={styles.simpleTitle}>Favorites</Text><View style={{ width: 45 }} /></View>
          <ScrollView contentContainerStyle={styles.favoriteGrid}>
            <Text style={styles.simpleSub}>Recipes you have saved with the heart icon.</Text>
            <View style={styles.cardWrap}>{recipes.filter(recipe => favorites.includes(recipe.id)).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onPress={() => openRecipe(recipe)} isFavorite onFavorite={() => toggleFavorite(recipe.id)} />)}</View>
            {!favorites.length && <View style={styles.emptyBox}><Text style={{ fontSize: 35 }}>♡</Text><Text style={styles.emptyTitle}>No favorites yet</Text><Text style={styles.emptySub}>Tap the heart on a recipe to save it here.</Text></View>}
          </ScrollView>
        </View>
      )}
      {screen === 'profile' && (
        <View style={styles.simpleScreen}>
          <View style={styles.simpleHeader}><Pressable onPress={() => setScreen('home')}><Text style={styles.backLink}>‹ Back</Text></Pressable><Text style={styles.simpleTitle}>My Profile</Text><View style={{ width: 45 }} /></View>
          <View style={styles.profileContent}><View style={styles.avatar}><Text style={styles.avatarText}>{(user.username || 'F').slice(0, 1).toUpperCase()}</Text></View><Text style={styles.profileName}>{user.username}</Text><Text style={styles.profileEmail}>{user.email}</Text><View style={styles.profileStats}><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{myRecipes.length}</Text><Text style={styles.profileStatLabel}>MY RECIPES</Text></View><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{favorites.length}</Text><Text style={styles.profileStatLabel}>FAVORITES</Text></View></View><Pressable style={styles.profileButton} onPress={openSettings}><Text style={styles.profileButtonText}>Open Settings</Text></Pressable><Pressable style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>Log Out</Text></Pressable><Text style={styles.localNote}>Demo account stored locally on this device.</Text></View>
        </View>
      )}

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.menuPanel} onPress={() => {}}>
            <View style={styles.menuHeader}><Text style={styles.menuTitle}>Foodie menu</Text><Pressable onPress={() => setMenuOpen(false)}><Text style={styles.menuClose}>×</Text></Pressable></View>
            <Text style={styles.menuUser}>{user.username} · {user.email}</Text>
            {[['⌂', 'Home', () => { setMenuOpen(false); setScreen('home'); }], ['♥', 'Favorites', () => { setMenuOpen(false); setScreen('favorites'); }], ['⚙', 'Settings', openSettings], ['♧', 'Notifications', openNotifications], ['◎', 'My Profile', () => { setMenuOpen(false); setScreen('profile'); }], ['↪', 'Log Out', logout]].map(([icon, label, action]) => <Pressable key={label} style={styles.menuItem} onPress={action}><Text style={styles.menuItemIcon}>{icon}</Text><Text style={styles.menuItemText}>{label}</Text><Text style={styles.menuArrow}>›</Text></Pressable>)}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#FFF8F2' }, loading: { flex: 1, backgroundColor: '#FFF8F2', alignItems: 'center', justifyContent: 'center' }, loadingEmoji: { fontSize: 48 }, loadingText: { color: '#8B7E73', marginTop: 12, fontWeight: '700' },
  simpleScreen: { flex: 1, backgroundColor: '#FFF8F2' }, simpleHeader: { padding: 20, paddingTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEE2D8' }, backLink: { color: '#E47743', fontWeight: '900' }, simpleTitle: { color: '#29221E', fontSize: 19, fontWeight: '900' }, favoriteGrid: { padding: 22, paddingBottom: 40 }, simpleSub: { color: '#8B7E73', marginBottom: 16 }, cardWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, emptyBox: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 28, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#F0E6DD' }, emptyTitle: { color: '#302720', fontWeight: '900', fontSize: 17, marginTop: 8 }, emptySub: { color: '#94867C', textAlign: 'center', marginTop: 5 },
  profileContent: { flex: 1, padding: 25, alignItems: 'center', justifyContent: 'center' }, avatar: { width: 86, height: 86, borderRadius: 30, backgroundColor: '#FFE1CB', alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 37, fontWeight: '900', color: '#D66B3B' }, profileName: { fontSize: 24, fontWeight: '900', color: '#302720', marginTop: 15 }, profileEmail: { color: '#8B7E73', marginTop: 5 }, profileStats: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 17, marginTop: 27, marginBottom: 23, paddingVertical: 18, width: '100%', borderWidth: 1, borderColor: '#F0E6DD' }, profileStat: { flex: 1, alignItems: 'center' }, profileStatNumber: { color: '#E47743', fontSize: 22, fontWeight: '900' }, profileStatLabel: { color: '#94867C', fontSize: 9, letterSpacing: 1, marginTop: 4, fontWeight: '900' }, profileButton: { width: '100%', backgroundColor: '#F07843', padding: 15, alignItems: 'center', borderRadius: 13 }, profileButtonText: { color: '#FFFFFF', fontWeight: '900' }, logoutButton: { width: '100%', backgroundColor: '#FCEBE8', padding: 15, alignItems: 'center', borderRadius: 13, marginTop: 10 }, logoutText: { color: '#C95146', fontWeight: '900' }, localNote: { color: '#A09287', fontSize: 10, marginTop: 25 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(35, 27, 22, 0.35)', alignItems: 'flex-end' }, menuPanel: { width: '82%', maxWidth: 360, height: '100%', backgroundColor: '#FFF8F2', padding: 22, paddingTop: 54, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }, menuHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, menuTitle: { fontSize: 23, fontWeight: '900', color: '#302720' }, menuClose: { fontSize: 32, color: '#8B7E73', lineHeight: 34 }, menuUser: { color: '#9A8D83', fontSize: 11, marginTop: 6, marginBottom: 26 }, menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 17, borderTopWidth: 1, borderColor: '#F0E6DD' }, menuItemIcon: { fontSize: 20, color: '#E47743', width: 38 }, menuItemText: { flex: 1, color: '#4A3F37', fontSize: 15, fontWeight: '800' }, menuArrow: { color: '#B5A79C', fontSize: 24 }
});
