//统一管理首页模块接口
//引入二次封装axios
import request from "@/utils/request";


//通过枚举管理接口地址
enum API {
    // REGISTER_URL = 'admin/register',
    // ADMIN_URL = 'admin/login',
    // CATEGORY_URL = 'category/list',
    // DELETE_CATEGORY = 'category/_token/delete',
    // UPDATE_CATEGORY = 'category/_token/update',
    // ADD_CATEGORY = 'category/_token/add',
    // ADD_ARTICLE = 'blog/_token/add',
    // ALL_BLOG = 'blog/search',
    // SEARCH_BLOG = 'blog/detail',
    // DELETE_BLOG = 'blog/_token/delete',
    // UPDATE_BLOG = 'blog/_token/update',
    // UPLOAD_FILE = 'uploadArticle',
    // UPLOAD_IMG = 'upload/file',
    // GET_COMMENT = 'comment/allComments',
    // GET_BLOGCOMMENTS = 'comment/BlogComments',
    // DELETE_COMMENT = 'comment/_token/deleteComment',
    // UPDATE_COMMENT = 'comment/_token/updateComment',
    // ADD_COMMENT = 'comment/_token/addComment',

    REGISTER_URL = 'api/admin/register',
    ADMIN_URL = 'api/admin/login',
    CATEGORY_URL = 'api/category/list',
    DELETE_CATEGORY = 'api/category/_token/delete',
    UPDATE_CATEGORY = 'api/category/_token/update',
    ADD_CATEGORY = 'api/category/_token/add',
    ADD_ARTICLE = 'api/blog/_token/add',
    ALL_BLOG = 'api/blog/search',
    SEARCH_BLOG = 'api/blog/detail',
    DELETE_BLOG = 'api/blog/_token/delete',
    UPDATE_BLOG = 'api/blog/_token/update',
    UPLOAD_FILE = 'api/uploadArticle',
    UPLOAD_IMG = 'api/upload/file',
    GET_COMMENT = 'api/comment/allComments',
    GET_BLOGCOMMENTS = 'api/comment/BlogComments',
    DELETE_COMMENT = 'api/comment/_token/deleteComment',
    UPDATE_COMMENT = 'api/comment/_token/updateComment',
    ADD_COMMENT = 'api/comment/_token/addComment',
}
export const reqRegister = (data: any) => request.post<any>(API.REGISTER_URL, data)
//提交用户信息
export const reqUserInfo = (data: any) => request.post<any>(API.ADMIN_URL, data);
//获取分类接口
export const reqCategoryList = () => request.get<any>(API.CATEGORY_URL);
//删除分类的接口
export const reqdeleteCategory = (id: string) => request.delete<any>(API.DELETE_CATEGORY + `?id=${id}`);
//修改分类的接口
export const reqUpdateCategory = (obj: { id: string, name: string }) => request.put<any>(API.UPDATE_CATEGORY, obj);
//添加分类接口的回调
export const reqAddCategory = (obj: { name: string }) => request.post<any>(API.ADD_CATEGORY, obj);
//添加文章的接口
export const reqAddArticle = (obj: any) => request.post<any>(API.ADD_ARTICLE, obj);
//查询所有文章的接口(携带分页数据)
export const reqAllBlog = (obj: any) => request.post<any>(API.ALL_BLOG, obj);
//查询某个文章的接口
export const reqBlog = (id: string) => request.get<any>(API.SEARCH_BLOG + `?id=${id}`);
//删除博客的接口
export const reqDeleteBlog = (id: string) => request.delete(API.DELETE_BLOG + `?id=${id}`);
//更新博客的接口
export const reqUpdateBlog = (obj: any) => request.put(API.UPDATE_BLOG, obj);
//上传图片的接口
export const reqUploadImg = (form: any) => request.post(API.UPLOAD_IMG, form, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
//获取所有的评论
export const reqGetComment = () => request.get<any>(API.GET_COMMENT);
//根据id获取评论
export const reqGetBlogComments = (id: string) => request.get<any>(API.GET_BLOGCOMMENTS + `?id=${id}`);
//删除评论
export const reqDeleteComment = (id: string) => request.delete(API.DELETE_COMMENT + `?id=${id}`);
//更新评论
export const reqUpdateComment = (obj: any) => request.put(API.UPDATE_COMMENT, obj);
//增加评论
export const reqAddComment = (obj: any) => request.post<any>(API.ADD_COMMENT, obj, {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
});