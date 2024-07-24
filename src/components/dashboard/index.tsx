"use client"

import { Application } from "@prisma/client"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { noRewards, unclaimedRewards } from "@/lib/rewards"
import { ProjectWithDetails, UserWithAddresses } from "@/lib/types"
import {
  cn,
  hasShownNoRewardsDialog,
  profileProgress,
  saveHasShownNoRewardsDialog,
} from "@/lib/utils"
import { useAnalytics } from "@/providers/AnalyticsProvider"

import ExternalLink from "../ExternalLink"
import CreateOrganizationDialog from "../organizations/CreateOrganizationDialog"
import OrganizationOnboardingDialog from "../organizations/OrganizationOnboardingDialog"
import { CompleteProfileCallout } from "../profile/CompleteProfileCallout"
import AddFirstProject from "./AddFirstProject"
import ApplicationBanner from "./ApplicationBanner"
import { SurveyCallout } from "./Callouts"
import NoRewardsDialog from "./dialogs/NoRewardsDialog"
import UnclaimedRewardsDialog from "./dialogs/UnclaimedRewardsDialog"
import JoinProjectDialog from "./JoinProjectDialog"
import MakeFirstOrganization from "./MakeFirstOrganization"
import ProfileDetailCard from "./ProfileDetailCard"
import { ProjectRewardRow } from "./ProjectRewardRow"
import UserOrganizationTitleRow from "./UserOrganizationTitleRow"
import UserProjectCard from "./UserProjectCard"

const SHOW_APPLICATIONS = false

const Dashboard = ({
  className,
  user,
  projects,
  applications,
}: {
  className?: string
  user: UserWithAddresses
  projects: ProjectWithDetails[]
  applications: Application[]
}) => {
  const [joinProjectDialogOpen, setJoinProjectDialogOpen] = useState(false)
  const [showNoRewardsDialog, setShowNoRewardsDialog] = useState(false)
  const [showUnclaimedRewardsDialog, setShowUnclaimedRewardsDialog] =
    useState(false)

  const [loadingNewProject, setLoadingNewProject] = useState(false)
  const [showOnBoarding, setShowOnBoarding] = useState(false)
  const [showCreateOrganizationDialog, setShowCreateOrganizationDialog] =
    useState(false)

  const { track } = useAnalytics()

  const profileInitiallyComplete = useRef(profileProgress(user) === 100)

  useEffect(() => {
    // User has submitted at least one application but didn't receive any rewards
    if (
      !hasShownNoRewardsDialog() &&
      projects.find((project) => project.applications.length > 1) &&
      noRewards(projects)
    ) {
      saveHasShownNoRewardsDialog()
      setShowNoRewardsDialog(true)
      return
    }

    if (projects.find((project) => unclaimedRewards(project).length)) {
      setShowUnclaimedRewardsDialog(true)
    }
  }, [projects])

  // TODO: hide rewards section if all rewards are claimed
  const showRewardsSection = Boolean(
    projects.find((project) => project.applications.length),
  )

  return (
    <div className={cn("flex flex-col gap-y-6 mt-6", className)}>
      <SurveyCallout projectId={projects[0]?.id} />
      {showNoRewardsDialog && (
        <NoRewardsDialog open onOpenChange={setShowNoRewardsDialog} />
      )}
      {showUnclaimedRewardsDialog && (
        <UnclaimedRewardsDialog
          open
          onOpenChange={setShowUnclaimedRewardsDialog}
          projects={projects}
        />
      )}

      {showOnBoarding && (
        <OrganizationOnboardingDialog
          open
          onOpenChange={setShowOnBoarding}
          onConfirm={() => {
            setShowCreateOrganizationDialog(true)
            setShowOnBoarding(false)
          }}
        />
      )}
      {showCreateOrganizationDialog && (
        <CreateOrganizationDialog
          open
          onOpenChange={setShowCreateOrganizationDialog}
        />
      )}
      <div className="card flex flex-col w-full gap-y-12">
        {joinProjectDialogOpen && (
          <JoinProjectDialog
            open
            onOpenChange={(open) => setJoinProjectDialogOpen(open)}
          />
        )}
        <ProfileDetailCard user={user} />
        {!profileInitiallyComplete.current && (
          <CompleteProfileCallout user={user} />
        )}

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3>Your Projects</h3>
            <Link
              href="/projects/new"
              onClick={() => {
                track("Add new project clicked")
                setLoadingNewProject(true)
              }}
            >
              <Button
                isLoading={loadingNewProject}
                variant={projects.length === 0 ? "destructive" : "secondary"}
              >
                Add a project
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <>
              {projects.map((project) => (
                <UserProjectCard key={project.id} project={project} />
              ))}
            </>
          ) : (
            <Link href="/projects/new">
              <AddFirstProject />
            </Link>
          )}
        </div>

        {showRewardsSection && (
          <div className="flex flex-col gap-6">
            <h3>Your Retro Funding Round 4 rewards</h3>
            {projects.map((project) => (
              <ProjectRewardRow key={project.id} project={project} />
            ))}
          </div>
        )}

        <MakeFirstOrganization onClick={() => setShowOnBoarding(true)} />
        <div className="flex flex-col gap-6">
          <UserOrganizationTitleRow />
          <Link href="/projects/new">
            <AddFirstProject />
          </Link>
        </div>

        {SHOW_APPLICATIONS && (
          <div className="flex flex-col gap-y-6">
            <h3>Your Retro Funding applications</h3>
            {/* canApply is false now that applications are closed */}
            <ApplicationBanner application={applications[0]} canApply={false} />

            <ExternalLink
              href="https://gov.optimism.io/t/retro-funding-4-onchain-builders-round-details/7988"
              className="flex items-center gap-x-2 no-underline text-secondary-foreground"
            >
              <p className="text-sm font-medium">
                Learn more about Retro Funding Round 4
              </p>
              <ArrowUpRight size={16} />
            </ExternalLink>
          </div>
        )}

        {true && (
          <Button
            variant="ghost"
            onClick={() => setJoinProjectDialogOpen(true)}
            className="flex items-center justify-center gap-x-2 no-underline text-secondary-foreground"
          >
            <p className="text-sm font-medium">
              I’m looking to join an existing project or organization
            </p>
            <Image
              src="/assets/icons/arrow-left.svg"
              className="h-3"
              height={12}
              width={12}
              alt="left"
            />
          </Button>
        )}
      </div>
    </div>
  )
}

export default Dashboard
