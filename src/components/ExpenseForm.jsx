import { useState } from 'react'

function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function ExpenseForm({ projects, defaultProjectId, initial, onSubmit, onClose }) {
  const [projectId, setProjectId] = useState(initial?.projectId || defaultProjectId || projects[0]?.id || '')
  const [datetime, setDatetime] = useState(
    initial ? toDatetimeLocalValue(new Date(initial.datetime)) : toDatetimeLocalValue(new Date())
  )
  const [purpose, setPurpose] = useState(initial?.purpose || '')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [note, setNote] = useState(initial?.note || '')
  const [reimbursed, setReimbursed] = useState(initial?.reimbursed || false)
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!projectId) nextErrors.projectId = '请选择项目'
    if (!purpose.trim()) nextErrors.purpose = '请填写用途'
    if (amount === '' || Number.isNaN(Number(amount)) || Number(amount) < 0) nextErrors.amount = '请填写有效金额'
    if (!datetime) nextErrors.datetime = '请选择日期时间'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      projectId,
      datetime: new Date(datetime).toISOString(),
      purpose: purpose.trim(),
      amount: Number(amount),
      note: note.trim(),
      reimbursed,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h3>{initial ? '编辑记录' : '记一笔'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <form className="modal__body" onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="exp-datetime">日期时间</label>
              <input
                id="exp-datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
              />
              {errors.datetime && <span className="field-hint" style={{ color: 'var(--red)' }}>{errors.datetime}</span>}
            </div>
            <div className="field">
              <label htmlFor="exp-project">所属项目</label>
              <select id="exp-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <span className="field-hint" style={{ color: 'var(--red)' }}>{errors.projectId}</span>}
            </div>
          </div>

          <span className="field-hint">默认是现在的日期时间和当前项目，需要补录以前的账目时可以手动改。</span>

          <div className="field">
            <label htmlFor="exp-purpose">用途</label>
            <input
              id="exp-purpose"
              autoFocus={!initial}
              placeholder="例如：买瓷砖、订机票"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            {errors.purpose && <span className="field-hint" style={{ color: 'var(--red)' }}>{errors.purpose}</span>}
          </div>

          <div className="field field-amount-prefix">
            <label htmlFor="exp-amount">金额</label>
            <span>¥</span>
            <input
              id="exp-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <span className="field-hint" style={{ color: 'var(--red)' }}>{errors.amount}</span>}
          </div>

          <button
            type="button"
            className={`reimburse-check${reimbursed ? ' reimburse-check--done' : ''}`}
            onClick={() => setReimbursed((v) => !v)}
            aria-pressed={reimbursed}
          >
            <span className="reimburse-check__box">{reimbursed ? '✓' : ''}</span>
            这笔已经报销
          </button>

          <div className="field">
            <label htmlFor="exp-note">备注（选填）</label>
            <textarea
              id="exp-note"
              rows={2}
              placeholder="补充说明"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn--primary">
              {initial ? '保存修改' : '盖章入账'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
