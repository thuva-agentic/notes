import { HiOutlineDocumentText } from 'react-icons/hi2'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="flex items-center gap-2">
        <HiOutlineDocumentText className="size-8 text-primary" aria-hidden />
        <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
      </div>
      <Separator className="w-48" />
      <Button type="button">Create your first note</Button>
    </main>
  )
}

export default App
