import { redirect } from "next/navigation"

import { auth } from "@/auth"
import ProjectDetailsForm from "@/components/projects/details/ProjectDetailsForm"
import { getAdminOrganizations } from "@/db/organizations"
import { getProject } from "@/db/projects"
import { isUserMember } from "@/lib/actions/utils"

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {
  const session = await auth()

  if (!session?.user.id) {
    redirect("/dashboard")
  }

  //TODO: Implement this commented out code client-side
  // if (!project || !isUserMember(project, session?.user.id)) {
  //   redirect("/dashboard")
  // }

  return <ProjectDetailsForm projectId={params.projectId} />
}
