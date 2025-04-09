
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
            "group toast group-[.toaster]:bg-cyan group-[.toaster]:text-white group-[.toaster]:border-cyan/80 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/90",
          success: "group-[.toast]:bg-cyan group-[.toast]:text-white group-[.toast]:border-cyan/80",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-cyan",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-white/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
