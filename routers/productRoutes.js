const router = require("express").Router();
const { Product } = require("../models/index")
router.route("/get").get((req, res, next) => {
    Product.find({}, (err, result) => {
        if (err)
            return res.status(400)
                .json({ status: "error", msg: "Get product Fail." });
        res.status(200).json({
            status: "success",
            auth: true,
            msg: "Get product",
            result: result,
        });
    });
});
router.route("/add").post((req, res) => {
    const { name, price, amount } = req.body;
    const newProduct = new Product({
        name,
        price,
        amount
    });
    newProduct.save((err, result) => {
        if (err)
            return res
                .status(400)
                .json({ status: "error", msg: "Add product Fail." });
        res.status(200).json({
            status: "success",
            msg: "Add product Success.",
            result: result,
        });
    });
});
router.route("/update").post((req, res) => {
    const { _id, name, price, amount } = req.body;

    Product.findOne({ _id: _id }, (err, result) => {
        if (err)
            return res
                .status(400)
                .json({ status: "error", msg: "Edit product Fail." });


        result.name = name;
        result.price = price;
        result.amount = amount;
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
router.route("/delete").delete((req, res) => {
    const { _ids } = req.body;
    Product.deleteMany({ _id: { $in: _ids } }, err => {
        if (err) return res
            .status(400)
            .json({ status: "error", msg: "Delete product Fail." });

        setTimeout(() => {
            res.status(200).json({
                status: "success",
                msg: "Delete product Success."
            });
        }, 3000)
    });
});

module.exports = router;