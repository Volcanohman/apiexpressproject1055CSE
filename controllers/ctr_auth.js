const srvAuth = require('../services/srv_auth');
const hlpJWT = require('../helpers/hlp_JWT');
const nodemailer = require('nodemailer');

login = async function (req, res, next){
    let user = await srvAuth.getByEmail(req.body.email);
    if(user){
        const check = await srvAuth.comparePass(req.body.password, user.password);
        if(check){
            res.json(prepareUser(user));
        }
        else{
            res.status(403);
            res.json({error: 'Wrong Password'})
        }
    }
    else{
        res.status(403);
        res.json({error: 'The user is not registered. Register your account first'})
    }
}

register = async function (req,res,next) {
    const input = {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: await srvAuth.cryptPass(req.body.password),
        city: req.body.city,
        gender: req.body.gender
    }
    const alreadyRegistered = await srvAuth.checkDuplicate(input);
    if (alreadyRegistered.length) {
        res.status(403)
        res.json('User already registered')
    } else {
        const result = await srvAuth.register(input);
        let user = await srvAuth.getById(result.insertId);
        await sendWelcomeEmail(req.body.name, req.body.email);
        res.json(prepareUser(user));
    }
}

prepareUser = function (user){
    delete(user.password);
    user.apiToken = hlpJWT.generateAccessToken(user);
    return user;
}

function createHtml(name){
    return `
<div style="background: #eee; padding: 30px 20px;">
<div style="
border: 1px solid #ddd; 
max-width: 550px; 
background: white; 
margin: 0 auto;
padding: 10px 20px;
">
<p><img src="https://www.pngmart.com/files/20/Thank-You-Calligraphy-PNG-Free-Download.png" alt="Thank you!" width="550"</p>
<p>Hi ` + name + `,</p>
<p>Thanks for creating your account on our platform!</p>
<p>If you need any help from us, please contact us anytime.</p>
<p>Sincerly,</p>
<p>PR Representative</p>
<p>John Doe</p>
    `;
}

async function sendWelcomeEmail(name, email){
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_CODE
        }
    });
    const result = await transporter.sendMail(
        {
            from: "ipproject1055cse@gmail.com",
            to: email,
            subject: "Thank you for joining us!",
            html: createHtml(name)
        }
    )
}

module.exports = {
    login,
    register,
    prepareUser
}