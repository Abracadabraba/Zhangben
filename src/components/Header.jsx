import SealStamp from './SealStamp.jsx'

function formatMoney(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Header({ view, project, projectTotal, onBack }) {
  const isDetail = view === 'detail' && project

  return (
    <header className="app-header">
      <div className="app-header__row">
        {isDetail ? (
          <button className="app-header__back" onClick={onBack} aria-label="返回项目列表">
            ‹
          </button>
        ) : (
          <SealStamp char="来" />
        )}

        <div className="app-header__titles">
          <h1 className="app-header__title">{isDetail ? project.name : '来钱'}</h1>
          <p className="app-header__subtitle">
            {isDetail ? '按笔记账，随手补录' : '随手记，项目分明'}
          </p>
        </div>

        {isDetail && (
          <div className="app-header__total">
            <span className="app-header__total-label">项目总计</span>
            <span className="app-header__total-value">¥{formatMoney(projectTotal)}</span>
          </div>
        )}
      </div>
    </header>
  )
}
