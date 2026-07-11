import { useRef } from "react";

// ============================================================
// Controlled SINGLE-file upload component.
// It owns NO state itself — the parent passes `file` down and
// gets notified via `onFileChange` when it changes, same pattern
// as a controlled <input value={x} onChange={setX} />.
//
// If anyone wants to use this Box, please take not of what I note below: 
//
//   const [uploadedFile, setUploadedFile] = useState(null);
//   <FileUpload file={uploadedFile} onFileChange={setUploadedFile} />
//
// At submit time:
//   if (uploadedFile) formData.append("photo", uploadedFile.file);
// ============================================================

// CHANGED: props renamed files->file, onFilesChange->onFileChange (singular now)
export default function FileUpload({ file, onFileChange, maxSizeMB = 10 }) {
  const inputRef = useRef(null);

  const ALLOWED_TYPES = ["image/png", "image/jpeg"];

  const setFile = (rawFile) => {
    if (!rawFile) return;

    if (!ALLOWED_TYPES.includes(rawFile.type)) {
      alert(`${rawFile.name} isn't a PNG or JPG file`);
      return;
    }
    if (rawFile.size > maxSizeMB * 1024 * 1024) {
      alert(`${rawFile.name} exceeds the ${maxSizeMB}MB limit`);
      return;
    }

    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);

    onFileChange({
      file: rawFile,
      previewUrl: URL.createObjectURL(rawFile),
    });
  };

  const removeFile = () => {
    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
    onFileChange(null);
  };

  const handleInputChange = (e) => {
    setFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fileUploadRoot">
      <div
        className="dropzone d-flex flex-column justify-content-center align-items-center"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="mb-1 fw-semibold">Drag & drop files here</p>
        <p className="text-muted small mb-0">
          PNG or JPG only, up to {maxSizeMB}MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>

      {file && (
        <div className="uploadedGrid d-flex flex-wrap gap-2 mt-3">
          <div className="uploadedItem">
            <img src={file.previewUrl} alt={file.file.name} className="uploadedThumb" />
            <div className="uploadedInfo">
              <span className="uploadedName" title={file.file.name}>
                {file.file.name}
              </span>
              <span className="uploadedSize">{formatSize(file.file.size)}</span>
            </div>
            <button
              type="button"
              className="uploadedRemoveBtn"
              aria-label={`Remove ${file.file.name}`}
              onClick={removeFile}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
