const { DeviceDetails } = require('../models');

exports.registerDevice = async (req, res) => {
    const {
        deviceName,
        deviceId
    } = req.body
    try {
        const findDevice = await DeviceDetails.findOne({
            where: {
                deviceId
            }
        })
        if (findDevice) {
            res.json({
                status: 'FAILED',
                message: 'You are belongs to us.Signin please!!!',
                findDevice
            })
        } else {
            await DeviceDetails.create({
                deviceId,
                deviceName
            }).then(response => {
                if (response) {
                    res.json({
                        status: 'SUCCESS',
                        response
                    })
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'couldn"t complete'
                    })
                }
            }).catch(err => {
                console.log("Inside await method", err)
                res.json({
                    status: 'FAILED',
                    message: 'Something wrong!!!'
                })
            })
        }
    } catch (err) {
        console.log("Error in userDevice Registering", err);
        res.json({
            status: 'FAILED',
            message: 'Something wrong!!!'
        })
    }
}
