import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaCheckCircle, FaClock } from "react-icons/fa";

type TaskType = {
  id: number;
  text: string;
  completed: boolean;
};

const ToDoApp = () => {
  const [task, setTask] = useState("");
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("isDark");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });
  const [taskList, setTaskList] = useState<TaskType[]>(() => {
    const savedTaskList = localStorage.getItem("taskList");
    return savedTaskList ? JSON.parse(savedTaskList) : [];
  });

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const addingTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTask = task.trim();
    if (trimmedTask === "") {
      alert("Please enter a task before adding");
      return;
    }

    const isDuplicate = taskList.some(
      (existingTask) =>
        existingTask.text.toLowerCase() === trimmedTask.toLowerCase()
    );

    if (isDuplicate) {
      alert(`The task "${task}" already exists in your to-do list`);
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
    const updatedList = taskList.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedList);
  };

  const completedTask = taskList.filter((task) => task.completed);
  const remainingTask = taskList.filter((task) => !task.completed);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="relative flex pb-4 mb-3 items-center shadow shadow-gray-400 dark:bg-gray-800">
        <h1 className="absolute left-1/2 -translate-x-1/2 text-blue-600 text-lg font-bold sm:text-3xl">
          To-DoList App
        </h1>
        <button
          onClick={toggleTheme}
          className="mt-8 font-bold border rounded py-2 px-3 ml-3 flex items-center
          gap-x-2 hover:ring-2 ring-amber-400 dark:ring-white dark:text-white"
        >
          Theme {isDark ? <FaSun color="yellow" /> : <FaMoon color="gray" />}
        </button>
      </div>

      <form onSubmit={addingTask}>
        <div
          className="w-full gap-y-3 lg:w-200 md:w-150 mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 border-2
          border-slate-800 bg-yellow-100 dark:bg-gray-800 font-bold rounded-2xl p-2 max-w-xs sm:max-w-3xl"
        >
          <label className="flex-2 mt-1">Add the tasks you wish to do :</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task here..."
            className="sm:text-md border rounded flex-2 md:flex-3 bg-white sm:h-10
            text-black p-1 min-w-0 focus:outline-none focus:ring-2 ring-amber-400"
          />
          <button
            type="submit"
            className="flex-1 border px-3 py-1 bg-amber-500 rounded text-black hover:ring ring-amber-400"
          >
            Add task
          </button>
        </div>
      </form>

      <div className="my-3 text-center p-2 min-w-0 max-w-180 sm:mx-auto font-bold mx-2">
        {taskList.length === 0 ? (
          <h2 className="border-2 rounded p-3 sm:text-2xl text-red-500 border-black">
            No tasks yet!
          </h2>
        ) : (
          <div className="border-2 my-3 md:w-150 mx-auto dark:bg-gray-800">
            <ol>
              {taskList.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between px-2 my-2 space-y-2"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task.id)}
                    className="mt-1 hover:ring-2 ring-blue-400"
                  />
                  <span className="flex-1 font-semibold break-all">
                    {task.text}
                  </span>
                  <button
                    onClick={() =>
                      confirm("Are you sure you want to delete this task?") &&
                      deleteTask(task.id)
                    }
                    className="border rounded px-2 bg-red-600 text-white
                      hover:bg-red-700 ml-2 shrink-0 hover:ring-2 ring-red-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div
        className="border-2 flex flex-col md:flex-row justify-around gap-4 
        dark:bg-gray-800 min-w-0 max-w-2xl sm:mx-auto m-2 p-2"
      >
        <div className="flex-1 mx-3 min-w-0 text-center border rounded p-2 m-2 bg-green-50 dark:bg-green-900">
          <h1 className="sm:text-2xl font-bold text-gray-900 my-3 flex justify-center items-center gap-2">
            <FaCheckCircle /> Completed Task
          </h1>
          {completedTask.length === 0 ? (
            <h2 className="text-gray-500 sm:text-lg font-semibold">
              No Completed Tasks!
            </h2>
          ) : (
            <div className=" p-2 my-2 bg-green-100  text-green-800 dark:bg-green-800 dark:text-green-200">
              <ol className="list-decimal pl-6">
                {completedTask.map((task) => (
                  <li key={task.id} className="break-all">
                    {task.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="flex-1 mx-3 min-w-0 text-center border rounded p-2 m-2 bg-red-50 dark:bg-red-900">
          <h1 className="sm:text-2xl font-bold text-gray-900 sm:my-3 flex justify-center items-center gap-2">
            <FaClock /> Remaining Task
          </h1>
          {remainingTask.length === 0 ? (
            <h2 className="text-gray-500 font-semibold sm:text-xl">
              No Remaining Tasks!
            </h2>
          ) : (
            <div className=" p-2 my-2 bg-red-100  text-red-800 dark:bg-red-800 dark:text-red-200">
              <ol className="list-decimal pl-6">
                {remainingTask.map((task) => (
                  <li key={task.id} className="break-all">
                    {task.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoApp;
