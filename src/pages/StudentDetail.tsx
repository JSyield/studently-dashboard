
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getStudent } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Home, Phone, BookOpen, DollarSign } from "lucide-react";

export default function StudentDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch student details
  const { data: student, isLoading: isStudentLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: !!id,
  });

  if (isStudentLoading) {
    return <div className="flex items-center justify-center h-48">Loading student details...</div>;
  }

  if (!student?.data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Link to="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold">Student not found</h2>
              <p className="text-muted-foreground">The student you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studentData = student.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>
        <Button variant="outline" size="sm">
          Edit Student
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Full Name</p>
                <p className="text-sm text-muted-foreground">{studentData.full_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Parent/Guardian Name</p>
                <p className="text-sm text-muted-foreground">{studentData.parent_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Address</p>
                <p className="text-sm text-muted-foreground">{studentData.address}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Contact Number</p>
                <p className="text-sm text-muted-foreground">{studentData.contact_number}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Enrollment Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(studentData.enrollment_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course & Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Course</p>
                <p className="text-sm text-muted-foreground">
                  {studentData.courses?.name || "Not assigned"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Fees</p>
                <p className="text-sm text-muted-foreground">${studentData.fees}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Payment Status</p>
                <Badge variant={studentData.fees_status === "paid" ? "default" : 
                       studentData.fees_status === "partial" ? "outline" : "destructive"}>
                  {studentData.fees_status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
