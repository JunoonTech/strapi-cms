const sharp = require('sharp');

module.exports = (config, { strapi }) => async (ctx, next) => {
  const file = ctx.request.files.files;
  await next();
  if (file && file.type.includes('image')){
    const body = ctx.response.body;
    const img = body?.length ? body[0]: body;
    const thumbnail = img.formats.thumbnail;
    
    const resizedImageBuffer = await sharp(file.path)
      .resize(thumbnail.width)
      .webp({quality: 5})
      .jpeg({quality: 5})
      .png({quality: 5, compressionLevel: 9})
      .toBuffer();

    const base64 = 'data:'+ file.type + ';base64,' + resizedImageBuffer.toString('base64');
    
    await strapi.entityService.update('plugin::upload.file', img.id, { data: { base64 } });
  }
};