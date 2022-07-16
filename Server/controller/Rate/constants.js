const delivObj = {
  path: "delivery",
  populate: {
    path: "user",
    select: "fullname image email",
  },
  select: "user",
};
const vendorObj = {
  path: "vendor",
  populate: {
    path: "user",
    select: "fullname image email",
  },
  select: "user",
};

module.exports = {
  delivObj,
  vendorObj,
};
