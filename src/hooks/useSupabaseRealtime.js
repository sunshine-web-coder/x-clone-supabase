import { supabase } from '@/lib/supabaseConfig'
import { useEffect } from 'react'

export function useRealtime({ table, schema = 'public', onInsert, onUpdate, onDelete }) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${schema}:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema,
          table,
        },
        (payload) => {
          const { eventType, new: newData, old: oldData } = payload
          if (eventType === 'INSERT' && onInsert) onInsert(newData)
          if (eventType === 'UPDATE' && onUpdate) onUpdate(newData)
          if (eventType === 'DELETE' && onDelete) onDelete(oldData)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, schema, onInsert, onUpdate, onDelete])
}
