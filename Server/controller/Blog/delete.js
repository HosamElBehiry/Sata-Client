const Blog = require("../../models/Blog");
const blogFindCont = require("./find");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delBlog = await Blog.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// delete Many Blogs
const deleteMany = async (req, res) => {
  try {
    const dltBlogs = await Blog.deleteMany({ _id: { $in: req.body } });
    blogFindCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
