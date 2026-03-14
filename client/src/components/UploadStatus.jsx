import React from 'react';
import ProgressBar from './ProgressBar';

const UploadStatus = ({ files, onCancel }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="upload-status-container">
      <h3>Transfers</h3>
      <div className="upload-list">
        {files.map((fileObj, index) => (
          <div key={`${fileObj.file.name}-${index}`} className="upload-item">
            <div className="upload-item-header">
              <span className="file-name" title={fileObj.file.name}>
                {fileObj.file.name.length > 30 ? fileObj.file.name.substring(0, 30) + '...' : fileObj.file.name}
              </span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <span className={`status-badge ${fileObj.status}`}>
                   {fileObj.status === 'uploading' && 'Uploading...'}
                   {fileObj.status === 'success' && 'Done'}
                   {fileObj.status === 'error' && 'Failed'}
                   {fileObj.status === 'pending' && 'Waiting...'}
                 </span>
                 {(fileObj.status === 'uploading' || fileObj.status === 'pending') && onCancel && (
                   <button 
                     onClick={() => onCancel(fileObj.id)} 
                     className="cancel-btn"
                     style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}
                   >
                     Cancel
                   </button>
                 )}
              </div>
            </div>
            
            {(fileObj.status === 'uploading' || fileObj.status === 'success') && (
              <ProgressBar progress={fileObj.progress} />
            )}
            
            {fileObj.error && (
              <div className="error-message">{fileObj.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadStatus;
