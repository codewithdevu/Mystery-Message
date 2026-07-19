import AuthProvider from "@/context/AuthProvider"; // Adjust this import path to match your project

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {/* 
        NO <html> OR <body> TAGS HERE! 
        They are already provided by your main root layout.
      */}
      {children}
    </AuthProvider>
  );
}