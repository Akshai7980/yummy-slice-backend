const { User } = require('../models')
const { sentMail } = require('../commonFunctions/nodeMailer');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const validEmail = email.includes('@gmail.com')
    if (!validEmail || !email)
        return res.json({
            message: "Please enter valid email"
        })

    try {
        const user = await User.findOne({
            where: { email: email }
        })
        if (user) {
            const info = await sentMail(email, User)
            const statusFromInfo = info.status
            if (!statusFromInfo && info.error) {
                res.json({
                    status: 'FAILED',
                    message: 'Something wrong!!!'
                })
            } else {
                res.json({
                    status: 'SUCCESS',
                    message: 'Email send successfully'
                })
            }
        } else {
            res.json({
                status: 'FAILEd',
                message: 'Something wrong!!!'
            })
        }
    } catch (err) {
        console.log("Error occured in forgot password try catch block",err)
        return res.json({
            status: 'FAILED',
            err
        })
    }
}

