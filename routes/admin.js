const express = require("express");
const router = express.Router();
const adminHelpers = require("../helpers/adminHelpers");

const verifyLogin = (req, res, next) => {
       if (req.session.adminLogin) next();
       else res.redirect("/admin");
};

router.get("/", (req, res) => {
       if (req.session.adminLogin) res.redirect("/admin/home");
       else {
              let loginError = null;
              if (req.session.adminLoginError) {
                     loginError = req.session.adminLoginError;
                     req.session.adminLoginError = false;
              }
              res.render("admin/login", {
                     admin: true,
                     title: "Login",
                     loginError,
              });
       }
});

router.post("/login", (req, res) => {
       adminHelpers
              .loginAdmin(req.body)
              .then((adminName) => {
                     req.session.adminLogin = true;
                     req.session.admin = adminName;
                     res.redirect("/admin/home");
              })
              .catch((loginError) => {
                     req.session.adminLoginError = loginError;
                     res.redirect("/admin");
              });
});

router.get("/home", verifyLogin, (req, res) => {
       adminHelpers.getAllUsers().then((users) => {
              res.render("admin/home", {
                     title: "Homepage",
                     admin: req.session.admin,
                     users,
                     adminPanel: true,
                     newUserAdded: req.session.newUserAdded,
                     userEdited: req.session.userEdited,
              });
              req.session.newUserAdded = false;
              req.session.userEdited = false;
       });
});

router.get("/logout", (req, res) => {
       console.log("admin logout");
       req.session.adminLogin = false;
       req.session.admin = null;
       res.redirect("/admin");
});

router.get("/deleteUser/:id", verifyLogin, (req, res) => {
       adminHelpers.deleteUser(req.params.id).then(() => {
              res.redirect("/admin/home");
       });
});

router.get("/editUser/:id", verifyLogin, (req, res) => {
       adminHelpers.getOneUser(req.params.id).then((userDetails) => {
              res.render("admin/editUser", {
                     title: "Edit User",
                     adminPanel: true,
                     admin: req.session.admin,
                     userDetails,
                     editError: req.session.editError,
              });
              req.session.editError = null;
       });
});

router.post("/saveEdits", (req, res) => {
       delete req.body.confirmPassword;
       adminHelpers
              .editUser(req.body)
              .then(() => {
                     req.session.userEdited = true;
                     res.redirect("/admin/home");
              })
              .catch((editError) => {
                     req.session.editError = editError;
                     res.redirect("/admin/editUser/" + req.body.userId);
              });
});

router.get("/blockUser/:id/:blocked", verifyLogin, (req, res) => {
       adminHelpers.blockOrUnblockUser(req.params.id, req.params.blocked).then(() => {
              res.redirect("/admin/home");
       });
});

router.get("/addUser", verifyLogin, (req, res) => {
       res.render("admin/addUser", {
              title: "Add user",
              adminPanel: true,
              admin: req.session.admin,
              addUserError: req.session.addUserError,
       });
       req.session.addUserError = null;
});

router.post("/addUser", async (req, res) => {
       delete req.body.confirmPassword;
       await adminHelpers
              .addNewUser(req.body)
              .then(() => {
                     req.session.newUserAdded = true;
                     res.redirect("/admin/home");
              })
              .catch((addUserError) => {
                     req.session.addUserError = addUserError;
                     res.redirect("/admin/addUser");
              });
});

module.exports = router;
