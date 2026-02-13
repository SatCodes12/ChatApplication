# MERN Stack Real-Time Chat Application

A full-stack real-time chat application built with MongoDB, Express.js, React.js, and Node.js (MERN Stack), featuring Socket.IO for real-time messaging and JWT authentication.

## Features

### Core Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 👥 **One-on-One Chat** - Private conversations between users
- 👨‍👩‍👧‍👦 **Group Chat** - Create and manage group conversations
- 🔍 **User Search** - Search and connect with other users
- 📎 **File Sharing** - Share images and documents
- 😊 **Emoji Support** - Rich emoji picker for expressive messaging
- ⌨️ **Typing Indicators** - See when others are typing
- ✓ **Read Receipts** - Track message read status
- 🎨 **WhatsApp-like UI** - Modern, familiar interface

### Additional Features
- User profiles with avatars
- Online/offline status
- Responsive design
- Message timestamps
- Image preview
- File attachments

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Media storage

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Socket.IO Client** - Real-time client
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Emoji Picker React** - Emoji selection
- **Moment.js** - Date formatting
- **React Scrollable Feed** - Auto-scrolling messages

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account (for file uploads)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mern-chat-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=(your mongodb uri)
JWT_SECRET=(your secret key)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. MongoDB Atlas Setup

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

### 4. Cloudinary Setup

1. Create an account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard to get your credentials
3. Update the Cloudinary variables in `.env`

### 5. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
mern-chat-app/
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ChatBox/
    │   │   │   ├── ChatBox.js
    │   │   │   ├── ChatHeader.js
    │   │   │   ├── Messages.js
    │   │   │   └── MessageInput.js
    │   │   └── Sidebar/
    │   │       ├── Sidebar.js
    │   │       ├── ChatList.js
    │   │       ├── UserSearch.js
    │   │       ├── GroupModal.js
    │   │       └── ProfileModal.js
    │   ├── config/
    │   │   └── api.js
    │   ├── context/
    │   │   └── ChatContext.js
    │   ├── pages/
    │   │   ├── Auth.js
    │   │   └── Chat.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Users
- `GET /api/users?search=` - Search users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

### Chats
- `POST /api/chats` - Create or access one-on-one chat (protected)
- `GET /api/chats` - Get all user chats (protected)
- `POST /api/chats/group` - Create group chat (protected)
- `PUT /api/chats/group/rename` - Rename group (protected)
- `PUT /api/chats/group/add` - Add user to group (protected)
- `PUT /api/chats/group/remove` - Remove user from group (protected)

### Messages
- `POST /api/messages` - Send message with optional file (protected)
- `GET /api/messages/:chatId` - Get all messages for a chat (protected)
- `PUT /api/messages/read/:chatId` - Mark messages as read (protected)

## Socket.IO Events

### Client to Server
- `setup` - Initialize user connection
- `join chat` - Join a specific chat room
- `typing` - User is typing
- `stop typing` - User stopped typing
- `new message` - Send new message

### Server to Client
- `connected` - Connection established
- `user online` - User came online
- `user offline` - User went offline
- `message received` - New message received
- `typing` - Someone is typing
- `stop typing` - Someone stopped typing
- `messages read` - Messages marked as read

## Usage Guide

### 1. Register/Login
- Create a new account or login with existing credentials
- Upload a profile picture (optional)

### 2. Start Chatting
- Click the search icon to find users
- Select a user to start a conversation
- Send text messages, images, or files

### 3. Create Groups
- Click the "+" icon in the header
- Enter group name
- Select at least 2 users
- Click "Create Group"

### 4. Send Files
- Click the paperclip icon
- Select an image or document
- Add optional message
- Click send

## Features in Detail

### Real-time Communication
The app uses Socket.IO for real-time features:
- Instant message delivery
- Typing indicators
- Online/offline status
- Read receipts

### File Sharing
Supports sharing:
- Images (JPEG, PNG, GIF, WebP)
- Documents (PDF, DOC, DOCX, TXT)
- Max file size: 10MB

### Security
- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected API routes
- Input validation

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check your MongoDB Atlas connection string
- Ensure IP address is whitelisted
- Verify database user credentials

**Cloudinary Upload Failed**
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB)
- Ensure supported file format

**Socket.IO Not Connecting**
- Check CORS configuration
- Verify backend is running
- Check firewall settings

**Images Not Loading**
- Verify Cloudinary setup
- Check network tab for errors
- Ensure correct file permissions

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update CORS origin to production URL
3. Deploy using Git

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Update API URLs to production backend

### MongoDB Atlas
- Already cloud-hosted, no additional setup needed
- Update connection string if needed

## Future Enhancements

- [ ] Voice messages
- [ ] Video calls
- [ ] Message editing/deletion
- [ ] Message reactions
- [ ] Push notifications
- [ ] Dark/light theme toggle
- [ ] Message search
- [ ] User blocking
- [ ] Admin panel
- [ ] Message forwarding

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, email your-email@example.com or create an issue in the repository.

## Acknowledgments

- WhatsApp for UI/UX inspiration
- MongoDB Atlas for database hosting
- Cloudinary for media storage
- Socket.IO for real-time functionality
