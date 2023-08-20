# [Qrrate](https://qrrate.onrender.com) 🛸

***

#### Introducing Qrrate

Qrrate, the precursor to our updated service Altcode, was an open-source web application built on Node.js. It offered a unique approach to file management by allowing users to convert files of various formats into video files. However, unlike the later versions, Qrrate required users to download the converted files and manually upload them to YouTube. (Compression ratio is around 10x and still has almost complete chances for the file to get corrupted during youtube upload and download, on the other hand, the newer version of the same called **Altcode-Qrrate** 
 has a far better **ratio of 3.2x** and has a ~100% conversion rate)

- __Key Features:__

- Format Conversion: Qrrate excelled at converting a wide range of file types into video format, enabling users to potentially store files on YouTube.

- User-Initiated YouTube Upload: With Qrrate, users had to download the converted video files and then independently upload them to their YouTube accounts. This process allowed for storage on YouTube but required a manual upload step.

- Important Note: While Qrrate introduced a creative way to utilize YouTube for file storage, users should be aware of the practicality and time commitment involved in manually uploading files to YouTube.
## Tech

Altcode uses numerous technologies for advanced file processing:

- Node js
- Jimp
- ffmpeg
- adm-zip
- express-fileupload
- Js
 

## Installation

Altcode was developed on [Node.js](https://nodejs.org/) 8.13.0 .

Install the dependencies and start the server.

```sh
cd altcode
npm install
npm run start
```






## License

__Mozilla Public License 2.0__
