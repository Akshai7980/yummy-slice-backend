const { User, Products, Orders } = require('../models')

exports.addReview = async (req, res) => {
    const {
        rating,
        reviewMessage,
        uuid,
        id
    } = req.body
    try {
        const user = await User.findOne({ where: { uuid } })
        if (user) {
            const orderDetails = await Orders.findOne({
                where: {
                    userId: user.id,
                    productId: id
                }
            })
            if (orderDetails) {
                const product = await Products.findOne({ where: { id } })
                if (product) {
                    await user.addProduct(product, {
                        through: {
                            rating, reviewMessage
                        }
                    }).then(data => {
                        res.json({
                            status: 'SUCCESS',
                            data
                        })
                    }).catch(err => {
                        console.log("Error occured in await", err)
                        res.json({
                            status: 'Failed',
                            message: 'Internal server error'
                        })
                    })
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'Product not available'
                    })
                }
            }else{
                res.json({
                    status: 'FAILED',
                    message: 'till you didnt purchase this product so you cant add review'
                })
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'User does not exist'
            })
        }
    } catch (err) {
        console.log("<===========Error occured inside add review try catch block==========>", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable!!!'
        })
    }
}

exports.getUserReview = async (req, res) => {
    const {
        uuid
    } = req.body
    try {
        await User.findOne({
            attributes: {
                exclude: ['password', 'OTP', 'id']
            },
            where: {
                uuid
            },
            include: [{ model: Products }]
        }).then(data => {
            res.json({
                status: 'SUCCESS',
                data
            })
        }).catch(err => {
            console.log("Error occured in get user review wait catch", err)
            res.json({
                status: 'FAILED',
                message: 'Internal server error'
            })
        })
    } catch (err) {
        console.log("<===========Error occured inside get user reviews try catch block==========>", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable!!!'
        })
    }
}

exports.getAllReviewsForSingleProduct = async (req, res) => {
    const {
        id
    } = req.body
    try {
        await Products.findOne({
            where: { id },
            include: [{ model: User, attributes: { exclude: ['password', 'OTP', 'id'] } }]
        })
            .then(data => {
                res.json({
                    status: 'SUCCESS',
                    data
                })
            }).catch(err => {
                console.log("Error occured in get all reviews for single product", err)
                res.json({
                    status: 'FAILED',
                    message: 'Internal server error'
                })
            })
    } catch (err) {
        console.log("<===========Error occured inside get All Reviews For Single Product try catch block==========>", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable!!!'
        })
    }
}

exports.getAllReviewsForAllProducts = async (req, res) => {
    try {
        await Products.findAll({
            include: [{ model: User, attributes: { exclude: ['password', 'OTP', 'id'] } }]
        })
            .then(data => {
                res.json({
                    status: 'SUCCESS',
                    data
                })
            }).catch(err => {
                console.log("Error occured in get all reviews for all products", err)
                res.json({
                    status: 'FAILED',
                    message: 'Internal server error'
                })
            })
    } catch (err) {
        console.log("<===========Error occured inside get All Reviews For All Product try catch block==========>", err)
        res.json({
            status: 'FAILED',
            message: 'Remote server unreachable!!!'
        })
    }
}
