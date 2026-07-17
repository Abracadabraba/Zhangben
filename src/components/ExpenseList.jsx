import SealStamp from './SealStamp.jsx'

function formatMoney(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateTime(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <SealStamp char="记" />
        <h3>这个项目还没有记录</h3>
        <p>点右下角「记一笔」，把第一笔支出写进账本。</p>
      </div>
    )
  }

  return (
    <div className="ledger">
      <div className="ledger__head">
        <span>时间</span>
        <span>用途</span>
        <span>金额</span>
        <span>备注</span>
        <span></span>
      </div>
      {expenses.map((e) => (
        <div className="ledger__row" key={e.id} onClick={() => onEdit(e)}>
          <span className="ledger__col--time">{formatDateTime(e.datetime)}</span>
          <span className="ledger__col--purpose">{e.purpose}</span>
          <span className="ledger__col--amount">¥{formatMoney(e.amount)}</span>
          <span className="ledger__col--note">{e.note || '—'}</span>
          <span
            className="ledger__col--del"
            onClick={(ev) => {
              ev.stopPropagation()
              onDelete(e)
            }}
            aria-label="删除这笔记录"
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  )
}
