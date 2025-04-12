const postModel = require("./../../model/postModel");
const { createPostValidator } = require("./post.validator");


exports.showPostView = async (req, res) => {
    return res.render('post/upload');
};

exports.createPost = async (req, res, next) => {
    try {
        const {description, hashtags} = req.body;
        const user = req.user;

        const tags = hashtags.split(',');

        if (!req.file) {
            req.flash('error', 'media is required ');
            return res.render('post/upload');
        }

        await createPostValidator.validate(
            {description},
            {abortEarly: false}
        );
        const mediaUrlPath = `image/post/${req.file.filename}`;


        //* Create New Post
        const post = new postModel({
            media: {
                filename: req.file.filename,
                path: mediaUrlPath
            },
            description,
            hashtags: tags,
            user: user._id
        });

        await post.save();
        req.flash('success', 'post have been uploaded');

        return res.render('post/upload');

    } catch (err) {
        next(err);
    }
};