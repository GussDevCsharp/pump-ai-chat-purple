
export const ChatMessages = () => {
  return (
    <div className="flex-1 overflow-y-auto py-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="flex gap-4 px-4">
          <div className="w-8 h-8 rounded-full bg-pump-purple flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-white">P</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">Olá! Como posso ajudar você hoje?</p>
          </div>
        </div>
        
        <div className="flex gap-4 px-4 bg-pump-gray-light/50 py-4">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">Oi! Por favor, me ajude com uma análise de dados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
