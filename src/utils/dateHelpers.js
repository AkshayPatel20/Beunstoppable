import { format, parseISO, isToday } from 'date-fns'

export const formatDate = (iso) => {
  if(!iso) return '-'
  try{ return format(parseISO(iso), 'MMM d, yyyy') } catch(e){ return iso }
}

export const isCompletedToday = (iso) => {
  if(!iso) return false
  return isToday(parseISO(iso))
}
