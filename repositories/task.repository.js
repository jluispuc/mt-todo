const db = require('./../config/db');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = "task";

class TaskRepository {

    constructor(){}

    async find(userId, id=''){
        const find = (coll) => id == '' ? coll.find({user_id: new ObjectId(userId)}).toArray()
                                        : coll.find({_id: new ObjectId(id), user_id: new ObjectId(userId)}).toArray();

        let result = await db.execute(COLLECTION_NAME, find);

        return result;
    }

    async create(task){
        const user_id = new ObjectId(task.user_id);
        task = {
            ...task,
            createAt: new Date(),
            updateAt: new Date(),
            user_id: user_id
        };

        const insertOne = (coll) => coll.insertOne(task);

        let result = await db.execute(COLLECTION_NAME, insertOne);

        return result;
    }

    async update(id, newTask){
        const filter = {
            _id: new ObjectId(id)
        };

        let focusTimer = null;
        if (newTask.completedDate != null && newTask.startDate != null){
          focusTimer = (new Date(newTask.completedDate)) - (new Date(newTask.startDate));
        }

        const user_id = new ObjectId(newTask.user_id);
        const updateTask = {
            $set: {
                name: newTask.name,
                priority: newTask.priority,
                scheduledDate: new Date(newTask.scheduledDate) || null,
                status: newTask.status,
                completedDate: newTask.completedDate != null ? new Date(newTask.completedDate) : null,
                updateAt: new Date(),
                user_id: user_id,
                notes: newTask.notes,
                subTasks: newTask.subTasks || null,
                startDate: newTask.startDate != null ? new Date(newTask.startDate) : null,
                focusTimer: focusTimer
            },
            $setOnInsert: { createAt: new Date() }
        };
        const options = { upsert: true };

        const updateOne = (coll) => coll.updateOne(filter, updateTask, options);

        let result = await db.execute(COLLECTION_NAME, updateOne);

        return result;
    }

    async delete(id){
        const deleteOne = (coll) => coll.deleteOne({
            _id: new ObjectId(id)
        });

        let result = await db.execute(COLLECTION_NAME, deleteOne);

        return result;
    }
}

module.exports = TaskRepository;
