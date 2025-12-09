# EarlyBird 🌅

> 🚧 **UNDER CONSTRUCTION**: Use hard hats beyond this point.
> This is just a pre-alpha, "Day 1" MVP I threw together. Don't expect much.

**EarlyBird** is a **Social Alarm App** that turns waking up into a communal win. 
The core loop is simple: Commit to a wake time, and you have a 15-minute window to post a selfie to "unlock" your day and keep your streak.

<img width="2816" height="1536" alt="Gemini_Generated_Image_x7alojx7alojx7al" src="https://github.com/user-attachments/assets/eb4f2b5f-c1e5-4089-87c9-75733113f0e2" />

---

## 🛠 Tech Stack

We use a modern, performance-focused stack centered around Expo.

- **Framework**: [React Native](https://reactnative.dev/) (via [Expo SDK 54](https://expo.dev/))
- **Router**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing in `/app`)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Global store, Way simpler than Redux)
- **Backend / DB**: [Supabase](https://supabase.com/) (Auth, Postgres, Realtime, Storage)
- **Performance**: 
    - [`@shopify/flash-list`](https://github.com/Shopify/flash-list) for all lists.
    - [`expo-image`](https://docs.expo.dev/versions/latest/sdk/image/) for caching and performance.

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd EarlyBird
npm install
```

### 3. Environment Setup

Grab the Supabase keys from your project settings and stick them in a .env file at the root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Running the App

Start the development server:

```bash
npx expo start --clear
```
Then press `a` for Android, `i` for iOS, or `w` for web.

---

## 📂 How it's organized

```
/app          # Pages and layouts (where the routing happens)
/components   # UI bits (buttons, inputs, etc.)
/lib          # Config stuff (like the Supabase client)
/services     # API calls and Backend logic (Supabase queries go here!)
/store        # State management (with Zustand)
/assets       # Images, fonts, and static assets
```

## 📐 Notes for myself

- **Supabase Interaction**: 
  - Keep all the Supabase logic in /`/services`. Don't clutter the UI components with database calls.
- **Absolute Imports**: Use `@/components/...` or `@/lib/...` imports to keep code clean.
- **Icons**: Using `lucide-react-native`.

---

EarlyBird © 2025
