const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/userHelpers");

const verifyLogin = (req, res, next) => {
       if (req.session.userLogin) next();
       else res.redirect("/");
};

router.get("/", (req, res) => {
       if (req.session.userLogin) res.redirect("/home");
       else {
              let loginError = null;
              if (req.session.userLoginError) {
                     loginError = req.session.userLoginError;
                     req.session.userLoginError = false;
              }
              res.render("users/login", {
                     title: "Login",
                     loginError,
              });
       }
});

router.post("/login", (req, res) => {
       userHelpers
              .loginUser(req.body)
              .then((username) => {
                     req.session.userLogin = true;
                     req.session.user = username;
                     res.redirect("/home");
              })
              .catch((loginError) => {
                     req.session.userLoginError = loginError;
                     res.redirect("/");
              });
});

router.get("/signUp", (req, res) => {
       if (req.session.userLogin) res.redirect("/");
       else {
              let signUpError = null;
              if (req.session.userSignUpError) {
                     signUpError = req.session.userSignUpError;
                     req.session.userSignUpError = false;
              }
              res.render("users/signUp", {
                     title: "SignUp",
                     signUpError,
              });
       }
});

router.post("/signUp", (req, res) => {
       delete req.body.confirmPassword;
       userHelpers
              .registerUser(req.body)
              .then(() => {
                     req.session.userLogin = true;
                     req.session.user = req.body.username;
                     res.redirect("/home");
              })
              .catch((signUpError) => {
                     req.session.userSignUpError = signUpError;
                     res.redirect("/signUp");
              });
});

router.get("/home", verifyLogin, (req, res) => {
       let books = [
              {
                     bookTitle: "Descipline equals freedom - The field manuel",
                     bookImage: "https://www.ubuy.co.in/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzQxOEF2c1VocjBMLl9TUzQwMF8uanBn.jpg",
                     bookAuthor: "Jocko Willink",
                     bookDescription:
                            "Jocko Willink's methods for success were born in the SEAL Teams, where he spent most of his adult life, enlisting after high school and rising through the ranks to become the commander of the most highly decorated special operations unit of the war in Iraq. In Discipline Equals Freedom, Willink describes how he lives that mantra: the mental and physical disciplines he imposes on himself in order to achieve freedom in all aspects of life",
              },
              {
                     bookTitle: "Atomic Habits",
                     bookImage: "https://5.imimg.com/data5/SELLER/Default/2021/8/KK/HE/AI/135742206/atomic-habits-png-500x500.png",
                     bookAuthor: "James Clear",
                     bookDescription:
                            "A supremely practical and useful book. James Clear distils the most fundamental information about habit formation, so you can accomplish more by focusing on less. ’ Mark Manson, author of The Subtle Art of Not Giving People say when you want to change your life, you need to set big goals. But they’re wrong. World-renowned habits expert James Clear has discovered a simpler system for transforming your life",
              },
              {
                     bookTitle: "Complete English Grammer Rules",
                     bookImage: "https://images-platform.99static.com/jGKWsJkOPoRRc-U4QEp0k50foUs=/0x99:1000x1099/500x500/top/smart/99designs-contests-attachments/72/72902/attachment_72902899",
                     bookAuthor: "Peter Herring",
                     bookDescription:
                            "The grammar book for the 21st century has arrived, from the language experts at Farlex International and TheFreeD, the trusted reference destination with 1 billion+ annual visits. Farlex brings you the most comprehensive grammar guide yet: all the rules of English grammar, explained in simple, easy-to-understand terms",
              },
              {
                     bookTitle: "Macbeth",
                     bookImage: "https://www.ubuy.co.in/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzMxVjdlM0lEdDJMLl9TUzQwMF8uanBn.jpg",
                     bookAuthor: "William Shakespeare",
                     bookDescription:
                            "Fair is foul and foul is fair.”Macbeth, a Scottish general, is enslaved by his passion when a trio of witches prophesy that he would one day become the King of Scotland. Blinded by the lust for power, he succumbs to the evil wishes of Lady Macbeth, stabs King Duncan in his sleep and seizes the throne",
              },
              {
                     bookTitle: "Ulyses",
                     bookImage: "https://www.ubuy.co.in/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzQxTGh2SkswVU1MLl9TUzQwMF8uanBn.jpg",
                     bookAuthor: "James Joyce",
                     bookDescription:
                            "Tells of the diverse events which befall Leopold Bloom and Stephen Dedalus in Dublin on 16 June 1904, during which Bloom's wife, Molly, commits adultery. Initially deemed obscene in England and the USA, this novel, revolutionary in its Modernistic experimentalism, was hailed as a work of genius by W B Yeats, T S Eliot and Ernest Hemingway.",
              },
              {
                     bookTitle: "Jane Eyre",
                     bookImage: "https://www.ubuy.co.it/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzUxQ2hCS1NzZThMLl9TUzQwMF8uanBn.jpg",
                     bookAuthor: "Charlote Bronte",
                     bookDescription:
                            "A novel of intense emotional power, heightened atmosphere and fierce intelligence, Jane Eyre dazzled and shocked readers with its passionate depiction of a woman's search for equality and freedom on her own terms. Its heroine Jane endures loneliness and cruelty in the home of her heartless aunt and the cold charity of Lowood School",
              },
       ];
       res.render("users/home", {
              title: "Homepage",
              user: req.session.user,
              userPanel: true,
              books,
       });
});

router.get("/logout", (req, res) => {
       req.session.userLogin = false;
       req.session.user = null;
       res.redirect("/");
});

module.exports = router;
