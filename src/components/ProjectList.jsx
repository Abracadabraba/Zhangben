import SealStamp from './SealStamp.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function ProjectList({ projects, onOpen, onEdit, onDelete, onCreate }) {
  return (
    <div>
      <div className="section-heading">
        <h2>我的项目</h2>
        <span>{projects.length} 个项目</span>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <SealStamp char="来" />
          <h3>还没有项目</h3>
          <p>先建一个项目，比如「装修房子」或「日本旅行」，再开始随手记账。</p>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn--primary" onClick={onCreate}>
              + 新建项目
            </button>
          </div>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
          ))}
          <button className="new-project-tile" onClick={onCreate}>
            <span style={{ fontSize: 20 }}>＋</span> 新建项目
          </button>
        </div>
      )}
    </div>
  )
}
