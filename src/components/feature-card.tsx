import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-8 hover:border-[#fb5028]/50 transition-all group">
      <div className="mb-5 p-3 inline-block bg-gray-100 rounded-lg group-hover:bg-[#fb5028]/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
