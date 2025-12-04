// src/utils/pdf.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// PDF 생성 함수
module.exports = function generateResumePDF({
  name,
  email,
  phone,
  position,
  summary,
  skills,
  projects,
  education,
}) {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../../uploads/resumes");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `resume_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, filename);

      const doc = new PDFDocument({ margin: 40 });

      doc.pipe(fs.createWriteStream(filePath));

      // 제목
      doc.fontSize(24).text(name, { underline: true });
      doc.fontSize(14).text(`${position}`);
      doc.moveDown();
      doc.text(`📧 ${email}`);
      doc.text(`📱 ${phone}`);
      doc.moveDown();

      // Summary
      doc.fontSize(16).text("Summary", { underline: true });
      doc.fontSize(12).text(summary);
      doc.moveDown();

      // Skills
      doc.fontSize(16).text("Skills", { underline: true });
      doc.fontSize(12).text(skills.join(", "));
      doc.moveDown();

      // Projects
      doc.fontSize(16).text("Projects", { underline: true });

      projects.forEach((p) => {
        doc.moveDown(0.5);
        doc.fontSize(14).text(p.name, { bold: true });
        doc.fontSize(12).text(p.description);
        doc.text(`Tech: ${p.tech.join(", ")}`);
      });

      doc.moveDown();

      // Education
      doc.fontSize(16).text("Education", { underline: true });

      education.forEach((e) => {
        doc.moveDown(0.5);
        doc.fontSize(14).text(e.school);
        doc.fontSize(12).text(`${e.degree} • ${e.year}`);
      });

      doc.end();

      resolve(filename);
    } catch (err) {
      reject(err);
    }
  });
};
