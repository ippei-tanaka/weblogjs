import request from "superagent";
import nocache from "superagent-no-cache";


class ServerFacade {

    constructor() {
        this.urlBase = "/api/v1";
    }

    getBlogs() {
        return this
            .restfulAPI("/blogs")
            .then(function (data) {
                return data.items;
            });
    }

    getBlog(id) {
        return this
            .restfulAPI("/blogs/" + id);
    }

    createBlog(blogObject) {
        return this
            .restfulAPI("/blogs/", {
                data: blogObject,
                method: 'post'
            });
    }

    updateBlog(id, blogObject) {
        return this
            .restfulAPI("/blogs/" + id, {
                data: blogObject,
                method: 'put'
            });
    }

    deleteBlog(id) {
        return this
            .restfulAPI("/blogs/" + id, {
                method: 'delete'
            });
    }

    getCategories() {
        return this
            .restfulAPI("/categories")
            .then(function (data) {
                return data.items;
            });
    }

    getCategory(id) {
        return this
            .restfulAPI("/categories/" + id);
    }

    createCategory(categoryObject) {
        return this
            .restfulAPI("/categories/", {
                data: categoryObject,
                method: 'post'
            });
    }

    updateCategory(id, categoryObject) {
        return this
            .restfulAPI("/categories/" + id, {
                data: categoryObject,
                method: 'put'
            });
    }

    deleteCategory(id) {
        return this
            .restfulAPI("/categories/" + id, {
                method: 'delete'
            });
    }

    getPosts() {
        return this
            .restfulAPI("/posts")
            .then(function (data) {
                return data.items;
            });
    }

    getPost(id) {
        return this
            .restfulAPI("/posts/" + id);
    }

    createPost(postObject) {
        return this
            .restfulAPI("/posts/", {
                data: postObject,
                method: 'post'
            });
    }

    updatePost(id, postObject) {
        return this
            .restfulAPI("/posts/" + id, {
                data: postObject,
                method: 'put'
            });
    }

    deletePost(id) {
        return this
            .restfulAPI("/posts/" + id, {
                method: 'delete'
            });
    }

    getUsers() {
        return this
            .restfulAPI("/users")
            .then(function (data) {
                return data.items;
            });
    }

    getUser(id) {
        return this
            .restfulAPI("/users/" + id);
    }

    getMe() {
        return this
            .restfulAPI("/users/me");
    }

    createUser(userObject) {
        return this
            .restfulAPI("/users/", {
                data: userObject,
                method: 'post'
            });
    }

    updateUser(id, userObject) {
        return this
            .restfulAPI("/users/" + id, {
                data: userObject,
                method: 'put'
            });
    }

    deleteUser(id) {
        return this
            .restfulAPI("/users/" + id, {
                method: 'delete'
            });
    }

    getSetting() {
        return this
            .restfulAPI("/setting");
    }

    updateSetting(settingObject) {
        return this
            .restfulAPI("/setting", {
                data: settingObject,
                method: 'put'
            });
    }

    getPrivileges() {
        return this
            .restfulAPI("/privileges");
    }

    login(email, password) {
        return this
            .admin("/login", {
                data: {
                    email: email,
                    password: password
                },
                method: 'post'
            });
    }

    restfulAPI(uri, options) {
        options = Object.assign({
            url: this.urlBase + uri,
            method: "get",
            //dataType: 'json',
            //cache: false,
            //traditional: true
        }, options);

        return this.ajax(options);
    }

    admin(uri, options) {
        options = Object.assign({
            url: "/admin" + uri,
            method: "get",
            //dataType: 'json',
            //cache: false
        }, options);

        return this.ajax(options);
    }

    ajax (options) {
        var requestObject = request[options.method](options.url)
            .use(nocache)
            .type('json');

        if (options.data) {
            requestObject = requestObject.send(options.data);
        }

        return new Promise((resolve, reject) => {
            requestObject.end(function (err, res) {
                if (err) {
                    reject(res.body);
                    return;
                }
                resolve(res.body);
            });
        });
    }

}

export default new ServerFacade();
