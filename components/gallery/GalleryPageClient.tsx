"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ProjectPopup, Project } from "@/components/gallery/project-popup"

interface GalleryPageClientProps {
  projects: Project[];
}

export default function GalleryPageClient({ projects }: GalleryPageClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-zinc-900 border-white/10 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-video bg-zinc-800">
                  <img src={project.src} alt={project.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm text-white/60">{project.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <ProjectPopup project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}