import User from "../../models/User.js"

const signup = async (req, res) => {
    try {
        const { email, username, role, password, permissions, mobile } = req.body
    console.log(req.body)
    const userExist = await User.findOne({ where: { email } })
    console.log(userExist)

    if (userExist == null) {
        await User.create({ email, username, role, password, permissions, mobile })
    }

    res.json({
        message:'User created successfully'
    })
    } catch (error) {
        console.log(error)
    }
    
}


export default signup