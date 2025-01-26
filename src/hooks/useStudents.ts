import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Student } from "@/pages/Students";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, []);

  const addStudent = async (data: Omit<Student, "id">) => {
    await addDoc(collection(db, "students"), {
      ...data,
      createdAt: Timestamp.now(),
    });
  };

  const updateStudent = async (id: string, data: Omit<Student, "id">) => {
    await updateDoc(doc(db, "students", id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteStudent = async (id: string) => {
    await deleteDoc(doc(db, "students", id));
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}