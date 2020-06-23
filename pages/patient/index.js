import withBasicLayout from "../../components/layouts/basic-layout/withBasicLayout"
import { connect } from "react-redux"
import onlyGuest from "../../components/onlyGuest/onlyGuest"
import React, { Component } from "react"
import { Modal, Layout, Button, Divider } from "antd"
import PaymentCard from "../../components/payment/PaymentCard"
import ShowOnCard from "../../components/payment/ShowOnCard"
// import Search from "../../../Home/Search";
// import Navbar from "../../../Header/Header";
import Sidebar from "../../components/patient-sidebar/Sidebar"
// import Uppermsg from "../../Uppermsg";
import { patientCardList } from "../../services/api"
const { Content, Footer } = Layout
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
			// userDetails: JSON.parse(localStorage.getItem("patient")),
			modalToggle: false
		}
	}
	componentDidMount() {
		this.getSaveCards()
	}
	getSaveCards() {
		const { userDetails } = this.props
		// if(!userDetails){
		//   this.props.history.push("/login")
		//   return
		// }
		console.log({
			userDetails
		})
		patientCardList(userDetails?.customerProfile)
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
	render() {
		const { cardDetails, cardList } = this.state
		console.log()
		return (
			<div>
				<div className="maincontent-wrapper " >
					{/* <Navbar /> */}

					<Content
						style={{ padding: "0 50px", marginTop: 64 }}
						className="custom-home-content-ap"
					>
						<div
							style={{ background: "transparent", padding: 24, minHeight: 380 }}
							className="doctor-header"
						>
							{/* <Uppermsg /> */}
							<header className="App-header">{/* <Search /> */}</header>
							<Content style={{ padding: "0", marginTop: "30px" }}>
								<Layout
									style={{
										padding: "24px 0"
										//  background: '#fff'
									}}
								>
									<Sidebar active={"6"} />
									<Content
										style={{ minHeight: 280 }}
										className="custom-home-content-inner-ap-patient"
									>
										<Layout>
											<Content className="patient-profile-content">
												<p className="profile-header-custom-patient-ap">
													<strong>Payment</strong>
												</p>
												<Divider />
												<Button onClick={() => this.showModal()}>
													Add Card
												</Button>
												<div className="patient-profile-card">
													{cardList && cardList.length > 0
														? cardList.map((item, index) => (
																<ShowOnCard
																	cvvOnCard={""}
																	expDateOnCard={
																		item.exp_month + "/" + item.exp_year
																	}
																	numberOnCard={"xxxx xxxx xxxx " + item.last4}
																	nameOnCard={item.name}
																	transactionData=""
																/>
														  ))
														: "No card."}
												</div>
											</Content>
										</Layout>
									</Content>
								</Layout>
							</Content>
						</div>
					</Content>
					<Footer style={{ textAlign: "center" }}>
						Ant Design ©2018 Created by Ant UED
					</Footer>
				</div>
				<Modal
					title=""
					visible={this.state.visible}
					onOk={this.showModal}
					onCancel={this.showModal}
					footer={null}
					width={"80%"}
				>
					<PaymentCard
						cvvOnCard={""}
						expDateOnCard={""}
						numberOnCard={""}
						nameOnCard={""}
						cardResponse={response => this.cardResponse(response)}
						backButton={() => this.showModal()}
						transactionData={() => {}}
					/>
				</Modal>
			</div>
		)
	}
}
const mapStateToProps = state => ({
	userDetails: state.loggedInPatient
})

export default onlyGuest(false)(
	withBasicLayout(connect(mapStateToProps)(patient))
)
