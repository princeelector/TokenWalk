import {JsonRpcSigner} from "@ethersproject/providers"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
import TWDomainToken from "../../abis/TWDomainToken.json"
const {REACT_APP_DOMAIN_ADDRESS} = process.env

const transferNFT = async (
	from: string,
	nftID: number,
	to: string,
	signer: JsonRpcSigner,
	customDomain?: string
): Promise<void> => {
	const nft = new Contract(
		customDomain ?? REACT_APP_DOMAIN_ADDRESS!,
		customDomain ? MultiArtToken.abi : TWDomainToken.abi,
		signer
	)
	const tx = await nft.transferFrom(from, to, nftID)
	await tx.wait()
}

export default transferNFT
