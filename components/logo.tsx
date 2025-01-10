import { Building2 } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  showIcon?: boolean
}

export function Logo({ showIcon = true }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      {showIcon && (
        <Building2 className="h-6 w-6 text-primary" />
      )}
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">SH Distribution</span>
        <span className="text-xs text-muted-foreground">Supply Chain Solutions</span>
      </div>
    </Link>
  )
} 