const database = require("../database/connection");
const collections = require("../database/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectId;

module.exports = {
       loginAdmin: (adminDetails) => {
              return new Promise(async (resolve, reject) => {
                     let admin = await database
                            .get()
                            .collection(collections.ADMIN_COLLECTION)
                            .findOne({ adminName: adminDetails.adminName });
                     if (admin) {
                            if (await bcrypt.compare(adminDetails.password, admin.password))
                                   resolve(admin.adminName);
                            else reject("Invalid Password");
                     } else {
                            reject("Invalid Email or Username");
                     }
              });
       },
       getAllUsers: () => {
              return new Promise(async (resolve, reject) => {
                     let users = await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .find()
                            .toArray();
                     resolve(users);
              });
       },
       deleteUser: (userId) => {
              return new Promise(async (resolve, reject) => {
                     await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .deleteOne({ _id: objectId(userId) });
                     resolve();
              });
       },
       getOneUser: (userId) => {
              return new Promise(async (resolve, reject) => {
                     let user = await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .findOne({ _id: objectId(userId) });
                     resolve(user);
              });
       },
       editUser: (userDetails) => {
              return new Promise(async (resolve, reject) => {
                     let userNameExist = await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .findOne({
                                   _id: {
                                          $ne: objectId(userDetails.userId),
                                   },
                                   username: userDetails.username,
                            });

                     if (userNameExist) reject("Username already taken by another user");
                     else {
                            let emailAddressExist = await database
                                   .get()
                                   .collection(collections.USER_COLLECTION)
                                   .findOne({
                                          _id: {
                                                 $ne: objectId(userDetails.userId),
                                          },
                                          emailAddress: userDetails.emailAddress,
                                   });
                            if (emailAddressExist) reject("Already have account in this email");
                            else {
                                   if (userDetails.password)
                                          userDetails.password = await bcrypt.hash(
                                                 userDetails.password,
                                                 10,
                                          );

                                   await database
                                          .get()
                                          .collection(collections.USER_COLLECTION)
                                          .updateOne(
                                                 {
                                                        _id: objectId(userDetails.userId),
                                                 },
                                                 {
                                                        $set: {
                                                               ...userDetails,
                                                        },
                                                 },
                                          );

                                   resolve();
                            }
                     }
              });
       },
       blockOrUnblockUser: (userId, blocked) => {
              return new Promise(async (resolve, reject) => {
                     blocked = blocked === "true" ? false : true;

                     await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .updateOne(
                                   {
                                          _id: objectId(userId),
                                   },
                                   {
                                          $set: {
                                                 blocked: blocked,
                                          },
                                   },
                            );
                     resolve();
              });
       },
       addNewUser: (userDetails) => {
              return new Promise(async (resolve, reject) => {
                     console.log(userDetails)
                     if (
                            await database
                                   .get()
                                   .collection(collections.USER_COLLECTION)
                                   .findOne({ username: userDetails.username })
                     )
                            reject("Usename already taken");
                     else if (
                            await database
                                   .get()
                                   .collection(collections.USER_COLLECTION)
                                   .findOne({ emailAddress: userDetails.emailAddress })
                     )
                            reject("Already have account in this email");
                     else {
                            userDetails.password = await bcrypt.hash(userDetails.password, 10);
                            userDetails.blocked = false;
                            await database
                                   .get()
                                   .collection(collections.USER_COLLECTION)
                                   .insert(userDetails);
                            resolve();
                     }
              });
       },
};


