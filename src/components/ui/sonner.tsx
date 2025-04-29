
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gray-800 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-gray-700 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-white/90",
          success: "group-[.toast]:bg-green-900/90 group-[.toast]:text-white group-[.toast]:border-green-800",
          error: "group-[.toast]:bg-red-900/90 group-[.toast]:text-white group-[.toast]:border-red-800",
          actionButton:
            "group-[.toast]:bg-cyan group-[.toast]:text-charcoalPrimary group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-gray-700 group-[.toast]:rounded-md",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
