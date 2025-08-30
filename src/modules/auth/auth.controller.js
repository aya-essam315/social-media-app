import { Router } from "express";
import * as authServices from "./auth.service.js"
import { isValidate } from "../../middlewares/validation.js";
import * as authValidation from "./auth.validation.js"
const router = Router();

router.post("/signup", isValidate(authValidation.signUpValidation),authServices.signUp)
router.post("/confirm-email", authServices.confirmEmial)
router.post("/login", authServices.login)
router.post("/two-step-veryf", authServices.twoStepVerificationLogin)
router.post("/google-login", authServices.loginWithGoogle)
router.patch("/forget-password", authServices.forgetPassword)
router.patch("/request-new-otp", authServices.forgetPassword)

router.patch("/reset-password", isValidate(authValidation.forgetPasswordValidation),authServices.changePassword)
export default router