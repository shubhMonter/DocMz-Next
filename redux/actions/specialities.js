import { SET_SPECIALITIES } from './type'
import { getSpecialities as getSpecialitiesApi } from '../../services/api'
export const getSpecialities = aa => dispatch => {

    getSpecialitiesApi().then(({ data }) => {

        if (data.data) {
            dispatch({
                payload: data.data,
                type: SET_SPECIALITIES
            })
        }
    })
}
export const setSpecialities = (specialities = []) => ({
    specialities,
    type: SET_SPECIALITIES
})