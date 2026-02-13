# Quick Start Guide - MERN Chat Application

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created

## Setup Steps (5-10 minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env in server folder):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Get MongoDB URI:**
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Get Cloudinary Credentials:**
1. Go to Cloudinary (https://cloudinary.com)
2. Sign up/login
3. Find credentials on the Dashboard
4. Copy Cloud Name, API Key, and API Secret

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
App will open on http://localhost:3000

### Step 4: Test the Application

1. **Register Account:**
   - Click "Sign Up"
   - Enter name, email, password
   - Login with credentials

2. **Search Users:**
   - Click the search icon
   - Search for users (you need at least 2 accounts to chat)

3. **Send Messages:**
   - Click on a user to start chatting
   - Type and send messages
   - Try sending images and files

4. **Create Group:**
   - Click the "+" icon
   - Enter group name
   - Select users
   - Start group chatting

## Troubleshooting

### "Cannot connect to MongoDB"
→ Check your MongoDB URI in .env
→ Whitelist your IP in MongoDB Atlas
→ Verify database user credentials

### "Files not uploading"
→ Verify Cloudinary credentials
→ Check file size (max 10MB)
→ Ensure internet connection

### "Port already in use"
→ Change PORT in server/.env to 5001 or another port
→ Or kill the process using port 5000

### "Module not found"
→ Run `npm install` in both server and client folders
→ Delete node_modules and package-lock.json, then reinstall

## Production Deployment

### Option 1: Deploy to Render (Recommended)

**Backend:**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Add environment variables
5. Deploy

**Frontend:**
1. Update API URLs to production backend
2. Create Static Site on Render
3. Deploy

### Option 2: Deploy to Heroku

**Backend:**
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
# ... set other env vars
git push heroku main
```

**Frontend:**
Deploy to Vercel or Netlify

## Tips

- Use strong JWT_SECRET in production
- Keep .env files private (never commit to Git)
- Test with multiple browser tabs for different users
- Use MongoDB Compass to view database
- Check browser console for errors

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Review the main README.md for detailed documentation

Happy Chatting! 🎉
