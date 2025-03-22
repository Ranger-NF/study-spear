import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // For initial development, bypass authentication
  next();
  
  // Uncomment below for actual authentication
  /*
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
  */
};

export default authenticateToken; 