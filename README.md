# Knots

Welcome to Knots, a web application designed to introduce users to various types of knots and provide step-by-step instructions on how to tie them. This application is a work in progress and aims to be a comprehensive resource for knot enthusiasts and learners.

## Features

- **Browse Knots**: Explore a collection of different knots, categorized by their primary use (e.g., Binding, Loop, Hitch).
- **Detailed Knot Information**: Click on any knot to view its description, difficulty, common uses, strength rating, and step-by-step tying instructions with accompanying images.
- **Filtering and Search**: Easily find specific knots using category, difficulty, and search filters.
- **AI Knot Assistant (New!)**: A new interactive chat feature that allows users to ask natural language questions about knot-tying situations and receive AI-powered suggestions for the most suitable knots. This feature includes direct links to the suggested knots.
- **Hash-based Routing**: Direct links to specific knots (e.g., `/#bowline`) will open the corresponding knot modal, and the URL updates when a knot modal is opened or closed.

## Setup

To get Knots up and running on your local machine, follow these steps:

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd knots
    ```

2.  **Install dependencies**:
    The project is now split into a `frontend` and `backend`. You'll need to install dependencies for both.

    From the project root:
    ```bash
    cd frontend && npm install
    cd ../backend && npm install
    ```

3.  **Start the development servers**:
    From the project root:

    -   Start the frontend (in one terminal):
        ```bash
        cd frontend && npm run dev
        ```
    -   Start the backend (in another terminal):
        ```bash
        cd backend && node index.js
        ```

    The frontend will be available at `http://localhost:5173/`.

## Usage

- **Browsing**: Use the category, difficulty, and search filters to navigate through the knot collection.
- **Viewing Details**: Click on any knot tile to open a modal with detailed information and tying instructions.
- **AI Knot Assistant**: Located at the top of the page, type your question into the input field and press Enter or click "Send". For example, try asking: 
    - "What knot should I use to tie my paddle board to a buoy?"
    - "How do I secure a stick to a post?"
    - "I need to join two ropes of different sizes."
    The AI will provide a brief explanation and suggest relevant knots. Clicking on the suggested knot names will open their respective detail modals.

## AI Integration Notes

The AI Knot Assistant uses a backend service to communicate with the Google Gemini API. The frontend `AIService` class in `frontend/src/services/aiService.ts` sends requests to a Node.js/Express backend, which then securely queries the Gemini API.

**Backend:**

-   The backend is located in the `/backend` directory.
-   It uses the `geminiAIService.js` to build a prompt and query the Gemini API.
-   It requires a `GEMINI_API_KEY` environment variable to be set. You can create a `.env` file in the `/backend` directory to store this key.

**Frontend:**

-   The `AIService` class in `frontend/src/services/aiService.ts` makes `fetch` requests to the backend.
-   The backend URL is configurable via the `VITE_BACKEND_URL` environment variable in a `.env` file in the `frontend` directory.

**Running the Application:**

See the "Setup" section for instructions on how to run both the frontend and backend services.

## Technologies Used

-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **CSS**: For styling the application.
-   **Vite**: A fast build tool for modern web projects.
