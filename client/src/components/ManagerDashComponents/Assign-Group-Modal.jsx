import { useState } from "react";
import { createPortal } from "react-dom";
import { useCheckGroup } from "../../hook/useCheckGroup.js";
import { useAssignGroup } from "../../hook/useAssignGroup";

function AssignGroupModal({ listingId, currentGroupId, isOpen, onClose, onAssigned, onCleared }) {
  const [groupIdInput, setGroupIdInput] = useState("");
  const { checkGroup, checking, group, error: checkError, reset } = useCheckGroup();
  const { assignGroup, clearGroup, loading: assigning, error: assignError } = useAssignGroup();

  if (!isOpen) return null;

  const hasCurrentGroup = !!currentGroupId;

  const handleInputChange = (e) => {
    setGroupIdInput(e.target.value);
    reset();
  };

  const handleCheck = async () => {
    if (!groupIdInput.trim()) return;
    try {
      await checkGroup(groupIdInput.trim());
    } catch { }
  };

  const handleSubmit = async () => {
    try {
      await assignGroup(listingId, group.id);
      onAssigned?.(group);
      handleClose();
    } catch { }
  };

  const handleClear = async () => {
    const confirmed = window.confirm("Remove the group assigned to this listing?");
    if (!confirmed) return;
    try {
      await clearGroup(listingId);
      onCleared?.();
      handleClose();
    } catch { }
  };

  const handleClose = () => {
    setGroupIdInput("");
    reset();
    onClose();
  };

  return createPortal(
    <div onClick={(e) => e.stopPropagation()}>
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign a Group</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              {hasCurrentGroup && (
                <div className="alert alert-secondary d-flex justify-content-between align-items-center">
                  <span>This listing already has a group assigned.</span>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClear}
                    disabled={assigning}
                  >
                    {assigning ? "Clearing..." : "Clear Group"}
                  </button>
                </div>
              )}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter group ID"
                  value={groupIdInput}
                  onChange={handleInputChange}
                />
              </div>
              <button
                className="btn btn-secondary mb-2"
                onClick={handleCheck}
                disabled={checking || !groupIdInput.trim()}
              >
                {checking ? "Checking..." : "Check Group"}
              </button>
              {checkError && <p className="text-danger">{checkError}</p>}
              {group && <p className="text-success">✓ Found: {group.name}</p>}
              {assignError && <p className="text-danger">{assignError}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={handleClose}>
                Cancel
              </button>
              {group && (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={assigning}
                >
                  {assigning ? "Assigning..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default AssignGroupModal;
