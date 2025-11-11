# TechZu Task: Real-time Commenting App

Welcome to the Real-time Commenting App! This project is a simple and fun way to see how live comments work on a website. You can register, log in, and share your thoughts with others in a live discussion.

## How It Works

Have you ever been on a website where you can see new comments pop up without having to refresh the page? That's what this application does! It uses a technology called **WebSockets** (specifically with Socket.io) to create a live connection between your browser and the server.

When you post a comment, it's sent to the server, which then instantly broadcasts it to everyone else who is on the page. This makes for a dynamic and engaging conversation.

## Key Features

*   **User Authentication:** Secure sign-up and login system.
*   **Real-time Comments:** See new comments appear on the screen instantly.
*   **Add and View Comments:** Easily add your own comments and see a list of all the comments from others.
*   **Simple and Clean Interface:** A user-friendly design that is easy to navigate.
*   **Dark Mode:** A toggle to switch between light and dark themes.

## Getting Started

To get this project running on your own computer, you'll need to have a few things installed first.

### Prerequisites

*   **Node.js:** This is a JavaScript runtime that allows you to run the project. You can download it from [nodejs.org](https://nodejs.org/).
*   **A code editor:** We recommend using [Visual Studio Code](https://code.visualstudio.com/), which is a popular and free code editor.

### How to Install and Run

1.  **Download the Code:**
    You can download the project files as a ZIP or use a tool called Git to clone the repository.

2.  **Open the Project:**
    Open the `client` folder in your code editor.

3.  **Install the Dependencies:**
    Open a terminal in your code editor and run the following command. This will download all the necessary packages that the project needs to run.

    ```bash
    npm install
    ```

4.  **Set Up Environment Variables:**
    In the project, you'll see a file called `.env.example`. Make a copy of this file and rename it to `.env`. This file will hold the URL for the backend server.

    ```
    VITE_API_URL=http://localhost:5000
    ```

    Make sure the backend server is running at this address.

5.  **Run the Application:**
    Once the installation is complete, you can start the application with this command:

    ```bash
    npm run dev
    ```

    This will open the application in your web browser, and you can start using it!

## Deploying to Netlify

This project is all set up to be deployed on **Netlify**, a popular platform for hosting web applications. The `netlify.toml` file in the project tells Netlify how to build and deploy the site, ensuring that all the routing works correctly for a single-page application.

To deploy, you can connect your GitHub repository to Netlify and follow their instructions. It's a straightforward process that will have your site live in just a few minutes.