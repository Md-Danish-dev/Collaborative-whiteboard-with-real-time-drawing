#  Collaborative Whiteboard with Chat

A real-time collaborative whiteboard and chat application with role-based access control (Edit/View), built using **React**, **Express.js**, **Socket.IO**, and **Tailwind CSS**.

## 📸 Preview

<!-- Add an image or GIF demo if available -->
![preview](./preview.gif)

---

##  Features

-  Real-time collaborative whiteboard
-  Live chat messaging between users
-  Role-based room access:
  - **Presenter** (can draw)
  - **Viewer** (view-only)
-  Creator selects friend access type (Edit or View)
-  Unique room ID for joining
-  Clear whiteboard, undo/redo functionality
-  Instant whiteboard sync across users

---

##  Project Structure
collaborative-whiteboard/
├── client/ # React frontend (Vite + Tailwind CSS)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── server/ # Node.js + Express + Socket.IO backend
│ ├── utils/
│ ├── index.js
│ └── package.json
│
├── README.md
├── .gitignore


---

## 🛠 Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Realtime Communication:** WebSockets via Socket.IO
- **Deployment:** Vercel (frontend), Render (backend)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard

1. Start the Backend
cd server
npm install
node index.js

2. Start the Frontend
cd client
npm install
npm run dev


Made by Md Danish