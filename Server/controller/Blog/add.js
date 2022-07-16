const Blog = require("../../models/Blog");
const blogFindCont = require("./find");
const keys = require("./keys");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const newBlog = await new Blog(keys.getKeys(req)).save();
    req.newBlog = newBlog;
    blogFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
