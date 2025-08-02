<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />

# Net-4-Speed 🏎️

A thrilling racing game where your internet speed determines how fast your virtual car moves! Compete against dynamic AI opponents while your real-time bandwidth fuels your racing performance.

## Basic Details
### Team Name: Changemakers

### Team Members
- **Team Lead**: Prithvi Bhargav - Govt Model Engineering College, Kochi
- **Member 2**: Adithyan AS - Govt Model Engineering College, Kochi

### Project Description
Net-4-Speed transforms the mundane task of internet speed testing into an exciting racing game! Your actual download and upload speeds directly control your virtual car's performance. Race against AI opponents with dynamic speed variations, navigate through obstacles, and prove your internet connection is the fastest on the track.

### The Problem (that doesn't exist)
Waiting for boring internet speed tests to finish is a drag—there's no excitement, no competition, and absolutely zero racing action!

### The Solution (that nobody asked for)
By turning the mundane task of checking your internet speed into a high-stakes racing game! Your internet bandwidth directly fuels your virtual car. The faster your connection, the faster you race. Challenge your friends, climb the leaderboards, and prove that your internet is the fastest of them all!

## Technical Details
### Technologies/Components Used
- Languages: Javascript, Python
- Frameworks: NextJS, FastAPI
- Libraries: WebSocket, AsyncIO, Axios
- Tools used: MongoDB


### Implementation
For Software:


#### Installation

**Prerequisites:**
- Node.js 18+ 
- Python 3.8+
- npm or pnpm

**Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend Setup:**
```bash
cd frontend
npm install
# or
pnpm install
```

#### Run

**Start Backend Server:**
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
# or
pnpm dev
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- WebSocket: ws://localhost:8000/speedtest

### Project Documentation

# Screenshots

![Race Track](https://via.placeholder.com/800x400/1f2937/ffffff?text=Race+Track+View)
*The main racing interface showing player and opponent cars, obstacles, and real-time speed statistics*

![Speed Testing](https://via.placeholder.com/800x400/1f2937/ffffff?text=Speed+Test+Interface)
*WebSocket-based speed testing with live download/upload measurements*


# Diagrams
![Workflow](###Architecture

```
Frontend (Next.js) ←→ WebSocket ←→ Backend (FastAPI)
     ↓                    ↓              ↓
  React UI          Speed Testing    Database
  Components        Real-time Data   SQLite
```)
*Add caption explaining your workflow*

### Project Demo
# Video
[Add demo video link here]
*Demonstrates the complete net speed racing*


## Team Contributions

## Prithvi Bhargav:
- **Backend Development**: FastAPI server with WebSocket integration
- **Speed Testing Logic**: Real-time download/upload speed calculation
- **API Development**: RESTful endpoints for race data
- **WebSocket Implementation**: Real-time communication protocol

##Adithyan AS:
- **Frontend Development**: Next.js application with React components
- **UI/UX Design**: Modern racing interface with Tailwind CSS
- **Race Logic**: Player movement, opponent AI, obstacle system
- **State Management**: React hooks for race state and WebSocket data

### Shared Contributions
- **WebSocket Integration**: Real-time speed data flow between frontend and backend
- **Race Mechanics**: Obstacle collision, speed modifiers, position tracking
- **Error Handling**: Connection failures, fallback systems, graceful degradation
- **Testing**: WebSocket connection testing and race functionality validation

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)


