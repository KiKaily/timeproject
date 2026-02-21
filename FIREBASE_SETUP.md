# Firebase Configuration for projectelallavor

## Setup Instructions

1. **Update Firebase Credentials**
   - Go to your Firebase project: https://console.firebase.google.com/
   - Select your project: `projectelallavor`
   - Navigate to Project Settings > Service Accounts
   - Copy your Firebase config credentials
   - Update `src/lib/firebase.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "projectelallavor.firebaseapp.com",
  projectId: "projectelallavor",
  storageBucket: "projectelallavor.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

2. **Create Environment Variables**
   Create a `.env` file in the root directory:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=projectelallavor.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=projectelallavor
   VITE_FIREBASE_STORAGE_BUCKET=projectelallavor.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Update firebase.json**
   ```json
   {
     "hosting": {
       "site": "projectelallavor",
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     },
     "projects": {
       "default": "projectelallavor"
     }
   }
   ```

4. **Deploy to Firebase**
   ```bash
   npm run build
   firebase deploy --only hosting:projectelallavor
   ```

The website will be available at: `https://projectelallavor.web.app`

## Website Features

- ✨ Full-screen video background
- 🎯 Smooth scroll anchor navigation (5 sections)
- 🌍 Multi-language support (English, Español, Français)
- 📱 Responsive design
- 📧 Contact footer with email, localization, and phone
- 🎨 Beige background theme with overlay

## Customization

Edit the sections in `src/pages/Landing.tsx`:
- Update section titles and descriptions
- Add more content for each section
- Modify the video background URL
- Change contact information
