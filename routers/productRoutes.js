const router = require("express").Router();
const { Product } = require("../models/index");
const { processFileMiddleware } = require("../configs/middleware");
const FirebaseService = require("../service/FirebaseService");
const firebasestorage = new FirebaseService();
router.route("/get").get((req, res, next) => {
    Product.find({}, (err, result) => {
        if (err)
            return res.status(400)
                .json({ status: "error", msg: "Get product Fail." });
        res.status(200).json({
            status: "success",
            auth: true,
            msg: "Get product success",
            result: result,
        });
    });
});
router.route("/add").post(async (req, res) => {
    try {
        await processFileMiddleware(req, res);
        console.log(!req.file)
        console.log(req.body)
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const { name, price, amount, description } = req.body;
        const uploadImage = await firebasestorage.uploadImage(req.file).then(e => e).catch(e => e);
        console.log("uploadImage", uploadImage);
        if (uploadImage.status === "error") throw uploadImage;

        const newProduct = new Product({
            name,
            price,
            amount,
            description,
            url: uploadImage.url,
            imagename: uploadImage.imagename.slice(0, 100),
            location: uploadImage.location
        });
        newProduct.save((err, result) => {
            if (err)
                return res
                    .status(400)
                    .json({ status: "error", msg: "Add product Fail.111", err });
            res.status(200).json({
                status: "success",
                msg: "Add product Success.",
                result: result,
            });
        });
    } catch (error) {
        res.status(400)
            .json({ status: "error", msg: "Add product Fail.222", error });
    }
});
router.route("/edit").post((req, res) => {
    const { _id, name, price, amount, description } = req.body;
    Product.findOne({ _id: _id }, (err, result) => {
        if (err)
            return res
                .status(400)
                .json({ status: "error", msg: "Edit product Fail." });


        if (!result) return res
            .status(400)
            .json({ status: "error", msg: "Data not found." });

        result.name = name;
        result.price = price;
        result.amount = amount;
        result.description = description;
        result.save((errSave, resultSave) => {
            if (errSave)
                return res.send({ status: "error", msg: "Edit product Fail." });
            res.status(200).send({
                status: "success",
                msg: "Edit product Success.",
                result: resultSave,
            });
        })
    });
});
router.route("/delete").delete(async (req, res) => {
    const { _ids, location } = req.body;
    Product.deleteOne({ _id: _ids }, async err => {
        if (err) return res
            .status(400)
            .json({ status: "error", msg: "Delete product Fail." });

        const dleleteImage = await firebasestorage.deleteImage(location);
        console.log("dleleteImage", dleleteImage);

        res.status(200).json({
            status: "success",
            msg: "Delete product Success."
        });
    });
});
module.exports = router;