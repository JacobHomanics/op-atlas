"use client"

import { useState } from "react"

import {
  ApplicationWithDetails,
  CategoryWithImpact,
  ProjectWithDetails,
} from "@/lib/types"

import { ApplicationSubmitted } from "../ApplicationSubmitted"
import { FundingApplication } from "./FundingApplication"

export const ApplicationFlow = ({
  className,
  projects,
  applications,
  categories,
}: {
  className?: string
  projects?: ProjectWithDetails[]
  applications: ApplicationWithDetails[]
  categories: CategoryWithImpact[]
}) => {
  const [submittedApp, setSubmittedApp] =
    useState<ApplicationWithDetails | null>(null)

  return submittedApp ? (
    <ApplicationSubmitted className={className} application={submittedApp} />
  ) : (
    <FundingApplication
      className={className}
      projects={projects}
      applications={applications}
      categories={categories}
      onApplied={setSubmittedApp}
    />
  )
}
