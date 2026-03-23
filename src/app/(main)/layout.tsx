import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-hq-bg-primary flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-18">
        {children}
      </main>
      <Footer />
    </div>
  );
}
