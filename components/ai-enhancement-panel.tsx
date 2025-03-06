"use client"

import type React from "react"

import { useState } from "react"
import { Brain, Sparkles, Zap, Lightbulb, Crop, Palette, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface AIEnhancementPanelProps {
  settings: any
  setSettings: React.Dispatch<React.SetStateAction<any>>
  selectedFile: File | null
}

export function AIEnhancementPanel({ settings, setSettings, selectedFile }: AIEnhancementPanelProps) {
  const [enhancementLevel, setEnhancementLevel] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setSettings((prev: any) => ({ ...prev, [field]: checked }))

    if (field === "enhanceImage" && checked) {
      toast({
        title: "AI Enhancement Enabled",
        description: "Your images will be enhanced using advanced AI algorithms.",
      })
    }
  }

  const handleEnhancementLevelChange = (value: number[]) => {
    setEnhancementLevel(value[0])
  }

  const generateSuggestions = () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to generate enhancement suggestions.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate generating suggestions
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Enhancement Suggestions",
        description: "We recommend increasing contrast by 10% and applying smart cropping for this image.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">AI Enhancement</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enhanceImage">Enable AI Enhancement</Label>
            <p className="text-sm text-muted-foreground">Use AI to improve image quality</p>
          </div>
          <Switch
            id="enhanceImage"
            checked={settings.enhanceImage}
            onCheckedChange={handleSwitchChange("enhanceImage")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="smartCrop">Smart Cropping</Label>
            <p className="text-sm text-muted-foreground">AI detects important content when cropping</p>
          </div>
          <Switch id="smartCrop" checked={settings.smartCrop} onCheckedChange={handleSwitchChange("smartCrop")} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Enhancement Level</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Balanced</span>
            <span>Dramatic</span>
          </div>
          <Slider value={[enhancementLevel]} onValueChange={handleEnhancementLevelChange} max={100} step={1} />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Enhancement Features</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Palette className="h-3.5 w-3.5 mr-2" />
            Color Boost
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Zap className="h-3.5 w-3.5 mr-2" />
            Sharpen
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Crop className="h-3.5 w-3.5 mr-2" />
            Smart Crop
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Wand2 className="h-3.5 w-3.5 mr-2" />
            Auto Fix
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={generateSuggestions} className="w-full" disabled={isGenerating || !selectedFile}>
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Suggestions
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          {selectedFile
            ? `Selected: ${selectedFile.name}`
            : "Select an image to get AI-powered enhancement suggestions"}
        </p>
      </div>
    </div>
  )
}

