const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require("multer");
const formidable = require('formidable');
let fs = require('fs');
const UPLOAD_PATH = path.join(__dirname, '../', "public/uploads");
const upload = multer();
// 实现文件上传的路由
router.post("/file", async (req, res) => {
	// console.log(req)
	// 创建formidable表单解析对象
	const form = new formidable.IncomingForm({
		//配置上传文件的存放位置
		uploadDir: path.join(__dirname, '../', 'public', 'uploads'),
		//保留上传文件后缀
		keepExtensions: true,
	})
	console.log("req.body", req.bodt, "%", res);
	form.parse(req, (err, fields, files) => {
		console.log("files", files);
		// 将客户端传递过来的文件地址响应到客户端
		if (err) {
			return res.send(
				{
					errno: 1,
					message: "出现异常了",
					err
				}
			)
		}
		return res.send({
			errno: 0,
			data: {
				url: files.file.filepath.split('public')[1].slice(1),
				alt: '无'
			}
		});
	});
})

const writeFile = async (file) => {
	//修复文件上传时乱码的问题
	const originalname = Buffer.from(file.originalname, "latin1").toString("utf8");;
	console.log("originalname", originalname);
	return new Promise((resolve) => {
		fs.writeFile(`${UPLOAD_PATH}/${originalname}`, file.buffer, (err) => {
			if (err) {
				console.log("err", err);
				resolve({
					success: false,
					filePath: "",
				});
				return;
			}
			resolve({
				success: true,
				//这个可能要修复
				filePath: `http://localhost:8080/upload/${originalname}`,
			});
		});
	});
};
// 处理文件上传
router.post("/upload", upload.array("files"), async (req, res) => {
	// 'files'参数对应于表单中文件输入字段的名称
	const files = req.files;
	console.log(files);
	const promises = files.map((file) => writeFile(file));
	const result = await Promise.all(promises);
	//或许应该把结果存到数据库里面去。？？？但是怎么存呢。是不是要判断一下type是都是md
	// 返回上传成功的信息
	res.json({ data: result });
});
module.exports = router