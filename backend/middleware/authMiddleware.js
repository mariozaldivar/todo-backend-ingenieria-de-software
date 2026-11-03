const jwt = require('jsonwebtoken')
const asyncHandler = require ('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async(req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //obtenemos el token
        token = req.headers.authorization.split(' ')[1]

        //verificamos que el token este firmado por nuestro back
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        //obtener los datos del usuario logueado
        req.user = await User.findById(decoded.id_usuario).select('-password')

        next()

    } else {
        res.status(401)
        throw new Error("Acceso no autorizado")
    }

    if(!token) {
        res.status(401)
        throw new Error("Acceso no autorizado, no proporcionaste un token")
    }
})

module.exports = protect