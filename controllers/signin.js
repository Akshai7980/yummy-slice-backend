const { User } = require("../models")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config()


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.json({
            message: 'Enter your credentials!!!'
        })
    const validEmail = email.includes('@gmail.com')
    if (!validEmail)
        return res.json({
            message: 'Enter valid email!!!'
        })
    try {
        await User.findOne({
            attributes: ['uuid', 'username', 'role', 'password'],
            where: {
                email
            }
        }).then(userInfo => {
            if (userInfo) {
                const decrypted = bcrypt.compareSync(password, userInfo.password);
                if (decrypted) {
                    const user = {
                        uuid: userInfo.uuid,
                        username: userInfo.username
                    }
                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                    return res.json({
                        auth: true,
                        status: 'SUCCESS',
                        token: token,
                        user
                    })
                } else {
                    return res.json({
                        auth: false,
                        status: 'FAILED',
                        message: 'User not exist'
                    })
                }
            } else {
                return res.json({
                    auth: false,
                    status: 'FAILED',
                    message: 'User not exist'
                })
            }
        }).catch(err =>
            res.json({
                status: 'FAILED',
                err
            }))
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 'FAILED',
            err
        })
    }

}

exports.getAllUsers = async (req, res) => {
    try {
        await User.findAll()
            .then(data => {
                return res.json({
                    status: 'SUCCESS',
                    data
                })
            }).catch(err => {
                console.log("Error occured in get all users await", err)
                return res.json({
                    status: 'FAILED',
                    message: 'Internal server down'
                })
            })
    } catch (err) {
        console.log("Error occured in get all users try catch block", err)
        return res.json({
            status: 'FAILED',
            message: 'Remote server unreachable'
        })
    }
}

exports.viewProfile = async (req, res) => {
    const {
        uuid
    } = req.body
    try {
        await User.findOne({
            attributes: { exclude: ['id', 'password', 'OTP'] },
            uuid
        }).then(data => {
            res.json({
                status: 'SUCCESS',
                data
            })
        }).catch(err => {
            console.log("<================Error occured inside await=============>", err)
            res.json({
                status: 'FAILED',
                message: 'Internal server error!!!'
            })
        })

    } catch (err) {
        console.log("<===============Error occured in view Profile try catch block============>", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable!!!'
        })
    }
}
