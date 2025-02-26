import React, {FunctionComponent, useState, Fragment} from "react"
import {Learn} from "../../types/learn"
import "./styles.scss"
import {useHistory, useLocation} from "react-router-dom"

const LearnMenu: FunctionComponent<{
	entries: Learn
}> = ({entries}) => {
	const {hash, pathname} = useLocation()
	const {push} = useHistory()
	const [expandedEntry, setExpandedEntry] = useState<number | null>(
		hash ? Number(hash.split("_")[1]) : null
	)

	const handleLinkClick = (anchor: string) => {
		document.getElementById(anchor)?.scrollIntoView({
			behavior: "smooth"
		})
		push(`${pathname}#${anchor}`)
	}

	return (
		<div className="learn-menu">
			{entries.map((lv0Entry, lv0Index) => (
				<Fragment key={lv0Index}>
					<div
						className="learn-menu__link-lv0"
						onClick={() => {
							setExpandedEntry(lv0Index)
						}}
					>
						<a href={`#learn_${lv0Index}`}>{lv0Entry.title}</a>
						<span
							className={`learn-menu__expand${
								expandedEntry === lv0Index ? " learn-menu__expand--expanded" : ""
							}`}
						/>
					</div>
					{expandedEntry === lv0Index &&
						lv0Entry.childArticles.map((lv1Entry, lv1Index) => (
							<Fragment key={lv1Index}>
								<a
									className="learn-menu__link-lv1"
									onClick={() => {
										handleLinkClick(`learn_${lv0Index}_${lv1Index}`)
									}}
								>
									{lv1Entry.title}
								</a>
								{lv1Entry.childArticles.map((lv2Entry, lv2Index) => (
									<a
										key={lv2Index}
										className="learn-menu__link-lv2"
										onClick={() => {
											handleLinkClick(`#learn_${lv0Index}_${lv1Index}_${lv2Index}`)
										}}
									>
										{lv2Entry.title}
									</a>
								))}
							</Fragment>
						))}
				</Fragment>
			))}
		</div>
	)
}

export default LearnMenu
