const express = require("express");
const router = express.Router();
const {
  verifyAuthorization,
  verifyUser,
} = require("../../common/authenticate");
const { handleError, handleSuccess } = require("../../common/response");
const Team = require("../../models/Team");

router.get("/:id", verifyAuthorization, verifyUser, async (req, res) => {
  try {
    let reqId = req.params.id;
    const userTeams = await Team.fetchUserTeams(reqId);
    return handleSuccess(res, userTeams);
  } catch (err) {
    return handleError(res, err);
  }
});

router.post("/create", verifyAuthorization, verifyUser, async (req, res) => {
  try {
    let user = req.body.user;
    let name = req.body.name;
    let members = req.body.members;
    let newTeam = new Team({
      creator: user,
      name,
      members,
    });
    let teamDoc = await newTeam.save();
    const team = await teamDoc
      .populate({
        path: "members",
        select: "_id username avatar gender",
        model: "User",
      })
      .populate({
        path: "creator",
        select: "_id username avatar gender",
        model: "User",
      })
      .execPopulate();
    return handleSuccess(res, team);
  } catch (err) {
    return handleError(res, err);
  }
});

/**
 * delete team
 */
router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    const teamId = req.params.id;
    const resp = await Team.deleteOne({ _id: teamId });
    return handleSuccess(res, resp);
  } catch (err) {
    return handleError(res, err);
  }
});
/**
 * edit team members
 */

router.put("/member", verifyAuthorization, async (req, res) => {
  try {
    const memberIds = req.body.memberIds;
    const teamId = req.body.teamId;
    const resp = await Team.updateOne(
      { _id: teamId },
      { $set: { members: memberIds } }
    );
    if (resp.ok === 1 && resp.nModified === 1) {
      return handleSuccess(res, "ok");
    } else {
      return handleSuccess(res, "accept");
    }
  } catch (err) {
    return handleError(res, err);
  }
});

/**
 * leave team
 */
router.put("/leave", verifyAuthorization, async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const resp = await Team.updateOne(
      { _id: teamId },
      { $pull: { members: userId } }
    );
    if (resp.ok === 1 && resp.nModified === 1) {
      return handleSuccess(res, "ok");
    } else {
      return handleSuccess(res, "accept");
    }
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = router;
