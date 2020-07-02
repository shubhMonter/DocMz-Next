import Head from 'next/head'
import {compose} from "redux";
import { connect } from 'react-redux'
import Router from 'next/router'
import { PROJECT_NAME, GOOGLE_API_KEY } from '../../../constants/projectKeys'
import '../../../style/app.scss'
import { getSpecialities, toggleDashboardCollapse } from '../../../redux/actions'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import SideNav from '../../SideNav/SideNav';
import { getDoctorById,patientgetinfo } from '../../../services/api';


const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;
const { SubMenu } = Menu;
const withDashboardLayout = (PassedComponent) => {
    return class extends React.Component {
        constructor(){
            super();
            this.state = {
                visible: true,
                filterappointmentarr: [],
                allAppointments: [],
            }
           
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
            let componentProps = {}
            if (PassedComponent.getInitialProps) {
                componentProps = await PassedComponent.getInitialProps(ctx);
            }

            return {
                ...componentProps
            };
        }
        componentDidMount(){
            console.log(this.props);
            this.props.getSpecialities();
            const doctorId = this.props.loggedInDoctor._id;
            const patientId = this.props.loggedInPatient._id;
            if(doctorId){
                getDoctorById(doctorId)
                .then(response => {
                  console.log('docdetailsashbaord', response.data.data.appointments);
          
                  let apparr = response.data.data.appointments
                  let filterapparr = apparr.filter(function (hero) {
                    return hero.booked === true;
                    // console.log('hero',hero.booked == true)
                  });
                  console.log('filterapparrrdata', apparr)
                  this.setState({
                    filterappointmentarr: filterapparr,
                    allAppointments: apparr
                  })
                  console.log('allApp', this.state.filterappointmentarr)
                })
                .catch(e => {
                  console.log('error', e);
                });
            }
            else if(patientId){
               patientgetinfo(patientId)
                .then(response => {
                  console.log('patdetailsashbaord', response.data.data);
          
                  let apparr = response.data.data.appointments
                  let filterapparr = apparr.filter(function (hero) {
                    return hero.booked === true;
                    // console.log('hero',hero.booked == true)
                  });
                  console.log('filterapparrrdata', apparr)
                  this.setState({
                    filterappointmentarr: filterapparr,
                    allAppointments: apparr
                  })
                  console.log('allApp', this.state.filterappointmentarr)
                })
                .catch(e => {
                  console.log('error', e);
                });
            }
            else{
                Router.push("/login")
            }
        }
        
        componentDidUpdate(prevProps){
            if(prevProps.loggedInDoctor !== this.props.loggedInDoctor){
                if(!this.props.loggedInDoctor._id){
                    Router.push("/login")
                }
            }
        }
        showDrawer = () => {
            this.setState({
              visible: true
            });
        };
        toggleDrawer = ()=> this.setState(prevState => ({visible: !prevState.visible}))
        onClose = () => {
            if (this.state.visible) {
              this.setState({
                visible: false
              });
            }
        };
       
        render(){
            const {
                children,
                dashboard,
                toggleDashboardCollapse,
                ...props
            } = this.props
            if(!this.props.isPersist){
                return <div />
            }
            if(!this.props.loggedInDoctor._id && !this.props.loggedInPatient._id){
                return <div />
            }
            const {
                visible, filterappointmentarr, allAppointments
            } = this.state
            
            
            return (
                <div className="c-layout c-layout--dashboard">
                    <Head>
                        <title>{PROJECT_NAME}</title>
                        <link rel="icon" href="/favicon.png" />
                    </Head>
                    <script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} async defer></script>
                   
                        {/* {<Sider width={300} collapsible collapsed={dashboard.collapsed} onCollapse={toggleDashboardCollapse}>
                            <strong className="c-logo">
                                <Link href="/" >
                                    <a>
                                        <img src="/images/logo-white.png" alt={PROJECT_NAME} />
                                    </a>
                                </Link>
                            </strong>
                            <SideNav  />
                        </Sider>} */}
                         <main role="main" className="main-wrapper">
                         <div className="sidenav-wrapper">
                            <section className="sidenav-container">
                                <SideNav />
                            </section>
                        </div>
                      
                            
                                <PassedComponent {...props} >{children}</PassedComponent>
                            

                            {/* <TimelineDrover /> */}
                            {/* <div
                                style={{
                                    paddingLeft: 50
                                }}
                                >
                                <Button onClick={this.showDrawer} className="fr timeline-toggle" type="primary">
                                    <Icon style={{ fontSize: 20 }} type="schedule" />
                                </Button>
                                <TimelineDrover visible={visible}
                                    onClose={() => {
                                        this.onClose();
                                    }}
                                    toggle={this.toggleDrawer}
                                    class="stop-2"
                                    allAppointments={allAppointments}
                                    appointments={filterappointmentarr}
                                />
                            </div> */}
                       
                    
                </main>
                </div>
            )
        }
    }
}

const mapStateToProps = state => ({
    specialities: state.specialities,
    dashboard: state.dashboard,
    loggedInDoctor: state.loggedInDoctor,
})
const mapActionToProps = {
    getSpecialities,
    toggleDashboardCollapse,
   
}
export default compose(connect(mapStateToProps, mapActionToProps), withDashboardLayout)