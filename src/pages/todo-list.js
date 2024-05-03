//****************************************************************************************************************************
//Program name: "todo-list.jsx".  This program is the main part of our web app. Copyright (C)  *
//2024 Kyle Ho                                                                                                        *
//This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License  *
//version 3 as published by the Free Software Foundation.                                                                    *
//This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied         *
//warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.     *
//A copy of the GNU General Public License v3 is available here:  <https://www.gnu.org/licenses/>.                           *
//****************************************************************************************************************************


//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2=========3**
//
//Author information
//  Author names: Kyle Ho,
//  Author emails: kyleho@csu.fullerton.edu,
//  Course ID: CPSC362
//
//Program information
//  Program name: Task manager
//  Date of last update: February 19, 2024
//  Programming language(s): JavaScript, HTML, CSS
//  Files in this program: App.js, login.js, register.js, home.js, etc...
//
//  OS of the computer where the program was developed: Windows running WSL with Ubuntu 22.04.3 LTS
//  OS of the computer where the program was tested: Windows running WSL Ubuntu 22.04.3 LTS
//  Status: WIP
//
//References for this program
//  https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju
//  https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started
//
//Purpose
//  The main page for viewing tasks
//
//This file
//   File name: todo-list.jsx
//   Date of last update: February 19, 2024
//   Languages: JavaScript, HTML, CSS
//
//References for this file
//   https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started
//
//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2**
//
//
//
//
//===== Begin code area ================================================================================================

import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getFirestore, query, doc, getDocs, setDoc, deleteDoc, collection, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

function ToDoListPage() {
  const [tasks, setTasks] = useState([]);                         // Set initial state blank
  const [loading, isLoading] = useState(true);                    // Set loading state for database queries to true

  const db = getFirestore(app);                                   // The Firestore database.
  const auth = getAuth(app);                                      // The Firestore auth instance.
  /**
   * This effect handles pulling database information before the page is loaded.
   */
  useEffect(() => {

    // Fetch data from the database
    const fetchData = async () => {

      try {
        // Go to the tasks collection associated with the UID of the user.
        const uid = auth.currentUser.uid;

        // Prepare Firestore query and get the associated documents
        const q = query(collection(db, 'user-data', uid, 'tasks'));
        const querySnapshot = await getDocs(q);

        // Given an array of Firestore documents, map them to the object property names in TaskList.jsx
        // Ignore the empty document which is needed to keep the /tasks directory per user.
        let mappedTaskObj = querySnapshot.docs
        .filter(doc => Object.keys(doc.data()).length > 0)
        .map(doc => ({
          id: doc.id,
          name: doc.data().description,
          completed: doc.data().completed,
          createDate: doc.data().createDate,
          dueDate: doc.data().dueDate,
          status: 'none'                      // The status must be 'none' (no action on this record), 'updated' (updated value on this record),
        }));                                  // OR 'deleted' (this record was deleted). Otherwise, the database will not accept this record.

        setTasks(mappedTaskObj);
        localStorage.setItem("usertasks", JSON.stringify(tasks));   // Store the pulled tasks locally for modification.

        isLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    // Add event listener and cleanup for when user leaves the page.
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // Empty dependency array intentional, do not remove as this effect must run only once.

  /**
   * This effect saves tasks to the database when a user leaves the page (by navigation or closing window)
   */
  useEffect(() => {
    return async () => {

      // Save tasks
      try {
        // Go to the tasks collection associated with the UID of the user.
        const uid = auth.currentUser.uid;
        // const currentUserRef = collection(db, 'user-data', uid, 'tasks');

        // Parse the in-memory task object
        const taskObject = JSON.parse(localStorage.getItem('usertasks'));

        // For each taskObject, update the values within Firestore
        if (taskObject !== null) {

          // Determine if the tasks collection exists before attempting to access the task document.
          let tasksCollectionRef = collection(db, 'user-data', uid, 'tasks');
          const tasksSnapshot = await getDocs(tasksCollectionRef);

          // If the collection is empty, initialize with an empty document
          if (tasksSnapshot.empty) {
            const emptyDocRef = doc(tasksCollectionRef);
            await setDoc(emptyDocRef, {});

            console.log('User task directory empty, sample document created.')

            // Otherwise, check if the first document has no fields. If it does, delete!
          } else {

            // If the snapshot size is greater than one, delete the first document if it's empty.
            if (tasksSnapshot.size > 1) {
              const firstDoc = tasksSnapshot.docs[0];
              const firstDocData = firstDoc.data();

              if (Object.keys(firstDocData).length === 0) {
                await deleteDoc(firstDoc.ref)
              }
            }
          }

          taskObject.forEach(async (task) => {
            let docRef;
            
            if(task.id === -1) {
              docRef = doc(tasksCollectionRef);                         // Create a new document with a Firestore provided ID.
            } else {
              docRef = doc(db, 'user-data', uid, 'tasks', task.id);     // Point to user-data/UID/tasks document specified in taskObject instead
            }

            // If the task status is not set to deleted, merge.
            if (task.status !== 'deleted') {

              await setDoc(docRef, {
                completed: Boolean(task.completed),
                createDate: Timestamp.now(),
                description: task.name,
                dueDate: task.dueDate
              }, {
                merge: true
              })
            } else if (task.status === 'deleted') {

              await deleteDoc(docRef);       // banish thy document
            }
          });
        }

        localStorage.removeItem("usertasks");
      } catch (err) {
        console.log(err);
      }
    }
  }, [auth.currentUser.uid, db, tasks]);

  /**
   * Prompts user if they really want to leave.
   */
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  // Wait until the task list is retrieved from the database.
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TaskList tasks={tasks} />
  );
}

export default ToDoListPage;