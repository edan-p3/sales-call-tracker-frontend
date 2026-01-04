# Frontend Deployment Guide

## ✅ **What We've Done**

Your frontend has been updated with:
- ✅ Full authentication (login & registration)
- ✅ API integration with your backend
- ✅ Protected routes
- ✅ Removed "reps" selector (now uses logged-in user)
- ✅ Pushed to GitHub: https://github.com/edan-p3/sales-call-tracker-frontend

## 🚀 **Deploy to Vercel - Follow These Steps:**

### **Step 1: Go to Vercel**
1. Open https://vercel.com in your browser
2. Click "Add New" → "Project"

### **Step 2: Import Repository**
1. Find and select: `edan-p3/sales-call-tracker-frontend`
2. Click "Import"

### **Step 3: Configure Project**
1. **Framework Preset**: Should auto-detect "Create React App" ✅
2. **Root Directory**: Leave as `.` (default)
3. **Build Command**: `npm run build` (should be auto-filled)
4. **Output Directory**: `build` (should be auto-filled)

### **Step 4: Add Environment Variable**
Click "Environment Variables" and add:

**Key**: `REACT_APP_API_URL`  
**Value**: `https://sales-call-tracker-backend.vercel.app/api`

⚠️ **Important**: Make sure to use the exact backend URL above!

### **Step 5: Deploy**
1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. You'll get a URL like: `https://sales-call-tracker-frontend.vercel.app`

---

## 📋 **After Deployment - Update Backend CORS**

Once your frontend is deployed, you need to update the backend to allow requests from your frontend URL.

1. Go to your backend Vercel dashboard: https://vercel.com
2. Select project: `sales-call-tracker-backend`
3. Go to "Settings" → "Environment Variables"
4. Find the `CORS_ORIGIN` variable
5. Update its value to: `https://your-frontend-url.vercel.app` (use the actual URL Vercel gave you)
6. Click "Save"
7. Go to "Deployments" tab
8. Click the "..." menu on the latest deployment
9. Click "Redeploy"

---

## 🎉 **Testing Your Application**

Once both are deployed:

1. Visit your frontend URL
2. You should see a login page
3. Click "Don't have an account? Sign up"
4. Register with:
   - Email: your-email@example.com
   - Password: Test1234 (or any password with 8+ chars, 1 uppercase, 1 number)
   - First Name: Your name
   - Last Name: Your last name
5. You should be logged in and see the Sales Activity Tracker dashboard!

---

## 🛠️ **Local Development** (Optional)

If you want to run the frontend locally:

1. Update `.env.local` to point to your deployed backend:
   ```
   REACT_APP_API_URL=https://sales-call-tracker-backend.vercel.app/api
   ```

2. Run locally:
   ```bash
   cd "/Users/edandvora/Documents/Sales Call Tracker/sales-tracker"
   npm start
   ```

3. Open http://localhost:3000

---

## 📝 **Key Changes Made**

### **Removed Features:**
- ❌ Multiple reps selector (now uses logged-in user)
- ❌ "Add reps" in settings
- ❌ localStorage for activity data

### **Added Features:**
- ✅ Login/Register pages
- ✅ JWT authentication
- ✅ API integration for goals and activities
- ✅ Protected routes
- ✅ User profile display
- ✅ Logout button

### **File Structure:**
```
src/
├── components/
│   ├── Auth.js              (NEW - Login/Register UI)
│   ├── MainApp.js           (NEW - Main app with auth)
│   ├── Dashboard.js         (existing)
│   ├── Settings.js          (updated - removed reps)
│   └── ...
├── context/
│   └── AuthContext.js       (NEW - Auth state management)
├── utils/
│   ├── api.js               (NEW - Axios client)
│   ├── storageAPI.js        (NEW - API calls for data)
│   └── storage.js           (OLD - still exists for reference)
├── App.js                   (updated - routing)
└── index.js                 (updated - providers)
```

---

## 🐛 **Troubleshooting**

### **Issue: Can't login/register**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Make sure backend is running: https://sales-call-tracker-backend.vercel.app/health

### **Issue: CORS error**
- Update backend `CORS_ORIGIN` to match your frontend URL
- Redeploy backend after changing environment variables

### **Issue: 404 on refresh**
- This is normal with client-side routing
- Vercel should handle it automatically with `rewrites` in `vercel.json`
- If not, we can add a `vercel.json` to the frontend

---

## ✅ **Next Steps**

1. **Deploy frontend to Vercel** (follow steps above)
2. **Update backend CORS** with your frontend URL
3. **Test the application** end-to-end
4. **Celebrate!** 🎉

Let me know when you've deployed and I'll help you test everything!

