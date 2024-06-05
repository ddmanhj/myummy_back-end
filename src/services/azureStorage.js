const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const fs = require("fs").promises;
const mime = require("mime-types");

// Enter your storage account name and shared key
const accountName = `${process.env.ACCOUNT_NAME_STORAGE_AZURE}`;
const accountKey = `${process.env.ACCOUNT_KEY_STORAGE_AZURE}`;

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

// Tạo BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Lấy tên container và tạo một client cho container đó
const containerName = "myummy";
const containerClient = blobServiceClient.getContainerClient(containerName);

//upload file storage azure
exports.uploadBlob = async (file, customerID, customerName) => {
  try {
    // Determine the Content-Type
    const contentType =
      mime.lookup(file.originalname) || "application/octet-stream";

    // Determine the file extension based on the Content-Type
    const extension = mime.extension(contentType);

    // Create a unique name for the blob
    const blobName = await `avatarCustomer-${customerID}-${customerName}`;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Read the file into a Buffer
    const fileBuffer = await fs.readFile(file.path);

    // Upload the Buffer with Content-Type
    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    return {
      status: true,
      urlImageAvatar: blobName,
    };
  } catch (error) {
    console.error("Error uploading blob:", error.message);
  }
};

//delete Image on storage azure
exports.deleteBlob = async (nameFile) => {
  // Lấy blob client (Lấy thông tin file trong container)
  const blobClient = containerClient.getBlobClient(nameFile);

  // Xóa blob
  await blobClient.delete();
};
