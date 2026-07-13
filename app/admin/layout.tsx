import { isAuthed } from "@/lib/auth"
import LoginForm from "@/components/LoginForm"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isAuthed())) {
    return <LoginForm />
  }
  return <>{children}</>
}
