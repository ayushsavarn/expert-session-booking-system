# expert session booking system 

i built this real-time booking platform for my internship assignment. it lets people find industry experts and book sessions without any double-booking issues. used socket.io so you can see slot updates live.

## tech stack
*   **frontend**: react 19 (vite), tailwind css v4, react router, axios
*   **backend**: node.js, express, mongoose
*   **database**: mongodb atlas
*   **real-time**: socket.io for live updates
*   **icons**: heroicons (svg)

## key features
*   **real-time slot updates**: if someone books a slot, it disappears from everyone else's screen instantly. no refresh needed.
*   **race condition safety**: used a unique compound index in mongodb so it's physically impossible to book the same expert at the same time twice.
*   **admin dashboard**: added a simple `/admin` view to see every booking and change their status (pending/confirmed/completed).
*   **expert search**: you can search by name or filter through 10+ categories like tech, fitness, etc.

## how to run it

### 1. backend
```bash
cd backend
npm install
```
create a `.env` in the backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_url
```
run the seed script to get the 30+ demo experts:
```bash
npm run seed
```
start it up:
```bash
npm start
```

### 2. frontend
```bash
cd frontend
npm install
```
create a `.env` in the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
start the dev server:
```bash
npm run dev
```

## api endpoints
*   `GET /api/experts` - list experts with search/filters
*   `POST /api/bookings` - book a new session
*   `PATCH /api/bookings/:id/status` - update status (admin only)
*   `DELETE /api/bookings/:id` - cancel booking and free up the slot
