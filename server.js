require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const validUrl = require("valid-url");

const port = process.env.PORT || 3000;
let urlMap = ["https://freecodecamp.org/"];

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (_, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:id", (req, res) => {
  if (!urlMap[parseInt(req.params.id)]) {
    res.json({ error: "Invalid ID" });
  } else {
    res.redirect(urlMap[parseInt(req.params.id)]);
  }
});

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;

  if (!validUrl.isUri(url)) {
    res.json({ error: "invalid url" });
  } else if (urlMap.indexOf(url) > -1) {
    res.json({
      original_url: url,
      short_url: urlMap.indexOf(url),
    });
  } else {
    urlMap = [...urlMap, url];
    res.json({
      original_url: url,
      short_url: urlMap.length - 1,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
