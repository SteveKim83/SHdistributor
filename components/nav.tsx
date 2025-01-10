"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "../components/logo"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function Nav({ className, ...props }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render navigation items until client-side
  if (!mounted) {
    return (
      <nav
        className={cn(
          "flex items-center justify-between bg-background border-b px-6 h-16",
          className
        )}
        {...props}
      >
        <Logo />
        <div className="md:hidden">
          <Menu className="h-6 w-6" />
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={cn(
        "flex items-center justify-between bg-background border-b px-6 h-16",
        className
      )}
      {...props}
    >
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {isSignedIn && (
          <>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/catalogue"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Catalogue
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-background border-b md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {isSignedIn ? (
                <>
                  <Link 
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home 
                  </Link>
                  <Link
                    href="/catalogue"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Catalogue
                  </Link>
                </>
              ) : null}
              {isSignedIn ? (
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button 
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  )
} 