import Axios from 'axios'
import apiList from './apiList'

export const registerPatient = body => Axios.post(apiList.registerPatient, body)
export const patientLogin = body => Axios.post(apiList.patientLogin, body)
export const patientCardSave = body => Axios.post(apiList.patientCardSave, body)
export const patientCardStripeCharge = body => Axios.post(apiList.patientCardStripeCharge, body)
export const patientCardTestDetails = body => Axios.post(apiList.patientCardTestDetails, body)
export const patientCardList = id => Axios.get(apiList.patientCardList + `/${id}`)
export const patientgetinfo =id=> Axios.get(apiList.patientgetinfo + `/${id}`)