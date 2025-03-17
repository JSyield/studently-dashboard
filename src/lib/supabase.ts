
import { createClient } from "@supabase/supabase-js";

// Use the environment variables from our Supabase integration file
const supabaseUrl = "https://gieuqalvgvfbdcjbuvnl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZXVxYWx2Z3ZmYmRjamJ1dm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODc3MTIsImV4cCI6MjA1Nzc2MzcxMn0.r-NEYoiLrKayWLXNvRZIeOzF5_Oub-0b28e_gMCYs_s";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Database types
export type Student = {
  id: string;
  created_at: string;
  full_name: string;
  parent_name: string;
  address: string;
  contact_number: string;
  course_id: string;
  fees: number;
  enrollment_date: string;
  fees_status: "paid" | "unpaid" | "partial";
};

export type Course = {
  id: string;
  created_at: string;
  name: string;
  duration: string;
  fees: number;
  description: string;
  student_count?: number;
};

export type Payment = {
  id: string;
  created_at: string;
  student_id: string;
  amount: number;
  payment_date: string;
  notes?: string;
};

// Database operations
// Students
export const getStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*, courses(name)")
    .order("created_at", { ascending: false });
  
  return { data, error };
};

export const getStudent = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*, courses(name)")
    .eq("id", id)
    .single();
  
  return { data, error };
};

export const addStudent = async (student: Omit<Student, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();
  
  return { data, error };
};

export const updateStudent = async (id: string, student: Partial<Omit<Student, "id" | "created_at">>) => {
  const { data, error } = await supabase
    .from("students")
    .update(student)
    .eq("id", id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteStudent = async (id: string) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);
  
  return { error };
};

// Courses
export const getCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("name");
  
  return { data, error };
};

export const getCoursesWithStudentCount = async () => {
  const { data, error } = await supabase
    .rpc("get_courses_with_student_count");
  
  return { data, error };
};

export const getCourse = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  
  return { data, error };
};

export const createCourse = async (course: Omit<Course, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("courses")
    .insert(course)
    .select()
    .single();
  
  return { data, error };
};

export const updateCourse = async (id: string, course: Partial<Omit<Course, "id" | "created_at">>) => {
  const { data, error } = await supabase
    .from("courses")
    .update(course)
    .eq("id", id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteCourse = async (id: string) => {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);
  
  return { error };
};

// Payments
export const getPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("*, students(full_name)")
    .order("payment_date", { ascending: false });
  
  return { data, error };
};

export const getPaymentsForStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("payment_date", { ascending: false });
  
  return { data, error };
};

export const createPayment = async (payment: Omit<Payment, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();
  
  return { data, error };
};

// Dashboard data
export const getDashboardStats = async () => {
  const { data: totalStudents, error: studentsError } = await supabase
    .from("students")
    .select("id", { count: "exact" });
  
  const { data: totalFees, error: feesError } = await supabase
    .rpc("get_total_fees_collected");
  
  const { data: pendingFees, error: pendingFeesError } = await supabase
    .rpc("get_total_pending_fees");
  
  const { data: popularCourses, error: coursesError } = await supabase
    .rpc("get_popular_courses");
  
  return { 
    totalStudents: totalStudents?.length,
    totalFees, 
    pendingFees,
    popularCourses,
    error: studentsError || feesError || pendingFeesError || coursesError
  };
};
