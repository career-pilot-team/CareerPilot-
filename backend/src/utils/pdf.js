// src/utils/pdf.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

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
      // 📌 한글 폰트 경로 지정
      const fontPath = path.join(__dirname, "../../assets/fonts/NotoSansKR-Regular.ttf");

      const uploadsDir = path.join(__dirname, "../../uploads/resumes");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `resume_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, filename);

      const doc = new PDFDocument({ margin: 40 });

      // 파일로 출력
      doc.pipe(fs.createWriteStream(filePath));

      // 📌 한글 폰트 적용 (가장 핵심!)
      doc.font(fontPath);

      // 제목
      doc.fontSize(24).text(name || "", { underline: true });
      doc.fontSize(14).text(position || "");
      doc.moveDown();

      doc.fontSize(12).text(`📧 ${email || ""}`);
      doc.text(`📱 ${phone || ""}`);
      doc.moveDown();

      // Summary
      doc.fontSize(16).text("Summary", { underline: true });
      doc.fontSize(12).text(summary || "");
      doc.moveDown();

      // Skills
      doc.fontSize(16).text("Skills", { underline: true });
      doc.fontSize(12).text((skills || []).join(", "));
      doc.moveDown();

      // Projects
      doc.fontSize(16).text("Projects", { underline: true });

      (projects || []).forEach((p) => {
        doc.moveDown(0.5);
        doc.fontSize(14).text(p.name || "");
        doc.fontSize(12).text(p.description || "");
        doc.text(`Tech: ${(p.tech || []).join(", ")}`);
      });

      doc.moveDown();

      // Education
      doc.fontSize(16).text("Education", { underline: true });

      (education || []).forEach((e) => {
        doc.moveDown(0.5);
        doc.fontSize(14).text(e.school || "");
        doc.fontSize(12).text(`${e.degree || ""} • ${e.year || ""}`);
      });

      doc.end();

      resolve(filename);
    } catch (err) {
      reject(err);
    }
  });
};
