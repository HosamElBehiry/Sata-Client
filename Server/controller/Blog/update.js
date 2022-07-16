const Blog = require("../../models/Blog");
const keys = require("./keys");
const blogFndCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const updBlog = await Blog.findByIdAndUpdate(req.params.id, {
      $set: keys.getKeys(req),
    });
    blogFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
