import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addDAONFT = async (nftId: string, daoAddress: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/deleteDaoNft`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			nftId,
			address: daoAddress.toLowerCase()
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to delete NFT")
	}
}

export default addDAONFT
