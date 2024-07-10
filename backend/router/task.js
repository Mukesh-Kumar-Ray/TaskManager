const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");
//create-task
router.post("/create-task",authenticateToken, async (req, res) => {
try {
const { title, desc } = req.body;
const { id } = req.headers;
const newTask = new Task({ title: title, desc: desc });
const saveTask = await newTask.save();
// const taskId = saveTask._id;
await User.findByIdAndUpdate(id, {$push:{tasks:saveTask._id}});
res.status(201).json({message: "Task created"});
}
catch (error) { 
    console.log(error);
res.status(500) = json({ message: "Internal Server Error" });
}
 });

// Get all tasks route
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate({path: "tasks",option:{sort:{createdAt:-1}}});

     res.status(200).json({ data:userData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});
//delete task

router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const userId=req.headers.id;
      await Task.findByIdAndDelete(id);

    res.status(200).json({message: "Task deleted successfully "});
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

  //update task
  router.put("/Update-task/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
     const {title,desc} =req.body;
      await Task.findByIdAndUpdate(id,{title:title,desc:desc});
      

    res.status(200).json({message: "Task Update successfully "});
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

  router.put("/Update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const TaskData = await Task.findById(id)
      const ImpTask = TaskData.important;
      await Task.findByIdAndUpdate(id,{important:!ImpTask});
    res.status(200).json({message: "Task Update successfully "});
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

  router.put("/Update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const TaskData = await Task.findById(id);
      if (!TaskData) {
        console.log("Task not found");
        return res.status(404).json({ message: "Task not found" });
      }
      console.log("Task data before update:", TaskData);
      const CompleteTask = TaskData.completed; 

      
      const updatedTask = await Task.findByIdAndUpdate(id, { completed: !CompleteTask }, { new: true });
      console.log("Task data after update:", updatedTask);
  
      res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
  
      const Data = await User.findById(id).populate({path: "tasks", match:{important:true},option:{sort:{createdAt:-1}}});
     const ImpTaskData = Data.tasks;
       res.status(200).json({ data:ImpTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

  router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
  
      const Data = await User.findById(id).populate({path: "tasks", match:{completed:true},option:{sort:{createdAt:-1}}});
     const CompTaskData = Data.tasks;
       res.status(200).json({ data:CompTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });


  router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
  
      const Data = await User.findById(id).populate({path: "tasks", match:{completed:false},option:{sort:{createdAt:-1}}});
     const CompTaskData = Data.tasks;
       res.status(200).json({ data:CompTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });
module.exports = router;