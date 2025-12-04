// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();

const RecommendTask = require('../models/recommendTask');

// 🔥 일단 인증 없이 동작하도록 구현 (로그인 복구가 우선)
router.patch('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { isDone } = req.body; // { isDone: true/false }

  if (typeof isDone !== 'boolean') {
    return res.status(400).json({
      ok: false,
      message: 'isDone(boolean) 값이 필요합니다.',
    });
  }

  try {
    const task = await RecommendTask.findByPk(taskId);

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: 'Task not found',
      });
    }

    // DB 컬럼 이름은 done 이라서 이렇게 매핑
    task.done = isDone;
    await task.save();

    return res.json({
      ok: true,
      task: {
        id: task.id,
        trackId: task.trackId,
        label: task.label,
        orderNo: task.orderNo,
        isDone: task.done,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (err) {
    console.error('PATCH /api/tasks/:taskId error:', err);
    return res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
