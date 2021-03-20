const express = require("express")
const cors = require("cors")
const fs = require('fs')
const patterns = require("./regexPatterns")

const app = express()
const PORT= 5000;

var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus:200,
}

app.use(cors())
app.use(express.json(corsOptions))

app.get('/userlist', (req, res) => {
    let users = fs.readFileSync('users.json')
    users =  JSON.parse(users)    
    res.send(users)
})

app.post('/adduser', (req, res) => {
    console.log(req.body)
    let currentUsers = JSON.parse(fs.readFileSync('users.json'))
    const newUser = req.body
    let {username, email, age} = newUser

    //username validation
    if (!patterns.username.test(username))
        return res.send({error: true, msg: 'Username must be between 3 and 16 characters. No special characters allowed'})
    
    let userDup = currentUsers.find((user) => user.username.toLowerCase() === username.toLowerCase())
    if (userDup)
        return res.send({error: true, msg: 'Username is already in use'})

    //email validation
    if (!patterns.email.test(email))
        return res.send({error: true, msg: 'Invalid email'})

    let mailDup = currentUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (mailDup)
        return res.send({error: true, msg: 'Email is already in use'})

    //age validation
    if (!patterns.age.test(age) || age<=0 || age>120 || Number(age)%1 !==0)
        return res.send({error: true, msg: 'Invalid age'})
    
    currentUsers.push(newUser)
    currentUsers = JSON.stringify(currentUsers)
    fs.writeFileSync('users.json', currentUsers)

    res.send({success: true, msg: 'User added successfully'})
})

app.listen(PORT, ()=>{
    console.log(`server runs on port ${PORT}`)
})