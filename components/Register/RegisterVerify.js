import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Select, Radio, DatePicker, Upload, Button, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { registerDoctor } from '../../services/api/doctors.js';
const {
    Item : FormItem
} = Form
const { Option } = Select;
import cityJson from '../../constants/US_States_and_Cities.json';
import Loader from '../loader/Loader.js';
import ErrorAlert from '../error/ErrorAlert.js';
import rules from '../../services/validations/rules.js';
import { registerPatient ,uploadimagepatient} from '../../services/api/index.js';
const stateList = Object.keys(cityJson)
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
class RegisterVerify extends Component {
    constructor(){
        super()
        this.state = {
            isLoading: false,
            err: "",
            errMsg: "",
            files:[],
            imageUrl:""
        }
    }
    handleSubmit = (e)=> {
        e.preventDefault()
        const {
            form: {
                validateFields,
            }, onSubmit,
            isDoctor,
            infoFormDetails
        } = this.props
        validateFields((err, values)=> {
            if (!err) {
                
                this.setState({
                    isLoading: true
                }, ()=> {
                    if(isDoctor){
                        const {
                            repassword,
                            ...restValues
                        } = values
                        const infoDetail = {
                            ...infoFormDetails,
                            basic: {
                                ...infoFormDetails.basic,
                                first_name: values.first_name,
                                last_name: values.last_name,
                            }
                        }
                        const doctorDetails = {
                            ...infoDetail,
                            ...restValues
                        }
                        this.setState({
                                        isLoading: false
                                    });
                                  
                                       
                                  
                                    onSubmit()
                        // registerDoctor(doctorDetails)
                        // .then(({data}) => {
                        //     if(data.status){
                        //         this.setState({
                        //             isLoading: false
                        //         })
                        //         onSubmit(data.data)
                        //     }else{
                        //         this.setState({
                        //             isLoading: false,
                        //             errMsg: data.message,
                        //             err: true
                        //         })
                        //     }
                        //     console.log({res})
                        // }).catch(err => {
                        //     this.setState({
                        //         err,
                        //         errMsg: err.response?.data?.error,
                        //         isLoading: false
                        //     })
                        // } )
                    }else{
                        const {
                            repassword,
                            ...infoRest 
                        } = infoFormDetails
                        const userValues = {
                            ...infoRest,
                            ...values
                        }
                        this.setState({
                                         isLoading: false
                                     })
                                    onSubmit();
                                    if(this.state.imageUrl){
                                        let files= new FormData()

                                        files.append('files', this.state.files)
                                        uploadimagepatient(files).then(data=>{
                                            console.log(data);
                                        }).catch(err=>console.log(err));
                                    }
                        // registerPatient(userValues).then(({data}) => {
                        //     if(data.status){
                        //         this.setState({
                        //             isLoading: false
                        //         })
                        //         onSubmit(data.data)
                        //     }else{
                        //         this.setState({
                        //             isLoading: false,
                        //             errMsg: data.message,
                        //             err: true
                        //         })
                        //     }
                        //     console.log({res})
                        // }).catch(err => {
                        //     this.setState({
                        //         err,
                        //         errMsg: err.response?.data?.error,
                        //         isLoading: false
                        //     })
                        // } )
                    }
                })
            }
        })
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ isLoading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          console.log(info.file);
          this.setState({files:info.file.originFileObj});
          
          getBase64(info.file.originFileObj, imageUrl =>{
            console.log(imageUrl);
            this.setState({
              imageUrl,
              isLoading: false,
            })
          });
        }
      };
    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    };
    
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    
    render() {
        const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
        const {
            infoFormDetails, specialities
        } = this.props
        const {
            isLoading, errMsg,imageUrl
        } = this.state
        const firstName = (infoFormDetails.basic?.first_name || "").toLowerCase()
        const lastName = (infoFormDetails.basic?.last_name || "").toLowerCase()
        const specialitiesList  = specialities.map(({name})   => ({name}))

        const uploadButton = (
            <div>
              {this.state.isLoading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">Upload</div>
            </div>
          );

        return (
            <div className="c-register-info pt-5">
                <Form onSubmit={this.handleSubmit}>
                    <div className="">
                        {/* <p>We’ve sent verification code on your email. Why I need code?</p> */}
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-12">
                            <FormItem>
                            
                            <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                                    
                            
                            </FormItem>
                        </div>
                        <div className="col-sm-6">
                            <FormItem>
                                {
                                    getFieldDecorator("first_name", {
                                        rules: [
                                            //rules.required("Please Input Your First Name"),
                                        ],
                                        initialValue: firstName
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="First Name"
                                        />,
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="col-sm-6">
                            <FormItem>
                                {
                                    getFieldDecorator("last_name", {
                                        rules: [
                                            //rules.required("Please Input Your Last Name"),
                                        ],
                                        initialValue: lastName
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Last Name"
                                        />,
                                    )
                                }
                            </FormItem>
                        </div>
                    </div>
                    
                    {
                        this.props.isDoctor && <>
                            
                            <div className="">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormItem>
                                            {
                                                getFieldDecorator("email", {
                                                    rules: [
                                                        //rules.required("Please Input Your First Name"),
                                                        rules.email(),
                                                    ],
                                                })(
                                                    <Input
                                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                        placeholder="Email"
                                                    />,
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormItem>
                                            {
                                                getFieldDecorator("phone", {
                                                    rules: [
                                                        //rules.required("Please Input Your Phone"),
                                                    ],
                                                })(
                                                    <Input
                                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                        placeholder="Phone"
                                                    />,
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <FormItem>
                                        {
                                            getFieldDecorator("password", {
                                                rules: [
                                                    //rules.required("Please Input Your Password"),
                                                    {
                                                        validator: this.validateToNextPassword,
                                                    }
                                                ],
                                            })(
                                                <Input
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="Password"
                                                    type="password"
                                                />,
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <div className="col-sm-6">
                                    <FormItem>
                                        {
                                            getFieldDecorator("repassword", {
                                                rules: [
                                                    //rules.required("Please Re-enter Your Password"),
                                                    {
                                                        validator: this.compareToFirstPassword
                                                    }
                                                ],
                                            })(
                                                <Input
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="Retype Password"
                                                    type="password"
                                                />,
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </div>    
                            <div className="">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormItem>
                                            {
                                                getFieldDecorator("state", {
                                                    rules: [{ 
                                                       // required: true, message: 'Please select state!'
                                                     }],
                                                    onChange: (a)=> {
                                                        setFieldsValue({
                                                            city: cityJson[a][0]
                                                        })
                                                    }
                                                })(
                                                    <Select
                                                        placeholder="Select Your State"
                                                    >
                                                        {
                                                            stateList.map( state => <Option key={state} value={state}>{state}</Option> )
                                                        }
                                                    </Select>,
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormItem>
                                            {
                                                getFieldDecorator("city", {
                                                    rules: [{ 
                                                       // required: true, message: 'Please select City!' 
                                                    }],
                                                })(
                                                    <Select
                                                        disabled={!getFieldValue("state")}
                                                        placeholder="Select Your City"
                                                    >
                                                        {
                                                            (cityJson[getFieldValue("state")] || []).map( city => <Option key={city} value={city}>{city}</Option> )
                                                        }
                                                    </Select>,
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <FormItem>
                                    {
                                        getFieldDecorator("experience", {
                                            rules: [{ 
                                               // required: true, message: 'Please input your experience!' 
                                            }],
                                        })(
                                            <Input
                                                placeholder="Years of experience"
                                                type="number"
                                            />,
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <FormItem>
                                        {
                                            getFieldDecorator("dob", {
                                                rules: [{ 
                                                   // required: true, message: 'Please input your experience!'
                                                 }],
                                            })(
                                                <DatePicker
                                                    className="d-block"
                                                    placeholder="Date of birth"
                                                />,
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <div className="col-sm-6">
                                    <FormItem>
                                        {
                                            getFieldDecorator("speciality", {
                                                rules: [{ 
                                                    //required: true, message: 'Please input your speciality!'
                                                 }],
                                            })(
                                                <Select
                                                    placeholder="Speciality"
                                                >
                                                    {
                                                        specialitiesList.map( speciality => <Option key={speciality.name} value={speciality.name}>{speciality.name}</Option> )
                                                    }
                                                </Select>,
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </div>
                        </>
                    }
                    <Loader isLoading={isLoading} />
                    <ErrorAlert error={errMsg} />
                    <div className="text-center d-block">
                        <button disabled={isLoading} className="btn btn-primary" type="submit">Continue</button>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    specialities: state.specialities
})
export default Form.create({ 
    name: 'register-verify'
 })(connect(mapStateToProps)(RegisterVerify))