import { Form, Icon, Input, Radio, Select } from "antd";
import React, { Component } from "react";
import cityJson from "../../constants/US_States_and_Cities.json";
import { getDoctorByNpi } from "../../services/api/doctors.js";
import rules from "../../services/validations/rules";
import Loader from "../loader/Loader.js";

const stateList = Object.keys(cityJson);
const { Item: FormItem } = Form;
const { Option } = Select;
class RegisterInfo extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      onSubmit
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log("values",values);
       if (values.npi) {
          this.setState(
            {
              isLoading: true
            },
            () => {
              getDoctorByNpi(values.npi)
                .then(({ data }) => {
                  if (data.status) {
                    const doctorInfo = data.doctorInfo.results[0];
                    this.setState({
                      isLoading: false
                    });
                    onSubmit({
                      ...values,
                      ...doctorInfo
                    });
                  } else {
                    this.setState({
                      isLoading: false,
                      errMsg: data.message,
                      err: true
                    });
                  }
                })
                .catch(err => {
                  this.setState({
                    err,
                    errMsg: err.response?.data?.error,
                    isLoading: false
                  });
                });
            }
          );
        } else {
          onSubmit(values);
        }
      }
    });
  };
  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue
    } = this.props.form;
    const { firstName, lastName, email } = this.props;
    const { isLoading } = this.state;
    console.log({
      firstName,
      lastName
    });
    return (
      <div className="c-register-info pt-5">
        <Form onSubmit={this.handleSubmit}>
          <div className="">
            <h5>Start As</h5>
          </div>
          <div className="">
            <FormItem>
              {getFieldDecorator("userType", {
               // rules: [rules.required("Please select a User Type!")],
                initialValue: "user"
              })(
                <Radio.Group>
                  <Radio value={"doctor"}>Doctor</Radio>
                  <Radio value={"user"}>Regular User</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </div>
          {getFieldValue("userType") === "doctor" && (
            <div className="">
              <FormItem>
                {getFieldDecorator("npi", {
                 //// rules: [rules.required("NPI Number is required")]
                })(<Input placeholder="NPI Number" />)}
              </FormItem>
            </div>
          )}
          {getFieldValue("userType") === "user" && (
            <>
              <div className="">
                <div className="row">
                  <div className="col-sm-6">
                    <FormItem>
                      {getFieldDecorator("email", {
                       // rules: [rules.required("Please input your Email!")]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Email"
                        />
                      )}
                    </FormItem>
                  </div>
                  <div className="col-sm-6">
                    <FormItem>
                      {getFieldDecorator("phone", {
                       // rules: [
                       //   rules.required("Please input your Phone!"),
                     //     {
                       //     pattern: /^\d{10}$/,
                      //      message: "Please enter a valid Phone Number"
                      //    }
                     //   ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Phone"
                        />
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <FormItem>
                    {getFieldDecorator("password", {
                     // rules: [rules.required("Please input a Password!")]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="Password"
                        type="password"
                      />
                    )}
                  </FormItem>
                </div>
                <div className="col-sm-6">
                  <FormItem>
                    {getFieldDecorator("repassword", {
                     // rules: [
                     //   rules.required("Please retype your Password!"),
                     //   {
                     //     validator: (rule, value) => {
                      //      if (value !== getFieldValue("password"))
                       //       return Promise.reject("Passwords don't match");
                      //      return Promise.resolve();
                       //   }
                     //   }
                      //]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="Retype Password"
                        type="password"
                      />
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="">
                <div className="row">
                  <div className="col-sm-6">
                    <FormItem>
                      {getFieldDecorator("state", {
                       // rules: [
                     //     { required: true, message: "Please select state!" }
                     //   ],
                        onChange: a => {
                          setFieldsValue({
                            city: cityJson[a][0]
                          });
                        }
                      })(
                        <Select placeholder="Select Your State">
                          {stateList.map(state => (
                            <Option key={state} value={state}>
                              {state}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <div className="col-sm-6">
                    <FormItem>
                      {getFieldDecorator("city", {
                       // rules: [
                        //  { required: true, message: "Please select City!" }
                     //   ]
                      })(
                        <Select
                          disabled={!getFieldValue("state")}
                          placeholder="Select Your City"
                        >
                          {(cityJson[getFieldValue("state")] || []).map(
                            city => (
                              <Option key={city} value={city}>
                                {city}
                              </Option>
                            )
                          )}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
            </>
          )}
          <Loader isLoading={isLoading} />
          <div className="text-center d-block">
            <button
              disabled={isLoading}
              className="btn btn-primary"
              type="submit"
            >
              Start Now
            </button>
          </div>
        </Form>
      </div>
    );
  }
}
export default Form.create({
  name: "register-info"
})(RegisterInfo);
