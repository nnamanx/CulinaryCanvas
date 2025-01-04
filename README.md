# Culinary Canvas

A React-based web application to manage, filter, and view recipes. This project also includes a `JSON-Server` to act as a backend for storing and managing recipe data.

---

## 🚀 Features

- Add, update, delete, and view recipes.
- Drag-and-drop functionality for reordering recipes.
- Filtering and sorting by tags, difficulty, and other attributes.
- Persistent data storage with `JSON-Server`.
- Responsive design for a seamless user experience across devices.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your system:

1. [Node.js](https://nodejs.org/) (LTS version recommended)
2. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nnamanx/CulinaryCanvas.git
cd recipe-app
```
### 2. Install Dependencies
Run the following command in the project directory:

```bash
npm install
```

### 3. Start the JSON-Server
In the project root directory, start the JSON-Server:

```bash
npx json-server --watch ./data/db.json --port 3030
```

The server will run at http://localhost:3030.
Recipe data is stored in data/db.json.
### 4. Start the React App
Run the following command to start the React application:

```bash
npm start
```
The React app will run at http://localhost:3000.

---

Was made for Web & Mobile course,
ADA University

Contributors:
Gozal Alizada,
Turkana Aliyev
