// Simple unique id generator; avoids adding an extra dependency for uuid.
export function makeId(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 9)
  const time = Date.now().toString(36)
  return `${prefix}_${time}_${rand}`
}
