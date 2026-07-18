import Modal from './Modal.jsx'

export default function ConfirmDialog({ title, message, confirmLabel = '确定', danger = true, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm-body">{message}</div>
      <div className="modal__actions" style={{ padding: '0 20px calc(20px + env(safe-area-inset-bottom))' }}>
        <button className="btn btn--ghost" onClick={onClose}>
          取消
        </button>
        <button
          className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
