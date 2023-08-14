const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const QRCode = require("qrcode");
const jsQr = require("jsqr");
const Jimp = require("jimp");
const width = 708;
const exec = require("child_process").exec;
const AdmZip = require("adm-zip");

//Convert Text to Qr photos

exports.generateQRCodeSync = () => {
  const file = fs.readFileSync(`${__dirname}/ZipFile/converted.zip`);
  const blob = Buffer.from(file).toString("base64");
  return new Promise(async (resolve, reject) => {
    const charPerPiece = 2000;
    const lengthOfBlob = blob.length;
    let l = 0;
    for (let i = 0; i < lengthOfBlob; i += charPerPiece) {
      let newSlice;
      if (i + charPerPiece < lengthOfBlob) {
        newSlice = blob.substring(i, i + charPerPiece);
      } else {
        newSlice = blob.substring(i, lengthOfBlob);
      }

      l++;
      try {
        QRCode.toFile(
          `${__dirname}/outputQr/new${l}.png`,
          [{ data: newSlice, mode: "byte" }],
          {
            errorCorrectionLevel: "L",
            version: 40,
            scale: 10,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
            width: width,
          }
        );
      } catch (error) {
        reject(error);
      }
    }

    resolve();
  });
};

//Convert files to zip

exports.createZipArchive = async () => {
  delete require.cache[`${__dirname}/index.js`];
  return new Promise((resolve, rejects) => {
    const zip = new AdmZip();
    const outputFile = `${__dirname}/ZipFile/converted.zip`;
    zip.addLocalFolder(`${__dirname}/DataFile`);
    zip.writeZip(outputFile);
    console.log(`Created zip successfully`);
    resolve();
  });
};

exports.convertImagestoVideo = () => {
  const file = fs.readFileSync(`${__dirname}/ZipFile/converted.zip`);
  const blob = Buffer.from(file).toString("base64");
  return new Promise((resolve, rejects) => {
    console.log("Process Started");
    const ffmpegCommand = `
  ffmpeg -framerate 1 -start_number 1 -i outputQr/new%d.png -c:v libx264 -r 1 -pix_fmt yuv420p -vf "scale=708:708" -t ${blob.length} video/converted.mp4
`;
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Error:", error);
        return;
      }
      console.log("FFmpeg command executed successfully");
    });
    resolve();
  });
};

//convertImagestoVideo -->

exports.convertVideoToFrames = async () => {
  delete require.cache[`${__dirname}/index.js`];
  return new Promise((resolve, rejects) => {
    const inputVideoPath = `${__dirname}/video/converted.mp4`;
    const outputImagePath = "frames/";
    const imagePrefix = "new";
    const frameInterval = 1;
    let frameCount = 0;
    // check if the folder exists
    if (!fs.existsSync(outputImagePath)) {
      fs.mkdirSync(outputImagePath);
    }
    ffmpeg(inputVideoPath)
      .on("filenames", (filenames) => {
        frameCount += filenames.length;
        console.log(
          `Extracting frames ${frameCount}-${
            frameCount + filenames.length - 1
          }:`,
          filenames
        );
      })
      .on("end", () => {
        console.log("Frame extraction completed.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error:", err);
      })
      .output(outputImagePath + imagePrefix + "%d.jpg")
      .outputOptions([`-vf fps=1/${frameInterval}`, "-q:v 2"])
      .run();
  });
};

//convert video frames to text

exports.convertFramesToText = async () => {
  delete require.cache[`${__dirname}/index.js`];
  return new Promise((resolve, rejects) => {
    fs.readdir(`${__dirname}/frames`, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        return;
      }
      const numberOfFiles = files.length;
      const process = async () => {
        let c = "";
        for (let i = 1; i <= numberOfFiles; i++) {
          const buffer = fs.readFileSync(`${__dirname}/frames/new${i}.jpg`);
          const image = await Jimp.read(buffer);
          const dataa = jsQr(image.bitmap.data, width, width);
          c += dataa.data;
        }

        return c;
      };
      process().then((c) => {
        const myBuffer = Buffer.from(c, "base64");
        fs.writeFileSync(`${__dirname}/operated.zip`, myBuffer);
        console.log("File Extraction conpleted!");
        resolve();
      });
    });
  });
};
