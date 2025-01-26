import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Student } from "@/pages/Students";
import type { Database } from "@/integrations/supabase/types";

type DbStudent = Database['public']['Tables']['students']['Row'];
type Tables = Database['public']['Tables'];

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Subscribe to changes in the students table
    const channel = supabase
      .channel('students_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        () => {
          // Fetch latest data when changes occur
          fetchStudents();
        }
      )
      .subscribe();

    // Initial fetch
    fetchStudents();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*') as { data: DbStudent[] | null; error: Error | null };

    if (error) {
      console.error('Error fetching students:', error);
      return;
    }

    if (!data) return;

    // Convert the data to match our Student type
    const formattedStudents = data.map(student => ({
      id: student.id,
      name: student.name,
      class: student.class,
      section: student.section,
      rollNumber: student.roll_number,
      address: student.address,
      phone: student.phone,
      email: student.email,
      parentName: student.parent_name,
      parentPhone: student.parent_phone,
      dateOfBirth: new Date(student.date_of_birth).toISOString().split('T')[0],
      bloodGroup: student.blood_group,
      gender: student.gender,
    }));

    setStudents(formattedStudents);
  };

  const addStudent = async (data: Omit<Student, "id">) => {
    const { error } = await supabase
      .from('students')
      .insert([{
        name: data.name,
        class: data.class,
        section: data.section,
        roll_number: data.rollNumber,
        address: data.address,
        phone: data.phone,
        email: data.email,
        parent_name: data.parentName,
        parent_phone: data.parentPhone,
        date_of_birth: data.dateOfBirth,
        blood_group: data.bloodGroup,
        gender: data.gender,
      }] satisfies Partial<Tables['students']['Insert']>[]);

    if (error) throw error;
  };

  const updateStudent = async (id: string, data: Omit<Student, "id">) => {
    const { error } = await supabase
      .from('students')
      .update({
        name: data.name,
        class: data.class,
        section: data.section,
        roll_number: data.rollNumber,
        address: data.address,
        phone: data.phone,
        email: data.email,
        parent_name: data.parentName,
        parent_phone: data.parentPhone,
        date_of_birth: data.dateOfBirth,
        blood_group: data.bloodGroup,
        gender: data.gender,
      } satisfies Tables['students']['Update'])
      .eq('id', id);

    if (error) throw error;
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}