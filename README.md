# react-timer

A simple, modern timer app built with **React** and **Vite**. Designed for focus and clarity.

---

## Features

- ⚡ Instant load with [Vite](https://vitejs.dev/)
- 💡 Minimalist design, dark-themed interface
- 📱 Responsive layout for desktop and mobile
- 🧠 Built with composability and future enhancements in mind!

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/mcckyle/react-timer.git
cd react-timer
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Motion](https://motion.dev/)

---

## 📁 Project Structure

```
react-timer/
├── .github/              # GitHub workflows (CI/CD).
├── public/               # Static assets (served as-is).
├── src/                  # Application Source code.
│   ├── components/       # Reusable React components.
│   │   ├── Timer/
│   │   │   ├── Timer.jsx
│   │   │   └── Timer.css
│   │   │
│   │   ├── TimerHeader/
│   │   │   ├── TimerHeader.jsx
│   │   │   └── TimerHeader.css
│   │   │
│   │   ├── TimerDisplay/
│   │   │   ├── TimerDisplay.jsx
│   │   │   └── TimerDisplay.css
│   │   │
│   │   ├── VisualTimer/
│   │   │   ├── VisualTimer.jsx
│   │   │   └── VisualTimer.css
│   │   │
│   │   ├── TimeField/
│   │   │   ├── TimeField.jsx
│   │   │   └── TimeField.css
│   │   │
│   │   ├── TimerSeparator/
│   │   │   ├── TimerSeparator.jsx
│   │   │   └── TimerSeparator.css
│   │   │
│   │   ├── TimerControls/
│   │   │   ├── TimerControls.jsx
│   │   │   └── TimerControls.css
│   │   │
│   │   ├── PastTimers/
│   │   │   ├── PastTimers.jsx
│   │   │   └── PastTimers.css
│   │   │
│   │   └── DurationPicker/
│   │       ├── DurationPicker.jsx
│   │       └── DurationPicker.css
│   │
│   ├── utils/
│   │   ├── formatTime.jsx
│   │   ├── formatDuration.jsx
│   │   └── splitDuration.jsx
│   │
│   ├── __tests__/
│   │   └── useTimer.test.jsx
│   │
│   ├── hooks/            # Custom React hooks.
│   │   ├── useTimer.js
│   │   ├── useKeyboardShortcuts.js
│   │   └── useCompletionSound.js
│   │
│   ├── App.jsx           # Main React application component.
│   ├── main.jsx          # React DOM entry point.
│   ├── App.css           # Styles specific to App.jsx.
│   └── index.css         # Global styles.
│
├── .gitignore            # Specifies intentionally untracked files and folders to ignore.
├── LICENSE               # Open source license for the project.
├── README.md             # Project overview, instructions, and documentation.
├── eslint.config.js      # ESLint configuration.
├── index.html            # HTML entry point.
├── babel.config.cjs      # Babel config for Jest.
├── jest.config.js        # Jest testing configuration.
├── vite.config.js        # Vite config for build and development.
├── package.json          # Project metadata, dependencies, and scripts.
└── package-lock.json     # Exact versions of installed dependencies.
```

---

## 🎯 Roadmap

- [ ] Keyboard shortcuts for core controls.
- [ ] Add light/dark mode toggle with animation.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
Feel free to extend it for your own projects, or contribute improvements back to the community.

---

## 🙌 Acknowledgments

This project was made possible thanks to the open-source community and the following technologies:

- [React](https://react.dev) - A modern library designed specifically for building fast, interactive UIs.
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling with lightning-fast dev server and build optimizations.
- [Motion](https://motion.dev/) - A production-grade animation library for the web.
- [FreeSound](https://freesound.org/) - Thanks to user @juskiddink for the bell audio.

bell3.wav by juskiddink -- https://freesound.org/s/59536/ -- License: Attribution 4.0 -- https://creativecommons.org/licenses/by/4.0/

Only changed the filename on download: bell3.wav -> bell.mp3

Special thanks to the broader open-source ecosystem for the tools that empower developers to create and share freely.
