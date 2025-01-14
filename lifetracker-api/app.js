const express = require("express")
const cors = require("cors")
const morgan = require("morgan") 
const security = require("./middleware/security")
const authRoutes = require('./routes/auth')
const nutritionRoutes = require('./routes/nutrition')
const activityRoutes = require('./routes/activity')
const {NotFoundError} = require("./utils/errors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use(security.extractUserFromJwt)

app.use("/auth", authRoutes)
app.use("/nutrition", nutritionRoutes)
app.use("/activity", activityRoutes)

app.get("/", async (req, res, next) => {
    res.status(200).json({ "ping": "pong"})
})

app.use((req,res,next) => {
    return next(new NotFoundError())
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || "Something went wrong in the application"
    
    return res.status(status).json({
        error: {message, status}
    })
})

module.exports = app