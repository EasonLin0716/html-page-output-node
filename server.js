const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const secretPagesPassword = process.env.SECRET_PAGES_PASSWORD || "Gin";

app.use(express.static("public"));
app.use(cookieParser("ginsartworks"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);
});
app.get("/login", (req, res) => {
  const filePath = path.join(__dirname, "login.html");
  res.sendFile(filePath);
});
app.post("/login", (req, res) => {
  if (req.body.password && req.body.password === secretPagesPassword) {
    res.cookie("secret", req.body.password, {
      httpOnly: true,
      signed: true,
      maxAge: 1440000,
    });
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
});
app.get("/secret/:file", (req, res) => {
  if (
    req.signedCookies.secret &&
    req.signedCookies.secret === secretPagesPassword
  ) {
    const { path: requestFilePath } = req;
    const filePath = path.join(__dirname, "pages", requestFilePath);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});
app.get("*", (req, res) => {
  const { path: requestFilePath } = req;
  const filePath = path.join(__dirname, "pages", requestFilePath);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => console.log(`app listening on port ${port}`));
