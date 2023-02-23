const {Thought, User} = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find()
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .sort({createdAt: -1})
            .then(dbThoughts => res.json(dbThoughts))
            .catch((err) => res.status(500).json(err));
    },
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId})
        .then((dbThoughts) => {
            if(!dbThoughts) {
                return res.status(404).json(err);
            }
            res.json(dbThoughts);
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },
    createThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughts) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId},
                {$push: { thoughts: dbThoughts._id}},
                {new: true}
            );
        }).then((userData) => {
            if(!userData) {
                return res.status(404).json(err);
            }
            res.json({message: 'No user found'});
        }).catch(err => res.status(500).json(err))
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $set: req.body},
            { runValidators: true, new: true})
            .then((dbThoughts) => {
                if(!dbThoughts) {
                    return res.status(404).json({message: 'No thought found'})
                }
                res.json(dbThoughts)
            })
            .catch((err) => {
                res.status(500).json(err);
            })
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId})
            .then((dbThoughts) => {
                if(!dbThoughts) {
                    return res.status(404).json({message: 'no thought found'})
                }
                return User.findOneAndUpdate(
                    { _id: req.params.thoughtId},
                    { $pull: {thoughts: req.params.thoughtId}},
                    { new: true}
                )
            })
            .then((userData) => {
                if(!userData) {
                    return res.status(404).json({message: "No user found"})
                }
            })
            .catch((err) => {
                res.status(500).json(err);
            })
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        ).then((dbThoughts) => {
            if(!dbThoughts){
                return res.status(404).json({message: 'no thought found'})
            }
            res.json(dbThoughts)
        })
        .catch((err) =>{
            res.status(500).json(err)
        })
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        ).then((dbThoughts) => {
            if(!dbThoughts){
                return res.status(404).json({message: 'no thought found'})
            }
            res.json(dbThoughts)
        })
        .catch((err) =>{
            res.status(500).json(err)
        })
    },
};

module.exports = thoughtController;