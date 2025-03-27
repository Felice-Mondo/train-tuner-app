
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  BarChart4, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Dumbbell, 
  FileText,
  LineChart,
  Plus,
  Trophy,
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [progress, setProgress] = useState(72);
  
  // Mock data for recent workouts
  const recentWorkouts = [
    { id: 1, name: "Upper Body Strength", date: "Today", duration: "45 min", exercises: 8 },
    { id: 2, name: "Leg Day", date: "Yesterday", duration: "50 min", exercises: 6 },
    { id: 3, name: "Core & Cardio", date: "Sep 15, 2023", duration: "30 min", exercises: 5 },
    { id: 4, name: "Full Body HIIT", date: "Sep 13, 2023", duration: "40 min", exercises: 10 },
    { id: 5, name: "Recovery & Mobility", date: "Sep 11, 2023", duration: "25 min", exercises: 4 },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze your fitness progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Workout
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Weekly Progress */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-soft hover:shadow-strong transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>Target: 100%</span>
              </div>
              <p className="text-sm mt-4 text-muted-foreground">
                5 of 7 workouts completed this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Volume */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-soft hover:shadow-strong transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <LineChart className="h-5 w-5 text-blue-500" />
                Monthly Volume
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">12,540 kg</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" /> 8% from last month
                  </p>
                </div>
                <div className="h-16 flex items-end gap-1">
                  {[40, 65, 45, 70, 85, 60, 75].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-3 bg-blue-500/20 rounded-t-sm" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Records */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-soft hover:shadow-strong transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-amber-500" />
                Recent PRs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Bench Press</p>
                    <p className="text-sm text-muted-foreground">100 kg × 1</p>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
                    3 days ago
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Deadlift</p>
                    <p className="text-sm text-muted-foreground">150 kg × 1</p>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
                    1 week ago
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Next Workout */}
      <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-none shadow-soft hover:shadow-strong transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Next Planned Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Lower Body Strength</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Tomorrow, 06:30 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>60 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    <span>8 exercises</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Edit</Button>
                <Button>Start Workout</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Workouts and Stats Tabs */}
      <Tabs defaultValue="recent" className="mt-8">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="recent">Recent Workouts</TabsTrigger>
          <TabsTrigger value="stats">Stats Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-6">
          <div className="bg-card rounded-lg overflow-hidden border-none shadow-soft">
            <div className="bg-muted/30 px-4 py-3 border-b border-border">
              <h3 className="font-medium">Last 5 Workouts</h3>
            </div>
            <ul>
              {recentWorkouts.map((workout, index) => (
                <li key={workout.id} className="border-b border-border last:border-0">
                  <a 
                    href="#" 
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">{workout.duration}</p>
                        <p className="text-sm text-muted-foreground">{workout.exercises} exercises</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 bg-muted/20 border-t border-border">
              <Button variant="ghost" className="w-full flex items-center justify-center gap-1">
                View All Workouts
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between px-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-8 rounded-t-md ${i < 5 ? 'bg-primary' : 'bg-muted'}`} 
                        style={{ 
                          height: `${[60, 80, 40, 100, 65, 20, 15][i]}%`,
                          opacity: i < 5 ? 1 : 0.5
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Most Used Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { name: "Bench Press", count: 24, percent: 85 },
                    { name: "Squats", count: 22, percent: 78 },
                    { name: "Deadlift", count: 18, percent: 64 },
                    { name: "Pull-ups", count: 15, percent: 53 },
                    { name: "Shoulder Press", count: 12, percent: 42 },
                  ].map((exercise) => (
                    <li key={exercise.name} className="flex items-center gap-2">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{exercise.name}</span>
                          <span className="text-xs text-muted-foreground">{exercise.count} times</span>
                        </div>
                        <Progress value={exercise.percent} className="h-1.5" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
