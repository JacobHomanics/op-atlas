"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useCallback, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { isAddress } from "viem"
import { z } from "zod"

import { Badge } from "@/components/common/Badge"
import Input from "@/components/common/Input"
import { DialogProps } from "@/components/dialogs/types"
import ExternalLink from "@/components/ExternalLink"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { verifyUserAddress } from "@/lib/actions/addresses"
import { useAppDialogs } from "@/providers/DialogProvider"

const formSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
})

export function AddGrantDeliveryAddressDialog({
  open,
  onOpenChange,
}: DialogProps<object>) {
  const { data: session } = useSession()
  const { address } = useAppDialogs()

  const [isPending, startTransition] = useTransition()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signature: "",
    },
  })

  const messageToSign = `I verify that I am ${session?.user.farcasterId} on Farcaster and I'm an optimist.`

  const handleClose = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen)
      if (!isOpen) {
        reset()
      }
    },
    [onOpenChange, reset],
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(messageToSign)
    toast.success("Copied to clipboard")
  }, [messageToSign])

  const onSubmit = useCallback(
    async (data: { signature: string }) => {
      console.log(">>> onSubmit", address, data.signature)
      if (!address) return

      startTransition(async () => {
        try {
          if (!isAddress(address)) throw new Error("Invalid address")
          if (!data.signature.startsWith("0x"))
            throw new Error("Invalid signature")

          const result = await verifyUserAddress(
            address,
            data.signature as `0x${string}`,
          )
          if (result.error) throw new Error(result.error)

          toast.success("Address verified")
          handleClose(false)
        } catch (err) {
          toast.error(
            err instanceof Error
              ? err.message
              : "An error occurred, please try again",
          )
        }
      })
    },
    [address, handleClose],
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col items-center gap-y-6 sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="flex flex-col items-center text-center gap-4">
            <h3>Copy and sign the message below</h3>
            <p className="text-secondary-foreground">
              You can{" "}
              <ExternalLink
                href="https://optimistic.etherscan.io/verifiedSignatures"
                className="underline"
              >
                use Etherscan
              </ExternalLink>{" "}
              to generate a signature. Then return here with your signature hash
              and continue to the next step.
            </p>
          </div>

          <div className="flex flex-col self-stretch gap-1">
            <div className="text-sm font-medium">Chain</div>
            <Input
              className="text-secondary-foreground text-sm"
              readOnly
              value="OP Mainnet"
              leftIcon="/assets/chain-logos/optimism.svg"
            />
          </div>

          <div className="flex flex-col self-stretch gap-1">
            <div className="text-sm font-medium">Message to sign</div>
            <Textarea disabled value={messageToSign} className="resize-none" />
            <Button type="button" onClick={handleCopy} variant="secondary">
              Copy
            </Button>
          </div>

          <div className="flex flex-col self-stretch gap-1">
            <div>Signature hash</div>
            <Controller
              control={control}
              name="signature"
              render={({ field }) => (
                <Textarea {...field} className="resize-none" />
              )}
            />
            {errors.signature && (
              <p className="text-destructive text-sm font-medium">
                {errors.signature.message}
              </p>
            )}
          </div>

          <Button
            className="self-stretch"
            variant="destructive"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
