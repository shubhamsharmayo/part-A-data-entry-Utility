import express from 'express'
import cors from 'cors'
import fs from 'fs'
import dotenv from "dotenv";
import createDatabaseIfNotExists from './utils/createDB.js'
import sequelize from './utils/database.js';
import User from './models/User.js';
import userRoute from './routes/UserManagement.js'
import template from './routes/template/template.js'
import bodyParser from 'body-parser';
import Template from './models/template.js';
import MetaData from './models/metadata.js';
import TaskRoute from './routes/tasks/taskRoutes.js'
import Files from './models/filedata.js';
import path from "path";
import { fileURLToPath } from "url";
import MappedData from './models/mappedData.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const builtPath = path.join(
  __dirname,
  "../P_Frontend/dist"
);
console.log(builtPath)


dotenv.config();

const app = express()
const port = process.env.PORT
app.use(express.static(builtPath));

app.use(
  cors({
    origin: "*", // or specific domain
    exposedHeaders: ["X-Incomplete-Tasks", "X-Incomplete-Count","Content-Disposition"],
  })
);




app.use("/api/images", express.static(path.join(__dirname, "extractedFiles")));
app.use(cors())
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/uploads', express.static('uploads'));

app.use("/api",userRoute)
app.use("/api",template)
app.use("/api",TaskRoute)
app.get("/*path", (req, res) => {
  res.sendFile(path.join(builtPath, "index.html"));
});

Template.hasMany(MetaData, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

MetaData.belongsTo(Template, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

Template.hasMany(Files, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Files.belongsTo(Template, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Template.hasMany(MappedData, {
  foreignKey: {
    name: "templateId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

MappedData.belongsTo(Template, {
  foreignKey: {
    name: "templateId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

MetaData.belongsTo(MappedData, {
  foreignKey: "templateId",
  as: "templetedatum", // 👈 Alias added here
});
MappedData.hasMany(MetaData, {
  foreignKey: "templeteId",
  as: "templetedatum", // 👈 Alias added here
});


async function StartServer() {

    try {
        await createDatabaseIfNotExists()
        await sequelize.sync({ force: !true })

        const adminUser = await User.findOne({ where: { role: "Admin" } });
        if (!adminUser) {
            // const hashedPassword = await bcrypt.hash("123456", 12);
            const permissions = {
                dataEntry: true,
                comparecsv: true,
                csvuploader: true,
                createTemplate: true,
                resultGenerator: true,
            }
            await User.create({
                username: "admin",
                mobile: "1234567891",
                password: 123456,
                role: "Admin",
                email: "admin@gmail.com",
                permissions: permissions,
            });
            console.log("Admin user created.");
        }
        app.listen(port, () => {
            console.log(`server avaliable at ${port}`)
        })

    } catch (error) {
        console.log(error)
    }

}

StartServer()
