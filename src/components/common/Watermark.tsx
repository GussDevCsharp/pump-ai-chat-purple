
import React from 'react'

export const Watermark = () => {
  return (
    <div className="fixed bottom-4 left-4 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
      <img 
        src="/uploads/chatpump-logo-transparent.png"
        alt="Watermark"
        className="w-[500px] max-w-full"
      />
    </div>
  )
}
