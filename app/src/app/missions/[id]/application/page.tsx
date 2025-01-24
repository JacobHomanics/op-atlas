import React from "react"
import { FUNDING_ROUNDS, MODERN_FUNDING_ROUNDS } from "@/lib/mocks"
import { notFound } from "next/navigation"
import { getApplications, getProjects } from "@/lib/actions/projects"
import { auth } from "@/auth"
import { MissionApplication } from "@/components/missions/application/MissionApplication"

export default async function MissionApplicationPage({
  params,
}: {
  params: { id: string }
}) {
  const round = MODERN_FUNDING_ROUNDS.find(
    (page) => page.pageName === params.id,
  )
  if (round === undefined) notFound()

  const session = await auth()

  const [projects, applications] = session
    ? await Promise.all([
        getProjects(session.user.id),
        getApplications(session.user.id),
      ])
    : [[], [], []]

  return (
    <main className="flex flex-col flex-1 h-full items-center pb-12 relative">
      <MissionApplication
        projects={projects}
        // round={round}
        applications={applications}
      />
    </main>
  )
}
