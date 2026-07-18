import { useState } from 'react'
import ExpenseList from './ExpenseList.jsx'
import ExpenseForm from './ExpenseForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SealStamp from './SealStamp.jsx'

export default function ProjectDetail({
  project,
  expenses,
  allProjects,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onToggleReimbursed,
  onExport,
}) {
  const [formState, setFormState] = useState(null) // null | 'new' | expense object
  const [pendingDelete, setPendingDelete] = useState(null)
  const [showStamp, setShowStamp] = useState(false)

  function handleSubmit(payload) {
    if (formState && formState !== 'new') {
      onUpdateExpense(formState.id, payload)
    } else {
      onAddExpense(payload)
      setShowStamp(true)
      window.setTimeout(() => setShowStamp(false), 950)
    }
  }

  return (
    <div>
      <div className="section-heading">
        <h2>{project.note ? project.note : '账目明细'}</h2>
        <button className="btn" onClick={() => onExport(project)}>
          导出 Excel
        </button>
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={(exp) => setFormState(exp)}
        onDelete={(exp) => setPendingDelete(exp)}
        onToggleReimbursed={onToggleReimbursed}
      />

      <button className="fab" onClick={() => setFormState('new')}>
        <span className="fab__plus">＋</span> 记一笔
      </button>

      {formState && (
        <ExpenseForm
          projects={allProjects}
          defaultProjectId={project.id}
          initial={formState === 'new' ? null : formState}
          onSubmit={handleSubmit}
          onClose={() => setFormState(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="删除这笔记录"
          message={`确定要删除「${pendingDelete.purpose}」这笔 ¥${Number(pendingDelete.amount).toFixed(2)} 的记录吗？删除后无法恢复。`}
          confirmLabel="删除"
          onConfirm={() => onDeleteExpense(pendingDelete.id)}
          onClose={() => setPendingDelete(null)}
        />
      )}

      {showStamp && <SealStamp char="入账" toast />}
    </div>
  )
}
