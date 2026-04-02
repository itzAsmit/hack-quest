import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
