import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Student } from "@/pages/Students";

// Helper function to convert Firestore data to our Student type
const convertFirestoreData = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "",
    class: data.class || "",
    section: data.section || "",
    rollNumber: data.rollNumber || "",
    address: data.address || "",
    phone: data.phone || "",
    email: data.email || "",
    parentName: data.parentName || "",
    parentPhone: data.parentPhone || "",
    dateOfBirth: data.dateOfBirth || "",
    bloodGroup: data.bloodGroup || "",
    gender: data.gender || "",
  } as Student;
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map(convertFirestoreData);
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, []);

  const addStudent = async (data: Omit<Student, "id">) => {
    const studentData = {
      ...data,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, "students"), studentData);
  };

  const updateStudent = async (id: string, data: Omit<Student, "id">) => {
    const studentData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(doc(db, "students", id), studentData);
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