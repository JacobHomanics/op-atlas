"use client"

import Image from "next/image"
import ExternalLink from "../ExternalLink"
import { VideoCallout } from "@/components/missions/Callouts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ApplicationStatusCard } from "@/components/missions/ApplicationStatusCard"
import { EnrolledProjectsCard } from "@/components/missions/EnrolledProjectsCard"
import React from "react"
import { Eligibility } from "@/components/missions/details/Eligibility"
import { FundingRound } from "@/lib/mocks"
import { format } from "date-fns"
import Header from "./details/Header"
import Rewards from "./details/Rewards"

export default function Mission({
  round,
  applications,
  missionApplications,
  projects,
}: {
  round: FundingRound
  applications: { icon: string | null; name: string }[]
  missionApplications: { icon: string | null; opReward: number }[]
  projects: any[]
}) {
  const {
    name,
    details,
    iconUrl,
    applyBy,
    startsAt,
    endsAt,
    eligibility,
    rewards,
  } = round

  return (
    <div className="mt-16 bg-background flex flex-col px-16 w-full max-w-5xl rounded-3xl z-10">
      <div className="mt-1 flex flex-1 gap-x-10">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col flex-1 gap-y-12">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    Retro Funding Missions
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col">
              <Header
                name={name}
                description={details}
                iconUrl={iconUrl}
                startsAt={startsAt}
                endsAt={endsAt}
              />
              <Eligibility eligibility={eligibility} />
              <Rewards rewards={rewards} />
              {name === "Dev Tooling" ? (
                <div className="">
                  <div className="bg-secondary h-[2px] mt-5 mb-5" />
                  <div>
                    <span className="font-bold pr-1">Learn More</span>
                    <span>
                      in the{" "}
                      <ExternalLink
                        href="https://gov.optimism.io/t/season-7-retro-funding-missions/9295"
                        className="underline"
                      >
                        Collective Governance Forum: Retro Funding Mission: Dev
                        Tooling
                      </ExternalLink>
                    </span>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-6 ml-auto w-[290px]">
          <ApplicationStatusCard
            applyByDate={applyBy && format(applyBy, "MMM d")}
            startDate={format(startsAt, "MMM d")}
            userProjectCount={projects.length}
            userAppliedProjects={applications}
            pageName={round.pageName}
          />
          {missionApplications.length > 0 ? (
            <EnrolledProjectsCard projects={missionApplications} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
