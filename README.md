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
    The project uses `npm` for package management. Navigate to the project root directory and install the required packages:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    Once the dependencies are installed, you can start the development server:
    ```bash
    npm run dev
    ```
    This will typically open the application in your default web browser at `http://localhost:5173/` (or a similar address).

## Usage

- **Browsing**: Use the category, difficulty, and search filters to navigate through the knot collection.
- **Viewing Details**: Click on any knot tile to open a modal with detailed information and tying instructions.
- **AI Knot Assistant**: Located at the top of the page, type your question into the input field and press Enter or click "Send". For example, try asking: 
    - "What knot should I use to tie my paddle board to a buoy?"
    - "How do I secure a stick to a post?"
    - "I need to join two ropes of different sizes."
    The AI will provide a brief explanation and suggest relevant knots. Clicking on the suggested knot names will open their respective detail modals.

## AI Integration Notes

The AI Knot Assistant currently uses a `MockAIService` (`src/services/aiService.ts`) for demonstration purposes. This mock service provides hardcoded responses based on simple keyword matching.

**To integrate a real AI API (e.g., Google Gemini, OpenAI, Claude):**

1.  **Create a new service class**: In `src/services/aiService.ts`, create a new class that implements the `IAIService` interface. This class will contain the logic to make actual API calls to your chosen AI provider.

2.  **Prompt Engineering**: You will need to design effective prompts for your AI model to ensure it returns relevant knot suggestions and explanations in a structured format (e.g., JSON) that your application can parse.

3.  **Replace the mock service**: In `src/components/AIChat.tsx`, import and instantiate your new AI service instead of `MockAIService`.

**Important Security Note on API Keys:**

For production applications, you **MUST NEVER** expose your AI API keys directly in client-side code. This is a significant security risk. Instead, implement a **backend proxy server** that handles all communication with the AI API. Your client-side application would then send requests to your backend proxy, which securely forwards them to the AI API. This approach protects your API keys and allows for additional server-side logic like rate limiting, logging, and more complex data processing.

## Technologies Used

-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **CSS**: For styling the application.
-   **Vite**: A fast build tool for modern web projects.
