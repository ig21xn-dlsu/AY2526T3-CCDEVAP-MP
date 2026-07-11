import { useRef } from "react";

// ============================================================
// Controlled file upload component.
// It owns NO state itself — the parent passes `files` down and
// gets notified via `onFilesChange` when they change, same pattern
// as a controlled <input value={x} onChange={setX} />.
//
// If anyone else in the group wants to use this, take not of this: 
//
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />
//
// At submit time, loop over uploadedFiles and do:
//   uploadedFiles.forEach(({ file }) => formData.append("photos", file));
// ============================================================

export default function FileUpload({ files, onFilesChange, maxSizeMB = 10 }) {
  const inputRef = useRef(null);

  const ALLOWED_TYPES = ["image/png", "image/jpeg"];

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name} isn't a PNG or JPG file`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} exceeds the ${maxSizeMB}MB limit`);
        return false;
      }
      return true;
    });

    const withMeta = incoming.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file),
    }));

    onFilesChange([...files, ...withMeta]);
  };

  const removeFile = (id) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const handleInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // allows re-selecting the same file later
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
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
          multiple
          accept="image/png, image/jpeg"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <div className="uploadedGrid d-flex flex-wrap gap-2 mt-3">
          {files.map(({ file, id, previewUrl }) => (
            <div key={id} className="uploadedItem">
              <img src={previewUrl} alt={file.name} className="uploadedThumb" />
              <div className="uploadedInfo">
                <span className="uploadedName" title={file.name}>
                  {file.name}
                </span>
                <span className="uploadedSize">{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="uploadedRemoveBtn"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
