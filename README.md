# Foodie Recipe App — Final Project Lab

A student Expo / React Native project scaffold for the final-project checklist. It includes local demo authentication, recipe browsing, recipe details, favorites, personal recipes, AsyncStorage persistence, TheMealDB API search, a settings menu, and local notifications.

## Expo version and dependencies

This project uses Expo SDK 58. The SDK 58 version line uses React Native 0.88.1 / React 19.3.0. Dependencies are listed in `package.json`.

- AsyncStorage stores the demo account, session, favorites, personal recipes, and settings locally.
- TheMealDB is queried through `src/services/recipeApi.js` using its public search endpoint.
- `expo-notifications` is used to request permission and schedule a local test notification. Local notifications can be tested in Expo Go; remote push notifications on Android require a development build.
- `expo-image-picker` lets a user choose an image for a personal recipe.

## Run the app

1. Install Node.js 22.13 or later.
2. Download/extract this folder or clone the public GitHub repository.
3. Open a terminal in this folder and run:

```bash
npm install
npx expo start
```

4. Open the QR code in Expo Go or run the project in an Expo-compatible development environment. If Expo prompts you to sign in, sign in to your Expo account.

For a browser preview, install the web peer dependencies using Expo's install command and run `npx expo start --web`.

## Demo account flow

- Start at the Login screen and select **Sign up** to create a local demo account.
- Use any valid email address and a password of at least six characters.
- The credentials are saved on the current device using AsyncStorage. Log out and sign in again to test Login.
- To capture a signup error, enter an invalid email or a password shorter than six characters.
- To capture a login error, enter an unregistered email or an incorrect password.

**Security note:** this is a classroom demonstration. Passwords are stored locally in plain JSON for demonstration and must not be used for real users. A production app must use a secure authentication provider and never store plaintext passwords.

## Implementation links for the GitHub checklist

After uploading the project to a public repository, replace `YOUR-USERNAME` with your GitHub username. These are the file URLs to submit:

| Requirement | File URL path |
|---|---|
| Public repository | `https://github.com/YOUR-USERNAME/foodie-recipe-app` |
| Nine user stories | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/USER_STORIES.md` |
| Signup implementation | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/screens/AuthScreen.js` and `src/services/storage.js` |
| Login implementation | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/screens/AuthScreen.js` and `src/services/storage.js` |
| Home screen | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/screens/HomeScreen.js` |
| Detail screen | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/screens/DetailScreen.js` |
| Local storage | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/services/storage.js` |
| External API | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/services/recipeApi.js` |
| Settings menu | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/App.js` |
| Settings screen | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/screens/SettingsScreen.js` |
| Notifications | `https://github.com/YOUR-USERNAME/foodie-recipe-app/blob/main/src/services/notifications.js` and `src/screens/NotificationsScreen.js` |

## Evidence checklist

The required image names and capture instructions are in [`evidence/README.md`](evidence/README.md). Capture the real screens in Figma and from the running app/device, then upload the images into the `evidence/` folder and commit them to GitHub.

Screenshots of Figma, successful runtime API results, local device storage, and an actually triggered notification cannot be truthfully produced from source code alone. They must be captured in the relevant application/device after running this project.

## Project structure

```text
App.js
app.json
package.json
USER_STORIES.md
evidence/README.md
src/
  components/RecipeCard.js
  data/recipes.js
  screens/
    AuthScreen.js
    HomeScreen.js
    DetailScreen.js
    RecipeEditorScreen.js
    SettingsScreen.js
    NotificationsScreen.js
  services/
    storage.js
    recipeApi.js
    notifications.js
```

## Notes

- The app is a functional teaching/demo scaffold; it has not been deployed to your GitHub account and has not been run on your physical device from this chat.
- Figma evidence still needs to be created in Figma. The instructions are provided in `evidence/README.md`.
- The external API requires internet access. If the public service is unavailable, the app shows an error message instead of inventing results.
