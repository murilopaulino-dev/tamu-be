import fs from "fs";
import path from "path";
const associations: string[] = [];

const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) !== ".ts"
    );
  })
  .forEach(file => {
    fs.readdirSync(`${__dirname}/${file}`).forEach((nestedFile, index) => {
      const route = `./${file}/${nestedFile}`;
      if (nestedFile.includes("model.ts")) {
        require(route);
      } else if (nestedFile.includes("association.ts")) {
        associations.push(route);
      }
    });
  });

for (const el of associations) {
  require(el);
}
