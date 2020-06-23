import React, { Component } from "react";
// import { Link, NavLink } from "react-router-dom";
import Link from "next/link";
import { Layout, Menu } from "antd";
import "./sidebar.css";
const { Content, Footer, Header, Sider } = Layout;
class Sidebar extends Component {
  render() {
    // const {active}=this.props
    // const activeLink=active && active > 0 ? active : 1
    return (
      <>
        <Sider
          width={200}
          style={{ background: "#fff" }}
          className="custom-sider-patient"
        >
          <Menu
            mode="inline"
            //defaultSelectedKeys={[activeLink]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%" }}
          >
            <Menu.Item key="1">
              {/* <Icon type="file" /> */}
              {/* <Link to="/Patient"><span>Profile</span></Link> */}
              <Link href="/Patient" >
                <span>
                  {/* <img src={require("./male.png")} width="24" /> */}
                  Card 
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item key="2">
              {/* <Icon type="file" /> */}
              <Link href="/Password" >
                <span>
                  {/* <img src={require("./password.png")} width="24" /> */}
                 UPI
                </span>
              </Link>
              {/* <Link to="/Password" ><span>Password</span></Link> */}
            </Menu.Item>

        </Menu>
        </Sider>
      </>
    );
  }
}

export default Sidebar;
