
import { EventEmitter } from "events";

import { sendEmail } from "./send.email.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async({email, OTP})=>{

    await sendEmail({to:email, subject:`confirm ur email `,html:`<h2>ur otp is ${OTP}</h2>`});
})

emailEvent.on("resetPassword", async({email, OTP})=>{

    await sendEmail({to:email, subject:`reset-password `,html:`<h2>ur otp is ${OTP}</h2>`});
})

emailEvent.on("sendConfirmTempEmail", async({email, OTP})=>{

    await sendEmail({to:email, subject:`confirm ur new email `,html:`<h2>ur otp is ${OTP}</h2>`});
})

emailEvent.on("send-2-step-verification-code", async({email, OTP})=>{

    await sendEmail({to:email, subject:`2-step-verification-code `,html:`<h2>ur otp for 2-step-verification-code is  ${OTP}</h2>`});
})