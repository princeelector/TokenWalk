import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "./safeUtils"

export const signHookupProposalModule = async (
	safeAddress: string,
	proposalModule: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> =>
	createSafeSignature(
		safeAddress,
		safeAddress,
		GnosisSafeL2.abi,
		"enableModule",
		[proposalModule],
		signer
	)

export const executeHookupProposalModule = async (
	safeAddress: string,
	proposalModule: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		safeAddress,
		GnosisSafeL2.abi,
		"enableModule",
		[proposalModule],
		signer,
		signatures
	)
