"use client";

import { useState, useRef, useCallback } from "react";
import { type CvMeta } from "~/lib/cv";
import FileIcon from "./icons/FileIcon";
import Button from "./ui/Button";

interface CvDropProps {
  value?: CvMeta | null;
  onChange: (meta: CvMeta | null) => void;
  error?: string | undefined;
}

export default function CvDrop({ value, onChange, error }: CvDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const computeHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please select a PDF file only';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5 MB';
    }
    return null;
  };

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      showMessage(validationError);
      return;
    }

    setIsProcessing(true);
    try {
      const hash = await computeHash(file);
      const cvMeta: CvMeta = {
        name: file.name,
        size: file.size,
        type: 'application/pdf',
        hash
      };

      // TODO: Prepare upload when Firebase is wired
      // await CvService.prepareUpload(cvMeta);

      onChange(cvMeta);
      showMessage(`${file.name} selected successfully`);
    } catch (_err) {
      showMessage('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      void processFile(files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dropzoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      void processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    showMessage('File removed');
    // Return focus to dropzone
    setTimeout(() => dropzoneRef.current?.focus(), 100);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (value) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3 bg-gray-50">
          <FileIcon className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{value.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="black"
              size="sm"
              type="button"
              onClick={handleReplace}
              className="text-xs"
            >
              Replace
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleRemove}
              className="text-xs"
            >
              Remove
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={dropzoneRef}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file by clicking or dragging and dropping"
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isProcessing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
        `}
        onClick={isProcessing ? undefined : handleClick}
        onKeyDown={isProcessing ? undefined : handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isProcessing ? (
          <div className="space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Processing file...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <FileIcon className="w-8 h-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to select or drag and drop your CV
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF only • Max 5 MB • No upload yet
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Accessibility announcements */}
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  );
}