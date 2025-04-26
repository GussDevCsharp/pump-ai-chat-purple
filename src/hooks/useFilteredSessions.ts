
import { useState, useEffect } from 'react'
import { ChatSession } from '@/hooks/useChatSessions'
import { ChatTheme } from '@/hooks/useChatThemes'

export const useFilteredSessions = (sessions: ChatSession[], themes?: ChatTheme[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSessions, setFilteredSessions] = useState(sessions)

  useEffect(() => {
    if (sessions) {
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        const filtered = sessions.filter(session =>
          session.title.toLowerCase().includes(lowerSearchTerm)
        )
        setFilteredSessions(filtered)
      } else {
        setFilteredSessions(sessions)
      }
    }
  }, [sessions, searchTerm])

  const groupedSessions = filteredSessions
    ? filteredSessions.reduce((acc: { [key: string]: ChatSession[] }, session: ChatSession) => {
      if (session.theme_id) {
        const theme = themes?.find(t => t.id === session.theme_id)
        const themeKey = theme ? `theme-${theme.id}` : 'no-theme'
        if (!acc[themeKey]) {
          acc[themeKey] = []
        }
        acc[themeKey].push(session)
      } else {
        const createdAt = new Date(session.created_at)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)

        let dateKey: string
        if (createdAt.toDateString() === today.toDateString()) {
          dateKey = 'today'
        } else if (createdAt.toDateString() === yesterday.toDateString()) {
          dateKey = 'yesterday'
        } else {
          dateKey = createdAt.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }
        
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(session)
      }
      return acc
    }, {})
    : {}

  return {
    searchTerm,
    setSearchTerm,
    groupedSessions
  }
}
