import { useState } from 'react';

interface AIImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  isProcessing?: boolean;
}

export default function AIImageUpload({ onImageSelect, isProcessing = false }: AIImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.1rem' }}>Drone Image Analysis</h3>
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(76, 175, 80, 0.05)' : 'var(--color-surface)',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: isProcessing ? 0.6 : 1,
        }}
      >
        {isProcessing ? (
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
              AI Processing
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Analyzing crops...</p>
            <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Detecting plant health and growth patterns
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
              Upload Drone Image
            </div>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Drag & drop image here, or click to select
            </p>
            <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Supports: JPG, PNG (Max 10MB)
            </p>
            <input
              type="file"
              onChange={handleChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="ai-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="ai-upload"
              style={{
                display: 'inline-block',
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Choose Image
            </label>
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: 'var(--spacing-sm)', 
        padding: 'var(--spacing-sm)', 
        backgroundColor: 'rgba(76, 175, 80, 0.1)', 
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)'
      }}>
        <strong>Tip:</strong> Upload vertical drone images for best crop detection results
      </div>
    </div>
  );
}
