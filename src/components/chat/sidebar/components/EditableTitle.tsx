
import React from "react"

interface EditableTitleProps {
  isEditing: boolean
  editTitle: string
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveEdit: (e: React.MouseEvent) => void
  handleCancelEdit: (e: React.MouseEvent) => void
  title: string
  isActive?: boolean
}

export function EditableTitle({
  isEditing,
  editTitle,
  handleTitleChange,
  handleSaveEdit,
  handleCancelEdit,
  title,
  isActive
}: EditableTitleProps) {
  if (isEditing) {
    return (
      <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
        <input 
          type="text" 
          value={editTitle} 
          onChange={handleTitleChange}
          onClick={(e) => e.stopPropagation()}
          className="text-sm px-2 py-1 w-full rounded border border-pump-gray/20 mr-1 bg-offwhite dark:bg-[#222222] dark:text-white dark:border-gray-700"
          autoFocus
        />
        <div className="flex space-x-1">
          <button 
            onClick={handleSaveEdit} 
            className="text-xs text-pump-purple hover:text-pump-purple/80 p-1"
          >
            ✓
          </button>
          <button 
            onClick={handleCancelEdit} 
            className="text-xs text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-between">
      <p className={`text-sm font-medium truncate max-w-[120px] sm:max-w-[160px] ${
        isActive 
          ? "text-pump-gray-dark dark:text-white" 
          : "text-pump-gray dark:text-gray-300"
      }`}>{title}</p>
    </div>
  )
}
