const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async(email, password,done) => {
        const user = await getUserByEmail(email);
        if(user == null){
            return done(null, false, { message: "No user with that email"}); //자격증명 이메일 부분에서 유효하지 않은 경우
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                console.log(12345);
                return done(null, user); //자격증명이 유효한 경우
            } else {
                return done(null, false, {message: 'Password incorrect'}) //자격증명 비밀번호 부분에서 유효할 경우
            }
        } catch(err) {
            return done(e) //예외 발생하는 경우
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id)); // 어떠한 데이터를 저장할지 선택
    passport.deserializeUser(async (id, done) => { // 매 요청시 실행해줌
        return done(null, await getUserById(id))
    })
}


module.exports = initialize;