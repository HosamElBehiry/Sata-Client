const dE = (res, e) => res.status(500).json({ success: false, e, emoji: "😥" });

const dSuc = (res, data) => res.status(200).json({ success: true, data });

const dCre = (res, data) => res.status(201).json({ success: true, data });

const dNotPermit = (res, data) =>
  res.status(403).json({ success: false, data });

module.exports = { dE, dSuc, dCre, dNotPermit };
