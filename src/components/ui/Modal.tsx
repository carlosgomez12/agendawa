import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  titulo: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ titulo, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-xl bg-white shadow-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-neutral-900">{titulo}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
