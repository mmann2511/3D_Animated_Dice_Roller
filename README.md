# 🎲 3D Dice Roller (Three.js + Cannon-es)

A 3D dice roller built with **Three.js** for rendering and **Cannon-es** for physics.
Dice are rolled using real rigid-body physics inside a textured tray with walls,
shadows, and face-value detection once the dice settle.

This project is a continuation of an earlier 2D / logic-based dice roller and was
created primarily as a **learning-by-doing** project.

---

## 🧠 Why I'm Building This

My friends and I play **Dungeons & Dragons**, and I wanted to make something
fun and visual that we could use during our sessions.

This project started as a way to:
- Teach myself **JavaScript** and **Three.js**
- Learn how **physics engines** work in practice
- Build something interactive and reusable rather than a one-off demo

I'm intentionally pushing myself beyond my comfort zone, working with unfamiliar
libraries and debugging real problems like collision tunneling, object sleep
states, texture loading, and physics/render synchronization.


---

## ✨ Features

- 🎲 Real 3D dice with physics-based rolls
- 🧱 Dice tray with walls and floor
- 🪵 Textured tray (felt + wood)
- 🌤 Directional & hemisphere lighting
- 🌑 Shadows enabled for dice and tray
- 🔢 Dice face detection after settling
- ➕ Add multiple D6 dice

---

## 📸 Screenshots

### Dice rolling
![Rolling]<img width="1234" height="1123" alt="Screenshot 2025-12-31 111128" src="https://github.com/user-attachments/assets/0e332c4f-174b-43d0-a4b1-e7a80efea2c3" />


### Final result
![Result]<img width="1236" height="1273" alt="Screenshot 2025-12-31 111207" src="https://github.com/user-attachments/assets/3a847921-031c-42d8-a9e1-0a2068b89da5" />


---

---

## 🛠 Tech Stack

- **JavaScript (ES Modules)**
- **Three.js** – 3D rendering
- **Cannon-es** – Physics simulation
- **Vite** – Local dev server

---

## 📁 Project Structure

```text
/
├── index.html
├── main.js        # Scene setup, UI, game loop
├── tray.js        # Dice tray visuals + physics walls
├── dice.js        # Dice creation, rolling, face detection
├── textures/
│   ├── dice/
│   └── tray/
└── README.md
````

---

## ▶️ Running the Project Locally

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 🚧 Current State & Future Ideas

This project is still evolving. Some ideas I may explore next:

* Support for other dice types (D20, D8, D4, etc.)
* Improved roll realism and energy damping
* Sound effects on impacts
* Camera controls (zoom / rotate)
* Mobile-friendly layout
* Cleaner physics constraints for edge cases

---
