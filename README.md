# Flutter To-Do List App with Supabase



A mobile To-Do app built with Flutter and Supabase backend featuring:



\- User authentication (Sign up / Sign in)

\- Add, edit, delete tasks

\- Drag \& drop task reordering

\- Dark mode toggle

\- Search and sort tasks

\- Export tasks to PDF and CSV

\- Real-time sync with Supabase



---



\## Screenshot



!\[App Screenshot](./assets/screenshot.png)  

\*Example screenshot of the app in action\*



---



\## Prerequisites



\- Flutter SDK (version 3.0.0 or higher)  

&nbsp; Install from: \[https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)

\- Android Studio or Xcode (for running on Android/iOS devices or emulators)

\- Supabase account and project with configured `tasks` table



---



\## Installation \& Setup



1\. \*\*Clone the repository

&nbsp;  ```bash

&nbsp;  git clone https://github.com/yourusername/flutter\_todo\_supabase.git

&nbsp;  cd flutter\_todo\_supabase

&nbsp;  

2\. \*\*Install dependencies\*\*



&nbsp;  ```bash

&nbsp;  flutter pub get

&nbsp;  ```



3\. \*\*Configure Supabase\*\*



&nbsp;  \* Create a new project on \[Supabase](https://supabase.com/)

&nbsp;  \* Set up a `tasks` table with the following columns:



&nbsp;    \* `id` (primary key)

&nbsp;    \* `title` (text)

&nbsp;    \* `description` (text, nullable)

&nbsp;    \* `date` (timestamp, nullable)

&nbsp;    \* `tags` (text array, nullable)

&nbsp;    \* `priority` (text)

&nbsp;    \* `order` (integer)

&nbsp;    \* `user\_id` (UUID, foreign key)

&nbsp;  \* Copy your Supabase project URL and anon key

&nbsp;  \* Open `lib/main.dart` and replace the placeholder constants:



&nbsp;  ```dart

&nbsp;  const supabaseUrl = 'YOUR\_SUPABASE\_URL';

&nbsp;  const supabaseAnonKey = 'YOUR\_SUPABASE\_ANON\_KEY';

&nbsp;  ```



4\. \*\*Run the app\*\*



&nbsp;  Connect your device or launch an emulator, then run:



&nbsp;  ```bash

&nbsp;  flutter run

&nbsp;  ```



---



\## Features



\* \*\*Authentication:\*\* Sign up, log in, and persist sessions with Supabase.

\* \*\*Task Management:\*\* Add, edit, and reorder tasks via drag-and-drop.



\## Troubleshooting



\* \*\*Icons not showing:\*\*

&nbsp; Ensure your `pubspec.yaml` includes:



&nbsp; ```yaml

&nbsp; flutter:

&nbsp;   uses-material-design: true

&nbsp; ```



\* \*\*Android NDK version conflicts:\*\*

&nbsp; If you see NDK version errors during build, edit your `android/app/build.gradle.kts` file to specify the highest NDK version:



&nbsp; ```kotlin

&nbsp; android {

&nbsp;     ndkVersion = "27.0.12077973"

&nbsp;     ...

&nbsp; }

&nbsp; ```



---



\## License



This project is licensed under the MIT License - see the \[LICENSE](LICENSE) file for details.



---



\## Contact



For questions or feedback, contact: \\\[\[zakiomer@zamufey.com](mailto:your.zakiomer@zamufey.com)]



