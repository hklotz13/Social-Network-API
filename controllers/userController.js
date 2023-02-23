const { User, Thought } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find()
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1})
        .then((userData) => {
            res.json(userData)
        }).catch((err) => {
            res.status(500).json(err);
        })
    },
    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((userData) => {
            if(!userData) {
                res.status(404).json({message: 'User not found'})
            }
        }).catch((err) => {
            res.status(500).json(err);
        })
    },
    createUser(req, res) {
        User.create(req.body)
            .then((userData) => {
                res.json(userData)
            }).catch((err) => {
                res.status(500).json(err)
            })
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        ).then((userData) => {
            if(!userData) {
                return res.status(404).json({message: 'No user found'})
            }
            res.json(userData)
        }).catch((err) => {
            res.status(500).json(err);
        })
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId})
            .then((userData) => {
                if(!userData) {
                    return res.status(404).json({message: 'User not found'})
                }
            })
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId},
            { $addToSet: { friends: req.params.friendId } },
            { new: true })
            .then((userData) => {
                if(!userData) {
                    return res.status(404).json({message: 'No user found'})
                }
                res.json(userData)
            }).catch((err) => {
                res.status(500).json(err);
            })
    },
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId},
            { $pull: { friends: req.params.friendId }},
            { new: true}
        ).then((userData) => {
            if(!userData) {
                return res.status(404).json({message: 'No user found'})
            }
            res.json(userData)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
};

module.exports = userController;