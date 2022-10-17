const database = require("../database/connection");
const collections = require("../database/collections");
const bcrypt = require("bcrypt");

module.exports = {
       registerUser: (userDetails) => {
              return new Promise(async (resolve, reject) => {
                     let usersCollection = await database
                            .get()
                            .collection(collections.USER_COLLECTION);

                     if (await usersCollection.findOne({ username: userDetails.username }))
                            reject("Uss.blockename already taken");
                     else if (
                            await usersCollection.findOne({
                                   emailAddress: userDetails.emailAddress,
                            })
                     )
                            reject("Already have account in this email");
                     else {
                            userDetails.password = await bcrypt.hash(userDetails.password, 10);
                            userDetails.blocked = false;
                            await usersCollection.insert(userDetails);
                            resolve();
                     }
              });
       },
       loginUser: (userDetails) => {
              return new Promise(async (resolve, reject) => {
                     let user = await database
                            .get()
                            .collection(collections.USER_COLLECTION)
                            .findOne({
                                   $or: [
                                          { username: userDetails.emailAddressOrUsername },
                                          { emailAddress: userDetails.emailAddressOrUsername },
                                   ],
                            });
                     if (user)
                            if (await bcrypt.compare(userDetails.password, user.password))
                                   if (user.blocked)
                                          reject("You can't login, Admin have blocked you");
                                   else resolve(user.username);
                            else reject("Invalid Password");
                     else reject("Invalid Email or Username");
              });
       },
};
