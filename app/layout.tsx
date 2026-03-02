import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crazly — Build faster. Ship smarter.",
  description:
    "Crazly gives you the exact AI tools, prompts, and workflows used by the top 1% of professionals in your field.",
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "any" },
      { url: "/favicon-16x16.png",  sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32", type: "image/png" },
    ],
    apple:   "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* ── Explicit favicon tags as fallback for all browsers ── */}
          <link rel="icon"       href="/favicon.ico"       sizes="any" />
          <link rel="icon"       href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="icon"       href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* ── Fonts ── */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
            rel="stylesheet"
          />
        </head>
        <body style={{ margin: 0, padding: 0, background: "#060608" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}