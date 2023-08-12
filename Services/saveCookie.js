function SaveToCookie(req, userToken) {
  const numberOfdays = 1;
  req.session.cookie.maxAge = numberOfdays * 24 * 60 * 60 * 1000;
  req.session.userToken = userToken;
  req.session.isloggedIn = true;
  req.session.cookie.expires = false;
}
export { SaveToCookie }