# Web To-Do List App with Supabase

A responsive and aesthetic web-based To-Do list application built with Next.js 14, Supabase, and shadcn/ui. The app supports:

* 🌗 Dark / Light Mode toggle
* ✅ Task creation, deletion, and drag & drop reordering
* 🔍 Search, filter, and priority-based sorting
* 🧾 Export to PDF / CSV
* 🔄 Real-time updates via Supabase Realtime Channels
* 🔐 Supabase Auth (Sign Up / Sign In)
* 📱 Fully responsive (mobile/tablet/desktop)

---

## Screenshot

![Web Screenshot 1](./assets/screenshot.png)
*Dashboard with dark mode and draggable cards*

![Web Screenshot 2](./assets/screenshot_1.png)
*Task creation modal + light mode UI*

---

## Prerequisites

* Node.js v18 or higher
* Supabase account and project
* Git

---

## Tech Stack

* **Frontend:** Next.js App Router, React, TailwindCSS, shadcn/ui
* **Backend:** Supabase (Auth + Realtime + Database)
* **PDF/CSV Export:** jsPDF, react-csv
* **Drag and Drop:** dnd-kit

---

## Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/next_todo_app.git
   cd next_todo_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create a `.env.local` file and add:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Configuration**

   * Go to [Supabase](https://supabase.com/), create a project.

   * Create a `tasks` table:

     | Column      | Type    | Notes                       |
     | ----------- | ------- | --------------------------- |
     | id          | uuid    | Primary Key, default uuid() |
     | title       | text    |                             |
     | description | text    | Nullable                    |
     | date        | date    | Nullable                    |
     | tags        | text\[] | Nullable                    |
     | priority    | text    | 'High', 'Medium', 'Low'     |
     | order       | int     | Default 0                   |
     | user\_id    | uuid    | Foreign key to auth.users   |

   * Enable Row-Level Security and add the policy:

     ```sql
     alter policy "Enable users to view their own data only"
     on "public"."tasks"
     to authenticated
     using (user_id = auth.uid());
     ```

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

* 💡 Toggle between dark/light mode
* 📦 Organize tasks with tags and priorities
* 📅 Date-based task filtering
* ↕️ Drag & drop to reorder tasks
* 🔒 Authenticated routes (with Supabase)
* 📄 Export tasks to CSV or print-ready PDF

---

## Troubleshooting

* **Dark mode not applying to dropdowns:** Make sure `Select`, `Dialog`, and all shadcn components have `dark:bg-*` classes applied in both `trigger` and `content`.
* **Insert errors (empty object):** Ensure RLS policy allows `insert` and `user_id = auth.uid()`.
* **Realtime not syncing:** Confirm you’re using `.channel("tasks-updates")` and `supabase.channel().on().subscribe()` properly with correct table name.

---

## Deployment

You can deploy this to:

* [Vercel](https://vercel.com/) – auto-detects Next.js
* [Netlify](https://netlify.com/)
* [Render](https://render.com/)

Just make sure to add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.

---

## License

MIT © \[Zaki Omer]

---

## Contact

Got feedback or suggestions?
📧 [zakiomer@zamufey.com](mailto:zakiomer@zamufey.com)
