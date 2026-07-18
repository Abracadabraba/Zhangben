import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import ProjectList from './components/ProjectList.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'
import ProjectFormModal from './components/ProjectFormModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import {
  getProjectSummaries,
  getExpensesByProject,
  createProject,
  updateProject,
  deleteProject,
  addExpense,
  updateExpense,
  deleteExpense,
  toggleExpenseReimbursed,
} from './utils/storage.js'
import { exportProjectToExcel } from './utils/export.js'

export default function App() {
  const [projects, setProjects] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [expenses, setExpenses] = useState([])

  const [showProjectForm, setShowProjectForm] = useState(false) // false | true (new) | project (edit)
  const [pendingDeleteProject, setPendingDeleteProject] = useState(null)

  function refreshProjects() {
    setProjects(getProjectSummaries())
  }

  function refreshExpenses(projectId) {
    if (projectId) setExpenses(getExpensesByProject(projectId))
  }

  useEffect(() => {
    refreshProjects()
  }, [])

  useEffect(() => {
    if (selectedId) refreshExpenses(selectedId)
  }, [selectedId])

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedId) || null,
    [projects, selectedId]
  )

  // ---------- project actions ----------

  function handleOpenProject(project) {
    setSelectedId(project.id)
  }

  function handleBack() {
    setSelectedId(null)
    refreshProjects()
  }

  function handleCreateProject() {
    setShowProjectForm(true)
  }

  function handleEditProject(project) {
    setShowProjectForm(project)
  }

  function handleSubmitProject({ name, note }) {
    if (showProjectForm && showProjectForm !== true) {
      updateProject(showProjectForm.id, { name, note })
    } else {
      const created = createProject({ name, note })
      setSelectedId(created.id)
    }
    refreshProjects()
  }

  function handleDeleteProject(project) {
    setPendingDeleteProject(project)
  }

  function confirmDeleteProject() {
    deleteProject(pendingDeleteProject.id)
    if (selectedId === pendingDeleteProject.id) setSelectedId(null)
    refreshProjects()
  }

  // ---------- expense actions ----------

  function handleAddExpense(payload) {
    addExpense(payload)
    refreshExpenses(selectedId)
    refreshProjects()
  }

  function handleUpdateExpense(expenseId, payload) {
    updateExpense(expenseId, payload)
    refreshExpenses(payload.projectId || selectedId)
    refreshProjects()
  }

  function handleDeleteExpense(expenseId) {
    deleteExpense(expenseId)
    refreshExpenses(selectedId)
    refreshProjects()
  }

  function handleToggleReimbursed(expense) {
    toggleExpenseReimbursed(expense.id)
    refreshExpenses(expense.projectId || selectedId)
  }

  function handleExport(project) {
    exportProjectToExcel(project).catch((err) => {
      console.error('导出失败', err)
      const msg = String(err?.message || err || '')
      if (!/cancel/i.test(msg)) {
        window.alert('导出失败，请稍后重试。')
      }
    })
  }

  return (
    <div className="app">
      <Header
        view={selectedProject ? 'detail' : 'list'}
        project={selectedProject}
        projectTotal={selectedProject?.total || 0}
        onBack={handleBack}
      />

      <main className="app-main">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            expenses={expenses}
            allProjects={projects}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            onToggleReimbursed={handleToggleReimbursed}
            onExport={handleExport}
          />
        ) : (
          <ProjectList
            projects={projects}
            onOpen={handleOpenProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onCreate={handleCreateProject}
          />
        )}
      </main>

      <footer className="app-footer">来钱 · 数据保存在本机浏览器中，请定期导出 Excel 备份</footer>

      {showProjectForm && (
        <ProjectFormModal
          initial={showProjectForm === true ? null : showProjectForm}
          onSubmit={handleSubmitProject}
          onClose={() => setShowProjectForm(false)}
        />
      )}

      {pendingDeleteProject && (
        <ConfirmDialog
          title="删除项目"
          message={`确定要删除项目「${pendingDeleteProject.name}」吗？该项目下的 ${pendingDeleteProject.count} 笔记录会一并删除，且无法恢复。`}
          confirmLabel="删除项目"
          onConfirm={confirmDeleteProject}
          onClose={() => setPendingDeleteProject(null)}
        />
      )}
    </div>
  )
}
