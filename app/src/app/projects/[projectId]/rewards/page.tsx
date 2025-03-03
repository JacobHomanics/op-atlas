import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { RewardsSection } from "@/components/projects/rewards/RewardsSection"
import { getProject } from "@/db/projects"
import { isUserMember } from "@/lib/actions/utils"

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {
  const session = await auth()
  if (!session?.user.id) {
    redirect("/login")
  }

  const project = await getProject({ id: params.projectId })

  if (!project || !(await isUserMember(project, session?.user.id))) {
    redirect("/dashboard")
  }

  return <RewardsSection project={project} />
}
