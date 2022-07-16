const Users = require("../../models/Users");
const usrFindCont = require("./find");
const usrFndRoleCont = require("./users");
const vendDltCont = require("../Vendor/delete");
const delvDltCont = require("../Delivery/update");
const workDltCont = require("../Worker/delete");
const { dE } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const usrDataFnd = await Users.findById(req.params.id);
    const usrData = await Users.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    if (usrDataFnd.role === "vendor") {
      vendDltCont.deleteByUsrId(req, res);
    } else if (usrDataFnd.role === "delivery") {
      delvDltCont.deleteByUsrId(req, res);
    } else if (usrDataFnd.role === "worker") {
      workDltCont.deleteByUsrId(req, res);
    }
    usrFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const deleteMany = async (req, res) => {
  try {
    req.usrData = await Users.findById(req.body[0]);
    const usrData = await Users.updateMany(
      { _id: { $in: req.body } },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    if (req.usrData.role === "vendor") {
      vendDltCont.deleteMany(req, res);
    } else if (req.usrData.role === "delivery") {
      delvDltCont.deleteMany(req, res);
    } else if (req.usrData.role === "worker") {
      workDltCont.deleteMany(req, res);
    }
    usrFndRoleCont.findByRole(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
