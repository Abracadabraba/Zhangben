import { useState } from 'react'

export default function ProjectFormModal({ initial, onSubmit, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [note, setNote] = useState(initial?.note || '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('请输入项目名称')
      return
    }
    onSubmit({ name: name.trim(), note: note.trim() })
    onClose()
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h3>{initial ? '编辑项目' : '新建项目'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <form className="modal__body" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="project-name">项目名称</label>
            <input
              id="project-name"
              autoFocus
              placeholder="例如：装修房子、日本旅行"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
            />
            {error && <span className="field-hint" style={{ color: 'var(--red)' }}>{error}</span>}
          </div>
          <div className="field">
            <label htmlFor="project-note">项目备注（选填）</label>
            <textarea
              id="project-note"
              rows={2}
              placeholder="例如：预算 5 万元，年底前完工"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn--primary">
              {initial ? '保存' : '创建项目'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
