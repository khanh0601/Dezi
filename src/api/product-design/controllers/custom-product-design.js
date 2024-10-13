'use strict';
const fs = require('fs');
const parse = require('csv-parse/sync').parse;

module.exports = {
  async importData(ctx) {
    try {
      // Kiểm tra xem file có tồn tại không
      if (!ctx.request.files || !ctx.request.files.files) {
        return ctx.send({ error: 'No file uploaded' }, 400);
      }

      const files = ctx.request.files.files;
      const filePath = Array.isArray(files) ? files[0].path : files.path;

      // Đọc file dữ liệu
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse dữ liệu từ file CSV
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });

      const createdDesigns = [];

      for (const record of records) {
        // Nếu product_categories không tồn tại hoặc rỗng, bỏ qua
        let validCategoryIds = [];
        if (record.product_categories && record.product_categories.trim() !== '') {
          const categoryNames = record.product_categories.split(',');
          validCategoryIds = await Promise.all(categoryNames.map(async (name) => {
            const category = await strapi.db.query('api::product-category.product-category').findOne({
              where: { name }
            });
            return category ? category.id : null;
          }));
          validCategoryIds = validCategoryIds.filter(id => id !== null);
        }

        let validTags = [];
        if (record.tags && record.tags.trim() !== '') {
          validTags = record.tags.split(',');
        }

        // Chuyển đổi Description từ chuỗi thành định dạng Slate hợp lệ
        const descriptionSlateFormat = [
          {
            type: 'paragraph',
            children: [{ text: record.description || '' }],
          },
        ];

        const design = await strapi.db.query('api::product-design.product-design').create({
          data: {
            Title: record.title,
            Description: descriptionSlateFormat,  // Sử dụng format Slate
            Thumnail: record.thumnail,
            Product_categories: validCategoryIds.length > 0 ? validCategoryIds : null,
            Tags: validTags.length > 0 ? validTags : null,
            publishedAt: new Date(),
          },
        });

        createdDesigns.push(design);
      }

      ctx.send({
        message: 'Import successful',
        data: createdDesigns
      });
    } catch (error) {
      ctx.send({
        error: 'Failed to import data',
        details: error.message
      });
    }
  }
};
