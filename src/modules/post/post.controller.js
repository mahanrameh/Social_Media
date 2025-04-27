const postModel = require("./../../model/postModel");
const likeModel = require("./../../model/likeModel");
const saveModel = require("./../../model/saveModel");
const mongoose = require("mongoose");
const hasAccessPage =  require("./../../utils/hasAccess");
const { createPostValidator } = require("./post.validator");
const {getUserInfo} = require("./../../utils/helper");
const { post } = require("./post.route");



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

exports.like = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;
        
        const post = await postModel.findOne({ _id: new mongoose.Types.ObjectId(postID) });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        const hasAccess = await hasAccessPage(user._id, post.user.toString());
        if (!hasAccess) {
            return res.status(403).json({ error: "You do not have permission to view this post" });
        }
        

        const existLike = await likeModel.findOne({
             user: user._id,
              post: postID 
        });
        if (existLike) {
            return res.redirect('back');
        }

        const like = new likeModel({
            post: postID,
            user: user._id
        });

        await like.save();

        return res.redirect('back');
    } catch (err) {
        next(err);
    }
};

exports.disLike = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const like = await likeModel.findOne({ user: user._id, post: postID });
        if (!like) {
            return res.redirect('back');
        }

        await likeModel.findOneAndDelete({ _id: like._id });

        return res.redirect('back');
    } catch (err) {
        next(err);
    }
};

exports.save = async (req, res, next) => {
   try {
    const user = req.user;
    const {postID} = req.body;

    const post = await postModel.findOne({ _id: new mongoose.Types.ObjectId(postID) });
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    const hasAccess = await hasAccessPage(user._id, post.user.toString());
    if (!hasAccess) {
        return res.status(403).json({ error: "You do not have permission to view this post" });
    }
    
    const existSave = await saveModel.findOne({
        user: user._id,
        post: postID 
   });
   if (existSave) {
       return res.redirect('back');
   }

    await saveModel.create({
        post: postID,
        user: user._id
    });


    return res.redirect('back');
   } catch (err) {
    next(err);
   }
};

exports.unSave = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;


        const unSave = await saveModel.findOneAndDelete({ 
            user: user._id,
            post: postID
        });
        if (!unSave) {
            //! error message
        }
        return res.redirect('back');
       } catch (err) {
        next(err);
       }
};

exports.showSaveView = async (req, res, next) => {
    try {
        const user = req.user;
        const save = await saveModel.find({ user: user._id })
        .populate('post')
        .lean();
        const like = await likeModel.find({ user: user._id })
        .populate('post')
        .lean();


        save.forEach((item) => {
            like.forEach((like) => {
                if (item.post._id.toString() == like.post._id.toString()) 
                {
                    item.post.hasLike = true;
                }
            });
        });


        const userInfo = await getUserInfo(user._id);

        

        return res.render('post/save', {
            post: save,
            user: userInfo
        });

    } catch (err) {
        next(err);
    }
};