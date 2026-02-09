import { SuperadminShell } from "@/components/dashboard/superadmin-shell";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperadminShell>{children}</SuperadminShell>;
}
