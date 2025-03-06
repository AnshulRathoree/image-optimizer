// Client-side image processing functions using browser APIs only

// Function to process an image with the given settings
export async function processImage(file: File, settings: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element to load the file
      const img = new Image()
      img.crossOrigin = "anonymous"

      // Create a FileReader to read the file
      const reader = new FileReader()

      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"))
          return
        }

        // Set the image source to the file data
        img.src = e.target.result as string

        img.onload = () => {
          try {
            // Get the original dimensions
            const originalWidth = img.width
            const originalHeight = img.height

            // Calculate new dimensions if resizing is enabled
            let newWidth = originalWidth
            let newHeight = originalHeight

            if (settings.resizeImages) {
              const maxWidth = settings.maxWidth
              const maxHeight = settings.maxHeight

              if (originalWidth > maxWidth || originalHeight > maxHeight) {
                const widthRatio = maxWidth / originalWidth
                const heightRatio = maxHeight / originalHeight

                // Use the smaller ratio to ensure the image fits within the constraints
                const ratio = Math.min(widthRatio, heightRatio)

                newWidth = Math.floor(originalWidth * ratio)
                newHeight = Math.floor(originalHeight * ratio)
              }
            }

            // Create a canvas element to draw the image
            const canvas = document.createElement("canvas")

            // Set up canvas for smart cropping or regular resizing
            if (settings.smartCrop && settings.resizeImages) {
              // Simulate smart cropping by focusing on the center of the image
              // In a real app, this would use more sophisticated algorithms
              const cropFactor = 0.75 // Focus on central 75% of the image

              const cropWidth = originalWidth * cropFactor
              const cropHeight = originalHeight * cropFactor
              const cropX = (originalWidth - cropWidth) / 2
              const cropY = (originalHeight - cropHeight) / 2

              canvas.width = newWidth
              canvas.height = newHeight

              const ctx = canvas.getContext("2d")
              if (!ctx) {
                reject(new Error("Failed to get canvas context"))
                return
              }

              // Draw the cropped and resized image
              ctx.drawImage(
                img,
                cropX,
                cropY,
                cropWidth,
                cropHeight, // Source rectangle
                0,
                0,
                newWidth,
                newHeight, // Destination rectangle
              )
            } else {
              // Regular resizing
              canvas.width = newWidth
              canvas.height = newHeight

              const ctx = canvas.getContext("2d")
              if (!ctx) {
                reject(new Error("Failed to get canvas context"))
                return
              }

              // Draw the resized image
              ctx.drawImage(img, 0, 0, newWidth, newHeight)
            }

            // Apply AI enhancement if enabled
            if (settings.enhanceImage) {
              enhanceImage(canvas)
            }

            // Convert to WebP if enabled, otherwise use original format
            let mimeType = file.type
            let extension = file.name.split(".").pop() || "jpg"

            if (settings.convertToWebP) {
              mimeType = "image/webp"
              extension = "webp"
            }

            // Get the optimized image data
            const quality = settings.quality / 100
            const optimizedDataUrl = canvas.toDataURL(mimeType, quality)

            // Calculate the size of the optimized image
            const optimizedSize = getDataUrlSize(optimizedDataUrl)
            const originalSize = file.size

            // Calculate the reduction percentage
            const reduction = Math.round(((originalSize - optimizedSize) / originalSize) * 100)

            // Create a filename for the optimized image
            const baseName = file.name.substring(0, file.name.lastIndexOf("."))
            const optimizedName = `${baseName}-optimized.${extension}`

            // Return the result
            resolve({
              name: optimizedName,
              originalName: file.name,
              originalSize: originalSize,
              newSize: optimizedSize,
              reduction: reduction,
              url: optimizedDataUrl,
              width: newWidth,
              height: newHeight,
              format: extension,
            })
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      // Read the file as a data URL
      reader.readAsDataURL(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to enhance an image using canvas filters
function enhanceImage(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Apply various enhancements

  // 1. Increase contrast
  const contrast = 1.2 // 20% increase in contrast
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

  // 2. Adjust brightness
  const brightness = 15 // Slight brightness increase

  // 3. Increase saturation
  const saturation = 1.2 // 20% increase in saturation

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast
    data[i] = clamp(factor * (data[i] - 128) + 128 + brightness)
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128 + brightness)
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128 + brightness)

    // Apply saturation
    const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = clamp(gray + saturation * (data[i] - gray))
    data[i + 1] = clamp(gray + saturation * (data[i + 1] - gray))
    data[i + 2] = clamp(gray + saturation * (data[i + 2] - gray))
  }

  // Put the enhanced image data back on the canvas
  ctx.putImageData(imageData, 0, 0)

  // Apply a slight sharpening effect using a convolution filter
  applySharpening(canvas)
}

// Function to apply a sharpening filter
function applySharpening(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width
  const height = canvas.height

  // Create a copy of the original data
  const original = new Uint8ClampedArray(data)

  // Sharpening kernel
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]

  // Apply the convolution
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const offset = (y * width + x) * 4

      // For each color channel (R, G, B)
      for (let c = 0; c < 3; c++) {
        let sum = 0

        // Apply the kernel
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const kernelIndex = (ky + 1) * 3 + (kx + 1)
            const pixelOffset = ((y + ky) * width + (x + kx)) * 4 + c

            sum += original[pixelOffset] * kernel[kernelIndex]
          }
        }

        // Set the new value
        data[offset + c] = clamp(sum)
      }
    }
  }

  // Put the sharpened image data back on the canvas
  ctx.putImageData(imageData, 0, 0)
}

// Helper function to clamp a value between 0 and 255
function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

// Function to calculate the size of a data URL in bytes
function getDataUrlSize(dataUrl: string): number {
  // Remove the metadata part of the data URL
  const base64 = dataUrl.split(",")[1]

  // Calculate the size in bytes
  const sizeInBytes = Math.ceil((base64.length * 3) / 4)

  return sizeInBytes
}

// Function to analyze an image and return metadata and suggestions
export async function analyzeImage(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element to load the file
      const img = new Image()
      img.crossOrigin = "anonymous"

      // Create a FileReader to read the file
      const reader = new FileReader()

      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"))
          return
        }

        // Set the image source to the file data
        img.src = e.target.result as string

        img.onload = () => {
          try {
            // Get the image dimensions
            const width = img.width
            const height = img.height

            // Create a canvas to analyze the image
            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext("2d")
            if (!ctx) {
              reject(new Error("Failed to get canvas context"))
              return
            }

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0)

            // Get the image data
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data

            // Analyze the image
            const analysis = {
              // Extract dominant colors
              dominant_colors: extractDominantColors(data, width, height),

              // Generate labels based on image characteristics
              labels: generateLabels(data, width, height),

              // Calculate a quality score
              quality_score: calculateQualityScore(data, width, height),

              // Check if the image has text
              has_text: detectText(data, width, height),

              // Check if the image has faces
              has_faces: detectFaces(data, width, height),

              // Generate optimization suggestions
              optimization_suggestions: generateOptimizationSuggestions(file, width, height),
            }

            // Return the metadata and analysis
            resolve({
              metadata: {
                width,
                height,
                format: file.type.split("/")[1],
                size: file.size,
                hasAlpha: hasAlphaChannel(data),
                channels: getChannelCount(data),
              },
              analysis,
            })
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      // Read the file as a data URL
      reader.readAsDataURL(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to extract dominant colors from image data
function extractDominantColors(data: Uint8ClampedArray, width: number, height: number): any[] {
  // Simplified color extraction - in a real app, this would use clustering algorithms
  const colorMap: Record<string, { count: number; color: string }> = {}
  const pixelCount = width * height
  const sampleRate = Math.max(1, Math.floor(pixelCount / 10000)) // Sample at most 10,000 pixels

  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Skip transparent pixels
    if (data[i + 3] < 128) continue

    // Quantize colors to reduce the number of unique colors
    const quantizedR = Math.floor(r / 32) * 32
    const quantizedG = Math.floor(g / 32) * 32
    const quantizedB = Math.floor(b / 32) * 32

    const colorKey = `${quantizedR},${quantizedG},${quantizedB}`
    const hexColor = `#${quantizedR.toString(16).padStart(2, "0")}${quantizedG.toString(16).padStart(2, "0")}${quantizedB.toString(16).padStart(2, "0")}`

    if (colorMap[colorKey]) {
      colorMap[colorKey].count++
    } else {
      colorMap[colorKey] = { count: 1, color: hexColor }
    }
  }

  // Convert to array and sort by count
  const colors = Object.values(colorMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Take top 5 colors
    .map((item) => ({
      color: item.color,
      score: item.count / (pixelCount / sampleRate),
      pixelFraction: item.count / (pixelCount / sampleRate),
    }))

  return colors
}

// Function to generate labels based on image characteristics
function generateLabels(data: Uint8ClampedArray, width: number, height: number): string[] {
  // In a real app, this would use machine learning models
  // Here we'll use simple heuristics to generate plausible labels

  const labels: string[] = []

  // Check if the image is likely a landscape
  if (width > height * 1.5) {
    labels.push("Landscape")
    labels.push("Panorama")
  }

  // Check if the image is likely a portrait
  if (height > width * 1.5) {
    labels.push("Portrait")
  }

  // Check if the image is likely a close-up
  if (width < 800 && height < 800) {
    labels.push("Close-up")
  }

  // Add some generic labels
  const genericLabels = ["Nature", "Outdoor", "Indoor", "Object", "Scene", "Art"]
  const numGenericLabels = 2 + Math.floor(Math.random() * 3) // 2-4 generic labels

  for (let i = 0; i < numGenericLabels; i++) {
    const randomIndex = Math.floor(Math.random() * genericLabels.length)
    const label = genericLabels.splice(randomIndex, 1)[0]
    labels.push(label)
  }

  return labels
}

// Function to calculate a quality score for the image
function calculateQualityScore(data: Uint8ClampedArray, width: number, height: number): number {
  // In a real app, this would use more sophisticated algorithms
  // Here we'll use simple heuristics

  // Base score
  let score = 70 + Math.random() * 20 // 70-90 base score

  // Adjust based on resolution
  if (width * height > 2000000) {
    // > 2 megapixels
    score += 5
  } else if (width * height < 500000) {
    // < 0.5 megapixels
    score -= 10
  }

  // Adjust based on aspect ratio
  const aspectRatio = width / height
  if (aspectRatio > 2.5 || aspectRatio < 0.4) {
    score -= 5 // Unusual aspect ratio
  }

  // Clamp the score to 0-100
  return Math.max(0, Math.min(100, score))
}

// Function to detect if the image contains text
function detectText(data: Uint8ClampedArray, width: number, height: number): boolean {
  // In a real app, this would use OCR or machine learning
  // Here we'll just return a random boolean with a bias
  return Math.random() > 0.7
}

// Function to detect if the image contains faces
function detectFaces(data: Uint8ClampedArray, width: number, height: number): boolean {
  // In a real app, this would use face detection algorithms
  // Here we'll just return a random boolean with a bias
  return Math.random() > 0.6
}

// Function to generate optimization suggestions
function generateOptimizationSuggestions(file: File, width: number, height: number): string[] {
  const suggestions: string[] = []

  // Check file size
  if (file.size > 1024 * 1024) {
    // > 1MB
    suggestions.push("Image is large (> 1MB). Consider further compression.")
  }

  // Check dimensions
  if (width > 2000 || height > 2000) {
    suggestions.push("Image dimensions are very large. Consider resizing for web use.")
  }

  // Check file format
  const format = file.type.split("/")[1]?.toLowerCase()
  if (format === "png") {
    suggestions.push("PNG format detected. Converting to WebP could reduce file size significantly.")
  } else if (format === "jpeg" || format === "jpg") {
    suggestions.push("JPEG format detected. Converting to WebP could improve quality at the same file size.")
  } else if (format === "gif") {
    suggestions.push("GIF format detected. Consider using WebP for better compression of animated images.")
  }

  // Add a random suggestion
  const randomSuggestions = [
    "Consider using progressive loading for better user experience.",
    "Adding proper alt text will improve accessibility.",
    "Using responsive images with srcset can improve performance on different devices.",
    "Consider lazy loading images that are below the fold.",
  ]

  const randomIndex = Math.floor(Math.random() * randomSuggestions.length)
  suggestions.push(randomSuggestions[randomIndex])

  return suggestions
}

// Function to check if the image has an alpha channel
function hasAlphaChannel(data: Uint8ClampedArray): boolean {
  // Sample a subset of pixels to check for transparency
  const sampleSize = Math.min(1000, data.length / 4)
  const step = Math.floor(data.length / 4 / sampleSize)

  for (let i = 3; i < data.length; i += 4 * step) {
    if (data[i] < 255) {
      return true
    }
  }

  return false
}

// Function to get the number of color channels
function getChannelCount(data: Uint8ClampedArray): number {
  // Check if the image has an alpha channel
  if (hasAlphaChannel(data)) {
    return 4 // RGBA
  } else {
    return 3 // RGB
  }
}

