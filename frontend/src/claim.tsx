import { Button, Card, CardHeader, Image } from '@nextui-org/react'
import { getAccount, requestCreateEvent } from '@puzzlehq/sdk'
import { EventType } from "@puzzlehq/types"

export const Claim = () => {
    const params = new URLSearchParams(window.location.search)
    const amount = `${params.get("amount")}u128`;
    const nonce = `${params.get("nonce")}u128`;
    const signature = `${params.get("signature")}`

    const submit = async () => {
        const { account } = await getAccount();

        const a = await requestCreateEvent({
            address: account?.address as string,
            type: EventType.Execute,
            programId: "aleo_casino_v001.aleo",
            functionId: "mint",
            fee: 3,
            inputs: [amount, nonce, signature, account?.address as string]
        })

        console.log(a)
    }

    return (
        <div>
            <Card className="col-span-12 sm:col-span-4 h-[300px]">
                <Button onClick={submit} color="primary" variant="shadow">Claim {Number(params.get("amount")) / 10 ** 6} tokens</Button>
            </Card>
        </div>
    )
}
