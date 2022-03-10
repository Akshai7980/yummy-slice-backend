const { Notification, User } = require('../models')

exports.notifications = async (req, res) => {
    const {
        title,
        content,
        uuid
    } = req.body
    try {
        let user
        if (uuid !== '' && uuid !== undefined) {
            user = await User.findOne({
                attributes: ['id'],
                where: { uuid }
            })
        }
        let userId = user ? user.id : null
        await Notification.create({
            title,
            content,
            userId
        }).then(data => {
            res.json({
                status: 'SUCCESS',
                message: 'Notification added',
                data
            })
        }).catch(err => {
            console.log("Error occured in notifications try catch block", err)
            res.json({
                status: 'FAILED',
                message: 'Couldnt complete'
            })
        })
    } catch (err) {
        console.log("Error occured in notifications", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable'
        })
    }
}

exports.getNotifications = async (req, res) => {
    try {
        await Notification.findAll({
            attributes: { exclude: ['id'] },
            where: { userId: null }
        })
            .then(data => {
                res.json({
                    status: 'SUCCESS',
                    data
                })
            }).catch(err => {
                console.log("Error occured in await", err)
                res.json({
                    status: 'FAILED',
                    message: 'Couldnt get notifications'
                })
            })
    } catch (err) {
        console.log("Error ocuured in notifications getNotifications try catch block", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable'
        })
    }
}

exports.getNotificationById = async (req, res) => {
    const { uuid } = req.body
    try {
        const user = await User.findOne({
            where: { uuid },
            include: [{ model: Notification }]
        })
        if (user) {
            res.json({
                status: 'SUCCESS',
                notifications: user.Notifications
            })
        } else {
            res.json({
                status: 'FAILED',
                message: 'Internal server error'
            })
        }
    } catch (error) {
        console.log("Error occured in try catch block", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable'
        })
    }
}
