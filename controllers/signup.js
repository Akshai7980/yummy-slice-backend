const { User, DeviceDetails } = require('../models')
const bcrypt = require('bcrypt')

exports.signup = async (req, res) => {
    const {
        username,
        email,
        password,
        mobileNumber,
        city,
        userDeviceId,
        role
    } = req.body;
    if (!username || !email || !password || !mobileNumber)
        return res.json({
            message: 'Enter your credentials!!!'
        })
    const validEmail = email.includes('@gmail.com')
    const strongPassword = password.length >= 8;
    if (!validEmail || !strongPassword)
        return res.json({
            message: !validEmail ? 'Enter valid email' : 'Enter a strong password'
        })
    try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const resultDeviceId = await DeviceDetails.findOne({
            attributes: ['deviceId'],
            where: {
                login: false,
                deviceId: userDeviceId
            }
        })
        if (resultDeviceId) {
            const deviceid = resultDeviceId.deviceId;
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                mobileNumber,
                city,
                deviceId: deviceid,
                role
            })
            if (user) {
                await DeviceDetails.update({ login: true }, {
                    where: { deviceId: userDeviceId }
                }).then(data => {
                    res.json({
                        status: 'SUCCESS',
                        user: {
                            username: user.username,
                            email: user.email,
                            mobileNumber: user.mobileNumber,
                            city: user.city,
                            role: user.role
                        }
                    })
                }).catch(err => {
                    console.log("Error occured in inside device details update", err)
                    res.json({
                        status: 'FAILED',
                        message: 'Internal server down!!!'
                    })
                })
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Internal server down!!!!'
                })
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Device id not found!!!'
            })
        }
    } catch (err) {
        console.log("<=========SignUp try catch error======>", err)
        return res.json({
            status: false,
            err
        })
    }
}
