const Group = require('../models/Group.js');

/**
 * GET /api/stats/groups
 *
 * Returns:
 *  - averageGroupSize: mean number of members across all groups
 *  - averageBudget: { avgMin, avgMax, avgMidpoint } across all groups
 *  - mostCommonUniversity: the single top university + its count
 *  - universityLeaderboard: full ranked list, shaped as [{ University, count }]
 *    to plug directly into the <UniLeaderBoards /> chart component in place
 *    of the dummy data.
 */
const getGroupStats = async (req, res) => {
  try {
    const [sizeResult, budgetResult, universityLeaderboard] = await Promise.all([
      // A) Average group size (based on actual members joined, not `spots` capacity)
      Group.aggregate([
        { $project: { size: { $size: '$members' } } },
        { $group: { _id: null, avgSize: { $avg: '$size' } } },
      ]),

      // C) Average budget
      Group.aggregate([
        {
          $group: {
            _id: null,
            avgMin: { $avg: '$budget.min' },
            avgMax: { $avg: '$budget.max' },
          },
        },
      ]),

      // B) University leaderboard (also gives us "most common" as the top entry)
      Group.aggregate([
        { $match: { university: { $nin: ['', null] } } },
        { $group: { _id: '$university', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, University: '$_id', count: 1 } },
      ]),
    ]);

    const averageGroupSize = sizeResult[0] ? Number(sizeResult[0].avgSize.toFixed(2)) : 0;

    const avgMin = budgetResult[0] ? budgetResult[0].avgMin : 0;
    const avgMax = budgetResult[0] ? budgetResult[0].avgMax : 0;
    const averageBudget = {
      avgMin: Number(avgMin.toFixed(2)),
      avgMax: Number(avgMax.toFixed(2)),
      avgMidpoint: Number(((avgMin + avgMax) / 2).toFixed(2)),
    };

    const mostCommonUniversity = universityLeaderboard[0] || null;

    return res.status(200).json({
      averageGroupSize,
      averageBudget,
      mostCommonUniversity,
      universityLeaderboard, // e.g. [{ University: "UT Austin", count: 12 }, ...]
    });
  } catch (err) {
    console.error('Error computing group stats:', err);
    return res.status(500).json({ message: 'Failed to compute group statistics' });
  }
};

module.exports = { getGroupStats };
