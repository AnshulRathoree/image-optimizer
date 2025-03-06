"use client"

import { useState, useEffect } from "react"
import { Loader2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { analyzeImage } from "@/lib/image-processor"

interface ImageAnalyzerProps {
  file: File
}

export function ImageAnalyzer({ file }: ImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const { toast } = useToast()

  const handleAnalyzeImage = async () => {
    if (!file) return

    setIsAnalyzing(true)

    try {
      const result = await analyzeImage(file)
      setAnalysis(result.analysis)
      setMetadata(result.metadata)
    } catch (error) {
      console.error("Error analyzing image:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (file) {
      handleAnalyzeImage()
    }
  }, [file])

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-center">Analyzing image with AI...</p>
        <Progress value={45} className="w-full" />
      </div>
    )
  }

  if (!analysis || !metadata) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <p>No analysis available</p>
        <Button onClick={handleAnalyzeImage}>
          <Zap className="mr-2 h-4 w-4" />
          Analyze Image
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Image Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Dimensions</p>
            <p className="text-sm text-muted-foreground">
              {metadata.width} × {metadata.height} pixels
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Format</p>
            <p className="text-sm text-muted-foreground">{metadata.format?.toUpperCase()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Size</p>
            <p className="text-sm text-muted-foreground">{(metadata.size / 1024).toFixed(1)} KB</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Quality Score</p>
            <div className="flex items-center gap-2">
              <Progress value={analysis.quality_score} className="flex-1" />
              <span className="text-sm">{Math.round(analysis.quality_score)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Content Analysis</h4>
        <div className="flex flex-wrap gap-1">
          {analysis.labels.map((label: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Color Palette</h4>
        <div className="flex gap-2">
          {analysis.dominant_colors.map((color: any, i: number) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.color }} />
              <span className="text-xs mt-1">{Math.round(color.score * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {analysis.optimization_suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Optimization Suggestions</h4>
          <ul className="space-y-1">
            {analysis.optimization_suggestions.map((suggestion: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

