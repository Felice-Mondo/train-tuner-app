
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  RotateCcw,
  Save,
  X,
  Grip,
  PlusCircle,
  ArrowDown,
  ArrowUp,
  Play,
  TimerReset
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Types
interface Exercise {
  id: number;
  name: string;
  category: "strength" | "cardio" | "flexibility";
  muscles: string[];
}

interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  type: "normal" | "superset" | "dropset" | "amrap";
}

interface Workout {
  id: number;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  completed?: boolean;
}

// Mock data
const mockExercises: Exercise[] = [
  { id: 1, name: "Bench Press", category: "strength", muscles: ["chest", "triceps"] },
  { id: 2, name: "Squat", category: "strength", muscles: ["quadriceps", "glutes"] },
  { id: 3, name: "Deadlift", category: "strength", muscles: ["lower back", "hamstrings"] },
  { id: 4, name: "Pull-up", category: "strength", muscles: ["lats", "biceps"] },
  { id: 5, name: "Push-up", category: "strength", muscles: ["chest", "shoulders"] },
  { id: 6, name: "Leg Press", category: "strength", muscles: ["quadriceps", "hamstrings"] },
  { id: 7, name: "Lat Pulldown", category: "strength", muscles: ["lats", "biceps"] },
  { id: 8, name: "Shoulder Press", category: "strength", muscles: ["shoulders", "triceps"] }
];

const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: "Upper Body Strength",
    date: new Date(2023, 8, 20), // September 20, 2023
    exercises: [
      { id: "ex1", exercise: mockExercises[0], sets: 4, reps: 8, weight: 80, restTime: 90, type: "normal" },
      { id: "ex2", exercise: mockExercises[3], sets: 3, reps: 10, weight: 0, restTime: 60, type: "normal" },
      { id: "ex3", exercise: mockExercises[4], sets: 3, reps: 15, weight: 0, restTime: 60, type: "normal" },
    ]
  },
  {
    id: 2,
    name: "Lower Body Power",
    date: new Date(2023, 8, 22), // September 22, 2023
    exercises: [
      { id: "ex4", exercise: mockExercises[1], sets: 4, reps: 6, weight: 100, restTime: 120, type: "normal" },
      { id: "ex5", exercise: mockExercises[5], sets: 3, reps: 12, weight: 150, restTime: 90, type: "normal" },
    ]
  }
];

const Workouts = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("New Workout");
  
  // New workout creation state
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const { toast } = useToast();
  
  const handleCreateWorkout = () => {
    setIsCreating(true);
    setWorkoutExercises([]);
    setNewWorkoutName("New Workout");
  };
  
  const handleCancelCreate = () => {
    setIsCreating(false);
  };
  
  const handleAddExercise = () => {
    // In a real app, we'd open a modal to select from the user's exercise library
    const randomExercise = mockExercises[Math.floor(Math.random() * mockExercises.length)];
    const newWorkoutExercise: WorkoutExercise = {
      id: `ex${Date.now()}`,
      exercise: randomExercise,
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
      type: "normal"
    };
    
    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
  };
  
  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id));
  };
  
  const handleSaveWorkout = () => {
    if (workoutExercises.length === 0) {
      toast({
        title: "Cannot save empty workout",
        description: "Please add at least one exercise to your workout.",
        variant: "destructive"
      });
      return;
    }
    
    const newWorkout: Workout = {
      id: Math.max(...workouts.map(w => w.id), 0) + 1,
      name: newWorkoutName,
      date: date || new Date(),
      exercises: workoutExercises
    };
    
    setWorkouts([...workouts, newWorkout]);
    setIsCreating(false);
    
    toast({
      title: "Workout saved",
      description: `"${newWorkoutName}" has been added to your calendar.`
    });
  };
  
  const handleUpdateExercise = (id: string, field: keyof WorkoutExercise, value: any) => {
    setWorkoutExercises(
      workoutExercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };
  
  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(workoutExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWorkoutExercises(items);
  };
  
  // Function to find workouts on the selected date
  const workoutsOnSelectedDate = date 
    ? workouts.filter(workout => 
        workout.date.getDate() === date.getDate() &&
        workout.date.getMonth() === date.getMonth() &&
        workout.date.getFullYear() === date.getFullYear()
      )
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Plan and schedule your training sessions</p>
        </div>
        <Button onClick={handleCreateWorkout} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Workout
        </Button>
      </div>

      {!isCreating ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="md:col-span-1 border-none shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Workout Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
              />
            </CardContent>
          </Card>
          
          {/* Workouts for selected date */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a Date"}
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setDate(prev => prev ? new Date(prev.setDate(prev.getDate() - 1)) : new Date())}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setDate(prev => prev ? new Date(prev.setDate(prev.getDate() + 1)) : new Date())}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {workoutsOnSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {workoutsOnSelectedDate.map(workout => (
                  <Card key={workout.id} className="border-none shadow-soft hover:shadow-strong transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="p-6 border-b border-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{workout.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {workout.exercises.length} exercises
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">Edit</Button>
                            <Button>Start</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Exercises</h4>
                        <ul className="space-y-2">
                          {workout.exercises.map((ex, index) => (
                            <li key={ex.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs font-medium text-primary">
                                  {index + 1}
                                </span>
                                <div>
                                  <p className="font-medium">{ex.exercise.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {ex.sets} sets × {ex.reps} reps
                                    {ex.weight > 0 ? ` × ${ex.weight} kg` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ex.restTime}s rest
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No workouts planned</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    You don't have any workouts scheduled for this day.
                  </p>
                  <Button onClick={handleCreateWorkout}>Create Workout</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        // Workout creation interface
        <div className="space-y-6">
          <Card className="border-none shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Label htmlFor="workout-name">Workout Name</Label>
                    <Input 
                      id="workout-name" 
                      value={newWorkoutName} 
                      onChange={(e) => setNewWorkoutName(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-normal">Date:</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Exercises</h2>
            <Button onClick={handleAddExercise} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Exercise
            </Button>
          </div>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="space-y-4"
                >
                  {workoutExercises.length > 0 ? (
                    workoutExercises.map((ex, index) => (
                      <Draggable key={ex.id} draggableId={ex.id} index={index}>
                        {(provided) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border-none shadow-soft"
                          >
                            <CardContent className="p-0">
                              <div className="flex justify-between items-center p-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="cursor-grab flex items-center justify-center"
                                  >
                                    <Grip className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <h3 className="font-semibold">{ex.exercise.name}</h3>
                                  <Select 
                                    value={ex.type} 
                                    onValueChange={(value) => handleUpdateExercise(ex.id, 'type', value)}
                                  >
                                    <SelectTrigger className="w-[140px]">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="superset">Superset</SelectItem>
                                      <SelectItem value="dropset">Dropset</SelectItem>
                                      <SelectItem value="amrap">AMRAP</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveExercise(ex.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <Label className="text-sm">Sets</Label>
                                  <div className="flex mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-r-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'sets', Math.max(1, ex.sets - 1)
                                      )}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Input 
                                      type="number" 
                                      value={ex.sets}
                                      onChange={(e) => handleUpdateExercise(
                                        ex.id, 'sets', parseInt(e.target.value) || 1
                                      )}
                                      className="rounded-none text-center"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-l-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'sets', ex.sets + 1
                                      )}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm">Reps</Label>
                                  <div className="flex mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-r-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'reps', Math.max(1, ex.reps - 1)
                                      )}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Input 
                                      type="number" 
                                      value={ex.reps}
                                      onChange={(e) => handleUpdateExercise(
                                        ex.id, 'reps', parseInt(e.target.value) || 1
                                      )}
                                      className="rounded-none text-center"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-l-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'reps', ex.reps + 1
                                      )}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm">Weight (kg)</Label>
                                  <div className="flex mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-r-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'weight', Math.max(0, ex.weight - 2.5)
                                      )}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Input 
                                      type="number" 
                                      value={ex.weight}
                                      onChange={(e) => handleUpdateExercise(
                                        ex.id, 'weight', parseFloat(e.target.value) || 0
                                      )}
                                      className="rounded-none text-center"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-l-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'weight', ex.weight + 2.5
                                      )}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm">Rest Time (sec)</Label>
                                  <div className="flex mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-r-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'restTime', Math.max(0, ex.restTime - 15)
                                      )}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Input 
                                      type="number" 
                                      value={ex.restTime}
                                      onChange={(e) => handleUpdateExercise(
                                        ex.id, 'restTime', parseInt(e.target.value) || 0
                                      )}
                                      className="rounded-none text-center"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="rounded-l-none"
                                      onClick={() => handleUpdateExercise(
                                        ex.id, 'restTime', ex.restTime + 15
                                      )}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Card className="border-none shadow-soft">
                      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="bg-primary/10 rounded-full p-3 mb-4">
                          <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No exercises added</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                          Add exercises to create your workout routine.
                        </p>
                        <Button onClick={handleAddExercise}>Add Exercise</Button>
                      </CardContent>
                    </Card>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkout} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
