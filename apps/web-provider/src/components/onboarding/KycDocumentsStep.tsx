'use client';

import { useState } from 'react';
import { Button } from '@palmera/ui';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface KycDocumentsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface UploadedFile {
  id: string;
  file: File;
  type: string;
  preview: string;
}

const documentTypes = [
  { id: 'business_license', name: 'Business License', required: true },
  { id: 'tax_certificate', name: 'Tax Certificate', required: true },
  { id: 'id_card', name: 'ID Card', required: true },
  { id: 'bank_statement', name: 'Bank Statement', required: false },
];

export function KycDocumentsStep({ onNext, onPrevious }: KycDocumentsStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: 'general',
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const handleNext = () => {
    // Validate required documents
    const hasRequiredDocs = documentTypes
      .filter(doc => doc.required)
      .every(doc => uploadedFiles.some(file => file.type === doc.id));
    
    if (hasRequiredDocs) {
      onNext();
    } else {
      alert('Please upload all required documents');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-midnight-950">
          KYC Documents
        </h2>
        <p className="text-midnight-600 mt-2">
          Upload the required documents for verification
        </p>
      </div>

      <div className="space-y-6">
        {/* Document Types */}
        <div>
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            Required Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-midnight-200 rounded-lg">
                <div>
                  <p className="font-medium text-midnight-900">{doc.name}</p>
                  <p className="text-sm text-midnight-500">
                    {doc.required ? 'Required' : 'Optional'}
                  </p>
                </div>
                <div className="flex items-center">
                  {uploadedFiles.some(file => file.type === doc.id) ? (
                    <span className="text-green-600 text-sm font-medium">✓ Uploaded</span>
                  ) : (
                    <span className="text-midnight-400 text-sm">Not uploaded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            Upload Documents
          </h3>
          <div
            {...getRootProps()}
            className={`kyc-upload ${isDragActive ? 'border-midnight-500 bg-midnight-50' : ''}`}
          >
            <input {...getInputProps()} />
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-midnight-400" />
            <p className="mt-2 text-sm text-midnight-600">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop files here, or click to select files'
              }
            </p>
            <p className="text-xs text-midnight-500 mt-1">
              PNG, JPG, PDF up to 5MB
            </p>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-midnight-900 mb-4">
              Uploaded Files
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-midnight-50 rounded-lg">
                  <div className="flex items-center">
                    <DocumentArrowUpIcon className="h-5 w-5 text-midnight-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-midnight-900">{file.file.name}</p>
                      <p className="text-xs text-midnight-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-midnight-400 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onPress={onPrevious}>
            Previous
          </Button>
          <Button onPress={handleNext}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
