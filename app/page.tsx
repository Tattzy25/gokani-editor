"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info, Loader2, Download, Upload, Share2 } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function LabelWithTooltip({ id, label, tooltip }: { id?: string, label: string, tooltip: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-xs text-sm">
          <p>{tooltip}</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ImageUploadInput({ 
  id, 
  value, 
  onChange, 
  label,
  tooltip
}: { 
  id: string, 
  value: string, 
  onChange: (val: string, fileName?: string) => void, 
  label: string,
  tooltip: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [localFileName, setLocalFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string, file.name)
      setLocalFileName(file.name)
    }
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.")
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        handleFile(file)
      } else {
        toast.error("Please upload a valid file (PNG, JPG, JPEG, WEBP)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        handleFile(file)
      } else {
        toast.error("Please upload a valid file (PNG, JPG, JPEG, WEBP)")
      }
    }
  }
  
  const handleClear = () => {
    onChange("", "")
    setLocalFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <LabelWithTooltip id={id} label={label} tooltip={tooltip} />
      
      {value ? (
        <div className="relative rounded-lg border bg-background p-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted/50">
            <img 
              src={value} 
              alt="Preview" 
              className="h-full w-full object-contain" 
            />
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {localFileName || "Image URL"}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
              onClick={handleClear}
            >
              Clear file
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-4 text-center transition-colors hover:bg-muted/50",
            isDragging && "border-primary bg-muted"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG, JPEG or WEBP
            </div>
          </div>
        </div>
      )}
      
      <input
        id={id}
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default function Home() {
  const [numOutputs, setNumOutputs] = useState(1)
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  
  // Share State
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareFile, setShareFile] = useState<File | null>(null)
  const [shareUrl, setShareUrl] = useState("")
  const [isPreparingShare, setIsPreparingShare] = useState(false)

  // Form State
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("dev")
  const [outputFormat, setOutputFormat] = useState("webp")
  const [megapixels, setMegapixels] = useState("1")
  const [outputQuality, setOutputQuality] = useState(80)

  const [image, setImage] = useState("")
  const [imageFileName, setImageFileName] = useState("")
  const [mask, setMask] = useState("")
  const [maskFileName, setMaskFileName] = useState("")

  const [promptStrength, setPromptStrength] = useState(0.8)

  const getDimensions = () => {
    if (aspectRatio === "custom") return { w: width, h: height }
    const [w, h] = aspectRatio.split(":").map(Number)
    // Base scale on 1024px
    return { w: 1024, h: Math.round(1024 * (h / w)) }
  }

  const getAspectRatioStyle = (ratio: string) => {
    if (ratio === "custom") return { aspectRatio: `${width} / ${height}` }
    const [w, h] = ratio.split(":").map(Number)
    return { aspectRatio: `${w} / ${h}` }
  }

  const handleGenerate = async () => {
    if (isLoading) return

    setIsLoading(true)
    setIsGenerated(false)
    setGeneratedImages([])

    try {
      const response = await fetch("https://api.tattty.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          prompt,
          customer_id: "9191615529035",
          version: "4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c",
          source_id: "9000",
          numOutputs: numOutputs.toString(),
          artist_uploads: "",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result?.error || result?.message || "Request failed"
        toast.error(errorMessage)
        return
      }

      const outputs = Array.isArray(result?.urls) ? result.urls : []

      if (outputs.length > 0) {
        setGeneratedImages(outputs)
        setIsGenerated(true)
      } else {
        toast.error(result?.error || result?.message || "No images returned from API")
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const filename = `generated-image-${index + 1}.${outputFormat}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error(error)
    }
  }

  const handleShare = async (url: string, index: number) => {
    const filename = `generated-image-${index + 1}.${outputFormat}`
    setShareUrl(url)
    
    // Check if we can share files
    if (navigator.canShare && navigator.canShare({ files: [new File([], 'test.png')] })) {
      setIsPreparingShare(true)
      toast.info("Preparing image for sharing...")
      
      try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&filename=${filename}`)
        if (response.ok) {
          const blob = await response.blob()
          const file = new File([blob], filename, { type: blob.type })
          setShareFile(file)
          setShareDialogOpen(true)
          setIsPreparingShare(false)
          return
        }
      } catch (error) {
        console.warn("File preparation failed", error)
      }
      setIsPreparingShare(false)
    }

    // Fallback to Link Sharing immediately if file sharing isn't supported or failed
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GoKAnI AI Generation',
          text: 'Check out this image I generated with GoKAnI AI!',
          url: url
        })
        toast.success("Shared link successfully")
        return
      }
    } catch (error) {
      console.warn("Link sharing failed", error)
    }

    // Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(url)
      toast.info("Sharing failed, link copied to clipboard instead!")
    } catch (clipboardError) {
      toast.error("Failed to share. Try downloading instead.")
    }
  }

  const executeShare = async () => {
    if (!shareFile) return
    
    try {
      await navigator.share({
        title: 'GoKAnI AI Generation',
        text: 'Check out this image I generated with GoKAnI AI!',
        files: [shareFile]
      })
      toast.success("Shared image successfully")
      setShareDialogOpen(false)
    } catch (error: any) {
      console.warn("Share execution failed", error)
      
      // If user cancelled, just close dialog
      if (error.name === 'AbortError') {
        setShareDialogOpen(false)
        return
      }

      // Fallback to link sharing
      if (shareUrl) {
        try {
          await navigator.share({
            title: 'GoKAnI AI Generation',
            text: 'Check out this image I generated with GoKAnI AI!',
            url: shareUrl
          })
          setShareDialogOpen(false)
          return
        } catch (e) {
           // ignore
        }
      }
      
      toast.error("Sharing failed. Try downloading instead.")
      setShareDialogOpen(false)
    }
  }

  const handleDownloadAll = async () => {
    toast.info("Starting download of all images...")
    for (let i = 0; i < generatedImages.length; i++) {
      await handleDownload(generatedImages[i], i)
      // Small delay to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const handleShareAll = async () => {
    try {
      await navigator.share({
        title: 'GoKAnI AI Generation',
        text: 'Check out this image I generated with GoKAnI AI!',
        url: generatedImages[0],
      })
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        toast.error("Sharing failed.")
      }
    }
  }

  const { w, h } = getDimensions()
  const slides = generatedImages.map((src) => ({
    src,
    width: w,
    height: h,
  }))

  return (
    <div className="flex flex-col w-full">
      <div className="w-full py-10 px-[5px] space-y-8">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start">
        <div className="grid grid-cols-1 gap-6 items-start">
        {/* Card 1: Prompt & Model Settings */}
        <Card className="h-full pb-[5px]">
          <CardContent className="space-y-4 flex-1 pt-[5px]">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <LabelWithTooltip 
                  id="prompt" 
                  label="Prompt" 
                  tooltip="Prompt for generated image. If you include the `trigger_word` used in the training process you are more likely to activate the trained object, style, or concept in the resulting image." 
                />
              </div>
              <Textarea 
                id="prompt" 
                placeholder="Enter your prompt here..." 
                className="h-24" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <div aria-hidden="true" style={{ height: "20px" }} />

            <div className="space-y-2">
              <LabelWithTooltip
                label={`Num Outputs (${numOutputs})`}
                tooltip="Number of outputs to generate"
              />
              <Slider
                value={[numOutputs]}
                onValueChange={(vals: number[]) => setNumOutputs(vals[0])}
                min={1}
                max={4}
                step={1}
              />
            </div>

            <div aria-hidden="true" style={{ height: "20px" }} />

            <ImageUploadInput
              id="image_url"
              label="Image 1 (Img2Img)"
              tooltip="Input image for image to image or inpainting mode. If provided, aspect_ratio, width, and height inputs are ignored."
              value={image}
              onChange={(val, name) => {
                setImage(val)
                if (name) setImageFileName(name)
              }}
            />

            <ImageUploadInput
              id="image_url_2"
              label="Image 2 (Optional)"
              tooltip="Optional second input image."
              value={mask}
              onChange={(val, name) => {
                setMask(val)
                if (name) setMaskFileName(name)
              }}
            />

          </CardContent>
          <CardFooter className="justify-center">
            <Button
              className="h-auto p-[3px]"
              style={{ fontFamily: "var(--font-rock-salt)", fontSize: "24px" }}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              Generate Now
            </Button>
          </CardFooter>
        </Card>

        </div>

        {!isLoading && generatedImages.length > 0 && (
          <div className="flex md:hidden justify-center gap-3 py-[10px] -my-6">
            <Button onClick={handleDownloadAll} variant="secondary" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleShareAll} variant="secondary" className="rounded-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        )}

        {/* Card 4: Image Uploads */}
        <Card className="h-full py-2">
          <CardContent className="flex-1 px-2">
            {!isLoading && generatedImages.length > 0 && (
              <div className="hidden md:flex justify-center gap-3 pb-[10px]">
                <Button onClick={handleDownloadAll} variant="secondary" className="rounded-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleShareAll} variant="secondary" className="rounded-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            )}
            <div className="flex flex-col items-center pb-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Creating your masterpiece...</p>
                </div>
              ) : (
                <>
                  <div className={cn("grid gap-2 w-full", generatedImages.length === 1 ? "grid-cols-1 max-w-[420px] mx-auto" : "grid-cols-2")}>
                    {generatedImages.map((src, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg overflow-hidden shadow-sm cursor-pointer"
                        style={getAspectRatioStyle(aspectRatio)}
                        onClick={() => {
                          setLightboxIndex(i)
                          setLightboxOpen(true)
                        }}
                      >
                        <img
                          src={src}
                          alt={`Generated image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ready to Share</DialogTitle>
            <DialogDescription>
              Your image has been prepared. Click the button below to share it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={executeShare}>Share Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}