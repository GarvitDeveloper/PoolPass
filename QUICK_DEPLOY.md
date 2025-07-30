# ⚡ Quick Deploy Guide - PoolPass

## 🚀 Fastest Deployment (5 minutes)

### Option 1: GitHub Pages (Recommended)

1. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `poolpass`
   - Make it public
   - Don't initialize with README

2. **Run Deployment Script**:
   ```bash
   ./deploy.sh
   ```
   - Follow the prompts
   - Enter your GitHub repository URL when asked

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Click "Save"

4. **Your app is live!** 🎉
   - URL: `https://YOUR_USERNAME.github.io/poolpass`
   - Admin PIN: `1234` (change this immediately!)

---

### Option 2: Netlify (Alternative)

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect GitHub and select your repository**
4. **Deploy settings**:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
5. **Click "Deploy site"**

---

## 🔧 Post-Deployment Setup

### 1. Change Admin PIN
Edit `data/settings.json`:
```json
{
  "adminPin": "YOUR_SECURE_PIN"
}
```

### 2. Update Pool Info
Edit `data/settings.json`:
```json
{
  "poolName": "Your Community Pool",
  "maxOccupancy": 50
}
```

### 3. Add Residents
Edit `data/residents.json`:
```json
{
  "residents": [
    "John Smith",
    "Jane Doe"
  ]
}
```

---

## 📱 Kiosk Setup

### For Touchscreen Device:

1. **Set Browser to Fullscreen**:
   ```bash
   # Chrome
   chrome --kiosk --app=https://your-app-url.com
   
   # Firefox
   firefox -kiosk https://your-app-url.com
   ```

2. **Auto-start Browser**:
   - Add browser command to startup applications
   - Disable screen saver
   - Set auto-login

---

## 🎯 Success Checklist

- ✅ App loads at your URL
- ✅ Check-in works
- ✅ Admin panel accessible
- ✅ QR codes generate
- ✅ Admin PIN changed
- ✅ Pool info updated
- ✅ Residents added

---

**Your PoolPass is ready for the community!** 🏊‍♂️ 