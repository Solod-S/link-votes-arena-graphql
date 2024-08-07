const fs = require("fs");
const path = require("path");

function listFiles(dir, indent = "") {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    console.log(`${indent}${file}`);
    if (stats.isDirectory()) {
      listFiles(filePath, `${indent}  `);
    }
  });
}

const rootDir = process.argv[2] || ".";
listFiles(rootDir);
