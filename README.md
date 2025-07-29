# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# React Native Todo App

A simple and modern Todo App built with **React Native**, **Expo**, and **Firebase**.  
Features include authentication, profile editing, todos by date, and a custom drawer navigation.

---

## Features

- **User Authentication** (Sign Up, Sign In, Password Reset)
- **Profile Editing**
- **Todos by Date** (with calendar view)
- **Mark tasks as completed or pending**
- **Custom Drawer Navigation**
- **Field-specific validation and error messages**
- **Firebase backend integration**

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/your-todo-app.git
cd your-todo-app
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Set Up Firebase

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable **Authentication** (Email/Password).
- Create a **Firestore Database**.
- Copy your Firebase config and replace it in `firebaseConfig.js` or `firebaseConfig.ts`.

### 4. Start the App

```sh
npx expo start
```

---

## Project Structure

```
/app
  /(auth)         # Authentication screens (sign-in, sign-up)
  /(drawer)       # Main app screens (todos, by date, edit profile)
  /components     # Custom components (drawer, etc.)
/utils            # Utility functions (auth, etc.)
/services         # API/service logic (e.g., todoService)
firebaseConfig.ts # Firebase config
```

---

## Scripts

- `npm start` — Start Expo development server
- `npm run android` — Run on Android device/emulator
- `npm run ios` — Run on iOS simulator (Mac only)

---

## Customization

- **Add more fields** to sign up/profile as needed.
- **Style** the app to your preference in the component files.
- **Add features** like notifications, recurring tasks, etc.

---

## License

MIT

---

## Credits

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
