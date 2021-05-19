const crypto = require("crypto");
const User = require("../../models/userModal");
const decrypt = (cipher) => {
  const decipher = crypto.createDecipher(
    process.env.ENCRYPTION_ALGO,
    process.env.CRYPTOJS_SECRET
  );
  var decrypted =
    decipher.update(cipher, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
};
const verifyEmail = async (req, res) => {
  const host = req.get("host");
  if (
    `${req.protocol}://${host}` ==
    `${process.env.PROTOCOL}://${process.env.HOST}`
  ) {
    //domain matched
    const encryptedID = req.query.a; //since a = id
    const encryptedTime = req.query.b; //since b = time
    console.log(encryptedID);
    console.log(encryptedTime);
    //decrypt ID and Time
    const decryptedID = decrypt(encryptedID);
    const decryptedTime = decrypt(encryptedTime);
    console.log("decryptedID : ",decryptedID," decryptedTime : ",decryptedTime);
    const user = await User.findById(decryptedID).exec();
    if (user) {
      const timeElapsed = (Date.now() - decryptedTime) / (1000 * 60); //in minutes;
      console.log(user);
      if (timeElapsed < process.env.EMAIL_LINK_VALIDITY) {
        //email link is clicked in valid time duration
        user.emailVerified = true;
        await user.save();
        console.log("email verified");
        res.cookie("emailVerified", user.emailVerified, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 5),
          httpOnly: false,
        });
        res.redirect("/dashboard");
      } else {
        //link not clicked in valid time duration
        res.status(400).send({errorMsg:"Invalid Link"});
        // res.render("sentEmailLinkAgain");
      }
    } else {
      res.status(400).send({ errorMsg: "Invalid request!" });
    }
  } else {
    //domain didn't matched
    res.status(400).send({ errorMsg: "Invalid request!" });
  }
};
module.exports = verifyEmail;
