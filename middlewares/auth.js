/*
checkNotAuthenticated:
회원가입, 로그인 직전 ->

checkAuthenticated:
로그인이랑, 로그아웃 되었을 경우


*/


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
    console.log("로그아웃되었습니다.")
  }
  
  module.exports = {
    checkNotAuthenticated,
    checkAuthenticated,
  };