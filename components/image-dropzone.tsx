"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { FileImage, Upload } from "lucide-react"

import { cn } from "@/lib/utils"

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void
}

export function ImageDropzone({ onFilesAdded }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length > 0) {
        onFilesAdded(imageFiles)
      }
    },
    [onFilesAdded],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files)
        onFilesAdded(files)
        // Reset the input value so the same file can be selected again
        e.target.value = ""
      }
    },
    [onFilesAdded],
  )

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-muted p-4">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Drag & drop your images here</h3>
          <p className="text-sm text-muted-foreground">Supports: JPG, PNG, GIF, WebP, SVG (max 10MB each)</p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="file-upload"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  )
}

