import User from "../../models/User.js"
import sequelize from "../../utils/database.js"

const login = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    try {
        if (!email || !password) {
            return res.status(404).json({ error: "Please fill in all fields" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (password !== user.password) {
            return res.status(401).json({
                message: "Password is Incorrect"
            })
        }


        return res.status(200).json({
            message:"user found",
            user
        })
    } catch (error) {

    }

}


export default login