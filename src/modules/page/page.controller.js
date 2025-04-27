const hasAccessPage = require("./../../utils/hasAccess");
const userModel = require("./../../model/userModel");
const followModel = require("./../../model/followModel");
const postModel = require("./../../model/postModel");
const likeModel = require("./../../model/likeModel");
const saveModel = require("./../../model/saveModel");


exports.getPage = async (req, res, next) => {
    try {
        const user = req.user;
        const {pageID} = req.params;
        const hasAccess = hasAccessPage(user._id, pageID);

        const followed = await followModel.findOne({
             follower: user._id,
             following: pageID
            });

        const page = await userModel.findOne(
            { _id: pageID },
            'name username biography isVerified profilePicture')
            .lean();

        if (!hasAccess) {
            req.flash('error', 'follow page to show content');
            return res.render('page/page', {
                followed: Boolean(followed),
                pageID,
                follower: [],
                following: [],
                post: [],
                page
            });
        }


        let follower = await followModel.find({ following: pageID })
        .populate('follower', 'name username')
        .lean();

        follower = follower.map(item => item.follower);


        let following = await followModel.find({ follower: pageID })
        .populate('following', 'name username')
        .lean();

        following = following.map(item => item.following);

        const ownPage = user._id.equals(pageID);

        const post = await postModel.find({ user: pageID })
        .sort({ _id: -1 })
        .populate('user', 'name username')
        .lean();

        const like = await likeModel.find({ user: user._id })
        .populate('user', '_id')
        .populate('post', '_id');

        const save = await saveModel.find({ user: user._id })
        .populate('user', '_id')
        .populate('post', '_id');

        
        post.forEach((post) => {
            if (like.length) {
                like.forEach((like) => {
                    if (like.post._id.toString() == post._id.toString()) {
                        post.haslike = true;
                    }
                });
            }
        });

        post.forEach((post) => {
            if (save.length) {
                save.forEach((save) => {
                    if (save.post._id.toString() == post._id.toString()) {
                        post.isSaved = true;
                    }
                });
            }
        });


        return res.render('page/page', {
            followed: Boolean(followed),
            pageID,
            follower,
            following,
            post,
            ownPage,
            page
        });
    } catch (err) {
        next(err);
    }
};

exports.follow = async (req, res, next) => {
    try {
        const user = req.user;
        const { pageID } = req.params;


        const targetOwnPage = await userModel.findOne({ _id: pageID });
        if (!targetOwnPage) {
            req.flash('error', 'Page not found');
            return res.redirect(`/page/${pageID}`);
        }

        if (user._id.equals(pageID)) {
            req.flash('error', 'Can not follow your own page');
            return res.redirect(`/page/${pageID}`);
        }

        const existFollow = await followModel.findOne({
            follower: user._id,
            following: pageID
        });
        if (existFollow) {
            req.flash('error', 'Page have been already followed');
            return res.redirect(`/page/${pageID}`);
        }

        await followModel.create({
            follower: user._id,
            following: pageID
        });
        req.flash('success', 'Page been followed');
        return res.redirect(`/page/${pageID}`);

    } catch (err) {
        next(err);
    }
};

exports.unFollow = async (req, res, next) => {
    try {
        const user = req.user;
        const { pageID } = req.params;

        const unFollowPage = await followModel.findOneAndDelete({
            follower: user._id,
            following: pageID
        });
        if (!unFollowPage) {
            req.flash('error', 'You did not follow this page');
            return res.redirect(`/page/${pageID}`);
        }



        req.flash('success', 'You unfollowed this page');
        return res.redirect(`/page/${pageID}`);

    } catch (err) {
        next(err);
    }
};
