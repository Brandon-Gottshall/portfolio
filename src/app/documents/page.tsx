import { redirect } from 'next/navigation'

// Documents now live inline on the About page; keep old links working.
export default function DocumentsPage() {
  redirect('/about#documents')
}
