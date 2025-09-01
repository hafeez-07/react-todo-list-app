import { useState, useEffect } from "react";

type TaskType = {
  id: number;
  text: string;
  completed: boolean;
};

const ToDoApp = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<TaskType[]>(() => {
    //Initialize taskList from local storage
    const storedTask = localStorage.getItem("tasks");
    return storedTask ? JSON.parse(storedTask) : [];
  });

  //save to local storage whenever taskList changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const addingTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTask = task.trim();
    if (trimmedTask === "") {
      alert(`please enter a task before adding`);
      return;
    } //when user just clicks add dont enter null

    let isDuplicate = taskList.some(
      (existingTask) =>
        existingTask.text.toLowerCase() === trimmedTask.toLowerCase()
    );

    if (isDuplicate) {
      alert(`The task ${task} already exists in your to-do-list`);
      return;
    }

    setTaskList((prev) => [
      ...prev,
      { id: Date.now(), text: trimmedTask, completed: false },
    ]);
    setTask("");
  };

  const deleteTask = (taskId: number) => {
    const modifiedTask = taskList.filter((task) => task.id !== taskId);
    setTaskList(modifiedTask);
  };

  const toggleCompleted = (taskId: number) => {
    const updatedList = taskList.map((task) => {
      return task.id === taskId
        ? { ...task, completed: !task.completed }
        : task;
    });
    setTaskList(updatedList);
  };

  const completedTask = taskList.filter((task) => task.completed === true);

  const remainingTask = taskList.filter((task) => task.completed === false);

  return (
    <div>
      <h1 className="mb-4 text-blue-600 font-bold sm:text-3xl">
        📝Welcome to To-DoList App
      </h1>
      <form onSubmit={addingTask}>
        <div
          className="w-full lg:w-200 md:w-150  mx-auto flex justify-between gap-2 border-2
         bg-slate-900 text-teal-50 font-semibold rounded p-2 "
        >
          <label className="flex-2 mt-1 hidden lg:inline">
            Add the tasks you wish to do :
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task here..."
            className="text-xs sm:text-md border rounded flex-2 md:flex-3 bg-white text-black pl-1 min-w-0"
          ></input>
          <button
            type="submit"
            className="flex-1 border p-1 bg-amber-500 rounded text-black "
          >
            Add
          </button>
        </div>
      </form>
      <div className="border-2 my-3 md:w-150 mx-auto bg-[#4ED7F1]">
        <ol>
          {taskList.map((task) => (
            <li
              key={task.id}
              className="flex items-start  justify-between px-2 my-1"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task.id)}
                className="mt-1"
              />
              <span className=" flex-1 font-semibold break-all">
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="border rounded p-1 bg-red-600
                 hover:bg-red-600/80 ml-2 shrink-0"
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-2 flex flex-col  md:flex-row justify-around gap-4 bg-gray-100">
        <div className="flex-1 mx-3 min-w-0">
          <h1 className="sm:text-2xl font-bold text-green-400 my-3">
            ✅Completed Task
          </h1>
          <div className="border-2 p-2 my-2 bg-green-100 border-green-400 text-green-700 ">
            <ol className="list-decimal pl-5">
              {completedTask.map((task) => (
                <li key={task.id} className="break-words">
                  {task.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="flex-1 mx-3 min-w-0">
          <h1 className="sm:text-2xl font-bold text-red-600 my-3">
            ⏱️Remaining Task
          </h1>
          <div className="border-2 p-2 my-2 bg-blue-100 border-blue-400 text-blue-700">
            <ol className="list-decimal pl-5">
              {remainingTask.map((task) => (
                <li key={task.id} className="break-words ">
                  {task.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoApp;
