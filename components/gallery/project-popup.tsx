import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Share2, FileText, RefreshCw, Send, Trash2 } from "lucide-react"

export interface Project {
  id: number
  src: string
  alt: string
  title: string
  date: string
  prompt: string
  model: string
}

interface ProjectPopupProps {
  project: Project | null
  onClose: () => void
}

export function ProjectPopup({ project, onClose }: ProjectPopupProps) {
  if (!project) return null

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] max-h-[90vh] w-[80vw] h-[90vh] bg-zinc-900 border-0 text-white p-0 overflow-hidden [&>button]:hidden">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 text-white/60 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
          aria-label="Close dialog"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row h-full w-full">
          {/* Image Section */}
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat min-h-[300px] md:min-h-0" 
            style={{ backgroundImage: `url(${project.src})` }}
            role="img"
            aria-label={project.alt}
          />
          
          {/* Details Section */}
          <div className="w-full md:w-96 bg-zinc-900 p-8 flex flex-col space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-sm text-white/60">{project.date}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-white/80">Details</h3>
              <div className="space-y-3 text-sm">
                <p className="text-white/80">
                  <strong className="text-white">Prompt:</strong>{" "}
                  {project.prompt}
                </p>
                <p className="text-white/80 flex items-center gap-2">
                  <strong className="text-white">Model:</strong>
                  <Badge variant="secondary" className="text-xs">
                    {project.model}
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex-grow" />

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5 text-white" 
                onClick={() => console.log("Post to community")}
              >
                <Share2 className="w-4 h-4 mr-3" />
                Post to community
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5 text-white" 
                onClick={() => console.log("View prompt")}
              >
                <FileText className="w-4 h-4 mr-3" />
                View prompt
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5 text-white" 
                onClick={() => console.log("Regenerate")}
              >
                <RefreshCw className="w-4 h-4 mr-3" />
                Regenerate
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/10 hover:bg-white/5 text-white" 
                onClick={() => console.log("Send to model")}
              >
                <Send className="w-4 h-4 mr-3" />
                Send to model
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0" 
                onClick={() => console.log("Delete")}
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}