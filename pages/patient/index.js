import withDashboardLayout from "../../components/layouts/dashboard-layout/withDashboardLayout";
import { connect } from "react-redux"
import onlyGuest from "../../components/onlyGuest/onlyGuest"
import React, { Component } from "react"
import { Container, Row, Col } from "react-bootstrap";
import { patientCardList } from "../../services/api"
import  Search  from "../../components/assets/search";
import  Cross  from "../../components/assets/redCross";
import  Clocksvg  from "../../components/assets/clock";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import HealthDetail from "../../components/HealthDetail/HealthDetail";
import UpcomingCards from "../../components/upcomingCards/UpcomingCards";
import AnalyticsCard from "../../components/AnalyticsCard/AnalyticsCard";
import DiscountsCard from "../../components/DiscountsCard/DiscountsCard";
import Graphs from "../../components/Graphs/Graphs";
import Calendar from "../../components/CalendarSlider/Calendar";
import Clock from "react-live-clock";
import Router from "next/router"
class patient extends Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmDirty: false,
			cardDetails: {
				name: "John Doe",
				cardNumber: "6011 0009 9013 9424",
				expDate: "10/22",
				cvvNo: "1234"
			},
			cardList: [],
			// loggedInPatient: JSON.parse(localStorage.getItem("patient")),
			modalToggle: false,
			search:''
		}
	}
	componentDidMount() {
		this.getSaveCards()
	}
	getSaveCards() {
		const { loggedInPatient } = this.props
		// if(!loggedInPatient){
		//   this.props.history.push("/login")
		//   return
		// }
		console.log({
			loggedInPatient
		})
		patientCardList(loggedInPatient?.customerProfile)
			.then(res => {
				const { data } = res.data.data
				console.log({ data })
				this.setState({
					cardList: data
				})
			})
			.catch(err => {
				console.log({ err })
			})
	}
	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log("Received values of form: ", values)
			}
		})
	}
	showModal = () => {
		this.setState({
			visible: !this.state.visible
		})
	}
	handleConfirmBlur = e => {
		const { value } = e.target
		this.setState({ confirmDirty: this.state.confirmDirty || !!value })
	}

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props
		if (value && value !== form.getFieldValue("password")) {
			callback("Two passwords that you enter is inconsistent!")
		} else {
			callback()
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props
		if (value && this.state.confirmDirty) {
			form.validateFields(["confirm"], { force: true })
		}
		callback()
	}
	cardResponse = response => {
		console.log({ response })
	}
	onchange = (e) =>{
		console.log(e.target.value);
		this.setState({search:e.target.value});
	}
	onsubmit = (e) =>{
		e.preventDefault();
		Router.push(`/search?name=${this.state.search}`)
	}
	render() {
		const { cardDetails, cardList } = this.state
		const {email} = this.props.loggedInPatient;
		console.log(this.props)
		return (
			
				<div className="maincontent-wrapper " >
					{/* <Navbar /> */}
					<section className="dashboard-info-section">
							<Container fluid>
							<Row>
								<Col sm={8} className="p-0 dashboard-metrics-container">
								{/* search wrapper style classes reused from dashboard page styles file */}
								{/* search and time section starts here  */}
								<section className="searchbar-wrapper">
									<div className="searchbar-container">
									<Search />

									<div className="searchbar-input ">
									<form onSubmit={this.onsubmit.bind(this)}>
									<input
										type="text"
										placeholder="Search for symptoms.."
										onChange={this.onchange.bind(this)}
										/>
										
										</form>	
									</div>
									</div>
									{/*  brand logo for mobile deivces visible only on mobile deivices  */}
									<div className="brand-sm-wrapper">
									<div className="brand-sm-icon">
										<Cross />
									</div>
									<div className="brand-sm-info">Medi</div>
									</div>
									{/* //ends here */}
									<div className="dashboard-datetime-wrapper">
									<span className="clock-icon">
										<Clocksvg />
									</span>
									<Clock
										format={"h:mm:ss A,dddd, MMMM Mo, YYYY"}
										ticking={true}
									/>{" "}
									</div>
								</section>
								{/* Search section ends here  */}
								{/* Dashboard page metrics  wrapper starts here */}
								<section className="dashboard-metrics-wrapper">
									<DiscountsCard />
									<Graphs />
									<div className="d-flex justify-content-between">
									<AnalyticsCard name="analytics" />
									<AnalyticsCard />
									</div>
								</section>
								{/* Dashboard page metrics  wrapper ends here */}
								</Col>
								<Col sm={4} className="dashboard-info-container px-5">
								<ProfileInfo name={email}/>
								<HealthDetail />

								<Calendar />

								<UpcomingCards type={"dent"} />
								<UpcomingCards />
								<div className="dashboard-secondary-title mt-4 mb-2 mx-5 px-2">
									Your treatment
								</div>
								<UpcomingCards type={"drug"} />
								<UpcomingCards type={"vitamin"} />
								</Col>
							</Row>
							</Container>
						</section>
					</div>
		
		)
	}
}
const mapStateToProps = state => ({
	loggedInPatient: state.loggedInPatient
})

export default onlyGuest(false)(
	withDashboardLayout(connect(mapStateToProps)(patient))
)
