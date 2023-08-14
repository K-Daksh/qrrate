const index = require("./index");
const express = require("express");
const fileUpload = require("express-fileupload");
const cacheControl = require("cache-control");
const fs = require("fs");
const app = express();
app.use(
  cacheControl({
    noCache: true,
  })
);
app.use(fileUpload());
const PORT = 5000 || process.env.PORT;

//upload the files here

app.post("/upload", function (req, res) {
  if (req.files && Object.keys(req.files).length !== 0) {
    const uploadedFile = req.files.uploadFile;
    const uploadPath = __dirname + "/DataFile/" + uploadedFile.name;
    uploadedFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
        res.send("Failed !!");
      } else res.send("Successfully Uploaded !!");
    });
  } else res.send("No file uploaded !!");
});

//upload video here

app.post("/uploadvideo", function (req, res) {
  if (req.files && Object.keys(req.files).length !== 0) {
    fs.unlink(`${__dirname}/video/converted.mp4`, function (err) {
      if (err) {
        console.log("Successfully deleted the video file.");
      }
    });
    const uploadedFile = req.files.uploadFile;
    const uploadPath = __dirname + "/video/" + "converted.mp4";
    uploadedFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
        res.send("Failed !!");
      } else res.send("Successfully Uploaded !!");
    });
  } else res.send("No file uploaded !!");
});

//convert to zip -->

app.get("/tozip", async (req, res) => {
  await index.createZipArchive();
  res.send("file archeived successfully");
});

//convert from video to file -->

app.get("/tofile", async (req, res) => {
  await index.convertVideoToFrames();
  await index.convertFramesToText();
  res.send("File retreived successfully");
});

//clear the dirs -->
app.get("/clear", (req, res) => {
  const fileNamesToRemove = [
    "DataFile",
    "frames",
    "outputQr",
    "ZipFile",
    "video",
  ];
  fileNamesToRemove.forEach((e) => {
    const fileData = fs.readdirSync(`${__dirname}/${e}`);
    for (let i = 1; i <= fileData.length; i++) {
      fs.unlink(`${__dirname}/${e}/${fileData[i - 1]}`, function (err) {
        if (err) {
          console.log("Successfully deleted.");
        }
      });
    }
  });
  fs.unlink(`${__dirname}/operated.zip`, function (err) {
    if (err) {
      console.log("Successfully deleted the output files.");
    }
  });
  res.send("Dir cleared successfully");
});

//Download Files, you can download the video here

app.get("/downloadvid", function (req, res) {
  fs.readFile(`${__dirname}/video/converted.mp4`, (err, data) => {
    if (!err) {
      res.download(__dirname + "/video/converted.mp4", function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

//Download Files, you can download the file here

app.get("/dfile", function (req, res) {
  fs.readFile(`${__dirname}/operated.zip`, (err, data) => {
    if (!err) {
      res.download(`${__dirname}/operated.zip`, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

// Convert to QR

app.get("/toqr", async (req, res) => {
  await index.generateQRCodeSync();
  res.send("Qr generated successfully");
});

// Convert to Video

app.get("/tovideo", async (req, res) => {
  await index.convertImagestoVideo();
  res.send("Video generated successfully");
});

// GET request to the root of the app
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Dormammu, I've come to bargain!

app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
