import { AdminAuthProvider } from "@/contexts/admin-auth-context";
import WithLayout from "@nextadmin/app/(with-layouts)/layout";

export default function AdminTemplateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthProvider>
      <div className="h-dvh overflow-hidden">
        <WithLayout>{children}</WithLayout>
      </div>
    </AdminAuthProvider>
  );
}
