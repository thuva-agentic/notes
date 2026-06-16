import { HashRouter, Route, Routes } from 'react-router-dom'
import { NotesWorkspace } from '@/features/notes/components/NotesWorkspace'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NotesWorkspace />} />
        <Route path="/folder/*" element={<NotesWorkspace />} />
        <Route path="/note/:noteId" element={<NotesWorkspace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
