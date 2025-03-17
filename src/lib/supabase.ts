
import { createClient } from "@supabase/supabase-js";

// These will be replaced by proper environment variables
// Using placeholders for now - actual values will be set up when connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "your-anon-key";

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

// Create database schemas
export const initializeDatabase = async () => {
  // This would be done through migrations in a production environment
  // But for demonstration, we'll create tables if they don't exist

  // Students table
  const { error: studentsError } = await supabase.rpc("init_students_table", {});

  // Courses table
  const { error: coursesError } = await supabase.rpc("init_courses_table", {});

  // Payments table
  const { error: paymentsError } = await supabase.rpc("init_payments_table", {});

  return { studentsError, coursesError, paymentsError };
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

export const createStudent = async (student: Omit<Student, "id" | "created_at">) => {
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
