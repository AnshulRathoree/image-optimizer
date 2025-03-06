"use client"

import type React from "react"

import { Info, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface OptimizationSettingsProps {
  settings: {
    quality: number
    convertToWebP: boolean
    resizeImages: boolean
    maxWidth: number
    maxHeight: number
    preserveMetadata: boolean
    enhanceImage: boolean
    smartCrop: boolean
    autoOptimize: boolean
    progressiveLoading: boolean
    batchProcessing: boolean
  }
  setSettings: React.Dispatch<React.SetStateAction<any>>
}

export function OptimizationSettings({ settings, setSettings }: OptimizationSettingsProps) {
  const handleQualityChange = (value: number[]) => {
    setSettings((prev: any) => ({ ...prev, quality: value[0] }))
  }

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setSettings((prev: any) => ({ ...prev, [field]: checked }))
  }

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setSettings((prev: any) => ({ ...prev, [field]: checked }))
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10) || 0
    setSettings((prev: any) => ({ ...prev, [field]: value }))
  }

  const resetToDefaults = () => {
    setSettings({
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
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Optimization Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">Quality ({settings.quality}%)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Lower quality means smaller file size but may affect image appearance. 80% is recommended for web.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              id="quality"
              min={10}
              max={100}
              step={1}
              value={[settings.quality]}
              onValueChange={handleQualityChange}
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="convertToWebP"
              checked={settings.convertToWebP}
              onCheckedChange={handleCheckboxChange("convertToWebP")}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="convertToWebP"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Convert to WebP
              </Label>
              <p className="text-sm text-muted-foreground">
                WebP offers better compression than PNG or JPEG with good quality
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="resizeImages"
              checked={settings.resizeImages}
              onCheckedChange={handleCheckboxChange("resizeImages")}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="resizeImages"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Resize images
              </Label>
              <p className="text-sm text-muted-foreground">Limit maximum dimensions while preserving aspect ratio</p>
            </div>
          </div>

          {settings.resizeImages && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="maxWidth">Max Width</Label>
                <Input
                  id="maxWidth"
                  type="number"
                  min={100}
                  max={10000}
                  value={settings.maxWidth}
                  onChange={handleInputChange("maxWidth")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxHeight">Max Height</Label>
                <Input
                  id="maxHeight"
                  type="number"
                  min={100}
                  max={10000}
                  value={settings.maxHeight}
                  onChange={handleInputChange("maxHeight")}
                />
              </div>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="preserveMetadata"
              checked={settings.preserveMetadata}
              onCheckedChange={handleCheckboxChange("preserveMetadata")}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="preserveMetadata"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preserve metadata
              </Label>
              <p className="text-sm text-muted-foreground">Keep EXIF data (increases file size)</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Advanced Features</h4>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Pro
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoOptimize">Auto-Optimize</Label>
              <p className="text-sm text-muted-foreground">Automatically optimize images on upload</p>
            </div>
            <Switch
              id="autoOptimize"
              checked={settings.autoOptimize}
              onCheckedChange={handleSwitchChange("autoOptimize")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="progressiveLoading">Progressive Loading</Label>
              <p className="text-sm text-muted-foreground">Enable progressive rendering of images</p>
            </div>
            <Switch
              id="progressiveLoading"
              checked={settings.progressiveLoading}
              onCheckedChange={handleSwitchChange("progressiveLoading")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="batchProcessing">Batch Processing</Label>
              <p className="text-sm text-muted-foreground">Process images in background for better performance</p>
            </div>
            <Switch
              id="batchProcessing"
              checked={settings.batchProcessing}
              onCheckedChange={handleSwitchChange("batchProcessing")}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">API Integration</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="cloudinary" />
            <Label htmlFor="cloudinary">Use Cloudinary</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="tinypng" />
            <Label htmlFor="tinypng">Use TinyPNG</Label>
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={resetToDefaults} className="w-full">
        Reset to Defaults
      </Button>
    </div>
  )
}

