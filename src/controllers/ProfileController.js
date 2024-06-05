const { isEmpty } = require("lodash");
const Customers = require("../models/customers");
const { uploadBlob, deleteBlob } = require("../services/azureStorage");

class ProfileController {
  //[POST] /api/profile
  async changeProfile(req, res) {
    const {
      customerID,
      customerName,
      phone,
      email,
      address,
      province,
      district,
      ward,
      defaultUrlImage,
    } = req.body;
    if (!customerID)
      return res.status(400).send({ data: "Profile not found", status: false });

    let statusUpload;
    // if (req.file) {
    //   statusUpload = await uploadBlob(req.file, customerID, customerName);
    //   if (!statusUpload?.status)
    //     return res
    //       .status(400)
    //       .send({ data: "Upload image failed", status: false });
    // }
    const urlImageAvatar = !isEmpty(statusUpload)
      ? `${process.env.URL_STORAGE_IMAGE}/${statusUpload?.urlImageAvatar}`
      : defaultUrlImage;

    const dataUpdate = {
      customerID,
      customerName,
      phone,
      email,
      address,
      province,
      district,
      ward,
      urlImageAvatar,
    };
    // await Customers.update(dataUpdate, {
    //   where: { id: customerID },
    // })
    //   .then((data) => {
    //     return data;
    //   })
    //   .catch((error) => res.status(501).send({ data: error, status: false }));
    res.status(200).send({ data: dataUpdate, status: true });
  }
}

module.exports = new ProfileController();
