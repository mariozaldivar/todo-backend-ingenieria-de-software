const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const User = require('../models/usersModel')

const register = asyncHandler(async(req, res) => {
    //desestructuramos el body
    const {name, email, password} = req.body

    //validamos los datos
    if(!name ) {
        res.status(400)
        throw new Error ("Favor de teclar el nombre")
    }

    if(!email) {
        res.status(400)
        throw new Error ("Favor de teclar el email")
    }

    if(!password) {
        res.status(400)
        throw new Error ("Favor de teclar el password") 
    } 

    //verificar que el usuario no exista
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    }

    //hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //crear el usuario 
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password:user.password
        })
    }
})

const login = asyncHandler(async(req, res) => {
    //desestructurar el body
    const {email, password} = req.body

    const user = await User.findOne({email})

    //si el usuario existe de una vez verificamos el password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email:user.email,
            token: generarToken(user.id)
        })
    } else {
        res.status(401)
        throw new Error("Credenciales incorrectas")
    }


})

const data = asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
})

const generarToken = (id_usuario) => {
    return jwt.sign({id_usuario}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, register, data
}