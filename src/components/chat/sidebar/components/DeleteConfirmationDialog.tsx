
import React from "react"

interface DeleteConfirmationDialogProps {
  onConfirm: (e: React.MouseEvent) => void
  onCancel: (e: React.MouseEvent) => void
}

export function DeleteConfirmationDialog({ onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] bg-offwhite dark:bg-[#222222] p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
      style={{ width: '240px' }}
    >
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar exclusão?</p>
        <div className="flex items-center space-x-3 w-full justify-center">
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
          >
            Sim
          </button>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  )
}
