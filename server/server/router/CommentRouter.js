var xss = require("xss");
const express = require('express')
const router = express.Router()
const { db, genid } = require("../db/config")

/**
 * 评论的查询、添加、修改、删除接口
 */
function getDefaultWhiteList() {
    return {
        a: ["target", "href", "title"],
        abbr: ["title"],
        address: [],
        area: ["shape", "coords", "href", "alt"],
        article: [],
        aside: [],
        audio: ["autoplay", "controls", "loop", "preload", "src"],
        b: [],
        bdi: ["dir"],
        bdo: ["dir"],
        big: [],
        blockquote: ["cite"],
        br: [],
        caption: [],
        center: [],
        cite: [],
        code: [],
        col: ["align", "valign", "span", "width"],
        colgroup: ["align", "valign", "span", "width"],
        dd: [],
        del: ["datetime"],
        details: ["open"],
        div: [],
        dl: [],
        dt: [],
        em: [],
        font: ["color", "size", "face"],
        footer: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        header: [],
        hr: [],
        i: [],
        img: ["src", "alt", "title", "width", "height"],
        ins: ["datetime"],
        li: [],
        mark: [],
        nav: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        section: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        table: ["width", "border", "align", "valign", "style"],
        tbody: ["align", "valign"],
        td: ["width", "rowspan", "colspan", "align", "valign", "style"],
        tfoot: ["align", "valign"],
        th: ["width", "rowspan", "colspan", "align", "valign"],
        thead: ["align", "valign"],
        tr: ["rowspan", "align", "valign"],
        tt: [],
        u: [],
        ul: [],
        video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"],
        style: []   //新添
    };
}
const options = {
    whiteList: getDefaultWhiteList(),
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
}
//查找所有的评论
router.get("/allComments", async (req, res) => {

    const search_sql = "SELECT comments.*,blog.title FROM comments JOIN blog ON comments.article_id = blog.id;"
    let { err, rows } = await db.async.all(search_sql, [])
    if (err === null) {
        res.send({
            code: 200,
            msg: '查询成功',
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: '查询失败'
        })
    }
})


//根据文章的id查找评论
router.get("/BlogComments", async (req, res) => {
    let { id } = req.query;
    const search_sql = "SELECT * FROM `comments` WHERE `article_id` = ?";
    let { err, rows } = await db.async.all(search_sql, [id]);
    if (err === null) {
        res.send({
            code: 200,
            msg: '查询成功',
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: '查询失败'
        })
    }
})


//添加 验证成功
router.post("/_token/addComment", async (req, res) => {
    console.log("zhixingl ");
    let { value, article_id, user } = req.body
    console.log("value, article_id, user", value, article_id, user);
    let id = genid.NextId()
    let create_time = new Date().getTime();
    const insert_sql = "INSERT INTO `comments`(`id`,`value`,`article_id`,`user`,`create_time`) VALUES(?,?,?,?,?)"
    //进行js-xss转义后的content
    const xss_value = xss(value, options);
    const xss_user = xss(user, options);
    let params = [id, xss_value, article_id, xss_user, create_time];
    let { err, rows } = await db.async.all(insert_sql, params)

    if (err === null) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            err,
            msg: "添加失败"
        })
    }
})

//更新
router.put("/_token/updateComment", async (req, res) => {
    let { id, value, user } = req.body
    let create_time = new Date().getTime();
    const update_sql = "UPDATE `comments` SET `value` = ?,`create_time` = ? WHERE `id` = ?";
    //进行js-xss转义后的content
    const xss_value = xss(value, options);
    const xss_user = xss(user, options);
    let params = [xss_value, create_time, id];
    let { err, rows } = await db.async.all(update_sql, params)

    if (err === null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            err,
            msg: "添加失败"
        })
    }
})
//添加评论
//列表查询接口

//删除
router.delete("/_token/deleteComment", async (req, res) => {
    let id = req.query.id
    console.log(id)
    const delete_sql = "DELETE FROM `comments` WHERE `id` = ?"
    let { err, rows } = await db.async.all(delete_sql, [id]);
    console.log("执行了");
    if (err === null) {
        res.send({
            code: 200,
            msg: '删除成功'
        })
    } else {
        res.send({
            code: 500,
            msg: '删除失败',
            error: err
        })
    }
})

module.exports = router