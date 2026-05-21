import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Portal",
  description: "Student enrollment and academic portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
