import Image from "next/image"
import Link from "next/link"
import { memo } from "react"

import { cn } from "@/lib/utils"

import ExternalLink from "../ExternalLink"

export const Callout = memo(function Callout({
  className,
  type,
  text,
  linkText,
  linkHref,
  showIcon = true,
}: {
  className?: string
  type: "info" | "error"
  text: string
  linkText?: string
  linkHref?: string
  showIcon?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded-md p-4 h-10 w-full",
        type === "error"
          ? "bg-red-200 text-destructive-foreground"
          : "bg-accent text-accent-foreground",
        className,
      )}
    >
      {showIcon && (
        <Image
          alt="Info"
          src={
            type === "error"
              ? "/assets/icons/info-red.svg"
              : "/assets/icons/info-blue.svg"
          }
          width={16.5}
          height={16.5}
        />
      )}
      <p className={cn("mr-5 text-sm font-medium", showIcon && "ml-2")}>
        {text}
      </p>
      {linkText && (
        <ExternalLink
          href={linkHref ?? "#"}
          className="ml-auto text-sm font-medium shrink-0"
        >
          {linkText}
        </ExternalLink>
      )}
    </div>
  )
})
