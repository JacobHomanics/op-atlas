import { ImageResponse } from "next/og"

import { getReward } from "@/db/rewards"
import { formatNumber } from "@/lib/utils"
import { loadFont, loadImage } from "@/lib/utils/og"

export async function GET(
  request: Request,
  { params }: { params: { rewardId: string; roundId: string } },
) {
  const claim = await getReward({ id: params.rewardId })
  const projectName = claim?.project.name
  const reward = formatNumber(claim?.amount.toFixed(0) || 0, 0)
  const thumbnailUrl = claim?.project.thumbnailUrl

  const soraRegular = await loadFont("Sora-Regular.otf")
  const soraSemiBold = await loadFont("Sora-SemiBold.otf")
  const soraBold = await loadFont("Sora-Bold.otf")
  const bgImage = await loadImage(`round-${params.roundId}-reward.png`)

  const gradient =
    params.roundId === "6"
      ? "linear-gradient(90deg, #39D551 0%, #3374DB 100%)"
      : "linear-gradient(90deg, #FE1138 0%, #FE4FE2 100%)"

  const textColor = params.roundId === "6" ? "#3374DB" : "#FE1138"

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          display: "flex",
          fontFamily: '"Sora"',
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        <img
          src={bgImage}
          style={{ position: "absolute" }}
          tw="absolute"
          alt="optimism red background"
        />

        <div tw="flex flex-row justify-between px-[55px] mt-[340px]">
          <img
            src={thumbnailUrl!}
            tw="h-[350px] w-[350px] mr-[40px] rounded-[35px]"
            alt="project thumbnail"
          />
          <div tw="flex flex-col self-end">
            <h3 tw="text-5xl m-0" style={{ color: textColor }}>
              {projectName} received
            </h3>
            <h4
              tw="text-[120px] m-0"
              style={{
                backgroundImage: gradient,
                backgroundClip: "text",
                // @ts-ignore TS doesn't know about webkit prefixes
                "-webkit-background-clip": "text",
                color: "transparent",
              }}
            >
              {reward} OP
            </h4>
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        {
          name: "Sora",
          data: soraRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Sora",
          data: soraSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Sora",
          data: soraBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  )
}
