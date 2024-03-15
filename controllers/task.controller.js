const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const TaskService = require('./../services/task.service');

const service = new TaskService();

// @desc      Get all tasks
// @route     GET /api/tasks
// @access    Public
exports.getTasks = asyncHandler(async (req, res, next) => {
    const taskList = await service.find();

    res.json(taskList);
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const task = service.findOne(id);

    if (task == undefined || task == null){
        res.status(404).json();
    }

    res.json(task);
});

exports.create = asyncHandler(async (req, res, next) => {
    const body = req.body;

    const newTask = service.create(body);

    res.status(201).json({
        message: 'created',
        data: newTask
    });
});

exports.update = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params;
        const body = req.body;

        const taskChanged = await service.update(id, body);

        res.json({
            message: 'update',
            data: taskChanged,
            id
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

exports.remove = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params;
        const body = req.body;

        const taskChanged = service.update(id, body);

        res.json({
            message: 'update',
            data: taskChanged,
            id
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});