import Router from 'next/router'
import { compose } from "redux";
import { connect } from 'react-redux'
import { PROJECT_NAME, GOOGLE_API_KEY } from '../../constants/projectKeys'

// const onlyGuest = (pp) => (PassedComponent) => ({children, ...props})=> {
//     console.log({
//         pp
//     })
//     return <PassedComponent {...props} >{children}</PassedComponent >
// }
const onlyGuest = (isGuest = true) => (PassedComponent) => connect(mapStateToProps)(class extends React.Component {
    static getInitialProps = async ctx => {
        let componentProps = {}
        if (PassedComponent.getInitialProps) {
            componentProps = await PassedComponent.getInitialProps(ctx);
        }

        return {
            ...componentProps
        };
    }
    componentDidMount(){
        if(isGuest){
            if(this.props.isPersist && this.props.loggedInPatient._id){
                Router.push("/patient")
            }
        }else{
            if(this.props.isPersist && !this.props.loggedInPatient._id){
                Router.push("/")
            }
        }
    }
    componentDidUpdate(prevProps){
        if((prevProps.loggedInPatient !== this.props.loggedInPatient) || (prevProps.isPersist !== this.props.isPersist)){
            if(isGuest){
                if(this.props.isPersist && this.props.loggedInPatient._id){
                    Router.push("/patient")
                }
            }else{
                if(this.props.isPersist && !this.props.loggedInPatient._id){
                    Router.push("/")
                }
            }
        }
    }
    render(){
        const {
            children, ...props
        } = this.props
        if(!this.props.isPersist){
            return <>
                <script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} async defer></script>
                <div/>
                </>
        }
        if(isGuest){
            if(!props.loggedInPatient._id){
                return <PassedComponent {...props} >{children}</PassedComponent>
            }
        }else{
            if(props.loggedInPatient._id){
                return <PassedComponent {...props} >{children}</PassedComponent>
            }
        }
        return <>
            <script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} async defer></script>
            <div/>
            </>
    }
})

const mapStateToProps = state => ({
    loggedInPatient: state.loggedInPatient,
})

export default onlyGuest