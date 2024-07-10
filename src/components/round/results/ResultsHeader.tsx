"use client"

import Image from "next/image"
import { useSession } from "next-auth/react"
import React from "react"

import { Account } from "@/components/common/Account"
import ExternalLink from "@/components/ExternalLink"
import { Button } from "@/components/ui/button"

const ResultsHeader = () => {
  const { data: session, status } = useSession()
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-full">
          <h1 className="text-4xl font-semibold text-text-default">
            Projects & Rewards
          </h1>
          <p className="mt-2 text-base font-normal text-text-secondary">
            Explore the projects that have applied for Retro Funding
          </p>
        </div>
        <Button variant="secondary">
          <ExternalLink
            className="flex items-center gap-2.5 w-full h-full py-2 px-3 text-sm font-medium"
            href="https://docs.opensource.observer/docs/contribute/project-data"
          >
            Round 4 analytics
            <Image
              src="/assets/icons/arrow-up-right.svg"
              height={8}
              width={8}
              alt="Arrow up right"
            />
          </ExternalLink>
        </Button>
      </div>
      {status === "unauthenticated" && !session && (
        <div className="hidden sm:flex items-center mt-6">
          <Account />
        </div>
      )}
    </div>
  )
}

export default ResultsHeader
