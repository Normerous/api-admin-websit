const admin = require("firebase-admin");
const uuidv1 = require('uuid').v1;
const uuidv4 = require('uuid').v4;
const cerdentailAdmin = require("./ecommerce-admin-c177d-910b4f0c3a1f.json");
const App = admin.initializeApp({
    credential: admin.credential.cert(cerdentailAdmin),
    storageBucket: `gs://ecommerce-admin-c177d.appspot.com`
});
class FirebaseService {
    constructor() {
        this.storage = admin.storage().bucket();
    }

    generateName() {
        const v1options = {
            node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
            clockseq: 0x1234,
            msecs: new Date().getTime(),
            nsecs: 5678,
        };
        return uuidv1(v1options);
    }

    uploadImage(file) {
        let namefile = this.generateName();
        let imagename = file.originalname;
        file.originalname = namefile;
        return new Promise((resolve, reject) => {
            const blob = this.storage.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                }
            });

            blobStream.on("error", (err) => {
                reject({ message: err.message, status: "error" });
            });
            blobStream.on("finish", async () => {
                const publicUrl = `https://storage.googleapis.com/ecommerce-admin-c177d.appspot.com/${blob.name}`;
                try {
                    await this.storage.file(file.originalname).makePublic();
                } catch (err) {
                    reject({
                        message:
                            `Uploaded the file successfully: ${file.originalname}, but public access is denied!`,
                        status: "error"
                    });
                }

                resolve({
                    message: "Uploaded the file successfully: " + file.originalname,
                    imagename,
                    location: file.originalname,
                    url: publicUrl
                });
            });

            blobStream.end(file.buffer);
        });
    }

    async deleteImage(location) {
        return await this.storage.file(location).delete().then(() => ({ status: "success" })).catch(err => ({ status: "error" }));
    }
}
module.exports = FirebaseService;