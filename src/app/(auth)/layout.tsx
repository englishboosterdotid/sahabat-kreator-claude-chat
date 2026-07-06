import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Floating atmosphere elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
            <Image
              src="/logo.png"
              alt="Sahabat Kreator"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-card-foreground">
              Sahabat Kreator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola konten kamu dengan mudah
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
