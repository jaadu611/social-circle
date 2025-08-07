export const protect = async (req, res, next) => {
  const { userId } = await req.auth();
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
