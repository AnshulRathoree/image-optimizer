"use client"

import { useState } from "react"
import { Share2, Users, Copy, Check, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface CollaborationPanelProps {
  files: File[]
  optimizedFiles: any[]
}

export function CollaborationPanel({ files, optimizedFiles }: CollaborationPanelProps) {
  const [copied, setCopied] = useState(false)
  const [comment, setComment] = useState("")
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "You", email: "you@example.com", avatar: "/placeholder.svg" },
    { id: 2, name: "Alex Smith", email: "alex@example.com", avatar: "/placeholder.svg" },
  ])
  const { toast } = useToast()

  const copyShareLink = () => {
    // In a real app, this would generate and copy a unique sharing link
    navigator.clipboard.writeText("https://image-optimizer.vercel.app/shared/abc123")
    setCopied(true)

    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const inviteCollaborator = (email: string) => {
    // In a real app, this would send an invitation email
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`,
    })
  }

  const addComment = () => {
    if (!comment.trim()) return

    // In a real app, this would add the comment to a database
    toast({
      title: "Comment added",
      description: "Your comment has been added to the project",
    })

    setComment("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Collaboration</h3>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Share Project</h4>
        <div className="flex gap-2">
          <Input value="https://image-optimizer.vercel.app/shared/abc123" readOnly className="text-xs" />
          <Button size="sm" variant="outline" onClick={copyShareLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Anyone with this link can view this optimization project</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Collaborators</h4>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Users className="h-3.5 w-3.5 mr-1" />
            Manage
          </Button>
        </div>

        <div className="space-y-2">
          {collaborators.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {user.id !== 1 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <Input placeholder="Email address" className="text-xs" />
          <Button size="sm" variant="outline" onClick={() => inviteCollaborator("colleague@example.com")}>
            Invite
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Comments</h4>
        <Textarea
          placeholder="Add a comment about this optimization project..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <Button size="sm" className="w-full" onClick={addComment}>
          <Send className="h-3.5 w-3.5 mr-2" />
          Add Comment
        </Button>
      </div>

      <div className="pt-2">
        <p className="text-xs text-center text-muted-foreground">
          {files.length > 0
            ? `Collaborating on ${files.length} images${optimizedFiles.length > 0 ? ` with ${optimizedFiles.length} optimized` : ""}`
            : "Add images to start collaborating"}
        </p>
      </div>
    </div>
  )
}

