# 🌍 Graveller

![Maintained](https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)

A full-stack, professional-grade Airbnb clone engineered with a premium UI, dynamic search, interactive map integration, and robust authentication architecture.

---

## ✨ Key Features
- 🔍 **Dynamic Fuzzy Search** — Case-insensitive backend query engine across property titles, locations, and countries.
- 🗺️ **Interactive Maps** — Property coordinates geocoded and mapped smoothly using Leaflet.js constraints.
- 🎨 **Premium UI/UX** — Handcrafted CSS design system featuring animated toast notifications, glassmorphism navbars, and interactive drag-and-drop image layouts.
- 🛡️ **Secure Authentication** — Handled natively via Passport-Local-Mongoose with persistent login sessions.
- ⭐ **Rich Interactive Reviews** — Star-rating UI where users click visual stars to leave reviews on properties.
- 🔒 **Role-based Authorization** — Only property owners (or the global dev admin) can update or wipe listings and reviews.
- 🏗️ **RESTful Architecture** — Complete MVC separation encompassing Models, Views, and Controllers.

---

## 🛠️ Tech Stack
| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | EJS (Embedded JavaScript), Vanilla CSS, Bootstrap 5 |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB Atlas (Mongoose ODM)                    |
| Auth       | Passport.js (Local Strategy, Express-Session)   |
| Maps       | Leaflet.js / OpenStreetMap                      |
| Image Host | Cloudinary (+ Multer)                           |
| Fonts      | Inter & Font Awesome 6                          |

---

## 🏗️ System Architecture
```mermaid
flowchart TD
    A[🌐 Browser\nClient] -->|GET/POST/PUT/DELETE\nHTTP Requests| B[🖥️ Express App\nindex.js]
    A -->|Static Assets| F[📂 public/\nCSS, JS]
    
    B --> C[🛣️ Routers\nlistings.js, user.js, reviews.js]
    C -->|Authenticates & Authorizes| D[🎛️ Controllers\nListing/Review/User Logic]
    
    D -->|Queries & Updates| E[(🍃 MongoDB Atlas\nCollections)]
    E -->|Returns Documents| D
    
    D -->|Renders Templates| G[🎨 Views\nEJS Files]
    G -->|Generates HTML| A
```

---

## 📁 Folder Structure
```
Graveller/
│
├── .env                        ← Secret keys (DB URL, Cloudinary, Session)
├── index.js                    ← Application entrypoint & Express config
├── package.json                ← Backend dependencies + scripts
│
├── COLLECTORS/                 ← Controllers (MVC): Business logic
│   └── listing_functions.js    ← Handles Listing CRUD, search, and DB interactions
│
├── ROUTERS/                    ← Express Routers: Maps endpoints to controllers
│   ├── listings.js             ← /listings routes
│   ├── reviews.js              ← /listings/:id/reviews routes
│   └── user.js                 ← /signup, /login, /logout routes
│
├── models/                     ← Mongoose Schemas (MVC)
│   ├── listing.js              ← Listing Data schema
│   ├── review.js               ← Review schema
│   └── user.js                 ← Passport User schema
│
├── middlewares/                ← Express Middlewares
│   └── isLoggedIn.js           ← Auth guards protecting sensitive routes
│
├── views/                      ← EJS Templates (MVC)
│   ├── layouts/                ← boilerplates
│   ├── includes/               ← navbar, footer, flash toasts
│   └── (index, show, new, edit, login, signup, feature_not_implemented, error)
│
├── public/                     ← Static frontend assets
│   ├── css/style.css           ← Global design token system
│   └── js/script.js            ← Frontend logic (maps, form validation)
│
└── utils/                      ← Helper error handlers, async wrappers, geocoding
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+ installed
- A MongoDB Atlas account (free tier cluster works fine)
- Cloudinary credentials (optional structure for robust image hosting)

### Step 1 — Clone the Repository
```bash
git clone https://github.com/vishnu108shanker/Project-_-Wanderlust.git
cd Project-_-Wanderlust
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Environment Variables
Create a root `.env` file and insert the following required keys:
```env
DB_URL="mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0"
SECRET="your_custom_session_secret"
```

### Step 4 — Run the App
```bash
npm run dev
# If you don't have nodemon installed globally, you can run: node index.js
# → Listening on port 8000
# → MongoDB Atlas connected!
```
Visit [http://localhost:8000/listings](http://localhost:8000/listings) in your browser!

---

## 🐛 Known Issues & Future TODOs
- **Image Upload Pipeline:** The backend currently heavily relies on direct generic image URLs inputted by the user. Next integration step is hooking the existing `views/new.ejs` drag-and-drop UI directly to the `multer-storage-cloudinary` array config for raw file storage.
- **Payments Integration:** Hook the newly designed "Check availability" sticky sidebar card on the `show.ejs` detail page up to a Stripe checkout webhook for simulated booking transactions.
- **Message System Integration:** Build out a Socket.io bridge for the `/feature-not-implemented` inbox pathways.

---

> *Engineered by **@the_evil_lord***
