const Blog = require("../../models/Blog");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const blogData = await Blog.findById(
      req.newBlog ? req.newBlog._id : req.params.id
    );
    dSuc(res, blogData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findAll = async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    dSuc(res, allBlogs);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERRRO"));
  }
};

module.exports = { findById, findAll };
