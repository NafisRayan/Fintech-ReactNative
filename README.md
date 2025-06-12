# Fintech App

This is a starter template for a Fintech application built with Expo and React Native. It provides a solid foundation for building a mobile banking or finance-related app, complete with authentication, navigation, and a variety of pre-built UI components.

## Features

* **Authentication Flow:** Includes screens for registration, login, and biometric authentication.
* **Tabbed Navigation:** A pre-configured bottom tab navigator for the main sections of the app.
* **Modal Screens:** Examples of how to implement modal screens for actions like sending money, adding a card, and viewing transaction details.
* **UI Components:** A set of reusable UI components, including buttons, cards, and inputs.
* **Context API:** Usage of React's Context API for managing global state like authentication, theme, and financial data.
* **TypeScript Support:** The project is written in TypeScript for better code quality and maintainability.

## Tech Stack

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
* **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/)
* **UI:**
    * [React Navigation](https://reactnavigation.org/) for navigation.
    * [Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) for blur effects.
    * [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) for gradients.
    * [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) for icons.
* **Fonts:** [Google Fonts](https://fonts.google.com/) (Inter)
* **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* Expo Go app on your mobile device or an Android/iOS simulator.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd fintech-app-master
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Scan the QR code** with the Expo Go app on your phone, or press `a` for Android emulator or `i` for iOS simulator.

## Available Scripts

*   `npm run dev`: Starts the Expo development server.
*   `npm run build:web`: Creates a production build for the web.
*   `npm run lint`: Lints the project files using `expo lint`.

## Project Structure

```
.
├── app/                      # Main application source code
│   ├── (tabs)/               # Tab-based navigation layout and screens
│   ├── auth/                 # Authentication-related screens
│   ├── modals/               # Modal screens
│   ├── _layout.tsx           # Root layout for the app
│   └── +not-found.tsx        # Not found screen
├── assets/                   # Static assets like images and fonts
├── components/               # Reusable UI components
│   ├── auth/                 # Authentication-specific components
│   ├── modals/               # Modal-specific components
│   └── ui/                   # Generic UI components
├── contexts/                 # React Context providers for global state
├── hooks/                    # Custom React hooks
├── styles/                   # Global styles (if any)
├── utils/                    # Utility functions
├── .gitignore
├── app.json                  # Expo configuration file
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration