import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { cn } from '@/lib/utils'

interface NoteEditorProps {
  noteId: string
  initialBody: string
  onSave: (body: string) => void
  className?: string
}

const SAVE_DEBOUNCE_MS = 500

export const NoteEditor = ({
  noteId,
  initialBody,
  onSave,
  className,
}: NoteEditorProps) => {
  const saveTimeoutRef = useRef<number | null>(null)
  const onSaveRef = useRef(onSave)

  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: initialBody,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] w-full px-1 py-2 text-sm leading-7 focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        onSaveRef.current(currentEditor.getMarkdown())
      }, SAVE_DEBOUNCE_MS)
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.commands.setContent(initialBody, { contentType: 'markdown' })
  }, [editor, initialBody, noteId])

  useEffect(
    () => () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current)
      }
    },
    [],
  )

  if (!editor) {
    return <p className="text-sm text-muted-foreground">Loading editor...</p>
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  )
}
