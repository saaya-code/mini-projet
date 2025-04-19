"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"

interface FileUploaderProps {
  onUpload: (file: File) => void
  isUploading: boolean
}

export function FileUploader({ onUpload, isUploading }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xls,.csv" />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium mb-1">Glissez-déposez un fichier ou cliquez pour parcourir</p>
        <p className="text-xs text-muted-foreground">Formats supportés: Excel (.xlsx, .xls) et CSV</p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleClearFile()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? "Importation en cours..." : "Importer"}
        </Button>
      </div>
    </div>
  )
}
