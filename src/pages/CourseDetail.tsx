
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign, BookOpen, Users } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function CourseDetail() {
  const { id } = useParams();
  
  // Fetch course details
  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id as string),
    enabled: !!id,
  });

  const course = courseData?.data;
  
  // Fetch students in this course
  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ['courseStudents', id],
    queryFn: async () => {
      const { data, error } = await getCourse(id as string);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-48">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Link to="/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold">Course not found</h2>
              <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const students = studentsData?.filter(item => item.course_id === id) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
        <Button variant="outline" size="sm">
          Edit Course
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Course Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{course.name}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{course.duration}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-2xl font-bold">${course.fees}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Students Enrolled
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{students.length} students</p>
          </div>
        </CardHeader>
        <CardContent>
          {isStudentsLoading ? (
            <div>Loading students...</div>
          ) : students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Fees Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>{student.parent_name}</TableCell>
                    <TableCell>{student.fees_status}</TableCell>
                    <TableCell>{student.contact_number}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/students/${student.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No students enrolled in this course yet.
            </div>
          )}
        </CardContent>
      </Card>
      
      {course.description && (
        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{course.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
