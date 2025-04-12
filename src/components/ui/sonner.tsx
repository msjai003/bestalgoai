
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
            "group toast group-[.toaster]:bg-cyan group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-white/20 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-white",
          success: "group-[.toast]:bg-cyan group-[.toast]:text-black group-[.toast]:border-white/20",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-cyan group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-white group-[.toast]:border-2 group-[.toast]:border-white/30 group-[.toast]:rounded-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
