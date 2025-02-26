import React, {FunctionComponent} from "react"
import Button from "../../components/Controls/Button"
import "./styles.scss"
import {Link} from "react-router-dom"

const HomePage: FunctionComponent = () => {
	return (
		<div className="home-page">
			<video src="/assets/Homepage_Video.mp4" muted autoPlay loop />
			<h1 className="home-page__title">
				Welcome to <br /> TokenWalk
			</h1>
			<div className="home-page__buttons">
				<Link to="/daos">
					<Button>DAOs</Button>
				</Link>
				<Button disabled>Events</Button>
			</div>
			<div style={{color: "white", margin: "20px 80px"}}>
				We are currently in test phase, but will be officially
				<br /> releasing in October 2021. Stay tuned!
			</div>
			<Link className="home-page__link" to="/learn">
				Learn More
			</Link>
		</div>
	)
}

export default HomePage
