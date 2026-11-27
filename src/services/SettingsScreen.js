
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';

export default function SettingsScreen({
  settings = { notificationsEnabled: true },
  onToggleNotifications,
  onOpenNotifications,
  onRefreshApi,
  storageSnapshot = {},
  onBack,
  apiBusy = false,
}) {
  const notificationsEnabled = Boolean(
    settings?.notificationsEnabled
  );

  const savedEntries = Object.entries(storageSnapshot || []);

  const savedCount = savedEntries.filter(
    ([, value]) => value !== null
  ).length;

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.intro}>
          Make Foodie feel like your own kitchen.
        </Text>

        {/* Notification Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Notifications
          </Text>

          <Text style={styles.cardSubtitle}>
            Choose whether Foodie can send cooking reminders
            and app updates.
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.rowTitle}>
                Enable notifications
              </Text>

              <Text style={styles.rowSubtitle}>
                {notificationsEnabled
                  ? 'Notifications are enabled'
                  : 'Notifications are disabled'}
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{
                false: '#D8CEC5',
                true: '#F3B18E',
              }}
              thumbColor={
                notificationsEnabled ? '#E47743' : '#FFFFFF'
              }
              accessibilityLabel="Enable notifications"
            />
          </View>

          <Pressable
            style={styles.linkRow}
            onPress={onOpenNotifications}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>
              Notification setup and test alert
            </Text>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* External API Integration */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Recipe Discovery
          </Text>

          <Text style={styles.cardSubtitle}>
            Fetch recipe information from the external
            TheMealDB API.
          </Text>

          <Pressable
            style={[
              styles.actionButton,
              apiBusy && styles.actionButtonDisabled,
            ]}
            onPress={onRefreshApi}
            disabled={apiBusy}
            accessibilityRole="button"
          >
            <Text style={styles.actionText}>
              {apiBusy
                ? 'Loading recipes...'
                : 'Fetch API Recipes'}
            </Text>
          </Pressable>
        </View>

        {/* Local Storage */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Local Storage Inspector
          </Text>

          <Text style={styles.cardSubtitle}>
            Values below are read from AsyncStorage on this device.
          </Text>

          <View style={styles.storageSummary}>
            <Text style={styles.storageKey}>
              Saved Data Keys
            </Text>

            <Text style={styles.storageValue}>
              {savedCount} / {savedEntries.length}
            </Text>
          </View>

          {savedEntries.map(([key, value]) => (
            <View key={key} style={styles.storageItem}>

              <View style={styles.storageItemHeader}>
                <Text style={styles.storageKey}>
                  {key.replace('@foodie/', '')}
                </Text>

                <Text style={styles.storageValue}>
                  {value === null
                    ? 'No value'
                    : `${String(value).length} chars saved`}
                </Text>
              </View>

              {value !== null && (
                <Text
                  style={styles.storagePreview}
                  numberOfLines={2}
                >
                  {String(value).slice(0, 160)}
                </Text>
              )}

            </View>
          ))}

          <Text style={styles.hint}>
            Save a recipe or favorite, then reopen Settings.
            The preview shows data persisted locally by the app.
          </Text>
        </View>

        {/* About Foodie */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            About Foodie
          </Text>

          <Text style={styles.cardSubtitle}>
            Foodie Recipe App · Student Final Project · Expo
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

// Settings Screen Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EEE2D8',
  },

  backButton: {
    minWidth: 55,
    paddingVertical: 4,
  },

  backText: {
    color: '#E47743',
    fontWeight: '900',
  },

  headerTitle: {
    color: '#29221E',
    fontSize: 19,
    fontWeight: '900',
  },

  headerSpacer: {
    width: 55,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  intro: {
    color: '#776B62',
    fontSize: 14,
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F0E6DD',
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    color: '#302720',
    fontWeight: '900',
  },

  cardSubtitle: {
    color: '#95877C',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  switchCopy: {
    flex: 1,
    paddingRight: 12,
  },

  rowTitle: {
    color: '#50453D',
    fontWeight: '700',
  },

  rowSubtitle: {
    color: '#9A8D83',
    fontSize: 11,
    marginTop: 3,
  },

  linkRow: {
    borderTopWidth: 1,
    borderColor: '#F1E8E0',
    paddingTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  linkText: {
    color: '#E47743',
    fontWeight: '800',
  },

  arrow: {
    fontSize: 20,
    color: '#E47743',
  },

  actionButton: {
    backgroundColor: '#FFE9D9',
    padding: 12,
    borderRadius: 11,
    alignItems: 'center',
  },

  actionButtonDisabled: {
    opacity: 0.55,
  },

  actionText: {
    color: '#D66B3B',
    fontWeight: '900',
  },

  storageSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#F2EAE3',
  },

  storageItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#F2EAE3',
  },

  storageItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  storageKey: {
    color: '#766A60',
    fontSize: 12,
  },

  storageValue: {
    color: '#312821',
    fontWeight: '800',
    fontSize: 12,
  },

  storagePreview: {
    color: '#A09287',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 4,
  },

  hint: {
    color: '#A09287',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 10,
  },
});
