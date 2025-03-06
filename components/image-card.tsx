"use client"

import { useState } from "react"
import { Download, ExternalLink, Maximize2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface ImageCardProps {
  file: {
    name: string
    originalName: string
    originalSize: number
    newSize: number
    reduction: number
    url: string
    width?: number
    height?: number
    format?: string
  }
}

export function ImageCard({ file }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const downloadImage = () => {
    // Create a download link for the data URL
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    })
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-80 hover:opacity-100 z-10"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-auto max-h-[80vh] overflow-auto">
              <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-auto object-contain" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {file.width && file.height ? `${file.width}×${file.height}` : ""}
                  {file.format ? ` · ${file.format.toUpperCase()}` : ""}
                </p>
              </div>
              <Button onClick={downloadImage}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <img
          src={file.url || "/placeholder.svg"}
          alt={file.name}
          className="object-cover w-full h-full"
          onLoad={handleImageLoad}
          loading="lazy"
        />

        {file.reduction > 60 && (
          <Badge variant="secondary" className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            Excellent
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{file.reduction}% smaller</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Original</span>
              <span>{(file.originalSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Optimized</span>
              <span>{(file.newSize / 1024).toFixed(1)} KB</span>
            </div>
            <Progress value={100 - file.reduction} className="h-1.5 mt-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={downloadImage}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.open(file.url, "_blank")}>
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Preview
        </Button>
      </CardFooter>
    </Card>
  )
}

