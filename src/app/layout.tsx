// app/layout.tsx
import "./globals.css";
// Pastikan import ini ada!
import AuthProvider from "@/components/AuthProvider"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider HARUS membungkus children */}
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}