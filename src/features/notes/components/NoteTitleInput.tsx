import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NoteTitleInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const NoteTitleInput = ({
  value,
  onChange,
  className,
}: NoteTitleInputProps) => (
  <Input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder="Note title"
    aria-label="Note title"
    className={cn('border-none text-2xl font-semibold shadow-none focus-visible:ring-0', className)}
  />
)
