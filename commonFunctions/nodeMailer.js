const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')

const sentMail = async (email, User) => {
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    const randomPassword = makeid(10)
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(randomPassword, salt);
    const OTPsave = await User.update({ password: hashedPassword }, {
        where: { email }
    })
    return new Promise((resolve) => {
        if (OTPsave) {
            const transaport = nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                auth: {
                    user: 'krishnaabhi1231@outlook.com',
                    pass: 'jZgKVTrR7PGc92H'
                }
            })
            const mailOptions = {
                from: 'krishnaabhi1231@outlook.com',
                to: email,
                subject: "Yummy Slice slice send you verification code.",
                text: "Highly Confidential.Don't Share With Anyone.Your Password is-" + randomPassword,
            }
            transaport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    resolve({ status: false, error })
                } else {
                    resolve({ status: true, info })
                }
            })
        } else {
            resolve({ error: true })
        }
    })

}
module.exports = { sentMail };
