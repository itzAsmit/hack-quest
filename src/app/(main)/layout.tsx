import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#131315] flex flex-col">
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
