"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  FileImage,
  Loader2,
  Settings,
  Upload,
  X,
  Zap,
  Brain,
  Sparkles,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { ImageDropzone } from "@/components/image-dropzone"
import { ImageCard } from "@/components/image-card"
import { OptimizationSettings } from "@/components/optimization-settings"
import { Badge } from "@/components/ui/badge"
import { ImageAnalyzer } from "@/components/image-analyzer"
import { CollaborationPanel } from "@/components/collaboration-panel"
import { AIEnhancementPanel } from "@/components/ai-enhancement-panel"
import { useToast } from "@/components/ui/use-toast"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { processImage } from "@/lib/image-processor"

export default function OptimizePage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState<File[]>([])
  const [optimizedFiles, setOptimizedFiles] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingIndex, setProcessingIndex] = useState(0)
  const { toast } = useToast()
  const processingCancelled = useRef(false)

  const [settings, setSettings] = useState({
    quality: 80,
    convertToWebP: true,
    resizeImages: false,
    maxWidth: 1920,
    maxHeight: 1080,
    preserveMetadata: false,
    enhanceImage: false,
    smartCrop: false,
    autoOptimize: false,
    progressiveLoading: true,
    batchProcessing: false,
  })

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])

    // If auto-optimize is enabled, start processing immediately
    if (settings.autoOptimize && newFiles.length > 0) {
      toast({
        title: "Auto-optimization enabled",
        description: `Starting optimization for ${newFiles.length} new images...`,
      })
      startProcessing()
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
  }

  const processNextImage = async (index: number, allFiles: File[]) => {
    if (processingCancelled.current || index >= allFiles.length) {
      return []
    }

    const file = allFiles[index]
    setProcessingIndex(index)

    try {
      // Process the image
      const result = await processImage(file, settings)

      // Update progress
      const newProgress = Math.round(((index + 1) / allFiles.length) * 100)
      setProgress(newProgress)

      // Process next image
      const remainingResults = await processNextImage(index + 1, allFiles)
      return [result, ...remainingResults]
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error)
      toast({
        title: "Processing error",
        description: `Failed to process ${file.name}. Skipping to next image.`,
        variant: "destructive",
      })

      // Continue with next image despite error
      const remainingResults = await processNextImage(index + 1, allFiles)
      return remainingResults
    }
  }

  const startProcessing = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setProcessingIndex(0)
    setActiveTab("processing")
    processingCancelled.current = false

    try {
      // Process all images sequentially
      const results = await processNextImage(0, files)

      if (processingCancelled.current) {
        setIsProcessing(false)
        return
      }

      setOptimizedFiles(results)
      setProgress(100)
      setIsProcessing(false)
      setActiveTab("results")

      toast({
        title: "Optimization complete",
        description: `Successfully optimized ${results.length} images`,
      })
    } catch (error) {
      console.error("Error optimizing images:", error)
      setIsProcessing(false)
      toast({
        title: "Optimization failed",
        description: "There was an error optimizing your images. Please try again.",
        variant: "destructive",
      })
    }
  }

  const cancelProcessing = () => {
    processingCancelled.current = true
    toast({
      title: "Processing cancelled",
      description: "Image optimization has been cancelled.",
    })
  }

  const downloadAll = () => {
    if (optimizedFiles.length === 0) return

    toast({
      title: "Preparing download",
      description: "Creating zip file with all optimized images...",
    })

    // Use JSZip to create a zip file with all optimized images
    import("jszip")
      .then(({ default: JSZip }) => {
        const zip = new JSZip()

        // Add each optimized image to the zip
        optimizedFiles.forEach((file) => {
          // Convert data URL to blob
          const dataUrl = file.url
          const byteString = atob(dataUrl.split(",")[1])
          const mimeType = dataUrl.split(",")[0].split(":")[1].split(";")[0]
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([ab], { type: mimeType })
          zip.file(file.name, blob)
        })

        // Generate the zip file
        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a download link
          const link = document.createElement("a")
          link.href = URL.createObjectURL(content)
          link.download = "optimized-images.zip"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          toast({
            title: "Download ready",
            description: `${optimizedFiles.length} images downloaded as a zip file`,
          })
        })
      })
      .catch((error) => {
        console.error("Error creating zip file:", error)
        toast({
          title: "Download failed",
          description: "There was an error creating the zip file. Please try downloading images individually.",
          variant: "destructive",
        })
      })
  }

  const totalSavings = optimizedFiles.reduce((acc, file) => acc + (file.originalSize - file.newSize), 0)
  const totalOriginalSize = optimizedFiles.reduce((acc, file) => acc + file.originalSize, 0)
  const averageReduction = optimizedFiles.length ? Math.round((totalSavings / totalOriginalSize) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Image Optimizer</h1>
          {settings.enhanceImage && (
            <Badge variant="outline" className="ml-2 bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle pressed={showSettings} onPressedChange={setShowSettings} aria-label="Toggle settings">
                  <Settings className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Optimization Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showAIPanel}
                  onPressedChange={setShowAIPanel}
                  aria-label="Toggle AI Enhancement"
                  className="text-primary"
                >
                  <Brain className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Enhancement</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showCollaboration}
                  onPressedChange={setShowCollaboration}
                  aria-label="Toggle Collaboration"
                >
                  <Share2 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Collaboration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showSettings && (
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <OptimizationSettings settings={settings} setSettings={setSettings} />
            </CardContent>
          </Card>
        )}

        {showAIPanel && (
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <AIEnhancementPanel settings={settings} setSettings={setSettings} selectedFile={selectedFile} />
            </CardContent>
          </Card>
        )}

        {showCollaboration && (
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <CollaborationPanel files={files} optimizedFiles={optimizedFiles} />
            </CardContent>
          </Card>
        )}

        <div className={`${showSettings || showAIPanel || showCollaboration ? "md:col-span-2" : "md:col-span-3"}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="processing" disabled={files.length === 0 || isProcessing}>
                Processing
              </TabsTrigger>
              <TabsTrigger value="results" disabled={optimizedFiles.length === 0}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div className="space-y-6">
                <ImageDropzone onFilesAdded={handleFilesAdded} />

                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Selected Images ({files.length})</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={clearAllFiles}>
                          Clear All
                        </Button>
                        <Button size="sm" onClick={startProcessing}>
                          {settings.enhanceImage ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Enhance & Optimize
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Start Optimization
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div
                            className="aspect-square relative bg-muted cursor-pointer"
                            onClick={() => setSelectedFile(file)}
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={file.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <FileImage className="h-16 w-16 text-muted-foreground" />
                              </div>
                            )}
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFile(index)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>

                            {/* Quick analyze button */}
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="absolute bottom-2 right-2 h-6 w-6"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Zap className="h-3 w-3" />
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent>
                                <div className="p-4 max-w-md mx-auto">
                                  <ImageAnalyzer file={file} />
                                </div>
                              </DrawerContent>
                            </Drawer>
                          </div>
                          <CardContent className="p-3">
                            <p className="text-sm truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-6">
                  <div className="w-full max-w-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">
                        {settings.enhanceImage ? "Enhancing & Optimizing Images" : "Optimizing Images"}
                      </h2>
                      <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground">
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing {processingIndex + 1} of {files.length}: {files[processingIndex]?.name || ""}
                        </span>
                      ) : (
                        "Processing complete!"
                      )}
                    </p>

                    {isProcessing && (
                      <Button variant="outline" size="sm" className="mt-4 mx-auto" onClick={cancelProcessing}>
                        Cancel
                      </Button>
                    )}

                    {settings.enhanceImage && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          AI enhancement is active. This may take longer but will produce better results.
                        </p>
                        <div className="flex justify-center mt-2 space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">Optimization Results</h2>
                    <p className="text-sm text-muted-foreground">
                      {optimizedFiles.length} images optimized with an average reduction of {averageReduction}%
                    </p>
                  </div>
                  <Button onClick={downloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>

                <Card className="bg-muted/50 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Original Size</p>
                      <p className="text-xl font-bold">{(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Optimized Size</p>
                      <p className="text-xl font-bold">
                        {((totalOriginalSize - totalSavings) / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="text-xl font-bold">{(totalSavings / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reduction</p>
                      <p className="text-xl font-bold">{averageReduction}%</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {optimizedFiles.map((file, index) => (
                    <ImageCard key={index} file={file} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

