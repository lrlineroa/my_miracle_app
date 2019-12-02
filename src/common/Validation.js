import appConstants from "./AppConstants";
class Validation {
    static validateEmail(candidate) {
        let re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (!re.test(candidate)) {
            return appConstants.validation.invalid.EMAIL;
        }
        return appConstants.validation.OK;
    }

    static validateEmailAndPhone(candidate) {
        if (this.validateEmail(candidate) == appConstants.validation.invalid.EMAIL
            && this.validatePhone(candidate) == appConstants.validation.invalid.PHONE_NUMBER)
            return appConstants.validation.invalid.PHONE_NUMBER_EMAIL
        return appConstants.validation.OK
    }

    static validatePhone(candidate) {
        if (candidate.match(/\d/g) && candidate.match(/\d/g).length > 5 && candidate.match(/\d/g).length <= 10) {
            return appConstants.validation.OK;
        }
        return appConstants.validation.invalid.PHONE_NUMBER
    }
}



export default Validation;