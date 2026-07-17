import { useEffect, useRef, useState } from 'react'

function formatMoney(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShortDate(iso) {
  if (!iso) return '暂无记录'
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `最近 ${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function ProjectCard({ project, onOpen, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  return (
    <div className="project-card" onClick={() => onOpen(project)}>
      <div ref={wrapRef} style={{ position: 'absolute', top: 8, right: 6 }}>
        <button
          className="project-card__menu"
          aria-label="项目操作"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
        >
          ⋯
        </button>
        {menuOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'var(--paper-light)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              boxShadow: 'var(--shadow)',
              overflow: 'hidden',
              minWidth: 96,
              zIndex: 5,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn--ghost"
              style={{ display: 'block', width: '100%', borderRadius: 0, textAlign: 'left' }}
              onClick={() => {
                setMenuOpen(false)
                onEdit(project)
              }}
            >
              编辑项目
            </button>
            <button
              className="btn btn--ghost btn--danger"
              style={{ display: 'block', width: '100%', borderRadius: 0, textAlign: 'left' }}
              onClick={() => {
                setMenuOpen(false)
                onDelete(project)
              }}
            >
              删除项目
            </button>
          </div>
        )}
      </div>
      <h3 className="project-card__name">{project.name}</h3>
      <div className="project-card__total">¥{formatMoney(project.total)}</div>
      <div className="project-card__meta">
        <span>共 {project.count} 笔</span>
        <span>{formatShortDate(project.lastEntryAt)}</span>
      </div>
    </div>
  )
}
