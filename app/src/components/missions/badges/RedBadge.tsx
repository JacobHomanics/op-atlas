import { Badge } from "@/components/ui/badge"
import { XIcon } from "lucide-react"

export const RedBadge = ({
  showIcon = false,
  text = "",
}: {
  showIcon?: boolean
  text?: string
}) => {
  return (
    <Badge
      className={`text-xs font-medium text-rose-800 border-0 bg-rose-200`}
      variant={"outline"}
    >
      {showIcon && <XIcon width={12} height={12} />}
      {text}
    </Badge>
  )
}
