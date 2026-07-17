import { makeId } from './id'

const PROJECTS_KEY = 'laiqian:projects'
const EXPENSES_KEY = 'laiqian:expenses'
const LAST_PROJECT_KEY = 'laiqian:lastProjectId'

// ---------- low level ----------

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`读取本地数据失败 (${key})`, err)
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`保存本地数据失败 (${key})`, err)
    return false
  }
}

// ---------- projects ----------

export function getProjects() {
  return readJSON(PROJECTS_KEY, [])
}

export function saveProjects(projects) {
  return writeJSON(PROJECTS_KEY, projects)
}

export function createProject({ name, note = '' }) {
  const projects = getProjects()
  const project = {
    id: makeId('proj'),
    name: name.trim(),
    note: note.trim(),
    createdAt: new Date().toISOString(),
    archived: false,
  }
  saveProjects([project, ...projects])
  return project
}

export function updateProject(projectId, patch) {
  const projects = getProjects().map((p) =>
    p.id === projectId ? { ...p, ...patch } : p
  )
  saveProjects(projects)
}

export function deleteProject(projectId) {
  saveProjects(getProjects().filter((p) => p.id !== projectId))
  saveExpenses(getExpenses().filter((e) => e.projectId !== projectId))
}

export function setArchived(projectId, archived) {
  updateProject(projectId, { archived })
}

// ---------- expenses ----------

export function getExpenses() {
  return readJSON(EXPENSES_KEY, [])
}

export function saveExpenses(expenses) {
  return writeJSON(EXPENSES_KEY, expenses)
}

export function getExpensesByProject(projectId) {
  return getExpenses()
    .filter((e) => e.projectId === projectId)
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
}

export function addExpense({ projectId, datetime, purpose, amount, note }) {
  const expenses = getExpenses()
  const expense = {
    id: makeId('exp'),
    projectId,
    datetime,
    purpose: purpose.trim(),
    amount: Number(amount),
    note: (note || '').trim(),
    createdAt: new Date().toISOString(),
  }
  saveExpenses([expense, ...expenses])
  setLastProjectId(projectId)
  return expense
}

export function updateExpense(expenseId, patch) {
  const expenses = getExpenses().map((e) =>
    e.id === expenseId ? { ...e, ...patch, amount: patch.amount !== undefined ? Number(patch.amount) : e.amount } : e
  )
  saveExpenses(expenses)
}

export function deleteExpense(expenseId) {
  saveExpenses(getExpenses().filter((e) => e.id !== expenseId))
}

// ---------- derived ----------

export function getProjectTotal(projectId) {
  return getExpensesByProject(projectId).reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

export function getProjectSummaries() {
  const projects = getProjects()
  const expenses = getExpenses()
  return projects.map((p) => {
    const own = expenses.filter((e) => e.projectId === p.id)
    const total = own.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    const last = own.reduce((latest, e) => {
      const t = new Date(e.datetime).getTime()
      return t > latest ? t : latest
    }, 0)
    return { ...p, total, count: own.length, lastEntryAt: last ? new Date(last).toISOString() : null }
  })
}

// ---------- misc ----------

export function getLastProjectId() {
  return localStorage.getItem(LAST_PROJECT_KEY) || null
}

export function setLastProjectId(projectId) {
  if (projectId) localStorage.setItem(LAST_PROJECT_KEY, projectId)
}
