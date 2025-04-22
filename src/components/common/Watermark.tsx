
import React from 'react'

export const Watermark = () => {
  return (
    <div className="fixed bottom-4 left-4 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
      <img 
        src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
        alt="Watermark"
        className="w-[300px] max-w-full"
      />
    </div>
  )
}
