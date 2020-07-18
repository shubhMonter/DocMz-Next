import Axios from 'axios'
import apiList from './apiList'

export const getSpecialities = () => Axios.get(apiList.getSpecialities)
export const getDoctorsList = () => Axios.get(apiList.getDoctorsList)
export const getDoctorById = id => Axios.get(apiList.getDoctorById + `/${id}`)
export const getDoctorByNpi = npi => Axios.get(apiList.getDoctorByNpi + `/${npi}`)
export const registerDoctor = body => Axios.post(apiList.registerDoctor, body)
export const doctorLogin = body => Axios.post(apiList.doctorLogin, body)
export const doctorProfileUpdate = body => Axios.post(apiList.doctorProfileUpdate, body)
export const saveTimeSlots = body => Axios.post(apiList.saveTimeSlots, body)
export const searchDoctors = body => Axios.post(apiList.searchDoctors, body)
export const searchDoctorsLite = body => Axios.post(apiList.searchDoctorsLite, body)

export const getAppointments = ({ limit, doctor, date }) => Axios.post(apiList.getAppointments, { limit, doctor, date })
export const approveAppointments = body => Axios.post(apiList.approveAppointments, body)
export const getOrder = body => Axios.post(apiList.getOrder, body)
export const addPayment = body => Axios.post(apiList.addPayment, body)