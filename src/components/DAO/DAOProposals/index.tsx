import React, {useContext, FunctionComponent, useState} from "react"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import EthersContext from "../../../context/EthersContext"
import {ProposalsTypeNames, Proposal, isGnosisProposal} from "../../../types/proposal"
import "./styles.scss"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import {capitalize} from "../../../utlls"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import SearchIcon from "../../../icons/SearchIcon"
import addSafeProposalSignature from "../../../api/firebase/proposal/addSafeProposalSignature"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeApproveNFTForZoraAuction,
	signApproveNFTForZoraAuction
} from "../../../api/ethers/functions/zoraAuction/approveNFTForZoraAuction"
import {
	executeCreateZoraAuction,
	signCreateZoraAuction
} from "../../../api/ethers/functions/zoraAuction/createZoraAuction"
import {
	executeApproveZoraAuction,
	signApproveZoraAuction
} from "../../../api/ethers/functions/zoraAuction/approveZoraAuction"
import {
	executeCancelZoraAuction,
	signCancelZoraAuction
} from "../../../api/ethers/functions/zoraAuction/cancelZoraAuction"
import {
	executeAddOwner,
	executeRemoveOwner,
	signAddOwner,
	signRemoveOwner
} from "../../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import {AuthContext} from "../../../context/AuthContext"
import updateDAOUser from "../../../api/firebase/DAO/updateDaoUser"

const DAOProposalCard: FunctionComponent<{
	refetch: () => void
	gnosisVotingThreshold: number
	proposal: Proposal & {proposalId: string}
	isMember: boolean
	isAdmin: boolean
	daoAddress?: string
}> = ({gnosisVotingThreshold, proposal, isMember, daoAddress, isAdmin, refetch}) => {
	const [processing, setProcessing] = useState(false)
	const {provider, signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)

	const handleVote = async (yes: boolean) => {
		if (!(provider && signer && daoAddress)) return
		setProcessing(true)
		try {
			console.log("TODO")
			// await voteForERC20DAOProposal(daoAddress, proposal.id!, yes, provider, signer)
			refetch()
			toastSuccess("Vote successful!")
		} catch (e) {
			console.error(e)
			toastError("Failed to vote")
		}
		setProcessing(false)
	}

	const startGracePeriod = async () => {
		if (!(provider && signer && daoAddress)) return
		setProcessing(true)
		try {
			console.log("TODO")
			// if (["changeRole", "joinHouse"].includes(proposal.type)) {
			// 	await startERC20DAORoleChangeGracePeriod(daoAddress, proposal.id!, provider, signer)
			// } else if (proposal.type === "requestFunding") {
			// 	await startERC20DAOFundingGracePeriod(daoAddress, proposal.id!, provider, signer)
			// }
			refetch()
			toastSuccess("Grace period started")
		} catch (e) {
			console.error(e)
			toastError("Failed to start grace period")
		}
		setProcessing(false)
	}

	const execute = async () => {
		if (!(provider && signer && daoAddress)) return
		setProcessing(true)
		try {
			console.log("TODO")
			// if (proposal.type === "changeRole") {
			// 	await executeERC20DAORoleChange(daoAddress, proposal.id!, provider, signer)
			// 	await updateDAOUser(proposal.gnosisAddress, proposal.recipientAddress!)
			// } else if (proposal.type === "joinHouse") {
			// 	await executeERC20DAOJoin(daoAddress, proposal.id!, provider, signer)
			// 	await updateDAOUser(proposal.gnosisAddress, proposal.userAddress)
			// } else if (proposal.type === "requestFunding") {
			// 	await executeERC20DAOFundingProposal(daoAddress, proposal.id!, provider, signer)
			// }
			refetch()
			toastSuccess("Proposal successfully executed")
		} catch (e) {
			console.error(e)
			toastError("Failed to execute proposal")
		}
		setProcessing(false)
	}

	const sign = async () => {
		if (!(signer && isAdmin)) return
		setProcessing(true)
		try {
			let signature: SafeSignature | undefined = undefined
			let signatureStep2: SafeSignature | undefined = undefined
			let executed = false
			// Dirty way to handle the case when someone kicking himself.
			// In this case user will not be able to add signature bc of access rights
			// So we should add signature before we update the user, and avoid adding it twice
			let signatureAdded = false
			switch (proposal.type) {
				case "createZoraAuction":
					if (!isGnosisProposal(proposal)) break
					const signingArgs = [
						proposal.gnosisAddress,
						Number(proposal.nftId),
						proposal.nftAddress!,
						proposal.duration!,
						proposal.reservePrice!,
						proposal.curatorAddress!,
						proposal.curatorFeePercentage!,
						proposal.auctionCurrencyAddress!,
						signer
					] as const
					signature = await signApproveNFTForZoraAuction(...signingArgs)
					signatureStep2 = await signCreateZoraAuction(...signingArgs)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeApproveNFTForZoraAuction(
							proposal.gnosisAddress,
							proposal.nftId!,
							proposal.nftAddress!,
							[...proposal.signatures, signature],
							signer
						)
						await executeCreateZoraAuction(
							proposal.gnosisAddress,
							Number(proposal.nftId),
							proposal.nftAddress!,
							proposal.duration!,
							proposal.reservePrice!,
							proposal.curatorAddress!,
							proposal.curatorFeePercentage!,
							proposal.auctionCurrencyAddress!,
							[...proposal.signaturesStep2!, signatureStep2],
							signer
						)
						executed = true
					}
					break
				case "approveZoraAuction":
					if (!isGnosisProposal(proposal)) break
					signature = await signApproveZoraAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeApproveZoraAuction(
							proposal.gnosisAddress,
							proposal.auctionId!,
							[...proposal.signatures, signature],
							signer
						)
						executed = true
					}
					break
				case "cancelZoraAuction":
					if (!isGnosisProposal(proposal)) break
					signature = await signCancelZoraAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeCancelZoraAuction(
							proposal.gnosisAddress,
							proposal.auctionId!,
							[...proposal.signatures, signature],
							signer
						)
						executed = true
					}
					break
				case "changeRole":
					if (!isGnosisProposal(proposal)) break
					if (["head", "admin"].includes(proposal.newRole!)) {
						signature = await signAddOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
							await executeAddOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
							await updateDAOUser(proposal.gnosisAddress, proposal.recipientAddress!)
						}
					} else {
						signature = await signRemoveOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
							await executeRemoveOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
							await addSafeProposalSignature({
								proposalId: proposal.proposalId,
								signature: signature!,
								signatureStep2,
								...(executed ? {newState: "executed"} : {})
							})
							signatureAdded = true
							await updateDAOUser(proposal.gnosisAddress, proposal.recipientAddress!)
						}
					}
					break
				default:
					throw new Error("Unexpected proposal type to sign")
			}
			if (!signatureAdded) {
				await addSafeProposalSignature({
					proposalId: proposal.proposalId,
					signature: signature!,
					signatureStep2,
					...(executed ? {newState: "executed"} : {})
				})
			}
			refetch()
			toastSuccess("Successfully signed!")
		} catch (e) {
			console.error(e)
			toastError("Failed to sign proposal")
		}
		setProcessing(false)
	}

	return (
		<div className="dao-proposals__card">
			<div className="dao-proposals__card-header">
				<p>{ProposalsTypeNames[proposal.type]}</p>
				<p>{capitalize(proposal.state)}</p>
			</div>
			<h2>{proposal.title}</h2>
			{/* TODO */}
			{/*{proposal.type === "joinHouse" && (*/}
			{/*	<div className="dao-proposals__card-section">*/}
			{/*		<b>Amount of governance token currently owned:</b>*/}
			{/*		{` ${proposal.balance}`}*/}
			{/*	</div>*/}
			{/*)}*/}
			{isGnosisProposal(proposal) && proposal.type === "changeRole" && (
				<>
					<div className="dao-proposals__card-section">
						<b>Member&apos;s Address:</b>
						{` ${proposal.recipientAddress}`}
					</div>
					<div className="dao-proposals__card-section">
						<b>Proposed New Role:</b>
						{` ${capitalize(proposal.newRole!)}`}
					</div>
				</>
			)}
			{/* TODO */}
			{/*{["applyForCommission", "requestFunding"].includes(proposal.type) && (*/}
			{/*	<>*/}
			{/*		<div className="dao-proposals__card-section">*/}
			{/*			<b>Requested amount:</b>*/}
			{/*			{` ${proposal.amount} ETH`}*/}
			{/*		</div>*/}
			{/*		<div className="dao-proposals__card-section">*/}
			{/*			<b>Recipient:</b>*/}
			{/*			{` ${proposal.recipientAddress}`}*/}
			{/*		</div>*/}
			{/*	</>*/}
			{/*)}*/}
			<div className="dao-proposals__card-footer">
				{/* TODO */}
				{/*{proposal.module === "DAO" && (*/}
				{/*	<div className="dao-proposals__voting">*/}
				{/*		<div className="dao-proposals__voting-legend">*/}
				{/*			<p>Yes</p>*/}
				{/*			<p>No</p>*/}
				{/*		</div>*/}
				{/*		<div className="dao-proposals__voting-bar">*/}
				{/*			<div*/}
				{/*				className="dao-proposals__voting-bar-inner"*/}
				{/*				style={{*/}
				{/*					width:*/}
				{/*						proposal.noVotes === 0*/}
				{/*							? "100%"*/}
				{/*							: `${Math.round((proposal.yesVotes * 100) / proposal.noVotes)}%`*/}
				{/*				}}*/}
				{/*			/>*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*)}*/}
				<div className="dao-proposals__voting-buttons">
					{isMember &&
						proposal.state === "active" &&
						proposal.module === "DAO" &&
						(processing ? (
							"Voting..."
						) : (
							<>
								<Button
									disabled={processing}
									buttonType="primary"
									onClick={() => {
										handleVote(true)
									}}
								>
									Yes
								</Button>
								<Button
									disabled={processing}
									buttonType="secondary"
									onClick={() => {
										handleVote(false)
									}}
								>
									No
								</Button>
							</>
						))}
					{isGnosisProposal(proposal) &&
						isAdmin &&
						proposal.state === "active" &&
						!proposal.signatures?.find(s => s.signer.toLowerCase() === account) && (
							<Button onClick={sign} disabled={processing}>
								{processing ? "Processing..." : "Sign"}
							</Button>
						)}
					{proposal.state === "passed" && (
						<Button onClick={startGracePeriod} disabled={processing}>
							{processing ? "Processing..." : "Queue"}
						</Button>
					)}
					{proposal.state === "waiting" && (
						<Button onClick={execute} disabled={processing}>
							{processing ? "Processing..." : "Execute"}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

const DAOProposals: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	daoAddress?: string
	isMember: boolean
	isAdmin: boolean
}> = ({gnosisVotingThreshold, gnosisAddress, daoAddress, isMember, isAdmin}) => {
	const {proposals, loading, error, refetch} = useDAOProposals(gnosisAddress)

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	return (
		<div className="dao-proposals">
			<h2>Proposals</h2>
			<div className="dao-proposals__controls">
				<div className="dao-proposals__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
				<Select options={[{name: "Filter By", value: ""}]} />
				<Select options={[{name: "Sort By", value: ""}]} />
			</div>
			{proposals.map((proposal, index) => (
				<DAOProposalCard
					refetch={refetch}
					gnosisVotingThreshold={gnosisVotingThreshold}
					daoAddress={daoAddress}
					proposal={proposal}
					key={index}
					isMember={isMember}
					isAdmin={isAdmin}
				/>
			))}
		</div>
	)
}

export default DAOProposals
