
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  BarChart2,
  ArrowUpDown,
  Eye,
  LineChart,
  Download,
  Dumbbell,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data
interface WorkoutHistory {
  id: number;
  name: string;
  date: Date;
  duration: number; // in minutes
  volume: number; // in kg
  exercises: number;
  completed: boolean;
}

const mockWorkoutHistory: WorkoutHistory[] = [
  {
    id: 1,
    name: "Upper Body Strength",
    date: new Date(2023, 8, 15), // Sep 15, 2023
    duration: 65,
    volume: 3200,
    exercises: 8,
    completed: true
  },
  {
    id: 2,
    name: "Lower Body Power",
    date: new Date(2023, 8, 13), // Sep 13, 2023
    duration: 75,
    volume: 5400,
    exercises: 6,
    completed: true
  },
  {
    id: 3,
    name: "Full Body HIIT",
    date: new Date(2023, 8, 10), // Sep 10, 2023
    duration: 45,
    volume: 1800,
    exercises: 10,
    completed: true
  },
  {
    id: 4,
    name: "Push Day",
    date: new Date(2023, 8, 8), // Sep 8, 2023
    duration: 55,
    volume: 2600,
    exercises: 7,
    completed: true
  },
  {
    id: 5,
    name: "Pull Day",
    date: new Date(2023, 8, 6), // Sep 6, 2023
    duration: 60,
    volume: 2800,
    exercises: 7,
    completed: true
  },
  {
    id: 6,
    name: "Leg Day",
    date: new Date(2023, 8, 4), // Sep 4, 2023
    duration: 70,
    volume: 6200,
    exercises: 6,
    completed: true
  },
  {
    id: 7,
    name: "Core & Cardio",
    date: new Date(2023, 8, 1), // Sep 1, 2023
    duration: 40,
    volume: 1200,
    exercises: 8,
    completed: true
  },
  {
    id: 8,
    name: "Upper Body Hypertrophy",
    date: new Date(2023, 7, 29), // Aug 29, 2023
    duration: 65,
    volume: 3000,
    exercises: 9,
    completed: true
  },
  {
    id: 9,
    name: "Lower Body Hypertrophy",
    date: new Date(2023, 7, 27), // Aug 27, 2023
    duration: 70,
    volume: 5800,
    exercises: 7,
    completed: true
  },
  {
    id: 10,
    name: "Full Body Strength",
    date: new Date(2023, 7, 25), // Aug 25, 2023
    duration: 80,
    volume: 4500,
    exercises: 10,
    completed: true
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutHistory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { toast } = useToast();

  // Filter workouts based on search term and date
  const filteredWorkouts = mockWorkoutHistory.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || (
      workout.date.getDate() === selectedDate.getDate() &&
      workout.date.getMonth() === selectedDate.getMonth() &&
      workout.date.getFullYear() === selectedDate.getFullYear()
    );
    
    return matchesSearch && matchesDate;
  });
  
  const handleViewDetails = (workout: WorkoutHistory) => {
    setSelectedWorkout(workout);
    setIsDetailOpen(true);
  };
  
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your workout history is being exported to CSV."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workout History</h1>
          <p className="text-muted-foreground">Track your progress and view past workouts</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto justify-between"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Filter by date"}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
            {selectedDate && (
              <div className="border-t p-3 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedDate(undefined)}
                  className="text-sm h-8"
                >
                  Clear date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="list" className="mt-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card className="border-none shadow-soft">
            <CardContent className="p-0">
              {filteredWorkouts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[250px]">
                          <div className="flex items-center gap-1">
                            Workout Name
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Exercises</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWorkouts.map((workout) => (
                        <TableRow key={workout.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">{workout.name}</TableCell>
                          <TableCell>{format(new Date(workout.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{workout.duration} min</TableCell>
                          <TableCell>{workout.volume} kg</TableCell>
                          <TableCell>{workout.exercises}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewDetails(workout)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                  <DropdownMenuItem>Export</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No workouts found</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {searchTerm || selectedDate 
                      ? "Try changing your search or date filter."
                      : "Your workout history is empty. Complete workouts to see them here."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Training Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-3xl font-bold">24.5 hrs</p>
                      <p className="text-sm text-muted-foreground">Total training time</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">5.2 hrs</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Average session</span>
                      <span className="font-medium">63 min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Longest session</span>
                      <span className="font-medium">95 min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Shortest session</span>
                      <span className="font-medium">35 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-none shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Volume Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-[180px] justify-end space-y-2">
                    <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                      <span>Muscle Group</span>
                      <span>Volume (kg)</span>
                    </div>
                    {[
                      { name: "Legs", volume: 22600, percent: 100 },
                      { name: "Chest", volume: 16400, percent: 73 },
                      { name: "Back", volume: 14200, percent: 63 },
                      { name: "Shoulders", volume: 9800, percent: 43 },
                      { name: "Arms", volume: 7400, percent: 33 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-24 text-sm">{item.name}</div>
                        <div 
                          className="bg-primary/80 h-6 rounded-md flex items-center pl-2 text-xs text-white font-medium"
                          style={{ width: `${item.percent}%` }}
                        >
                          {item.volume}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-none shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Workout Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">75%</p>
                    <p className="text-sm text-muted-foreground">Adherence rate</p>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-sm ${
                          [2, 5, 9, 11, 14, 17, 23, 24, 25].includes(i) 
                            ? "bg-muted/50" 
                            : "bg-primary"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4 weeks ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Workout Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedWorkout?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedWorkout && format(new Date(selectedWorkout.date), "EEEE, MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">{selectedWorkout?.duration} min</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">{selectedWorkout?.volume} kg</div>
                <div className="text-sm text-muted-foreground">Volume</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">{selectedWorkout?.exercises}</div>
                <div className="text-sm text-muted-foreground">Exercises</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Exercises</h3>
              
              <div className="space-y-3">
                {Array.from({ length: selectedWorkout?.exercises || 0 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Exercise {i + 1}</h4>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Sets:</span> 3
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reps:</span> 10, 8, 8
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span> 70, 75, 75 kg
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button>View Analytics</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
