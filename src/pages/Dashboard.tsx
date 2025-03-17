
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, CreditCard, GraduationCap, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-red-500">Error loading dashboard data</div>
      </div>
    );
  }

  // Format the chart data
  const chartData = stats?.popularCourses?.map((course) => ({
    name: course.course_name,
    students: Number(course.student_count),
  })) || [];

  // Calculate total fees and pending fees percentage
  const totalFees = Number(stats?.totalFees || 0);
  const pendingFees = Number(stats?.pendingFees || 0);
  const pendingFeesPercentage = totalFees === 0 ? 0 : Math.round((pendingFees / totalFees) * 100);
  const collectedFeesPercentage = 100 - pendingFeesPercentage;

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Students currently enrolled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Collected</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total fees received to date
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding payment amount
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fees Collection</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Collected: {collectedFeesPercentage}%</span>
              <span>Pending: {pendingFeesPercentage}%</span>
            </div>
            <Progress value={collectedFeesPercentage} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
            <CardDescription>Top enrolled courses by number of students</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} 
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>New students joined this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
