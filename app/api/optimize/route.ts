import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"
import { writeFile } from "fs/promises"

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const quality = Number.parseInt(formData.get("quality") as string) || 80
    const convertToWebP = formData.get("convertToWebP") === "true"
    const resizeImages = formData.get("resizeImages") === "true"
    const maxWidth = Number.parseInt(formData.get("maxWidth") as string) || 1920
    const maxHeight = Number.parseInt(formData.get("maxHeight") as string) || 1080
    const preserveMetadata = formData.get("preserveMetadata") === "true"
    const enhanceImage = formData.get("enhanceImage") === "true"
    const smartCrop = formData.get("smartCrop") === "true"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const originalSize = buffer.length

        // Create a unique filename
        const fileId = uuidv4()
        const originalExt = path.extname(file.name)
        const outputExt = convertToWebP ? ".webp" : originalExt
        const outputFilename = `${path.basename(file.name, originalExt)}-${fileId}${outputExt}`
        const outputPath = path.join("uploads", outputFilename)
        const publicPath = `/uploads/${outputFilename}`

        // Process the image with Sharp
        let sharpInstance = sharp(buffer)

        // Get image metadata
        const metadata = await sharpInstance.metadata()

        // Apply smart cropping if enabled and the image is larger than target dimensions
        if (smartCrop && resizeImages && metadata.width && metadata.height) {
          if (metadata.width > maxWidth || metadata.height > maxHeight) {
            sharpInstance = sharpInstance.resize({
              width: maxWidth,
              height: maxHeight,
              fit: "cover",
              position: "attention", // Smart cropping based on image content
            })
          }
        }
        // Regular resize if enabled
        else if (resizeImages && metadata.width && metadata.height) {
          if (metadata.width > maxWidth || metadata.height > maxHeight) {
            sharpInstance = sharpInstance.resize({
              width: maxWidth,
              height: maxHeight,
              fit: "inside",
              withoutEnlargement: true,
            })
          }
        }

        // Apply image enhancement if enabled
        if (enhanceImage) {
          sharpInstance = sharpInstance
            .normalize() // Normalize the image (improve contrast)
            .modulate({ brightness: 1.05, saturation: 1.1 }) // Slightly increase brightness and saturation
            .sharpen({ sigma: 0.8 }) // Sharpen the image
        }

        // Set output format and quality
        if (convertToWebP) {
          sharpInstance = sharpInstance.webp({
            quality,
            lossless: quality >= 95,
          })
        } else {
          // Handle different formats with appropriate options
          if (metadata.format === "jpeg" || metadata.format === "jpg") {
            sharpInstance = sharpInstance.jpeg({ quality })
          } else if (metadata.format === "png") {
            sharpInstance = sharpInstance.png({ quality: Math.floor(quality / 10) })
          } else if (metadata.format === "gif") {
            sharpInstance = sharpInstance.gif()
          }
        }

        // Process the image and get the output buffer
        const outputBuffer = await sharpInstance.toBuffer()
        const newSize = outputBuffer.length

        // Save the processed image
        await writeFile(path.join(process.cwd(), "public", outputPath), outputBuffer)

        // Calculate reduction percentage
        const reduction = Math.round(((originalSize - newSize) / originalSize) * 100)

        return {
          name: outputFilename,
          originalName: file.name,
          originalSize,
          newSize,
          reduction,
          url: publicPath,
          width: metadata.width,
          height: metadata.height,
          format: convertToWebP ? "webp" : metadata.format,
        }
      }),
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error processing images:", error)
    return NextResponse.json({ error: "Failed to process images" }, { status: 500 })
  }
}

