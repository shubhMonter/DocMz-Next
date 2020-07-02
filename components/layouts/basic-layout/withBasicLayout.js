import Head from "next/head";
import Router from "next/router";
import PropTypes from 'prop-types';
import { compose } from "redux";
import { connect } from "react-redux";
import { PROJECT_NAME, GOOGLE_API_KEY } from "../../../constants/projectKeys";
import { mainMenus } from "../../../constants/messages/menus";
import SideNav from '../../SideNav/SideNav';
import "../../../style/app.scss";
import { getSpecialities } from "../../../redux/actions";

 
const withBasicLayout = PassedComponent => {
	return class extends React.Component {
		getMenu() {
			var items = [];
			items = mainMenus.filter(elem => {
				return elem.link !== window.location.pathname;
			});
			return items;
		}
		static getInitialProps = async ctx => {
			// const response = await ctx.apolloClient.query({ query: ME });

			// console.log("@withAuth ", response);

			// if (!response || !response.data || !response.data.me) {
			//   redirect(ctx, "/");
			//   return {
			//     me: null
			//   };
			// }

			// Get component’s props
			let componentProps = {};
			if (PassedComponent.getInitialProps) {
				componentProps = await PassedComponent.getInitialProps(ctx);
			}

			return {
				...componentProps
			};
		};

		componentDidMount() {
			this.props.getSpecialities();
			
			if (this.props.loggedInDoctor._id) {
				Router.push("/doctor/newdash");
			}
			
		}
		componentDidUpdate(prevProps) {
			if (prevProps.loggedInDoctor !== this.props.loggedInDoctor) {
				if (this.props.loggedInDoctor._id) {
					Router.push("/doctor/newdash");
				}
			}
			
		}
		render() {
			const { children, ...props } = this.props;
			console.log(props);
			
			
			if (!this.props.isPersist || this.props.loggedInDoctor._id) {
				return (
					<>
						<script
							src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
							async
							defer
						></script>
						<div />
					</>
				);
			}
			return (
				<div className="c-layout c-layout--basic">
					<Head>
						<title>{PROJECT_NAME}</title>
						<link rel="icon" href="/favicon.png" />
					</Head>
					<script
						src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
						async
						defer
					></script>

						<main role="main" className="main-wrapper">
                         <div className="sidenav-wrapper">
                            <section className="sidenav-container">
                                <SideNav />
                            </section>
                        </div>
					<PassedComponent {...props}>{children}</PassedComponent>
					
					</main>
				</div>
			);
		}
	};
};
withBasicLayout.protoTypes ={
	getSpecialities: PropTypes.func.isRequired,
	specialities: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
	specialities: state.specialities,
	loggedInDoctor: state.loggedInDoctor,
	loggedInPatient: state.loggedInPatient
});
const mapActionToProps = {
	getSpecialities
};
export default compose(
	connect(mapStateToProps, mapActionToProps),
	withBasicLayout
);
