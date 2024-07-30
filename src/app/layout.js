'use client'; // Ensure this is at the top

import './globals.css'; // Import your global CSS
import NavBar from '../components/NavBar';
import { EntriesProvider } from '../context/EntriesContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MyJournal</title>
        <meta name="description" content="Journal App" />
        <link rel="icon" href="public/favicon_io/favicon1.ico" />
      </head>
      <body>
        <EntriesProvider>
          <NavBar />
          {children}
        </EntriesProvider>
      </body>
    </html>
  );
}
