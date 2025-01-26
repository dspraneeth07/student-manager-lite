import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { StudentModal } from "@/components/StudentModal";
import { useStudents } from "@/hooks/useStudents";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  address: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: string;
}

export default function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudent(studentToDelete.id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student",
      });
    } finally {
      setStudentToDelete(null);
    }
  };

  const handleSubmit = async (data: Omit<Student, "id">) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, data);
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        await addStudent(data);
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save student",
      });
    }
  };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        student={selectedStudent}
        viewOnly={isViewMode}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}