
# LingoFlip 🇪🇸 🇬🇧
> An AI-powered language learning application that generates native pronunciation audio on demand.

## 💡 About The Project
LingoFlip is a flashcard application designed to help users learn pronunciation alongside vocabulary. Unlike standard flashcard apps, LingoFlip uses Generative AI to create audio for any phrase the user types, offering unlimited learning possibilities.

I built this project to demonstrate the integration of **GenAI APIs** with a robust **Backend-as-a-Service** architecture.

**Key Architecture:**
* **Frontend:** React + Tailwind CSS (Rapidly prototyped via Lovable)
* **Backend:** Supabase (PostgreSQL Database & Auth)
* **AI Engine:** ElevenLabs API (Text-to-Speech)
* **Performance:** Implements a caching strategy where generated audio is uploaded to Supabase Storage. This ensures we never pay for the same API call twice and reduces latency for repeated plays.

---

## ⚠️ Configuration (Crucial Step)
To make the AI audio generation work locally, you must provide your own ElevenLabs API Key.

1.  Open the project in your code editor.
2.  Navigate to the **`src/components/`** folder.
3.  You need to update the API key in **two specific files**:
    * **File:** `src/components/FlashCard.tsx`
    * **File:** `src/components/NewCardDialog.tsx`

    Look for the placeholder string (e.g., `ENTER_KEY_HERE` or `const API_KEY = ...`) and replace it with your actual ElevenLabs API key:

    ```typescript
    // Example inside the files:
    const API_KEY = "your_actual_32_char_key_here";
    ```

---

# Welcome to your Lovable project

## Project info

**URL**: https://flip-indigo-speak.lovable.app/

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

```

**Edit a file directly in GitHub**

* Navigate to the desired file(s).
* Click the "Edit" button (pencil icon) at the top right of the file view.
* Make your changes and commit the changes.

**Use GitHub Codespaces**

* Navigate to the main page of your repository.
* Click on the "Code" button (green button) near the top right.
* Select the "Codespaces" tab.
* Click on "New codespace" to launch a new Codespace environment.
* Edit files directly within the Codespace and commit and push your changes once you're done.

##What technologies are used for this project?This project is built with:

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS
* **Supabase** (Auth, Database, Storage)
* **ElevenLabs API** (AI Audio Generation)

##How can I deploy this project?Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

##Can I connect a custom domain to my Lovable project?Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

##👤 Author**Tomer Novogrodtzki**

* [LinkedIn Profile](https://linkedin.com/in/yourprofile)
* [GitHub Profile](https://github.com/yourusername)

##🔒 Security NoteThis project is an MVP (Minimum Viable Product). Currently, the AI generation logic resides on the client-side for demonstration purposes. In a production environment, I would refactor the ElevenLabs API call into a **Supabase Edge Function** to keep the API keys strictly server-side.

```

```
