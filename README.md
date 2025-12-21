
# Full Stack Blog Project

A modern full-stack blog application where users can register, create posts, comment, and manage their profiles, including uploading profile pictures. The project demonstrates a robust CRUD architecture, authentication, and file upload handling.

## Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose ODM)
- **Passport.js** (Authentication)
- **Cloudinary** (Image storage)
- **Multer** (File upload middleware)

### Frontend
- **EJS** (Embedded JavaScript Templates)
- **Bootstrap 5** (Responsive UI)
- **Font Awesome** (Icons)

## Features
- User registration and authentication
- Create, edit, and delete blog posts
- Comment on posts
- User profile management (edit profile, upload profile picture)
- Responsive and modern UI

## Folder Structure
```
controllers/      # Route handlers for business logic
middlewares/      # Custom Express middlewares (auth, error, upload)
models/           # Mongoose models (User, Post, Comment, File)
routes/           # Express route definitions
views/            # EJS templates for UI
config/           # Configuration files (Cloudinary, Passport)
app.js            # Main Express app entry point
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (local or Atlas)

### Installation
1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd full-stack-blog-project
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Set up environment variables:**
	Create a `.env` file in the root directory with the following:
	```env
	MONGODB_URI=your_mongodb_connection_string
	SESSION_SECRET=your_session_secret
	CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
	CLOUDINARY_API_KEY=your_cloudinary_api_key
	CLOUDINARY_API_SECRET=your_cloudinary_api_secret
	```
4. **Start the application:**
	```sh
	npm start
	```
	Or for development with auto-reload:
	```sh
	npm run dev
	```
5. **Visit the app:**
	Open your browser and go to `http://localhost:3000`

## License
This project is licensed under the MIT License.
