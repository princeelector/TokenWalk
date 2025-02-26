import React, {FunctionComponent, useState} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"

const DAOCollection: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
}> = ({gnosisAddress, isAdmin}) => {
	const [galleryKey, setGalleryKey] = useState(Math.random())

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				<CreateNFTModal gnosisAddress={gnosisAddress} afterCreate={updateGallery} />
			</div>
			<NFTGallery key={galleryKey} account={gnosisAddress} isDao canDelete={isAdmin} />
		</div>
	)
}

export default DAOCollection
