import React ,{Component} from "react";
import { connect } from 'react-redux'
import Cross  from "../assets/redCross";
import Home  from "../assets/home";
import Settings  from "../assets/settings";
import Question  from "../assets/question";
import Heart  from "../assets/heart";
import Mail  from "../assets/mail";
import Exit  from "../assets/exit";
import Link from 'next/link';
import Router from "next/router"
import { unsetLoggedInDoctor ,unsetLoggedInPatient} from '../../redux/actions'
import { Button } from "antd";


class SideNav extends Component{
  constructor(){
    super();
   
}   
    onClick(){
      Router.push("/");
    }
   logout(){
    this.props.unsetLoggedInDoctor();
    this.props.unsetLoggedInPatient();

  }
  render(){
    return (
      <>
        <div className="sidenav-main ">
          <div className="sidenav-brand mt-lg-3">
            <div className="sidenav-brand-icon" onClick={this.onClick.bind(this)}>
              
                <Cross />
             
              
            </div>
            <div className="sidenav-brand-info">Medi</div>
          </div>
          <div className="sidenav-menu-wrapper">
            <div className="sidenav-ul">
              <div className="sidenav-li">
                <div className="sidenav-icon-wrapper">
                  {" "}
                 { <Home />} 
                </div>
              </div>
              <div className="sidenav-li">
                <div className="sidenav-icon-wrapper">
                  {" "}
                  {<Heart />} 
                </div>
              </div>
              <div className="sidenav-li">
                <div className="sidenav-icon-wrapper">
                  {" "}
                  {<Mail />} 
                </div>
              </div>
              <div className="sidenav-li">
                <div className="sidenav-icon-wrapper">
                  {" "}
                  {<Settings />} 
                </div>
              </div>
              <div className="sidenav-li">
                <div className="sidenav-icon-wrapper">
                  {" "}
                 { <Question />} 
                </div>
              </div>
            </div>
            <div className="sidenav-exit">
              <div className="sidenav-icon-wrapper" >
                {" "}
              <a onClick={this.logout.bind(this)}>
              <Exit />
              </a>
                
              
                
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
};

const mapDispatchToProps = {
  unsetLoggedInDoctor,
  unsetLoggedInPatient
}
export default connect(null, mapDispatchToProps)(SideNav)
